import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { databaseConnection } from '@/service/database';
import { SERVER_HOST, SERVER_PORT, SERVER_URI, DEV_ENVIRONMENT } from '@/config';

const app = express();
app.use(cookieParser());
app.use(express.json());
if (DEV_ENVIRONMENT) {
    app.use(cors({ credentials: true }));
}

app.listen(SERVER_PORT, SERVER_HOST, async () => {
    await databaseConnection.initialize();
    console.log(`Server is running on ${SERVER_URI}`);
});