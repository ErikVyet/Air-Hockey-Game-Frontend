import { createContext, type Dispatch, type SetStateAction } from "react";
import type { MenuAction } from "../enums/MenuAction";

export const MenuContext = createContext<{
    menuAction: MenuAction,
    setMenuAction: Dispatch<SetStateAction<MenuAction>>
} | null>(null);