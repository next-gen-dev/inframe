import { styled, useTheme } from "@mui/material/styles";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import TreeItem, { TreeItemProps, treeItemClasses } from "@mui/lab/TreeItem";
import MailIcon from "@mui/icons-material/Mail";
import DeleteIcon from "@mui/icons-material/Delete";
import Label from "@mui/icons-material/Label";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import InfoIcon from "@mui/icons-material/Info";
import ForumIcon from "@mui/icons-material/Forum";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArticleIcon from "@mui/icons-material/Article";
import { Avatar, Box, Button, Divider, Typography } from "@mui/material";
import { drawerNodes$ } from "../data/drawer-list";
import RenderIcon from "./RenderIcon";
import { useNavigate } from "react-router-dom";
import { DataNode } from "../lib/architecture/data-node";
import { useObservableState } from "observable-hooks";
import TreeCustomContent from "./utils/TreeCustomContent";
import { componentIcon } from "../lib/icon-def";
import { googleSignOut } from "../lib/models/gmail/google-login";
import { of } from "rxjs";

type StyledTreeItemProps = TreeItemProps & {
    bgColor?: string;
    labelIcon: React.ReactElement;
    labelText: string;
    depth?: number;
};

const StyledTreeItemRoot = styled(TreeItem, {
    shouldForwardProp: (prop) => prop !== "depth",
})<{ depth: number }>(({ theme, depth }) => ({
    color: theme.palette.text.secondary,
    [`& .${treeItemClasses.content}`]: {
        color: theme.palette.text.secondary,
        paddingRight: theme.spacing(1),
        fontWeight: theme.typography.fontWeightMedium,
        "&.Mui-expanded": {
            fontWeight: theme.typography.fontWeightRegular,
        },
        "&:hover": {
            backgroundColor: theme.palette.action.hover,
        },
        [`& .${treeItemClasses.label}`]: {
            fontWeight: "inherit",
            color: "inherit",
        },
        "&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused": {
            backgroundColor: theme.palette.action.selected,
        },
    },
    [`& .${treeItemClasses.group}`]: {
        marginLeft: 0, //theme.spacing(2),
        [`& .${treeItemClasses.content}`]: {
            paddingLeft: theme.spacing((1 + depth) * 3),
        },
    },
}));

function StyledTreeItem(props: StyledTreeItemProps) {
    const theme = useTheme();
    const { bgColor, labelIcon, labelText, depth, ...other } = props;

    return (
        <StyledTreeItemRoot
            ContentComponent={TreeCustomContent}
            depth={depth ?? 0}
            label={
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 1,
                        pr: 0,
                        pl: 0,
                    }}
                >
                    <Avatar
                        sx={{
                            color: theme.palette.text.disabled,
                            bgcolor: bgColor ?? "transparent",
                            width: 18,
                            height: 18,
                            mr: 2,
                            fontSize: 16,
                        }}
                        variant="rounded"
                    >
                        {labelIcon}
                    </Avatar>
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: "inherit",
                            flexGrow: 1,
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {labelText}
                    </Typography>
                </Box>
            }
            {...other}
        />
    );
}

export function NavDrawerItem({
    path,
    item,
    depth,
}: {
    path?: string;
    item: DataNode;
    depth?: number;
}) {
    const { lenses, data, children: children$ } = item;
    const { id, title, image } = lenses.listItem(data);
    const children = useObservableState(
        children$ ? children$ : of(undefined),
        [],
    );
    const nodeId = `${path ?? ""}${id}`;
    return (
        <StyledTreeItem
            key={id}
            nodeId={nodeId}
            labelText={title}
            depth={depth}
            labelIcon={<RenderIcon icon={image} />}
        >
            {/* TODO: Make this a recursive tree */}
            {/* {children &&
                children.map((child) => (
                    <NavDrawerItem
                        key={child.lenses.id(child.data)}
                        item={child}
                        path={`${nodeId}/`}
                        depth={(depth ?? 0) + 1}
                    />
                ))} */}
        </StyledTreeItem>
    );
}

export default function NavDrawer() {
    const navigate = useNavigate();
    const handleSelect = (event: React.SyntheticEvent, nodeId: string) => {
        navigate(`/${nodeId}`);
    };
    const drawerNodes = useObservableState(drawerNodes$, []);
    return (
        <>
            <TreeView
                defaultCollapseIcon={<ArrowDropDownIcon />}
                defaultExpandIcon={<ArrowRightIcon />}
                defaultEndIcon={<div style={{ width: 24 }} />}
                onNodeSelect={handleSelect}
                sx={{
                    height: 264,
                    flexGrow: 1,
                    maxWidth: 400,
                    overflowY: "auto",
                }}
            >
                {drawerNodes.map((node) => (
                    <NavDrawerItem key={node.data.id} item={node} />
                ))}
                {/* <StyledTreeItem
                    key={"new_connection"}
                    nodeId={"new_connection"}
                    labelText={"New Connection"}
                    depth={0}
                    labelIcon={
                        <RenderIcon icon={componentIcon(AddBoxRoundedIcon)} />
                    }
                ></StyledTreeItem> */}
            </TreeView>
            {/* <Divider />
            <Button onClick={() => googleSignOut()}>Logout</Button> */}
        </>
    );
}
