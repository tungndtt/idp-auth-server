import { config } from "dotenv";

config();

// Dev environment config
export const DEV_ENVIRONMENT = process.env.NODE_ENV !== 'production';

// Server config
export const SERVER_PORT = Number(process.env.SERVER_PORT) || 2809;
export const SERVER_HOST = process.env.SERVER_HOST || 'localhost';
export const SERVER_URI = `http://${SERVER_HOST}:${SERVER_PORT}`;

// Database config
export const DATABASE_HOST = process.env.DATABASE_HOST || 'localhost';
export const DATABASE_PORT = Number(process.env.DATABASE_PORT) || 5432;
export const DATABASE_USERNAME = process.env.DATABASE_USERNAME || 'database_username';
export const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || 'database_password';
export const DATABASE_NAME = process.env.DATABASE_NAME || 'database_name';

// Google OAuth config
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'google_client_id';
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'google_client_secret';

// Github OAuth config
export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || 'github_client_id';
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || 'github_client_secret';

// Linkedin OAuth config
export const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID || 'linkedin_client_id';
export const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET || 'linkedin_client_secret';

// Facebook OAuth config
export const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID || 'facebook_client_id';
export const FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET || 'facebook_client_secret';

// Email config
export const EMAIL_HOST = process.env.EMAIL_HOST || 'email_host';
export const EMAIL_PORT = Number(process.env.EMAIL_PORT) || 587;
export const EMAIL_DISPLAYNAME = process.env.EMAIL_DISPLAYNAME || 'email_displayname';
export const EMAIL_USERNAME = process.env.EMAIL_USERNAME || 'email_username';
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || 'email_password';

// Security config
export const SECRET = process.env.SECRET || 'secret';
export const ACCESS_TOKEN_DURATION = Number(process.env.ACCESS_TOKEN_DURATION) || 3600;
export const REFRESH_TOKEN_DURATION = Number(process.env.REFRESH_TOKEN_DURATION) || 86400;
export const EXCHANGE_DURATION = Number(process.env.EXCHANGE_DURATION) || 600;