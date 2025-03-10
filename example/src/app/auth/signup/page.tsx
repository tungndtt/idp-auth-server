import { useState } from "react";
import { useRouter } from "next/router";
import { useNotification } from "@/components/notification";
import { Box, Button, FormControl, FormLabel, TextField } from "@mui/material";
import { env } from "next-runtime-env";

export default function SignUpPage() {
    const SERVER_URL = env("NEXT_PUBLIC_SERVER_URL");
    const router = useRouter();
    const notify = useNotification();
    const { code } = router.query;
    const [email, setEmail] = useState(router.query.email);
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState(router.query.username);
    const signUp = async () => {
        if (!email || !password || !username) return;
        try {
            const response = await fetch(`${SERVER_URL}/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, username, code }),
            });
            const text = await response.text();
            notify({ message: text, isError: !response.ok });
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
                <FormLabel htmlFor="usrname">Username</FormLabel>
                <TextField
                    id="username"
                    type="text"
                    name="username"
                    placeholder="username"
                    autoFocus
                    required
                    fullWidth
                    variant="outlined"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </FormControl>
            <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <TextField
                    id="email"
                    type="email"
                    name="email"
                    placeholder="your@email.com"
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
                    id="password"
                    type="password"
                    name="password"
                    placeholder="••••••"
                    autoFocus
                    required
                    fullWidth
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </FormControl>
            <Button onClick={signUp}>Sign Up</Button>
        </Box>
    );
}
