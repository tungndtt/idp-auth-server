"use client";
import NotificationProvider from "./components/notification";
import { PublicEnvScript } from "next-runtime-env";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <PublicEnvScript />
            </head>
            <body suppressHydrationWarning>
                <NotificationProvider>{children}</NotificationProvider>
            </body>
        </html>
    );
}
