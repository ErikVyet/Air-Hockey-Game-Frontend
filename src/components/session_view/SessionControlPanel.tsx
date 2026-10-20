import { Box, Button, IconButton, List, ListItem, Stack, Tooltip, Typography } from "@mui/material";
import { useContext, useEffect, useState, type ChangeEvent, type SyntheticEvent } from "react";
import { SessionContext } from "../../contexts/SessionContext";
import { green, grey, red } from "@mui/material/colors";
import { CustomSlider, CustomTextField } from "../common/CustomInput";
import { FONT_FAMILY, TEXT_COLOR } from "../../constants/style";
import type { IPlayer } from "../../interfaces/IPlayer";
import { EditOutlined, SwapHoriz } from "@mui/icons-material";
import { MenuContext } from "../../contexts/MenuContext";
import { SessionViewport } from "../../enums/SessionViewport";
import { useNavigate } from "react-router-dom";
import { MenuAction } from "../../enums/MenuAction";
import { SessionMessage } from "../../enums/SessionMessage";
import { motion } from "motion/react";
import CustomDialogWithTextField from "../common/CustomDialogWithTextField";

export default function SessionControlPanel() {
    const sessionContext = useContext(SessionContext);
    if (!sessionContext) return null;
    const { activeSession, setActiveSession } = sessionContext;

    const menuContext = useContext(MenuContext);
    if (!menuContext) return null;
    const { sessionViewport, setSessionViewport, setMenuAction } = menuContext;

    const navigate = useNavigate();

    const [maxRounds, setMaxRounds] = useState(activeSession?.state.maxRounds ?? 5);
    const [players, setPlayers] = useState<IPlayer[]>([]);
    const [isReady, setIsReady] = useState(false);
    const [newName, setNewName] = useState("");
    const [openNameDialog, setOpenNameDialog] = useState(false);

    useEffect(() => {
        if (!activeSession) return;

        handleUpdatePlayers();

        activeSession.onStateChange(state => {
            // Update max rounds
            setMaxRounds(state.maxRounds);

            // Update players and spectators
            handleUpdatePlayers();
        });

        activeSession.onLeave(() => {
            setSessionViewport(SessionViewport.NONE);
            setMenuAction(MenuAction.ORIGINAL);
            setActiveSession(null);
            navigate("/", { replace: true });
        });

        return () => { activeSession.removeAllListeners(); }
    }, [activeSession]);

    useEffect(() => {
        setMaxRounds(activeSession?.state.maxRounds ?? 5);
    }, [activeSession?.state.maxRounds]);

    const handleOpenNameDialog = () => {
        setNewName("");
        setOpenNameDialog(true);
    };
    const handleCloseNameDialog = () => {
        setOpenNameDialog(false);
    };
    const handleUpdatePlayers = () => {
        let currentPlayers: IPlayer[] = [];
        activeSession?.state?.players?.forEach(player => {
            if (player.role === "player") {
                currentPlayers.push(player);
            }
            if (player.sessionId === activeSession.sessionId) {
                setIsReady(player.isReady);
            }
        });
        setPlayers(currentPlayers);
    };
    const handleMaxRoundsChange = (_event: Event, value: number | number[], _activeThumb: number) => {
        setMaxRounds(value as number);
    };
    const handlePlayerNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setNewName(event.currentTarget.value);
    };
    const handleUpdatePlayerName = () => {
        activeSession?.send(SessionMessage.UPDATE_PLAYER_NAME, newName);
        handleCloseNameDialog();
    };
    const handleMaxRoundsChangeCommitted = (_event: SyntheticEvent | Event, value: number | number[]) => {
        activeSession?.send(SessionMessage.UPDATE_MAX_ROUNDS, value as number);
    };
    const handleKickPlayer = (targetSessionId: string) => {
        activeSession?.send(SessionMessage.KICK_PLAYER, targetSessionId);
    };
    const handleLeaveClick = () => {
        activeSession?.leave(true);
        setSessionViewport(SessionViewport.NONE);
        setMenuAction(MenuAction.ORIGINAL);
        setActiveSession(null);
        navigate("/", { replace: true });
    };
    const handleReadyChange = () => {
        activeSession?.send(SessionMessage.UPDATE_PLAYER_READY_STATE);
    };
    const handleChangeToPlayer = () => {
        activeSession?.send(SessionMessage.UPDATE_PLAYER_ROLE, "player");
        setSessionViewport(SessionViewport.PLAYER_2);
    };
    const handleStartGame = () => {
        activeSession?.send(SessionMessage.START_GAME);
    };

    return (
        <>
            <Box className="w-lg h-full p-10">
                <Stack className="size-full p-6 items-center rounded-lg bg-zinc-900/70 outline-3 outline-zinc-800" spacing={3} sx={{ boxShadow: `-10px 10px 0 ${grey[800]}` }} component={motion.div} initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                    <CustomTextField value={activeSession?.state.sessionName ?? ""} color={"zinc"} type={"text"} label={"Session Name"} readOnly onChange={() => { }} />
                    <Stack className="w-full justify-center items-center gap-3">
                        <Typography className={`${FONT_FAMILY} ${TEXT_COLOR} text-xl! font-semibold! self-start`}>Players</Typography>
                        <List className="w-full p-3! rounded-lg outline-3 outline-zinc-500" sx={{ boxShadow: `-8px 8px 0 ${grey[700]}` }}>
                            {players.map((player, index) =>
                                <ListItem className={`h-15 pr-3 ${(index < players.length - 1 || players.length < 2) && 'mb-3!'} justify-between! bg-zinc-800/80 rounded-md overflow-hidden`} key={player.sessionId} disablePadding disableGutters>
                                    <Stack className="h-full items-center" direction={"row"} spacing={1.5}>
                                        <Box className={`w-5 h-full ${player.isReady ? 'bg-green-500' : 'bg-red-500'}`} />
                                        <Typography className={`${FONT_FAMILY} ${TEXT_COLOR}`}>{player.name}</Typography>
                                        {activeSession?.sessionId === player.sessionId && (
                                            <Tooltip title={"Change your name"} placement={"top"} arrow>
                                                <IconButton size={"small"} disableRipple onClick={handleOpenNameDialog}>
                                                    <EditOutlined className={`size-4! ${TEXT_COLOR}`} />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                        {player.isHost && (<Typography className={`${FONT_FAMILY} font-semibold! text-green-500!`}>(Host)</Typography>)}
                                        {!player.isHost && player.isReady && (<Typography className={`${FONT_FAMILY} font-semibold! text-green-500!`}>Ready</Typography>)}
                                    </Stack>
                                    {activeSession?.sessionId === activeSession?.state.hostSessionId && !player.isHost && (
                                        <Button className={`px-2! py-1! ${FONT_FAMILY} ${TEXT_COLOR} bg-red-500! outline-2! outline-red-800!`} variant={"contained"} sx={{ boxShadow: `-4px 4px 0 ${red[400]}` }} disableRipple onClick={() => handleKickPlayer(player.sessionId)}>Kick</Button>
                                    )}
                                </ListItem>
                            )}
                            {players.length < 2 && (
                                <ListItem className="h-15 pr-3! justify-between! bg-zinc-800/80 rounded-md overflow-hidden" disablePadding disableGutters>
                                    <Stack className="h-full items-center" direction={"row"} spacing={1.5}>
                                        <Box className="w-5 h-full bg-zinc-500" />
                                        <Typography className={`${FONT_FAMILY} ${TEXT_COLOR}`}>Waiting for player...</Typography>
                                    </Stack>
                                    {sessionViewport === SessionViewport.SPECTATOR && (
                                        <Tooltip title={"Change to player"} placement={"right"}>
                                            <IconButton className="bg-zinc-900! outline-2! outline-zinc-500!" size={"small"} onClick={handleChangeToPlayer}>
                                                <SwapHoriz className={`size-5! ${TEXT_COLOR}`} />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </ListItem>
                            )}
                        </List>
                    </Stack>
                    <CustomSlider value={maxRounds} range={[3, 10]} color={"zinc"} label={"Max Rounds"} readOnly={activeSession ? activeSession.sessionId !== activeSession.state.hostSessionId : true} onChange={handleMaxRoundsChange} onChangeCommitted={handleMaxRoundsChangeCommitted} />
                    <Stack className="w-full justify-between" direction={"row"} spacing={3}>
                        {activeSession && sessionViewport !== SessionViewport.SPECTATOR && (
                            activeSession.sessionId === activeSession.state.hostSessionId ? (
                                <Button className={`flex-1 ${FONT_FAMILY} ${TEXT_COLOR} bg-green-500! outline-2! outline-green-600!`} variant={"contained"} sx={{ boxShadow: `-5px 5px 0 ${green[500]}` }} disableRipple onClick={handleStartGame}>Start Game</Button>
                            ) : (
                                <Button className={`flex-1 ${FONT_FAMILY} ${TEXT_COLOR} outline-2! ${isReady ? 'bg-red-500! outline-red-800!' : 'bg-green-500! outline-green-600!'}`} variant={"contained"} sx={{ boxShadow: `-5px 5px 0 ${isReady ? red[500] : green[500]}` }} disableRipple onClick={handleReadyChange}>{isReady ? 'Not Ready' : 'Ready'}</Button>
                            )
                        )}
                        <Button className={`flex-1 ${FONT_FAMILY} ${TEXT_COLOR} bg-zinc-800! outline-2! outline-zinc-600!`} variant={"contained"} sx={{ boxShadow: `-5px 5px 0 ${grey[700]}` }} disableRipple onClick={handleLeaveClick}>Leave</Button>
                    </Stack>
                </Stack>
            </Box>
            <CustomDialogWithTextField open={openNameDialog} title={"New Name"} placeholder={"Enter new name"} limit={8} textFieldValue={newName} textFieldOnChange={handlePlayerNameChange} positiveLabel={"Save"} negativeLabel={"Cancel"} positiveAction={handleUpdatePlayerName} negativeAction={handleCloseNameDialog}/>
        </>
    );
}