import { Box, Button, Typography } from "@mui/material";
import { signInWithGoogle } from "../../lib/models/gmail/google-login";

export default function Landing() {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minWidth: "100vw",
                minHeight: "100vh",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Typography variant="h3">Inframe</Typography>
            <Button onClick={() => signInWithGoogle()}>
                Login with Google
            </Button>
        </Box>
    );
}
