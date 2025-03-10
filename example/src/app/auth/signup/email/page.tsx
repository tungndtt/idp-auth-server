import { useState } from "react";
import { useRouter } from "next/router";
import { useNotification } from "@/components/notification";
import { Box, Button, FormControl, FormLabel, TextField } from "@mui/material";
import { env } from "next-runtime-env";

export default function SignUpEmailPage() {
    const SERVER_URL = env("NEXT_PUBLIC_SERVER_URL");
    const router = useRouter();
    const notify = useNotification();
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [verifyingCode, setVerifyingCode] = useState(false);
    const verifyEmail = async () => {
        if (!email) return;
        try {
            const response = await fetch(`${SERVER_URL}/auth/local?email=${email}`);
            const text = await response.text();
            notify({ message: text, isError: !response.ok });
            setVerifyingCode(true);
        } catch {
            notify({ message: "Cannot request server", isError: true });
        }
    };

    const submitRegistrationCode = async () => {
        if (!email) return;
        try {
            const response = await fetch(`${SERVER_URL}/auth/local/callback?code=${code}`);
            if (!response.ok) {
                notify({ message: await response.text(), isError: false });
            } else {
                const { email, username, code } = await response.json();
                router.push({
                    pathname: "/auth/singup",
                    query: { email, username, code },
                });
            }
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
            <Box visibility={!verifyingCode ? "visible" : "hidden"}>
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
                <Button onClick={verifyEmail}>Verify Email</Button>
            </Box>
            <Box visibility={verifyingCode ? "visible" : "hidden"}>
                <FormControl>
                    <FormLabel htmlFor="code">Registration Code</FormLabel>
                    <TextField
                        id="code"
                        type="text"
                        name="code"
                        placeholder="code"
                        autoFocus
                        required
                        fullWidth
                        variant="outlined"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                </FormControl>
                <Button onClick={submitRegistrationCode}>Submit Registration Code</Button>
            </Box>
        </Box>
    );
}
