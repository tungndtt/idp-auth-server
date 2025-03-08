import { Request, Response, Router } from 'express';
import { checkUser, generateExchange } from 'src/service/database';
import { SERVER_URI, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from 'src/config';

const router = Router();
const REDIRECT_URI = `${SERVER_URI}/github/callback`;

router.get('', (_: Request, res: Response) => {
    const url = new URL('https://github.com/login/oauth/authorize');
    url.searchParams.append('client_id', GITHUB_CLIENT_ID);
    url.searchParams.append('redirect_uri', REDIRECT_URI);
    url.searchParams.append('scope', 'user');
    res.redirect(url.toString());
});

router.get('/callback', async (req: Request, res: Response) => {
    let code = req.query.code;
    if (!code) {
        res.status(400).send('Missing authorization code');
        return;
    }
    try {
        let response = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code: code as string,
                redirect_uri: REDIRECT_URI,
                grant_type: 'authorization_code',
                client_id: GITHUB_CLIENT_ID,
                client_secret: GITHUB_CLIENT_SECRET,
            }),
        });
        if (!response.ok) {
            res.status(500).send('Failed to get access token');
            return;
        }
        const accessInfo = new URLSearchParams(await response.text());
        if(!accessInfo.has('access_token')) {
            res.status(500).send('Failed to get access token');
            return;
        }
        let accessToken = accessInfo.get('access_token');
        const [userReponse, emailReponse] = await Promise.all([
            fetch('https://api.github.com/user', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }),
            fetch('https://api.github.com/user/emails', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }),
        ]);
        if (!userReponse.ok) {
            res.status(500).send('Failed to get user profile');
            return;
        }
        if (!emailReponse.ok) {
            res.status(500).send('Failed to get user profile');
            return;
        }
        const { name: username } = await userReponse.json();
        const emails = await emailReponse.json() as {email: string, primary: boolean}[];
        const emailInfo = emails.find(({ primary }) => primary);
        if(!emailInfo) {
            res.status(500).send('Failed to get user email');
            return;
        }
        const email = emailInfo.email;
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
