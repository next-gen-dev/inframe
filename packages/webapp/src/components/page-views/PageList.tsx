import {
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    useTheme,
} from "@mui/material";
import { useObservableState } from "observable-hooks";
import { Link, useLocation } from "react-router-dom";
import { Observable } from "rxjs";
import { ItemDisplay } from "../../lib/item-display";
import { visuallyRedact } from "../../utils/redactor";
import RenderIcon from "../RenderIcon";

export interface PageListProps {
    items: ItemDisplay[];
}

export default function PageList({ items }: PageListProps) {
    const theme = useTheme();
    const { pathname } = useLocation();

    return (
        <List
            sx={{
                padding: `0 0 ${theme.spacing(3)}`,
                "& .MuiListItemButton-root": {
                    paddingLeft: 3,
                    paddingRight: 3,
                },
                "& .MuiListItemIcon-root, & .MuiListItemAvatar-root": {
                    minWidth: 0,
                    marginRight: 2,
                    display: "flex",
                },
            }}
        >
            {(items ?? []).map((item) => (
                <ListItem disablePadding key={item.id}>
                    <ListItemButton
                        component={Link}
                        to={`${pathname}/${item.id}`}
                    >
                        <ListItemAvatar>
                            <Avatar
                                sx={{
                                    bgcolor: "transparent",
                                    color: theme.palette.text.disabled,
                                    width: 20,
                                    height: 20,
                                    fontSize: 18,
                                }}
                                variant="rounded"
                            >
                                <RenderIcon icon={item.image} />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            sx={{
                                whiteSpace: "nowrap",
                                "& .MuiTypography-root": {
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                },
                            }}
                        >
                            {visuallyRedact(
                                item.title,
                                theme.palette.text.disabled,
                            )}
                        </ListItemText>
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    );
}

export function AsyncPageList({
    items: items$,
}: {
    items: Observable<ItemDisplay[]>;
}) {
    const items = useObservableState(items$, []);
    return <PageList items={items} />;
}
