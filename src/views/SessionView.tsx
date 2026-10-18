import { Alert, Portal, Snackbar, Stack } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useClient from "../hooks/useClient";
import { SessionContext } from "../contexts/SessionContext";
import { SNACKBAR_COMMON_PROPS } from "../constants/props";
import { MenuContext } from "../contexts/MenuContext";
import { SessionViewport } from "../enums/SessionViewport";
import SessionControlPanel from "../components/session_view/SessionControlPanel";
import { MenuAction } from "../enums/MenuAction";
import SpectatorControlPanel from "../components/session_view/SpectatorControlPanel";

export default function SessionView() {
    const sessionContext = useContext(SessionContext);
    if (!sessionContext) return null;
    const { activeSession, setActiveSession } = sessionContext;

    const menuContext = useContext(MenuContext);
    if (!menuContext) return null;
    const { setSessionViewport, setMenuAction } = menuContext;

    const { reconnectionToken } = useParams();

    const navigate = useNavigate();

    const client = useClient();

    const [openAlert, setOpenAlert] = useState(false);
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!activeSession && reconnectionToken) {
                client.reconnect(reconnectionToken).then(session => {
                    setActiveSession(session);
                    handleOpenAlert(false, "Successfully reconnected to session");
                    navigate(`/session/${session.reconnectionToken}`, { replace: true });
                }).catch(() => {
                    handleOpenAlert(true, "Unable to connect to session");
                    setSessionViewport(SessionViewport.NONE);
                    setMenuAction(MenuAction.ORIGINAL);
                    navigate("/", { replace: true });
                });
            }
        }, 100);

        if (!activeSession) return;

        handleUpdateSessionView();

        activeSession.onStateChange(() => {
            // Update player's view
            handleUpdateSessionView();
        });

        return () => {
            clearTimeout(timeout);
            activeSession.removeAllListeners();
        }
    }, [activeSession]);

    const handleUpdateSessionView = () => {
        const player = activeSession?.state?.players.get(activeSession.sessionId);
        const isHost = activeSession?.sessionId === activeSession?.state?.hostSessionId;
        switch (player?.role) {
            case ("player"): {
                setSessionViewport(isHost ? SessionViewport.PLAYER_1 : SessionViewport.PLAYER_2);
                break;
            }
            case ("spectator"): {
                setSessionViewport(SessionViewport.SPECTATOR);
                break;
            }
            default: break;
        }
    };
    const handleOpenAlert = (error: boolean, message: string) => {
        setIsError(error);
        setMessage(message);
        setOpenAlert(true);
    };
    const handleCloseAlert = () => setOpenAlert(false);

    return (
        <>
            <Stack className="w-full h-screen justify-between items-center" direction={"row"}>
                <SessionControlPanel />
                <SpectatorControlPanel />
            </Stack>
            <Portal>
                <Snackbar open={openAlert} {...SNACKBAR_COMMON_PROPS} onClose={handleCloseAlert}>
                    <Alert severity={isError ? "error" : "success"} variant={"filled"} onClose={handleCloseAlert}>{message}</Alert>
                </Snackbar>
            </Portal>
        </>
    );
}