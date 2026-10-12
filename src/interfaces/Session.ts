
export interface Session {
    id: string,
    name: string,
    participants: number,
    spectators: number,
    password?: string,
}