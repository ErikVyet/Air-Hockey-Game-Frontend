import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import type { Session } from "../../interfaces/Session";
import { useMotionValueEvent, useScroll } from "motion/react";
import { Box, Button, List, ListItem, Stack, Typography } from "@mui/material";
import { CustomTextField } from "../common/CustomInput";
import CustomScrollbar from "../common/CustomScrollbar";
import { green, grey } from "@mui/material/colors";
import { FONT_FAMILY, TEXT_COLOR } from "../../constants/style";
import { data } from "../../assets/mock/mocked_sessions.json";
import { LockOutlined } from "@mui/icons-material";

export default function SessionList() {
    const sessionListRef = useRef<HTMLUListElement>(null!);

    const sessions = useMemo(() => data as Session[], [data]);

    const [resultSessions, setResultSessions] = useState(sessions);
    const [searchSession, setSearchSession] = useState("");
    const [scrollProgress, setScrollProgress] = useState(0);

    const { scrollYProgress } = useScroll({ container: sessionListRef });

    useMotionValueEvent(scrollYProgress, "change", (latest) => setScrollProgress(latest * 100));

    useEffect(() => {
        const timeout = setTimeout(() => {
            setResultSessions(sessions.filter(session => session.name.toLowerCase().includes(searchSession.toLowerCase())));
        }, 500);
        return () => { clearTimeout(timeout); }
    }, [searchSession]);

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

    return (
        <Stack className="w-full justify-center items-center" spacing={3}>
            <CustomTextField value={searchSession} type={"text"} color={"green"} placeholder={"Find Session"} onChange={handleSearchSessionChange} />
            <Stack className="w-full justify-between items-center" direction={"row"} spacing={1.5}>
                <Box className="w-full p-2.5 rounded-md bg-zinc-900/60 outline-3 outline-green-500" sx={{ boxShadow: `-6px 6px 0 ${green[300]}` }}>
                    <List className="w-full h-[40vh] rounded-sm overflow-auto scrollbar-none" ref={sessionListRef} disablePadding>
                        {resultSessions.map((session, index) =>
                            <ListItem className={`h-14 justify-between! pr-2.5 bg-zinc-800 ${index < sessions.length - 1 && 'mb-2.5'} rounded-sm overflow-hidden`} alignItems={"center"} key={session.id} disablePadding>
                                <Stack className="h-full flex-1" direction={"row"}>
                                    <Box className={`w-4.5 h-full ${session.participants < 2 ? 'bg-green-500' : 'bg-red-500'}`}/>
                                    <Stack className="items-center p-3" direction={"row"} spacing={1.5}>
                                        <Typography className={`${FONT_FAMILY} ${TEXT_COLOR} text-sm! line-clamp-1 text-ellipsis`}>{session.name}</Typography>
                                        <Typography className={`${FONT_FAMILY} ${TEXT_COLOR} text-sm! text-center whitespace-nowrap`}>( {session.participants} / 2 )</Typography>
                                        {session.password && (<LockOutlined className="size-4! text-yellow-500"/>)}
                                    </Stack>
                                </Stack>
                                <Button className={`${FONT_FAMILY} ${TEXT_COLOR} normal-case! bg-zinc-900! outline-2! outline-zinc-600!`} variant={"contained"} size={"small"} sx={{ boxShadow: `-5px 5px 0 ${grey[800]}` }} disableRipple>Join</Button>
                            </ListItem>
                        )}
                    </List>
                </Box>
                <CustomScrollbar value={scrollProgress} color={"green"} onChange={handleSessionListScrollbarSlide} />
            </Stack>
        </Stack>
    );
}