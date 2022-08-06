import { useContext } from "react";
import {
    createContext,
    PropsWithChildren,
    useState,
    ReactElement,
} from "react";
import { IconDef } from "../../lib/icon-def";
import { CodeExportFunction } from "./CodeExportProvider";

export interface ActionIconClickContext {
    exportCode: CodeExportFunction;
}

export interface ActionIcon {
    onClick?: (context: ActionIconClickContext) => void;
    href?: string;
    ariaLabel?: string;
    icon: IconDef;
    key: string;
}

export interface ActionIconContextValue {
    setActionIcons: (icons: ActionIcon[]) => void;
    actionIcons: ActionIcon[];
}

const ActionIconsContext = createContext<ActionIconContextValue>({
    actionIcons: [],
    setActionIcons: () => {},
});

export function ActionIconsProvider({ children }: PropsWithChildren<{}>) {
    const [actionIcons, setActionIcons] = useState<ActionIcon[]>([]);

    return (
        <ActionIconsContext.Provider value={{ actionIcons, setActionIcons }}>
            {children}
        </ActionIconsContext.Provider>
    );
}

export function useActionIcons() {
    return useContext(ActionIconsContext);
}
