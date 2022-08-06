import { useContext } from "react";
import {
    createContext,
    PropsWithChildren,
    useState,
    ReactElement,
} from "react";
import ExportCodeDialog from "../ExportCodeDialog";

export type CodeExportFunction = (path: string[]) => void;

export interface CodeExportContextValue {
    exportCode: CodeExportFunction;
    Dialog: JSX.Element | null;
}

const CodeExportContext = createContext<CodeExportContextValue>({
    exportCode: (path: string[]) => {},
    Dialog: null,
});

export function CodeExportProvider({ children }: PropsWithChildren<{}>) {
    const [exportingCode, setExportingCode] = useState(false);
    const [objectPath, setObjectPath] = useState<string[]>([]);

    const Dialog = (
        <ExportCodeDialog
            objPath={objectPath}
            open={exportingCode}
            onClose={() => {
                setExportingCode(false);
                setObjectPath([]);
            }}
        />
    );

    return (
        <CodeExportContext.Provider
            value={{
                exportCode: (objPath: string[]) => {
                    setObjectPath(objPath);
                    setExportingCode(true);
                },
                Dialog,
            }}
        >
            {children}
        </CodeExportContext.Provider>
    );
}

export function useCodeExport() {
    return useContext(CodeExportContext);
}
