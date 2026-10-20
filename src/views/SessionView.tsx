import { Alert, Badge, Box, IconButton, Portal, Snackbar, Stack, Tooltip } from "@mui/material";
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
import { SessionMessage } from "../enums/SessionMessage";
import type { IErrorMessage } from "../interfaces/IErrorMessage";
import { Chat, Visibility } from "@mui/icons-material";
import { TEXT_COLOR } from "../constants/style";
import ChatPanel from "../components/common/ChatPanel";
import { motion } from "motion/react";

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

    const [activeRightPanel, setActiveRightPanel] = useState<"spectators" | "chat">("spectators");
    const [lastSeenMessageNumber, setLastSeenMessageNumber] = useState(0);
    const [seenChat, setSeenChat] = useState(true);
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

        activeSession.onStateChange(state => {
            if (state.hasStarted) {
                navigate(`/game/${reconnectionToken}`, { replace: true });
            }

            // Update player's view
            handleUpdateSessionView();

            // Update chat status
            const isOnChatPanel = activeRightPanel === "chat";
            setSeenChat((!(state.messages.length > lastSeenMessageNumber)) || isOnChatPanel);
            if (isOnChatPanel) {
                setLastSeenMessageNumber(state.messages.length);
            }
        });

        activeSession.onMessage(SessionMessage.CAUGHT_ERROR, ({ message }: IErrorMessage) => {
            handleOpenAlert(true, message);
        });

        return () => {
            clearTimeout(timeout);
            activeSession.removeAllListeners();
        }
    }, [activeSession]);

    const handleUpdateSessionView = () => {
        const player = activeSession?.state?.players?.get(activeSession.sessionId);
        switch (player?.role) {
            case ("player"): {
                setSessionViewport(player?.isHost ? SessionViewport.PLAYER_1 : SessionViewport.PLAYER_2);
                break;
            }
            case ("spectator"): {
                setSessionViewport(SessionViewport.SPECTATOR);
                break;
            }
            default: break;
        }
    };
    const handleSwitchToSpectatorPanel = () => {
        setActiveRightPanel("spectators");
    };
    const handleSwitchToChatPanelSwitch = () => {
        setActiveRightPanel("chat");
        setLastSeenMessageNumber(activeSession?.state?.messages?.length ?? 0);
        setSeenChat(true);
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
                <Box className="relative h-full" component={motion.div} initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                    <Stack className="absolute left-[4.9px] top-1/10" spacing={1.5}>
                        <Tooltip title={"Spectators"} placement={"left"} arrow>
                            <IconButton className="bg-zinc-900! outline-2! outline-zinc-800! rounded-l-sm! rounded-r-none!" onClick={handleSwitchToSpectatorPanel}>
                                <Visibility className={`size-4! ${TEXT_COLOR}`}/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={"Chat"} placement={"left"} arrow>
                            <IconButton className="bg-zinc-900! outline-2! outline-zinc-800! rounded-l-sm! rounded-r-none!" disableRipple onClick={handleSwitchToChatPanelSwitch}>
                                <Badge badgeContent={seenChat ? 0 : 1} color={"error"} variant={"dot"} anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
                                    <Chat className={`size-4! ${TEXT_COLOR}`} />
                                </Badge>
                            </IconButton>
                        </Tooltip>
                    </Stack>
                    {activeRightPanel === "spectators" ? (
                        <SpectatorControlPanel />
                    ) : (
                        <ChatPanel/>
                    )}
                </Box>
            </Stack>
            <Portal>
                <Snackbar open={openAlert} {...SNACKBAR_COMMON_PROPS} onClose={handleCloseAlert}>
                    <Alert severity={isError ? "error" : "success"} variant={"filled"} onClose={handleCloseAlert}>{message}</Alert>
                </Snackbar>
            </Portal>
        </>
    );
}