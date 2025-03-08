import { Router, Request, Response } from 'express';
import { checkUser } from 'src/service/database';
import { SERVER_URI, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from 'src/config';

const router = Router();
const REDIRECT_URI = `${SERVER_URI}/google/callback`;

router.get('', (_: Request, res: Response) => {
    const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    url.searchParams.append('client_id', GOOGLE_CLIENT_ID);
    url.searchParams.append('redirect_uri', REDIRECT_URI);
    url.searchParams.append('response_type', 'code');
    url.searchParams.append('scope', 'openid profile email');
    res.redirect(url.toString());
});

router.get('/callback', async (req: Request, res: Response) => {
    const code = req.query.code;
    if (!code) {
        res.status(400).send('Missing authorization code');
        return;
    }
    try {
        let response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                code: code as string,
                redirect_uri: REDIRECT_URI,
                grant_type: 'authorization_code',
                client_id: GOOGLE_CLIENT_ID,
                client_secret: GOOGLE_CLIENT_SECRET,
            }),
        });
        if (!response.ok) {
            res.status(500).send('Failed to get access token');
            return;
        }
        const {access_token: accessToken} = await response.json();
        response = await fetch('https://www.googleapis.com/oauth2/v1/userinfo', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        if (!response.ok) {
            res.status(500).send('Failed to get user profile');
            return;
        }
        const profile = await response.json();
        const { email, name: username } = profile;
        const user = await checkUser(email);
        if (user) {
            res.status(404).send('User already exists');
            return;
        }
        res.status(200).send(`
            <script>
                window.opener.postMessage(${JSON.stringify({email, username})}, '*');
                window.close();
            </script>
        `);
    } catch (error) {
        res.status(500).send('Internal server error');
    }
});

export default router;
