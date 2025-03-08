import { Request, Response, Router } from 'express';
import { apiMiddleware } from '@/routes/api/middleware';

const router = Router();

router.get('', apiMiddleware, (_: Request, res: Response) => {
    res.status(200).send(res.locals.payload);
});

export default router;