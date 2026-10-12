import { createContext, type Dispatch, type SetStateAction } from "react";

export const SettingContext = createContext<{
    masterVolumn: number,
    setMasterVolumn: Dispatch<SetStateAction<number>>,
    fullScreen: boolean,
    setFullScreen: Dispatch<SetStateAction<boolean>>,
    vrMode: boolean,
    setVrMode: Dispatch<SetStateAction<boolean>>,
    arMode: boolean,
    setArMode: Dispatch<SetStateAction<boolean>>
} | null>(null);