import { Client } from "@colyseus/sdk";
import type { IGameState } from "../interfaces/IGameState";

export default function useClient() {
    return new Client<any, IGameState>(import.meta.env.VITE_TEST_SERVER_URL as string);
}