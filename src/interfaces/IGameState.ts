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
    puckPosition: [number, number, number],
    hasStarted: boolean,
    messages: IMessage[]
}