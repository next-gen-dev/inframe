import { Grid } from "@githubocto/flat-ui";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    useTheme,
} from "@mui/material";
import { useObservableState } from "observable-hooks";
import { TableDefinition } from "../../lib/table-types";
import { visuallyRedact } from "../../utils/redactor";

export interface PageTableProps extends TableDefinition {}

export function PageTable({ schema, rows: rows$ }: PageTableProps) {
    const rows = useObservableState(rows$) ?? [];
    // const theme = useTheme();
    const gridData = rows.map((row) => row.data);
    if (rows.length === 0) {
        return null;
    }
    let schemaSort = (schema ?? [])
        .filter((col) => col.sort === true)
        .map((col) => col.id);
    schemaSort = schemaSort.concat(schemaSort);
    return (
        <div style={{ borderTop: "solid 1px #d3d3d3", height: "100%" }}>
            <Grid
                data={gridData}
                isEditable={false}
                canDownload={false}
                defaultSort={[]}
            />
        </div>
    );
    // return (
    //     <TableContainer>
    //         <Table
    //             sx={{ minWidth: 650, tableLayout: "fixed" }}
    //             aria-label="simple table"
    //         >
    //             <TableHead>
    //                 <TableRow>
    //                     {schema.map((key) => (
    //                         <TableCell key={key.id} sx={{ fontWeight: "bold" }}>
    //                             {key.name}
    //                         </TableCell>
    //                     ))}
    //                 </TableRow>
    //             </TableHead>
    //             <TableBody>
    //                 {rows.map((row) => (
    //                     <TableRow
    //                         key={row.id}
    //                         sx={{
    //                             "&:last-child td, &:last-child th": {
    //                                 border: 0,
    //                             },
    //                         }}
    //                     >
    //                         {schema.map((key) => (
    //                             <TableCell
    //                                 key={key.id}
    //                                 sx={{
    //                                     whiteSpace: "nowrap",
    //                                     overflow: "hidden",
    //                                     textOverflow: "ellipsis",
    //                                     minHeight: "1em",
    //                                     "&:before": {
    //                                         content: '" "',
    //                                         display: "inline-block",
    //                                     },
    //                                 }}
    //                             >
    //                                 {visuallyRedact(
    //                                     row.data[key.id],
    //                                     theme.palette.text.disabled,
    //                                 )}
    //                             </TableCell>
    //                         ))}
    //                     </TableRow>
    //                 ))}
    //             </TableBody>
    //         </Table>
    //     </TableContainer>
    // );
}
