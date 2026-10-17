import type { Room } from "@colyseus/sdk";
import { createContext, type Dispatch, type SetStateAction } from "react";
import type { IGameState } from "../interfaces/IGameState";

export const SessionContext = createContext<{
    activeSession: Room<IGameState> | null,
    setActiveSession: Dispatch<SetStateAction<Room<IGameState> | null>>
} | null>(null);