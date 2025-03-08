import { Request, Response, Router } from 'express';
import { checkUser, generateExchange } from 'src/service/database';
import { SERVER_URI, FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET } from 'src/config';

const router = Router();
const REDIRECT_URI = `${SERVER_URI}/facebook/callback`;

router.get('', (_: Request, res: Response) => {
    const url = new URL('https://www.facebook.com/v12.0/dialog/oauth');
    url.searchParams.append('client_id', FACEBOOK_CLIENT_ID);
    url.searchParams.append('redirect_uri', REDIRECT_URI);
    url.searchParams.append('scope', 'email public_profile');
    url.searchParams.append('response_type', 'code');
    res.redirect(url.toString());
});

router.get('/callback', async (req: Request, res: Response) => {
    let code = req.query.code;
    if (!code) {
        res.status(400).send('Missing authorization code');
        return;
    }
    try {
        const tokenResponse = await fetch('https://graph.facebook.com/v12.0/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code: code as string,
                redirect_uri: REDIRECT_URI,
                grant_type: 'authorization_code',
                client_id: FACEBOOK_CLIENT_ID,
                client_secret: FACEBOOK_CLIENT_SECRET,
            }),
        });
        if (!tokenResponse.ok) {
            const error = await tokenResponse.json();
            res.status(500).send(`Failed to get access token: ${error.error.message}`);
            return;
        }
        const { access_token: accessToken } = await tokenResponse.json();
        const profileResponse = await fetch('https://graph.facebook.com/me?fields=id,name,email', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        if (!profileResponse.ok) {
            const error = await profileResponse.json();
            res.status(500).send(`Failed to get user profile: ${error.error.message}`);
            return;
        }
        const { email, name: username } = await profileResponse.json();
        const user = await checkUser(email);
        if (user) {
            res.status(409).send('User already exists');
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
