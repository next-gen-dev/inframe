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
import {
    Avatar,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Theme,
    Typography,
    useTheme,
} from "@mui/material";
import { capitalize, spaceCase, titleCase } from "../../utils/text-format";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import { forwardRef, PropsWithChildren, useMemo, useState } from "react";
import clsx from "clsx";
import TreeCustomContent from "../utils/TreeCustomContent";
import {
    DataNode,
    DataObjectType,
    DataProp,
    DataTableType,
    isDataNode,
    schemaReader,
} from "../../lib/architecture/data-node";
import { ItemDisplay } from "../../lib/item-display";
import RenderIcon from "../RenderIcon";
import { useNavigate } from "react-router-dom";
import { useObjectPath } from "../../utils/useObjectPath";
import { visuallyRedact } from "../../utils/redactor";
import { PageBlockRow, useRows } from "./PageBlocks";
import { imageIcon } from "../../lib/icon-def";

function createData(
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number,
) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
    createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
    createData("Eclair", 262, 16.0, 24, 6.0),
    createData("Cupcake", 305, 3.7, 67, 4.3),
    createData("Gingerbread", 356, 16.0, 49, 3.9),
];

export interface PageMagicTableProps {
    drawerNode: DataNode;
}

function PropValue({
    value,
    theme,
    field,
}: {
    value: any;
    theme: Theme;
    field: string;
}) {
    if (value === null || value === undefined) {
        return <span style={{ color: theme.palette.text.disabled }}>null</span>;
    }
    if (field === "icon" && typeof value === "string") {
        return (
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
                <RenderIcon icon={imageIcon(value)} />
            </Avatar>
        );
    } else {
        // console.log("NOT AN ICON", field, value);
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
        case "object":
            if (Array.isArray(value)) {
                return (
                    <>
                        {value.length
                            ? `[\xa0${value.length}\xa0]`
                            : "[\xa0\xa0]"}
                    </>
                );
            }
            return <>{"{\xa0...\xa0}"}</>;
    }
    return <>{JSON.stringify(value)}</>;
}

function MagicTable({
    rows,
    itemSchema,
}: {
    rows: PageBlockRow[];
    itemSchema: DataObjectType;
}) {
    const theme = useTheme();
    const [selected, setSelected] = useState<string | null>(null);
    return (
        <Table stickyHeader size="small">
            <TableHead>
                <TableRow>
                    {itemSchema.properties.map((prop) => (
                        <TableCell key={prop.key}>{prop.name}</TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((row) => (
                    <TableRow
                        key={row.key}
                        hover
                        sx={{
                            "&:last-child td, &:last-child th": {
                                border: 0,
                            },
                        }}
                    >
                        {itemSchema.properties.map((prop) => {
                            const propVal = (row.node?.data ?? {})[prop.key];

                            return (
                                <TableCell
                                    key={prop.key}
                                    sx={{
                                        whiteSpace: "nowrap",
                                        "& .MuiTypography-root": {
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        },
                                        maxWidth: "320px",
                                        overflow: "hidden",
                                    }}
                                >
                                    <PropValue
                                        value={propVal}
                                        theme={theme}
                                        field={prop.key}
                                    />
                                </TableCell>
                            );
                        })}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

// {itemSchema.properties.map((prop) => (
//    return <TableCell key={prop.key}>{row.node?.data?[prop.name] ?? ''}</TableCell>;
//})}
// <TableCell component="th" scope="row">
//     {row.node?.data?.name ?? ""}
// </TableCell>
// <TableCell>{row.node?.data?.emoji ?? ""}</TableCell>

export default function PageMagicTable({ drawerNode }: PageMagicTableProps) {
    const { rows, schema } = useRows(drawerNode);

    if (schema?.type === "array" && schema.items?.type === "object") {
        return <MagicTable itemSchema={schema.items} rows={rows} />;
    }

    return null;
}
