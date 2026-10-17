import { Client } from "@colyseus/sdk";
import type { IGameState } from "../interfaces/IGameState";
import { useMemo } from "react";

export default function useClient() {
    const client = useMemo(() => new Client<any, IGameState>(import.meta.env.VITE_SERVER_URL as string), []);
    return client;
}