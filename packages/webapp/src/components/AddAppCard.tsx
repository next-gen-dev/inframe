import {
    Avatar,
    Box,
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    Typography,
    useTheme,
} from "@mui/material";
import { ItemDisplay } from "../lib/item-display";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import RenderIcon from "./RenderIcon";
import { componentIcon } from "../lib/icon-def";
import { useCallback } from "react";
import {
    localSourceItems$,
    localSources$,
    NewConnectionDefinition,
    ResolvableInfo,
    ResolvableItem,
} from "../lib/models/sources";
import { firstValueFrom } from "rxjs";

export interface AddAppCardProps {
    service: NewConnectionDefinition;
    onClick?: (service: NewConnectionDefinition) => void;
}

const defaultAppIcon = componentIcon(CropSquareIcon);

export default function AddAppCard({ service, onClick }: AddAppCardProps) {
    const display = service.display;
    const theme = useTheme();
    const handleClick = useCallback(() => {
        if (onClick) onClick(service);
    }, [onClick]);
    return (
        <Card
            sx={{
                minWidth: 250,
                display: "inline-block",
                m: 1,
                textAlign: "center",
            }}
        >
            <CardActionArea onClick={handleClick}>
                <CardContent>
                    {/* {service.image ? <img src={service.image.} /> : <CropSquareIcon />} */}
                    {/* <Box sx={{ fontSize: "48px" }}>
                    <RenderIcon
                        icon={service.image ?? defaultAppIcon}
                        maxSize="48px"
                    />
                </Box> */}

                    <Avatar
                        sx={{
                            color: theme.palette.text.disabled,
                            bgcolor: "transparent",
                            width: "100%",
                            height: 48,
                            fontSize: "48px",
                        }}
                        variant="rounded"
                    >
                        <RenderIcon
                            icon={display.image ?? defaultAppIcon}
                            maxSize="48px"
                        />
                    </Avatar>

                    <Typography variant="h6" component="div">
                        {display.title}
                    </Typography>
                </CardContent>
            </CardActionArea>
            {/* <CardActions>
                <Button size="small">Learn More</Button>
            </CardActions> */}
        </Card>
    );
}
