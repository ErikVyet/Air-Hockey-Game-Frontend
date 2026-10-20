
export interface IPlayer {
    sessionId: string,
    name: string,
    role: "player" | "spectator",
    position: [x: number, y: number, z: number],
    score: number,
    isHost: boolean,
    isReady: boolean
}