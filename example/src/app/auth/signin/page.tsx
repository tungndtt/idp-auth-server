import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useNotification } from "@/components/notification";
import { Box, Button, Divider, FormControl, FormLabel, TextField } from "@mui/material";
import { env } from "next-runtime-env";

export default function SignInPage() {
    const SERVER_URL = env("NEXT_PUBLIC_SERVER_URL");
    const router = useRouter();
    const notify = useNotification();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    useEffect(() => {
        const registrationFormListener = (event: any) => {
            if (event.origin === SERVER_URL && event.data) {
                const { email, username, code } = event.data;
                router.push({
                    pathname: "/auth/singup",
                    query: { email, username, code },
                });
            }
        };
        window.addEventListener("message", registrationFormListener);
        return () => window.removeEventListener("message", registrationFormListener);
    }, []);
    const openAuthPopup = (e: any) => {
        const idp = e.target.name as string;
        const width = 500;
        const height = 600;
        const left = Math.max(window.innerWidth - width, 0) / 2;
        const top = Math.max(window.innerHeight - height, 0) / 2;
        window.open(`${SERVER_URL}/auth/${idp}`, idp, `width=${width},height=${height},top=${top},left=${left}`);
    };
    const signUpEmail = () => {
        router.push({ pathname: "/auth/signup/email" });
    };
    const signIn = async () => {
        if (!email || !password) return;
        try {
            const response = await fetch(`${SERVER_URL}/auth/signin`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            if (!response.ok) {
                notify({ message: await response.text(), isError: true });
                return;
            }
            router.push({ pathname: "/" });
        } catch {
            notify({ message: "Cannot request server", isError: true });
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
                p: 2,
            }}
        >
            <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <TextField
                    id="email"
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    autoComplete="email"
                    autoFocus
                    required
                    fullWidth
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>
            <FormControl>
                <FormLabel htmlFor="password">Password</FormLabel>
                <TextField
                    name="password"
                    placeholder="••••••"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    autoFocus
                    required
                    fullWidth
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </FormControl>
            <Button onClick={signIn}>Sign In</Button>
            <Divider>Sign Up</Divider>
            <Button onClick={signUpEmail}>Email</Button>
            <Button name="google" onClick={openAuthPopup}>
                Google
            </Button>
            <Button name="github" onClick={openAuthPopup}>
                Github
            </Button>
            <Button name="linkedin" onClick={openAuthPopup}>
                Linkedin
            </Button>
            <Button name="facebook" onClick={openAuthPopup}>
                Facebook
            </Button>
        </Box>
    );
}
