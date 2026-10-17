import { createContext, type Dispatch, type SetStateAction } from "react";
import type { MenuAction } from "../enums/MenuAction";
import type { SessionViewport } from "../enums/SessionViewport";

export const MenuContext = createContext<{
    menuAction: MenuAction,
    setMenuAction: Dispatch<SetStateAction<MenuAction>>,
    sessionViewport: SessionViewport,
    setSessionViewport: Dispatch<SetStateAction<SessionViewport>>
} | null>(null);