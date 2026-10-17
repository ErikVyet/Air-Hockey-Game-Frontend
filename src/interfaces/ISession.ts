
export interface ISession {
    roomId: string,
    name: string,
    clients: number,
    maxClients: number,
    locked: boolean,
    metadata?: {
        sessionName: string,
        hasPassword: boolean
    }
}