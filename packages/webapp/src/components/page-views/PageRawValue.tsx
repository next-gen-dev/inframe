import { imageIcon } from "@inframe/common";
import {
    Avatar,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Theme,
    useTheme,
} from "@mui/material";
import { useObservableState } from "observable-hooks";
import { Observable } from "rxjs";
import { schemaReader } from "../../lib/architecture/data-node";
import { visuallyRedact } from "../../utils/redactor";
import RenderIcon from "../RenderIcon";

export interface PageRawValueProps {
    value: any;
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

export function PageRawValue({ value }: PageRawValueProps) {
    const theme = useTheme();
    const schema = schemaReader(value);
    const itemSchema = (schema?.type === "array" && schema.items) || undefined;

    if (itemSchema?.type === "object" && Array.isArray(value)) {
        // Table
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
                    {value.map((row, index) => (
                        <TableRow
                            key={`${index}`}
                            hover
                            sx={{
                                "&:last-child td, &:last-child th": {
                                    border: 0,
                                },
                            }}
                        >
                            {itemSchema.properties.map((prop) => {
                                const propVal = row[prop.key];

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
    } else {
        // JSON
        try {
            const text = JSON.stringify(value, null, 4);
            return <pre>{text}</pre>;
        } catch (e) {
            return <span>Error displaying value</span>;
        }
    }
}

export function PageAsyncValue({ value }: { value: Observable<any> }) {
    const v = useObservableState(value);
    return <PageRawValue value={v} />;
}
