import { Router } from 'express';
import authRouter from '@/routes/auth';
import apiRouter from '@/routes/api';

const router = Router();
router.use('/auth', authRouter);
router.use('/api', apiRouter);

export default router;