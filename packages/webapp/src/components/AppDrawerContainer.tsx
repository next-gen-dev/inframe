import {
    Avatar,
    Box,
    CssBaseline,
    Drawer,
    IconButton,
    Toolbar,
    Typography,
} from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import { styled, useTheme } from "@mui/material/styles";
import { PropsWithChildren, useMemo, useState } from "react";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import MenuIcon from "@mui/icons-material/Menu";
import { drawerNodes$ } from "../data/drawer-list";
import { useObjectPath } from "../utils/useObjectPath";
import NavDrawer from "./NavDrawer";
import { ItemDisplay } from "../lib/item-display";
import RenderIcon from "./RenderIcon";
import { DataNode } from "../lib/architecture/data-node";
import { ActionIconClickContext, useActionIcons } from "./utils/ActionIcons";
import { Link } from "react-router-dom";
import { useObservableState } from "observable-hooks";
import { useCodeExport } from "./utils/CodeExportProvider";

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
    open: boolean;
}>(({ theme, open }) => ({
    flexGrow: 1,
    padding: 0,
    width: 0,
    minHeight: "100vh",
    transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }),
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})<{ open: boolean }>(({ theme, open }) => ({
    transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    background: theme.palette.background.paper,
    color: theme.palette.text.primary,
    boxShadow: "none",
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
}));

function findPathTitle(displays: DataNode[], path: string[]): ItemDisplay[] {
    if (path.length === 0) {
        return [];
    }
    const [segment, ...newPath] = path;
    const display = displays
        .map((item) => item.lenses.listItem(item.data))
        .find((item) => item.id === segment);
    // TODO: children
    return display ? [display] : [];
}

const drawerWidth = 280;

export default function AppDrawerContainer({
    children,
}: PropsWithChildren<{}>) {
    const theme = useTheme();
    const [open, setOpen] = useState(true);
    const path = useObjectPath();

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const drawerNodes = useObservableState(drawerNodes$, []);

    const titleDisplays = useMemo(() => {
        return findPathTitle(drawerNodes, path);
    }, [path]);

    const { actionIcons } = useActionIcons();

    const { exportCode } = useCodeExport();
    const context: ActionIconClickContext = { exportCode };

    return (
        <Box sx={{ display: "flex" }}>
            <AppBar
                position="fixed"
                open={open}
                sx={{
                    background: theme.palette.background.default,
                    "& .MuiToolbar-root": { minHeight: "45px !important" },
                }}
            >
                <Toolbar>
                    <IconButton
                        size="small"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            mr: 2,
                            ...(open && { display: "none" }),
                        }}
                    >
                        <MenuIcon htmlColor={theme.palette.text.disabled} />
                    </IconButton>
                    {titleDisplays.map((display) => (
                        <span
                            key={display.id}
                            style={{ display: "flex", alignItems: "center" }}
                        >
                            <Avatar
                                sx={{
                                    color: theme.palette.text.disabled,
                                    bgcolor: "transparent",
                                    width: 20,
                                    height: 20,
                                    fontSize: 18,
                                    mr: 2,
                                }}
                                variant="rounded"
                            >
                                <RenderIcon icon={display.image} />
                            </Avatar>
                            <Typography>{display.title}</Typography>
                        </span>
                    ))}
                    <div style={{ flexGrow: 1 }} />
                    {actionIcons.map((actionIcon) =>
                        actionIcon.href ? (
                            <IconButton
                                key={actionIcon.key}
                                size="small"
                                aria-label={actionIcon.ariaLabel ?? ""}
                                edge="start"
                                component={Link}
                                to={actionIcon.href}
                            >
                                <RenderIcon icon={actionIcon.icon} />
                                {/* {actionIcon.icon} */}
                            </IconButton>
                        ) : (
                            <IconButton
                                key={actionIcon.key}
                                size="small"
                                aria-label={actionIcon.ariaLabel ?? ""}
                                edge="start"
                                onClick={() =>
                                    actionIcon.onClick
                                        ? actionIcon.onClick(context)
                                        : null
                                }
                            >
                                <RenderIcon icon={actionIcon.icon} />
                                {/* {actionIcon.icon} */}
                            </IconButton>
                        ),
                    )}
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",
                        border: "none",
                        background: open
                            ? theme.palette.background.paper
                            : theme.palette.background.default,
                        transition:
                            theme.transitions.create(
                                ["transform", "background"],
                                open
                                    ? {
                                          easing: theme.transitions.easing
                                              .easeOut,
                                          duration:
                                              theme.transitions.duration
                                                  .enteringScreen,
                                      }
                                    : {
                                          easing: theme.transitions.easing
                                              .sharp,
                                          duration:
                                              theme.transitions.duration
                                                  .leavingScreen,
                                      },
                            ) + " !important",
                    },
                }}
                elevation={0}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader sx={{ minHeight: "45px !important" }}>
                    <Typography sx={{ flexGrow: 1, pl: 3 }} fontWeight="bold">
                        <Link className="clean-link" to="/">
                            Inframe
                        </Link>
                    </Typography>
                    <IconButton size="small" onClick={handleDrawerClose}>
                        {theme.direction === "ltr" ? (
                            <KeyboardDoubleArrowLeftIcon
                                htmlColor={theme.palette.text.disabled}
                            />
                        ) : (
                            <KeyboardDoubleArrowRightIcon
                                htmlColor={theme.palette.text.disabled}
                            />
                        )}
                    </IconButton>
                </DrawerHeader>
                <NavDrawer />
            </Drawer>
            <Main open={open} sx={{ display: "flex", flexDirection: "column" }}>
                <Box
                    sx={{
                        height: "45px",
                        flex: "0 0 45px",
                    }}
                ></Box>
                <Box
                    sx={{
                        height: "0",
                        flex: "1 1 0",
                        overflow: "auto",
                    }}
                >
                    {children}
                </Box>
            </Main>
        </Box>
    );
}
