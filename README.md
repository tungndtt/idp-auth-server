# IDP Authentication Server

**idp-auth-server** is a TypeScript Express backend which is designed to provide an extendable template for authentication server. It supports both manual authentication via email verification and OAuth from various identity providers such as Google, Linkedin, Github, Facebook, etc.

### API Endpoints

-   `GET /auth/local`: Register a new account via given email. Server sends verification code to confirm the email
-   `GET /auth/local/callback?code`: Use verification code to confirm the email associated with registered account
-   `GET /auth/{ipd}`: Register a new account via given **Identity Provider (idp)**. Currently, server supports OAuth from Google, Linkedin, Github and Facebook. The URL parameter `idp` can be either `google`, `github`, `linkedin` or `facebook`
-   `GET /auth/{idp}/callback?code`: Used for redirected URI for the IDP config. **Do not trigger the endpoints from the web client**
-   `POST /auth/signup`: Submit the registration form to sign up. The current form only includes the most basic information such as `email`, `username`, `password`. Can be extended to the application requirements
  
    > **Note**: registration uses exchange code `code` returned from `/auth/*/callback`
-   `POST /auth/signin`: Send request to sign in. By providing valid credentials, `access_token` and `refresh_token` are generated and added to the client cookies
-   `GET /auth/signout`: Send request to sign out. Clear `access_token` and `refresh_token` in the client cookies
-   `GET /api`: Start with actual app endpoints. Protected by middleware which handles validation and renewal of `access_token` and `refresh_token`

### Project Structure

```
idp-auth-server
├── src
│   ├── app.ts
│   ├── config.ts
│   ├── routes
│   |   ├── api
│   |   ├── auth
│   |   |   ├── facebook.ts
│   |   |   ├── github.ts
│   |   |   ├── google.ts
│   |   |   ├── linkedin.ts
│   |   |   ├── local.ts
│   |   |   └── index.ts
│   │   └── index.ts
│   └── services
│       ├── database.ts
│       ├── mailer.ts
│       └── security.ts
├── package.json
├── package-lock.json
└── tsconfig.md
```

#### Setup

-   The current implementation works on **Node 20+**
-   The server uses **MySQL** database to store the user accounts. You can configure the database engine by your favor
-   Install the necessary dependencies `npm install`
-   Start the server `npm run start`
-   Build the server `npm build` and run the build `run start`
