"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useNotification } from "./components/notification";
import { Box, Button, TextField } from "@mui/material";

export default function IndexPage() {
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
    const router = useRouter();
    const notify = useNotification();
    const [data, setData] = useState<{ email: string; username: string } | undefined>(undefined);
    useEffect(() => {
        fetch(`${SERVER_URL}/api`)
            .then(async (response) => {
                if (!response.ok) {
                    router.push({ pathname: "/auth/singin" });
                } else {
                    const { email, username } = await response.json();
                    setData({ email, username });
                }
            })
            .catch(() => notify({ message: "Cannot request server", isError: true }));
    }, []);
    const signOut = async () => {
        try {
            await fetch(`${SERVER_URL}/auth/signout`);
            router.push({ pathname: "/auth/singin" });
        } catch {}
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
            <TextField>
                Welcome {data?.email}, {data?.username}
            </TextField>
            <Button onClick={signOut}>Sign Out</Button>
        </Box>
    );
}
