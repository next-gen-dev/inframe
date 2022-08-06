import { createTheme } from "@mui/material";

export const lightTheme = createTheme({
    palette: {
        mode: "light",
        background: {
            paper: "#F7F6F3",
        },
    },
});

export const darkTheme = createTheme({
    palette: {
        mode: "dark",
        background: {
            paper: "#202020",
            default: "#191919",
        },
    },
});
