import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import Prism from "prismjs";
import { useEffect, useMemo, useState } from "react";

function exportCode(objPath: string[], type?: string) {
    const rootURL = `http://localhost:8081`;
    if (type === "fetch") {
        const urlpath = objPath.join("/");
        //         return `const request = {headers: {Authorization: "Bearer ${token}"}}
        // const response = await fetch("https://api.inframe.dev/${urlpath}", request)
        // const data = await response.json()
        // `;
        return `const response = await fetch("${rootURL}/data/${urlpath}")
const data = await response.json()
`;
    }
    const keypath = objPath
        .map((k) => (k.match(/^\d/) ? `["${k}"]` : k))
        .join(".");

    return `import { inframe } from "./inframe"

// Inside your React component

const data = useInframeData(inframe.${keypath})

`;
}

export interface ExportCodeDialogProps {
    open: boolean;
    onClose: () => void;
    objPath: string[];
}

export default function ExportCodeDialog({
    onClose,
    open,
    objPath,
}: ExportCodeDialogProps) {
    const handleClose = () => {
        if (onClose) onClose();
    };

    const handleListItemClick = (value: string) => {
        if (onClose) onClose();
    };

    const [codeType, setCodeType] = useState("fetch");
    const exportedCode = useMemo(
        () => exportCode(objPath, codeType),
        [objPath, codeType],
    );
    const [showCopied, setShowCopied] = useState(false);

    useEffect(() => {
        setTimeout(() => Prism.highlightAll(), 0);
    }, [exportedCode, open]);

    const handleCopy = async (copiedCode: string) => {
        await navigator.clipboard.writeText(copiedCode);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 4000);
    };

    return (
        <Dialog
            onClose={handleClose}
            open={open ?? true}
            fullWidth={true}
            maxWidth="md"
        >
            <DialogTitle sx={{ display: "flex" }}>
                <span>Export Code</span>
                <span style={{ flexGrow: 1 }}></span>
            </DialogTitle>
            <pre>
                <code className="language-js">{exportedCode}</code>
            </pre>
            {/* <List sx={{ pt: 0 }}>
        {emails.map((email) => (
          <ListItem button onClick={() => handleListItemClick(email)} key={email}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={email} />
          </ListItem>
        ))}
        <ListItem autoFocus button onClick={() => handleListItemClick('addAccount')}>
          <ListItemAvatar>
            <Avatar>
              <AddIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Add account" />
        </ListItem>
      </List> */}
            <DialogActions>
                <span
                    onMouseLeave={() => {
                        setShowCopied(false);
                    }}
                >
                    <Button
                        onClick={() => handleCopy(exportedCode)}
                        disabled={showCopied}
                    >
                        {showCopied ? "Copied" : "Copy"}
                    </Button>
                </span>
            </DialogActions>
        </Dialog>
    );
}
