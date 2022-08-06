import {
    TreeItem,
    treeItemClasses,
    TreeItemContentProps,
    TreeView,
    useTreeItem,
} from "@mui/lab";
import { useObservableState } from "observable-hooks";
import { Observable } from "rxjs";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Box, Typography, useTheme } from "@mui/material";
import { capitalize, spaceCase, titleCase } from "../../utils/text-format";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import { forwardRef } from "react";
import clsx from "clsx";
import TreeCustomContent from "../utils/TreeCustomContent";
import { visuallyRedact } from "../../utils/redactor";

export interface PageObjectProps {
    object: Observable<{ [k: string]: any } | undefined>;
}

interface PageItemProps {
    object: { [k: string]: any };
    idSuffix?: string;
}

function selectTarget(target: Node) {
    if ("selection" in document) {
        // IE
        // @ts-ignore
        const range = document.body.createTextRange();
        range.moveToElementText(target);
        range.select();
    } else if ("getSelection" in window) {
        const range = document.createRange();
        range.selectNode(target);
        const selection = window.getSelection();
        if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }
}

function PageItems({ object, idSuffix }: PageItemProps) {
    const theme = useTheme();
    const keys = Object.keys(object);

    function PropValue({ value }: { value: any }) {
        if (value === null || value === undefined) {
            return (
                <span style={{ color: theme.palette.text.disabled }}>null</span>
            );
        }
        switch (typeof value) {
            case "boolean":
                return (
                    <>
                        {/* {value ? (
                            <CheckCircleOutlineOutlinedIcon
                                htmlColor={theme.palette.text.disabled}
                                fontSize="small"
                                sx={{ mr: 0.5 }}
                            />
                        ) : (
                            <RemoveCircleOutlineOutlinedIcon
                                htmlColor={theme.palette.text.disabled}
                                fontSize="small"
                                sx={{ mr: 0.5 }}
                            />
                        )} */}
                        <Typography sx={{ color: "info.main" }}>
                            {value ? "true" : "false"}
                        </Typography>
                    </>
                );
            case "number":
                return (
                    <Typography sx={{ color: "success.main" }}>
                        {value}
                    </Typography>
                );
            case "string":
                return (
                    <>{visuallyRedact(value, theme.palette.text.disabled)}</>
                );
        }
        return <>{JSON.stringify(value)}</>;
    }
    return (
        <>
            {keys.map((key) => {
                const hasChildren =
                    object[key] && typeof object[key] === "object";
                // const label = hasChildren
                //     ? `${key}:`
                //     : `${key}: ${JSON.stringify(object[key])}`;

                //  JSON.stringify(object[key])
                const value = hasChildren ? (
                    ""
                ) : (
                    <PropValue value={object[key]} />
                );
                const nodeId = `${idSuffix}${key}`;
                const labelComp = (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            // p: 0.5,
                            // pr: 0,
                        }}
                    >
                        <Typography
                            color={theme.palette.text.disabled}
                            onDoubleClick={(event) => {
                                selectTarget(event.target as Node);
                            }}
                            sx={{
                                fontWeight: "inherit",
                                flexGrow: 1,
                                width: 0,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {titleCase(key)}
                        </Typography>
                        <Typography
                            color="inherit"
                            onDoubleClick={(event) => {
                                selectTarget(event.target as Node);
                            }}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                fontWeight: "inherit",
                                flexGrow: 4,
                                width: 0,
                            }}
                        >
                            {value}
                        </Typography>
                    </Box>
                );
                return (
                    <TreeItem
                        nodeId={nodeId}
                        key={key}
                        label={labelComp}
                        ContentComponent={TreeCustomContent}
                        sx={{
                            [`& > .${treeItemClasses.content}`]: {
                                pt: 0.75,
                                pb: 0.75,
                            },

                            [`& .${treeItemClasses.group}`]: {
                                marginLeft: 3,
                                [`& .${treeItemClasses.content}`]: {
                                    paddingLeft: theme.spacing(1),
                                },
                            },
                        }}
                    >
                        {hasChildren ? (
                            <PageItems
                                object={object[key]}
                                idSuffix={`${nodeId}.`}
                            />
                        ) : null}
                    </TreeItem>
                );
            })}
        </>
    );
}

export default function PageObject({ object }: PageObjectProps) {
    const theme = useTheme();
    const json = useObservableState(object, null);
    if (!json) {
        return null;
    }
    return (
        <TreeView
            aria-label="file system navigator"
            defaultCollapseIcon={
                <ExpandMoreIcon htmlColor={theme.palette.text.disabled} />
            }
            defaultExpandIcon={
                <ChevronRightIcon htmlColor={theme.palette.text.disabled} />
            }
            sx={{
                "& .MuiTreeItem-label": {
                    fontFamily: "monospace",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                },
            }}
        >
            <PageItems object={json} />
        </TreeView>
    );
}
