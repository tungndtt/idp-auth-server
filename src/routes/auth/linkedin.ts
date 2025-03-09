import { Router, Request, Response } from 'express';
import { checkUser, generateExchange } from '@/services/database';
import { SERVER_URI, LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET } from '@/config';

const router = Router();
const REDIRECT_URI = `${SERVER_URI}/linkedin/callback`;

router.get('', (_: Request, res: Response) => {
    const url = new URL('https://www.linkedin.com/oauth/v2/authorization');
    url.searchParams.append('response_type', 'code');
    url.searchParams.append('client_id', LINKEDIN_CLIENT_ID);
    url.searchParams.append('redirect_uri', REDIRECT_URI);
    url.searchParams.append('scope', 'openid profile email');
    res.redirect(url.toString());
});

router.get('/callback', async (req: Request, res: Response) => {
    let code = req.query.code;
    if (!code) {
        res.status(400).send('Missing authorization code');
        return;
    }
    try {
        let response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                code: code as string,
                redirect_uri: REDIRECT_URI,
                grant_type: 'authorization_code',
                client_id: LINKEDIN_CLIENT_ID,
                client_secret: LINKEDIN_CLIENT_SECRET,
            }).toString()
        });
        if (!response.ok) {
            res.status(500).send('Failed to get access token');
            return;
        }
        const {access_token: accessToken} = await response.json();
        response = await fetch("https://api.linkedin.com/v2/userinfo", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        if (!response.ok) {
            res.status(500).send("Failed to get user profile");
            return;
        }
        const {email, name: username} = await response.json();
        const user = await checkUser(email);
        if (user) {
            res.status(404).send('User already exists');
            return;
        }
        code = await generateExchange(email);
        res.status(200).send(`
            <script>
                window.opener.postMessage(${JSON.stringify({ email, username, code })}, '*');
                window.close();
            </script>
        `);
    } catch (error) {
        res.status(500).send('Internal server error');
    }
});

export default router;
