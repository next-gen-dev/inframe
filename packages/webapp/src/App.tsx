import { CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import AppDrawerContainer from "./components/AppDrawerContainer";
import { CopyEmailToNotion } from "./components/CopyEmailToNotion";
import { Page } from "./components/Page";
import NewConnection from "./components/pages/NewConnection";
import { ActionIconsProvider } from "./components/utils/ActionIcons";
import { CodeExportProvider } from "./components/utils/CodeExportProvider";
import { lightTheme } from "./utils/theme";

function App() {
    return (
        <BrowserRouter>
            <ThemeProvider theme={lightTheme}>
                <div className="App">
                    <CssBaseline />
                    <CodeExportProvider>
                        <ActionIconsProvider>
                            <AppDrawerContainer>
                                <Routes>
                                    <Route
                                        path="new_connection"
                                        element={<NewConnection />}
                                    />
                                    <Route
                                        path="gmail/:label/:threadId/copy"
                                        element={<CopyEmailToNotion />}
                                    />
                                    <Route path="*" element={<Page />}></Route>
                                </Routes>
                            </AppDrawerContainer>
                        </ActionIconsProvider>
                    </CodeExportProvider>
                </div>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;
