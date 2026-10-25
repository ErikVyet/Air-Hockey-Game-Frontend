import { Box, Button, Stack, Typography } from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { IGameResult } from "../interfaces/IGameResult";
import { SessionContext } from "../contexts/SessionContext";
import { blue, grey } from "@mui/material/colors";
import { FONT_FAMILY, TEXT_COLOR } from "../constants/style";
import { motion } from "motion/react";

export default function ResultView() {
    const sessionContext = useContext(SessionContext);
    if (!sessionContext) return null;
    const { setActiveSession } = sessionContext;

    const navigate = useNavigate();

    const { state } = useLocation();

    const [animationInterval, setAnimationInterval] = useState(0);

    const result = useMemo(() => state as IGameResult, [state]);

    useEffect(() => {
        setActiveSession(null);
        if (!state) {
            navigate("/", { replace: true });
        }
    }, [state]);

    useEffect(() => {
        const interval = setInterval(() => {
            setAnimationInterval(prev => prev + 1);
        }, 1000);

        return () => { clearInterval(interval); }
    }, []);

    const handleReturnToMainMenu = () => {
        navigate("/",  { replace: true, state: null });
    };

    return (
        <Stack className={`w-sm p-10 h-[80vh] justify-between items-center bg-zinc-900/80 outline-3 outline-zinc-800 rounded-lg`} sx={{ boxShadow: `-10px 10px 0 ${grey[800]}` }}>
            <Stack className="justify-center" spacing={6} direction={"row"}>
                <Stack className="justify-center items-center" spacing={2}>
                    <Stack className="justify-center items-center" spacing={1}>
                        <Typography className={`${FONT_FAMILY} ${TEXT_COLOR}`}>{result?.redName}</Typography>
                        <Box className="size-8 place-content-center place-items-center">
                            <Box className="w-1/3 h-1/2 bg-red-500 border-t-2 border-red-800 rounded-t-full"/>
                            <Box className="w-full h-1/3 bg-red-500 rounded-xs border-t-2 border-b border-red-800"/>
                        </Box>
                    </Stack>
                    <Typography className={`${FONT_FAMILY} ${TEXT_COLOR} text-3xl! font-semibold!`}>{result?.redScore}</Typography>
                </Stack>
                <Stack className="justify-center items-center" spacing={2}>
                    <Stack  className="justify-center items-center" spacing={1}>
                        <Typography className={`${FONT_FAMILY} ${TEXT_COLOR}`}>{result?.blueName}</Typography>
                        <Box className="size-8 place-content-center place-items-center">
                            <Box className="w-1/3 h-1/2 bg-blue-500 border-t-2 border-blue-800 rounded-t-full"/>
                            <Box className="w-full h-1/3 bg-blue-500 rounded-xs border-t-2 border-b border-blue-800"/>
                        </Box>
                    </Stack>
                    <Typography className={`${FONT_FAMILY} ${TEXT_COLOR} text-3xl! font-semibold!`}>{result?.blueScore}</Typography>
                </Stack>
            </Stack>
            <Box component={motion.div} initial={{ scale: 1 }} animate={{ scale: animationInterval % 2 === 0 ? 1 : 1.2 }} transition={{ ease: "linear", duration: 1 }}>
                {result?.redScore === result?.blueScore ? (
                    <Typography className={`${FONT_FAMILY} ${TEXT_COLOR} text-3xl!`}>Draw!</Typography>
                ) : (
                    <Stack className="justify-center items-center" spacing={1}>
                        <Typography className={`${FONT_FAMILY} ${TEXT_COLOR} text-3xl!`}>Winner</Typography>
                        <Typography className={`${FONT_FAMILY} ${TEXT_COLOR} text-3xl!`}>{result?.redScore > result?.blueScore ? result?.redName : result?.blueName}!</Typography>
                    </Stack>
                )}
            </Box>
            <Button className={`${FONT_FAMILY} ${TEXT_COLOR} bg-blue-500! outline-2! outline-blue-600!`} sx={{ boxShadow: `-5px 5px 0 ${blue[800]}` }} fullWidth disableRipple onClick={handleReturnToMainMenu}>Main Menu</Button>
        </Stack>
    );
}