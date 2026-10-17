import { Box, Button, IconButton, List, ListItem, Stack, Tooltip, Typography } from "@mui/material";
import { grey, red } from "@mui/material/colors";
import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../../contexts/SessionContext";
import type { IPlayer } from "../../interfaces/IPlayer";
import { FONT_FAMILY, TEXT_COLOR } from "../../constants/style";
import { SessionMessage } from "../../enums/SessionMessage";
import { MenuContext } from "../../contexts/MenuContext";
import { SessionViewport } from "../../enums/SessionViewport";
import { Add, Remove, SwapHoriz } from "@mui/icons-material";

export default function SpectatorControlPanel() {
    const sessionContext = useContext(SessionContext);
    if (!sessionContext) return null;
    const { activeSession } = sessionContext;

    const menuContext = useContext(MenuContext);
    if (!menuContext) return null;
    const { sessionViewport, setSessionViewport } = menuContext;

    const [spectators, setSpectators] = useState<IPlayer[]>([]);

    useEffect(() => {
        if (!activeSession) return;

        handleUpdateSpectators();

        activeSession.onStateChange(_state => {
            // Update spectators
            handleUpdateSpectators();
        });

        return () => { activeSession.removeAllListeners(); }
    }, [activeSession]);

    const handleUpdateSpectators = () => {
        let currentSpectators: IPlayer[] = [];
        activeSession?.state.players.forEach(player => {
            if (player.role === "spectator") {
                currentSpectators.push(player);
            }
        });
        setSpectators(currentSpectators);
    };
    const handleUpdateMaxSpectators = (cmd: "+" | "-") => {
        activeSession?.send(SessionMessage.UPDATE_MAX_SPECTATORS, cmd);
    };
    const handleChangeToSpectator = () => {
        activeSession?.send(SessionMessage.UPDATE_PLAYER_ROLE, "spectator");
        setSessionViewport(SessionViewport.SPECTATOR);
    };
    const handleKickSpectator = (targetSessionId: string) => {
        activeSession?.send(SessionMessage.KICK_PLAYER, targetSessionId);
    };

    return (
        <Box className="w-md p-10 self-start">
            <Stack className="size-full p-6 items-center rounded-lg bg-zinc-900/70 outline-3 outline-zinc-800" spacing={1.5} sx={{ boxShadow: `10px 10px 0 ${grey[800]}` }}>
                <Typography className={`${TEXT_COLOR} ${FONT_FAMILY} font-semibold! text-xl! self-start`}>Spectators</Typography>
                <List className="w-full p-3! rounded-lg outline-3 outline-zinc-500" sx={{ boxShadow: `-8px 8px 0 ${grey[700]}` }}>
                    {spectators.map(spectator =>
                        <ListItem className={`h-15 pr-3 mb-3 justify-between! bg-zinc-800/80 rounded-md overflow-hidden`} key={spectator.sessionId} disablePadding disableGutters>
                            <Stack className="h-full items-center" direction={"row"} spacing={1.5}>
                                <Box className={`w-5 h-full bg-green-500`} />
                                <Typography className={`${FONT_FAMILY} ${TEXT_COLOR}`}>{spectator.name}</Typography>
                            </Stack>
                            {activeSession?.sessionId === activeSession?.state.hostSessionId && (
                                <Button className={`px-2! py-1! ${FONT_FAMILY} ${TEXT_COLOR} bg-red-500! outline-2! outline-red-800!`} variant={"contained"} sx={{ boxShadow: `-4px 4px 0 ${red[400]}` }} disableRipple onClick={() => handleKickSpectator(spectator.sessionId)}>Kick</Button>
                            )}
                        </ListItem>
                    )}
                    {Array.from({ length: (activeSession?.state.maxSpectators ?? 0) - spectators.length }).map((_, index) =>
                        <ListItem className={`h-15 pr-3! justify-between! bg-zinc-800/80 rounded-md overflow-hidden ${index < (activeSession?.state.maxSpectators ?? 0) - 1 && 'mb-3'}`} key={index} disablePadding disableGutters>
                            <Stack className="h-full items-center" direction={"row"} spacing={1.5}>
                                <Box className="w-5 h-full bg-zinc-500" />
                                <Typography className={`${FONT_FAMILY} ${TEXT_COLOR}`}>Waiting for spectator...</Typography>
                            </Stack>
                            {sessionViewport === SessionViewport.PLAYER_1 && (
                                <Tooltip title={"Decrease max spectators"} placement={"right"}>
                                    <IconButton className="bg-zinc-900! outline-2! outline-zinc-500!" size={"small"} onClick={() => handleUpdateMaxSpectators("-")}>
                                        <Remove className={`size-5! ${TEXT_COLOR}`} />
                                    </IconButton>
                                </Tooltip>
                            )}
                            {sessionViewport === SessionViewport.PLAYER_2 && (
                                <Tooltip title={"Change to spectator"} placement={"right"}>
                                    <IconButton className="bg-zinc-900! outline-2! outline-zinc-500!" size={"small"} onClick={handleChangeToSpectator}>
                                        <SwapHoriz className={`size-5! ${TEXT_COLOR}`} />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </ListItem>
                    )}
                    {activeSession?.sessionId === activeSession?.state.hostSessionId && (activeSession?.state.maxSpectators ?? 0) < 4 && (
                        <ListItem className={`h-15 pr-3! ${(activeSession?.state.maxSpectators ?? 0) > 0 && 'mt-3'} justify-center! rounded-md overflow-hidden`} disablePadding disableGutters>
                            <Tooltip title={"Add another spectator slot"}>
                                <IconButton className="bg-zinc-900! outline-2! outline-zinc-500!" size={"small"} onClick={() => handleUpdateMaxSpectators("+")}>
                                    <Add className={`size-5! ${TEXT_COLOR}`}/>
                                </IconButton>
                            </Tooltip>
                        </ListItem>
                    )}
                </List>
            </Stack>
        </Box>
    );
}