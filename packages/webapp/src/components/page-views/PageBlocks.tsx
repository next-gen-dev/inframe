import {
    TreeItem,
    treeItemClasses,
    TreeItemContentProps,
    TreeView,
    useTreeItem,
} from "@mui/lab";
import { useObservableState } from "observable-hooks";
import { isObservable, Observable, of } from "rxjs";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Avatar, Box, Theme, Typography, useTheme } from "@mui/material";
import { capitalize, spaceCase, titleCase } from "../../utils/text-format";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import { forwardRef, PropsWithChildren, useMemo } from "react";
import clsx from "clsx";
import TreeCustomContent from "../utils/TreeCustomContent";
import {
    DataNode,
    DataProp,
    isDataNode,
    schemaReader,
} from "../../lib/architecture/data-node";
import { ItemDisplay } from "../../lib/item-display";
import RenderIcon from "../RenderIcon";
import { useNavigate } from "react-router-dom";
import { useObjectPath } from "../../utils/useObjectPath";
import { visuallyRedact } from "../../utils/redactor";

export interface PageBlockProps {
    // object: Observable<{ [k: string]: any } | undefined>;
    dataNode: DataNode;
}

export interface PageBlockRow {
    property?: DataProp;
    node?: DataNode;
    value?: any;
    key: string;
}

interface PageItemProps {
    // TODO: probably required
    dataNode?: DataNode;
    property?: DataProp;
    idSuffix?: string;
    theme: Theme;
    // TODO: remove
    value?: any;
    rowKey: string;
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

function PropValue({ value, theme }: { value: any; theme: Theme }) {
    if (value === null || value === undefined) {
        return <span style={{ color: theme.palette.text.disabled }}>null</span>;
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
                    <span style={{ color: theme.palette.info.main }}>
                        {value ? "true" : "false"}
                    </span>
                </>
            );
        case "number":
            return (
                <span style={{ color: theme.palette.success.main }}>
                    {value}
                </span>
            );
        case "string":
            return <>{visuallyRedact(value, theme.palette.text.disabled)}</>;
    }
    return <>{JSON.stringify(value)}</>;
}

function PropTypography({ children }: PropsWithChildren<{}>) {
    return (
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
            {children}
        </Typography>
    );
}

export function useRows(dataNode?: DataNode, value?: any) {
    const children$ = useMemo(
        () => dataNode?.children ?? of(undefined),
        [dataNode?.children],
    );
    const children = useObservableState(children$, []);
    const schema =
        dataNode?.schema ??
        (children
            ? {
                  type: "array",
                  ...(children.length === 0
                      ? {}
                      : {
                            items:
                                children[0].schema ??
                                schemaReader(children[0].data),
                        }),
              }
            : dataNode
            ? schemaReader(dataNode.data)
            : undefined);
    const rows: PageBlockRow[] = useMemo(() => {
        if (!schema) {
            if (Array.isArray(value)) {
                return value.map(
                    (item, index): PageBlockRow => ({
                        key: `${index}`,
                        value: item,
                    }),
                );
            } else if (value && typeof value === "object") {
                return Object.keys(value).map(
                    (key): PageBlockRow => ({
                        property: {
                            key,
                            name: titleCase(key),
                        },
                        value: value[key],
                        key: key,
                    }),
                );
            }
            return [];
        } else if (schema.type === "object") {
            return schema.properties.map((property) => {
                const value = dataNode?.data[property.key];
                return {
                    property,
                    // TODO: how do I get a node here? maybe it could be a value
                    // How can the properties be a node?
                    // node: null
                    [isDataNode(value) ? "node" : "value"]:
                        dataNode?.data[property.key],
                    key: property.key,
                };
            });
        } else {
            return children
                ? children.map((node) => ({
                      node,
                      key: node.lenses.listItem(node.data).id,
                  }))
                : [];
        }
    }, [schema, children, value]);
    return { rows, schema };
}

function BlockItemDisplay({
    theme,
    item,
}: {
    theme: Theme;
    item: ItemDisplay;
}) {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                p: 0,
                // pr: 0,
                // pl: 0,
            }}
        >
            <Avatar
                sx={{
                    color: theme.palette.text.disabled,
                    bgcolor: "transparent",
                    width: 18,
                    height: 18,
                    mr: 2,
                    fontSize: 16,
                }}
                variant="rounded"
            >
                <RenderIcon icon={item.image} />
            </Avatar>
            <span
                style={{
                    fontWeight: "inherit",
                    flexGrow: 1,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                }}
            >
                {item.title}
            </span>
        </Box>
    );
}

export function PageRow({
    idSuffix,
    dataNode,
    property,
    value: valueInput,
    theme,
    rowKey,
}: PageItemProps) {
    const key = rowKey;
    // return property ? <div>{JSON.stringify(value)}</div> : <div>NODE</div>;

    const value$ = isObservable(valueInput) ? valueInput : of(valueInput);
    const value = useObservableState(value$, undefined);

    const hasChildren = value && typeof value === "object";
    // const label = hasChildren
    //     ? `${key}:`
    //     : `${key}: ${JSON.stringify(object[key])}`;

    //  JSON.stringify(object[key])
    // TODO: pass the listItem to PropValue to render the icon
    const valueElement = dataNode ? (
        <BlockItemDisplay
            theme={theme}
            item={dataNode.lenses.listItem(dataNode.data)}
        />
    ) : hasChildren ? (
        ""
    ) : (
        <PropTypography>
            <PropValue theme={theme} value={value} />
        </PropTypography>
    );
    // const key = property?.key ?? dataNode?.lenses.id(dataNode.data) ?? "NO_KEY";
    const nodeId = `${idSuffix ?? ""}${key}`;
    const labelComp = (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                // p: 0.5,
                // pr: 0,
            }}
        >
            {!property ? null : (
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
                    {property.name}
                </Typography>
            )}
            {valueElement}
        </Box>
    );
    const { rows } = useRows(dataNode, value);

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
            {rows.length === 0
                ? null
                : rows.map((row) => (
                      <PageRow
                          idSuffix={`${nodeId}.`}
                          key={row.key}
                          rowKey={row.key}
                          dataNode={row.node}
                          property={row.property}
                          value={row.value}
                          theme={theme}
                      />
                  ))}
            {/* <PageRows dataNode={dataNode} theme={theme} /> */}
            {/* {hasChildren ? (
                <PageRow idSuffix={`${nodeId}.`} theme={theme} />
            ) : null} */}
        </TreeItem>
    );
}

// TODO: make the ChevronRightIcon fade when not in hover
export default function PageBlocks({ dataNode }: PageBlockProps) {
    const theme = useTheme();
    const { rows } = useRows(dataNode);
    const navigate = useNavigate();
    const objPath = useObjectPath();
    const path = objPath.join("/");
    const handleSelect = (event: React.SyntheticEvent, nodeId: string) => {
        navigate(`${path}/${nodeId}`);
    };
    return (
        <TreeView
            aria-label="file system navigator"
            defaultCollapseIcon={
                <ExpandMoreIcon htmlColor={theme.palette.text.disabled} />
            }
            defaultExpandIcon={
                <ChevronRightIcon htmlColor={theme.palette.text.disabled} />
            }
            onNodeSelect={handleSelect}
            sx={{
                "& .MuiTreeItem-label": {
                    // fontFamily: "monospace",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                },
            }}
        >
            {rows.map((row) => (
                <PageRow
                    key={row.key}
                    rowKey={row.key}
                    dataNode={row.node}
                    property={row.property}
                    value={row.value}
                    theme={theme}
                />
            ))}
        </TreeView>
    );
}
