import { useContext, useEffect, useRef, useState, type ChangeEvent } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, Snackbar, Stack, Typography } from "@mui/material";
import { CustomTextField } from "../common/CustomInput";
import CustomScrollbar from "../common/CustomScrollbar";
import { green, grey } from "@mui/material/colors";
import { FONT_FAMILY, TEXT_COLOR } from "../../constants/style";
import { LockOutlined } from "@mui/icons-material";
import useSessions from "../../hooks/useSessions";
import useClient from "../../hooks/useClient";
import { BLUE_STRIKER_INITIAL_POSITION } from "../../constants/scene";
import { SessionContext } from "../../contexts/SessionContext";
import { useNavigate } from "react-router-dom";
import { SNACKBAR_COMMON_PROPS } from "../../constants/props";

export default function SessionList() {
    const sessionContext = useContext(SessionContext);
    if (!sessionContext) return null;
    const { setActiveSession } = sessionContext;

    const { sessions, isLoading } = useSessions();

    const client = useClient();

    const navigate = useNavigate();

    const sessionListRef = useRef<HTMLUListElement>(null!);

    const [resultSessions, setResultSessions] = useState(sessions);
    const [searchSession, setSearchSession] = useState("");
    const [scrollProgress, setScrollProgress] = useState(0);
    const [targetSessionId, setTargetSessionId] = useState("");
    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
    const [password, setPassword] = useState("");
    const [openAlert, setOpenAlert] = useState(false);
    const [message, setMessage] = useState("");
    const [isJoining, setIsJoining] = useState(false);

    const { scrollYProgress } = useScroll({ container: sessionListRef });

    useMotionValueEvent(scrollYProgress, "change", (latest) => setScrollProgress(latest * 100));

    useEffect(() => {
        const timeout = setTimeout(() => {
            setResultSessions(sessions.filter(session => session.name.toLowerCase().includes(searchSession.toLowerCase())));
        }, 500);
        return () => { clearTimeout(timeout); }
    }, [searchSession, sessions]);

    const handleSearchSessionChange = (event: ChangeEvent<HTMLInputElement>) => setSearchSession(event.currentTarget.value);
    const handleSessionListScrollbarSlide = (_event: Event, value: number | number[], _activeThumb: number) => {
        const sessionList = sessionListRef.current;
        if (!sessionList) return;
        
        const { scrollHeight, clientHeight } = sessionList;
        const progress = 100 - Number(value);
        const maxScroll = scrollHeight - clientHeight;
        const targetScrollTop = (progress / 100) * maxScroll;

        sessionList.scrollTo({ top: targetScrollTop, behavior: "instant" });
        setScrollProgress(progress);
    };
    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.currentTarget.value);
    };
    const handleOpenPasswordDialog = (sessionId: string) => {
        setTargetSessionId(sessionId);
        setOpenPasswordDialog(true);
    };
    const handleClosePasswordDialog = () => {
        const timeout = setTimeout(() => {
            setTargetSessionId("");
            setPassword("");
        }, 100);
        setOpenPasswordDialog(false);
        return () => { clearTimeout(timeout); }
    };
    const handleOpenAlert = (message: string) => {
        setMessage(message);
        setOpenAlert(true);
    };
    const handleCloseAlert = () => {
        setOpenAlert(false);
    };
    const handleJoinSessionWithoutPassword = (sessionId: string) => {
        setIsJoining(true);
        client.joinById(sessionId, {
            position: BLUE_STRIKER_INITIAL_POSITION,
            isHost: false
        }).then(session => {
            setActiveSession(session);
            navigate(`/session/${session.reconnectionToken}`, { replace: true });
        }).catch(reason => {
            handleOpenAlert((reason as Error).message ?? "Failed to connect to session");
        }).finally(() => {
            setIsJoining(false);
        });
    };
    const handleJoinSessionWithPassword = () => {
        setIsJoining(true);
        client.joinById(targetSessionId, {
            password,
            position: BLUE_STRIKER_INITIAL_POSITION,
            isHost: false
        }).then(session => {
            setActiveSession(session);
            navigate(`/session/${session.reconnectionToken}`, { replace: true });
        }).catch(reason => {
            handleOpenAlert((reason as Error).message ?? "Failed to connect to session");
        }).finally(() => {
            setIsJoining(false);
        });
    };

    return (
        <>
            <Stack className="w-full justify-center items-center" spacing={3}>
                <CustomTextField value={searchSession} type={"text"} color={"green"} placeholder={"Find Session"} onChange={handleSearchSessionChange} />
                <Stack className="w-full justify-between items-center" direction={"row"} spacing={1.5}>
                    <Box className="w-full h-[40vh] p-2.5 place-content-center text-center rounded-md bg-zinc-900/60 outline-3 outline-green-500" sx={{ boxShadow: `-6px 6px 0 ${green[300]}` }}>
                        {isLoading ? (
                            <CircularProgress className="size-10! text-green-500!"/>  
                        ) : (
                            <List className="size-full rounded-sm overflow-auto scrollbar-none" ref={sessionListRef} disablePadding>
                                {resultSessions.map((session, index) =>
                                    <ListItem className={`h-14 justify-between! pr-2.5 bg-zinc-800 ${index < sessions.length - 1 && 'mb-2.5'} rounded-sm overflow-hidden`} alignItems={"center"} key={session.roomId} disablePadding>
                                        <Stack className="h-full flex-1" direction={"row"}>
                                            <Box className={`w-4.5 h-full ${session.clients < session.maxClients ? 'bg-green-500' : 'bg-red-500'}`}/>
                                            <Stack className="items-center p-3" direction={"row"} spacing={1.5}>
                                                <Typography className={`${FONT_FAMILY} ${TEXT_COLOR} text-sm! line-clamp-1 text-ellipsis`}>{session.metadata?.sessionName}</Typography>
                                                <Typography className={`${FONT_FAMILY} ${TEXT_COLOR} text-sm! text-center whitespace-nowrap`}>( {session.clients} / {session.maxClients} )</Typography>
                                                {session.metadata?.hasPassword && (<LockOutlined className="size-4! text-yellow-500"/>)}
                                            </Stack>
                                        </Stack>
                                        <Button className={`${FONT_FAMILY} ${TEXT_COLOR} normal-case! bg-zinc-900! outline-2! outline-zinc-600!`} variant={"contained"} size={"small"} sx={{ boxShadow: `-5px 5px 0 ${grey[800]}` }} disabled={isJoining} disableRipple onClick={() => session.metadata?.hasPassword ? handleOpenPasswordDialog(session.roomId) : handleJoinSessionWithoutPassword(session.roomId)}>Join</Button>
                                    </ListItem>
                                )}
                            </List>
                        )}
                    </Box>
                    <CustomScrollbar value={scrollProgress} color={"green"} onChange={handleSessionListScrollbarSlide} />
                </Stack>
            </Stack>
            <Dialog open={openPasswordDialog} slotProps={{ paper: { className: "px-2.5 bg-zinc-900! outline-3! outline-zinc-800!" } }} sx={{ boxShadow: `-6px 6px 0 ${grey[700]}` }}>
                <DialogTitle className={`${FONT_FAMILY} ${TEXT_COLOR}`}>Session Password</DialogTitle>
                <DialogContent className="py-2!">
                    <CustomTextField value={password} color={"zinc"} type={"password"} placeholder={"Enter password"} limit={20} onChange={handlePasswordChange}/>
                </DialogContent>
                <DialogActions className="py-4.5! gap-4">
                    <Button className={`${FONT_FAMILY} ${TEXT_COLOR} normal-case! bg-zinc-900! outline-2! outline-zinc-600!`} variant={"contained"} size={"small"} sx={{ boxShadow: `-5px 5px 0 ${grey[800]}` }} loading={isJoining} disableRipple onClick={handleJoinSessionWithPassword}>Join</Button>
                    <Button className={`${FONT_FAMILY} ${TEXT_COLOR} normal-case! bg-zinc-900! outline-2! outline-zinc-600!`} variant={"contained"} size={"small"} sx={{ boxShadow: `-5px 5px 0 ${grey[800]}` }} disabled={isJoining} disableRipple onClick={handleClosePasswordDialog}>Cancel</Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={openAlert} {...SNACKBAR_COMMON_PROPS} onClose={handleCloseAlert}>
                <Alert severity={"error"} variant={"filled"} onClose={handleCloseAlert}>{message}</Alert>
            </Snackbar>
        </>
    );
}