import { ListItem } from "@mui/material";
import { forwardRef, PropsWithChildren, Ref, useMemo } from "react";
import { Link as RouterLink, To } from "react-router-dom";

export interface ListItemLinkProps {
    to: To;
}

export function ListItemLink({
    children,
    to,
}: PropsWithChildren<ListItemLinkProps>) {
    const renderLink = useMemo(
        () =>
            forwardRef(function Link(itemProps, ref: Ref<HTMLAnchorElement>) {
                return (
                    <RouterLink
                        to={to}
                        ref={ref}
                        {...itemProps}
                        role={undefined}
                    />
                );
            }),
        [to],
    );

    return (
        <ListItem button component={renderLink}>
            {children}
        </ListItem>
    );
}
