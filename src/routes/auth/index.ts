import { Request, Response, Router } from 'express';
import localRouter from '@/routes/auth/local';
import googleRouter from '@/routes/auth/google';
import linkedinRouter from '@/routes/auth/linkedin';
import githubRouter from '@/routes/auth/github';
import facebookRouter from '@/routes/auth/facebook';
import { addUser, getUser, getExchange } from '@/service/database';
import { generateToken } from '@/service/security';
import { ACCESS_TOKEN_DURATION, REFRESH_TOKEN_DURATION } from '@/config';

const router = Router();
router.use('/local', localRouter);
router.use('/google', googleRouter);
router.use('/linkedin', linkedinRouter);
router.use('/github', githubRouter);
router.use('/facebook', facebookRouter);

router.post('/signup', async (req: Request, res: Response) => {
    const { email, password, username, code } = req.body;
    if (!email || !password) {
        res.status(400).send('Missing email or password');
        return;
    }
    if (!code) {
        res.status(400).send('Missing registration exchange code');
        return;
    }
    const exchange = await getExchange(code);
    if (!exchange) {
        res.status(400).send('Registration outdated');
        return;
    }
    const user = await addUser(email, password, username);
    if (!user) {
        res.status(500).send('Failed to create user');
        return;
    }
    res.status(201).send('User created');
});

router.post('/signin', async (req: Request, res: Response) => {
    const {email, password} = req.body;
    if (!email || !password) {
        res.status(400).send('Missing email or password');
        return;
    }
    const user = await getUser(email, password);
    if (!user) {
        res.status(403).send('Invalid email or password');
        return;
    }
    const accessToken = generateToken(user, ACCESS_TOKEN_DURATION);
    const refreshToken = generateToken(user, REFRESH_TOKEN_DURATION);
    res.cookie('access-token', accessToken, {httpOnly: true});
    res.cookie('refresh-token', refreshToken, {httpOnly: true});
    res.status(201).send(user);
});

router.get('/signout', (_: Request, res: Response) => {
    res.clearCookie('access-token');
    res.clearCookie('refresh-token');
    res.status(401).send('Sign out');
});

export default router;