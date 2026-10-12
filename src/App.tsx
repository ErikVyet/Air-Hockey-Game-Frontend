import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import MenuLayout from "./layouts/MenuLayout";
import MenuView from "./views/MenuView";
import { useEffect, useState } from "react";
import { SettingContext } from "./contexts/SettingContext";

export default function App() {
    const [masterVolumn, setMasterVolumn] = useState(() => {
        const tempValue = localStorage.getItem("master-volumn");
        const value = Number(tempValue);
        if (isNaN(value) || !tempValue) {
            localStorage.setItem("master-volumn", `${100}`);
            return 100;
        }
        else {
            return value;
        }
    });
    const [fullScreen, setFullScreen] = useState(false);
    const [vrMode, setVrMode] = useState(false);
    const [arMode, setArMode] = useState(false);

    useEffect(() => {
        if (fullScreen) {
            document.documentElement.requestFullscreen();
        }
        else {
            document.exitFullscreen();
        }
    }, [fullScreen]);

    useEffect(() => {
        if (vrMode) {
            setArMode(false);
        }
    }, [vrMode]);

    useEffect(() => {
        if (arMode) {
            setVrMode(false);
        }
    }, [arMode]);

    const browserRouter = createBrowserRouter(
        createRoutesFromElements(
            <Route>
                <Route element={<MenuLayout/>}>
                    <Route index element={<MenuView/>}/>
                </Route>
            </Route>
        )
    );

    return (
        <SettingContext.Provider value={{ masterVolumn, setMasterVolumn, fullScreen, setFullScreen, vrMode, setVrMode, arMode, setArMode }}>
            <RouterProvider router={browserRouter}/>
        </SettingContext.Provider>
    );
}