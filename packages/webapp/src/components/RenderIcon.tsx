import { Box, Typography } from "@mui/material";
import { IconDef } from "../lib/icon-def";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

export interface RenderIconProps {
    icon?: IconDef;
    maxSize?: string;
}

export default function RenderIcon({ icon, maxSize }: RenderIconProps) {
    if (!icon) {
        return null;
    }
    switch (icon.type) {
        case "image":
            return (
                <img
                    src={icon.src}
                    style={{
                        maxWidth: maxSize ?? "100%",
                        maxHeight: maxSize ?? "100%",
                    }}
                />
            );
        case "component":
            return (
                <Box
                    component={icon.component}
                    color="inherit"
                    fontSize="inherit"
                />
            );
        case "emoji":
            return (
                // Increasing the icon because of a Chrome Retina bug: https://stackoverflow.com/a/52909933
                <span
                    style={{
                        color: "black",
                        fontFamily: "sans-serif",
                        fontSize: "4em",
                        transform: "scale(0.24)", // Not 25% because it was cutting the corners of the globe emoji
                        textAlign: "center",
                        display: "inline-block",
                    }}
                >
                    {icon.value}
                </span>
            );
        case "color":
            return (
                <FiberManualRecordIcon
                    htmlColor={icon.value}
                    fontSize="small"
                />
            );
    }
    return null;
}
