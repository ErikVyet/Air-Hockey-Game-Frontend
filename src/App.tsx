import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import MenuLayout from "./layouts/MenuLayout";
import MenuView from "./views/MenuView";
import { useEffect, useState } from "react";
import { SettingContext } from "./contexts/SettingContext";
import SessionView from "./views/SessionView";
import { SessionContext } from "./contexts/SessionContext";
import type { Room } from "@colyseus/sdk";
import type { IGameState } from "./interfaces/IGameState";
import { GameLayout } from "./layouts/GameLayout";
import GameView from "./views/GameView";
import ResultView from "./views/ResultView";

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
    const [fps, setFps] = useState(() => {
        const tempValue = localStorage.getItem("fps");
        const value = Number(tempValue);
        if (isNaN(value) || !tempValue) {
            localStorage.setItem("fps", `${60}`);
            return 60;
        }
        else {
            return value;
        }
    });
    const [fullScreen, setFullScreen] = useState(false);
    const [vrMode, setVrMode] = useState(false);
    const [arMode, setArMode] = useState(false);
    const [activeSession, setActiveSession] = useState<Room<IGameState> | null>(null);

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
                    <Route path={"session/:reconnectionToken"} element={<SessionView/>}/>
                </Route>
                <Route element={<GameLayout/>}>
                    <Route path={"game/:reconnectionToken"} element={<GameView/>}/>
                    <Route path={"game/result"} element={<ResultView/>}/>
                </Route>
            </Route>
        )
    );

    return (
        <SessionContext.Provider value={{ activeSession, setActiveSession }}>
            <SettingContext.Provider value={{ masterVolumn, setMasterVolumn, fps, setFps, fullScreen, setFullScreen, vrMode, setVrMode, arMode, setArMode }}>
                <RouterProvider router={browserRouter}/>
            </SettingContext.Provider>
        </SessionContext.Provider>
    );
}