
export interface IPlayer {
    sessionId: string,
    name: string,
    role: "player" | "spectator",
    position: [x: number, y: number, z: number],
    scores: number[],
    isHost: boolean,
    isReady: boolean
}