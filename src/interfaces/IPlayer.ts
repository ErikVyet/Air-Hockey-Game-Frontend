
export interface IPlayer {
    sessionId: string,
    name: string,
    role: "player" | "spectator",
    isHost: boolean,
    isReady: boolean
}