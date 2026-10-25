import type { IMessage } from "./IMessage"
import type { IPlayer } from "./IPlayer"

export interface IGameState {
    hostSessionId: string,
    sessionName: string,
    players: Map<string, IPlayer>,
    spectatorCount: number,
    maxSpectators: number,
    round: number,
    maxRounds: number,
    puckPosition: [x: number, y: number, z: number],
    redStrikerPosition: [x: number, y: number, z: number],
    blueStrikerPosition: [x: number, y: number, z: number],
    redScore: number,
    blueScore: number,
    hasStarted: boolean,
    isPaused: boolean,
    countDown: number,
    messages: IMessage[]
}