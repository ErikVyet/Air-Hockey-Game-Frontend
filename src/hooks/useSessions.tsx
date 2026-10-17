import { Room } from "@colyseus/sdk";
import { useEffect, useState } from "react";
import type { ISession } from "../interfaces/ISession";
import useClient from "./useClient";
import { LobbyMessage } from "../enums/LobbyMessage";

export default function useSessions() {
    const [isLoading, setIsLoading] = useState(false);
    const [sessions, setSessions] = useState<ISession[]>([]);

    const client = useClient();

    useEffect(() => {
        let lobby: Room<ISession>;

        const readSessions = async () => {
            try {
                setIsLoading(true);
                lobby = await client.joinOrCreate("lobby");

                lobby.onMessage(LobbyMessage.GET_SESSIONS, (sessionList: ISession[]) => {
                    setSessions(sessionList);
                });
    
                lobby.onMessage(LobbyMessage.ADDICTIONAL_SESSION, ([roomId, room]: [string, ISession]) => {
                    setSessions(prev => {
                        const index = prev.findIndex(session => session.roomId === roomId);
                        if (index !== -1) {
                            const updatedSessions = [ ...prev ];
                            updatedSessions[index] = { ...room, roomId };
                            return updatedSessions;
                        }
                        return [ ...prev, { ...room, roomId } ];
                    });
                });
    
                lobby.onMessage(LobbyMessage.DISPOSED_SESSION, (roomId: string) => {
                    setSessions(prev => prev.filter(session => session.roomId !== roomId));
                });
            }
            catch (error) {
                console.error(`Failed to join lobby: ${error}`);
            }
            finally {
                setIsLoading(false);
            }
        };

        readSessions();

        return () => { lobby?.leave(); }
    }, []);

    return { sessions, isLoading };
}