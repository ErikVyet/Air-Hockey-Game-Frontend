import { Box, Stack, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../../contexts/SessionContext";
import { FONT_FAMILY, TEXT_COLOR } from "../../constants/style";
import { grey } from "@mui/material/colors";

export default function Scoreboard() {
    const sessionContext = useContext(SessionContext);
    if (!sessionContext) return null;
    const { activeSession } = sessionContext;

    const [redStrikerName, setRedStrikerName] = useState("");
    const [blueStrikerName, setBlueStrikerName] = useState("");
    const [redStrikerScore, setRedStrikerScore] = useState(0);
    const [blueStrikerScore, setBlueStrikerScore] = useState(0);

    useEffect(() => {
        if (!activeSession) return;

        handleUpdateScores();

        activeSession.onStateChange(() => {
            // Update scoreboard
            handleUpdateScores();
        });
    }, [activeSession]);

    const handleUpdateScores = () => {
        activeSession?.state?.players?.forEach(player => {
            if (player.role === "player") {
                if (player.isHost) {
                    setRedStrikerName(player.name);
                    setRedStrikerScore(activeSession.state.redScore);
                }
                else {
                    setBlueStrikerName(player.name);
                    setBlueStrikerScore(activeSession.state.blueScore);
                }
            }
        });
    };

    return (
        <Stack className="pb-10 justify-between items-center" direction={"row"} spacing={3}>
            <Box className="place-content-center place-items-center">
                <Typography className={`${FONT_FAMILY} ${TEXT_COLOR}`}>{redStrikerName}</Typography>
                <Box className="size-8 place-content-center place-items-center">
                    <Box className="w-1/3 h-1/2 bg-red-500 border-t-2 border-red-800 rounded-t-full"/>
                    <Box className="w-full h-1/3 bg-red-500 rounded-xs border-t-2 border-b border-red-800"/>
                </Box>
            </Box>
            <Stack className="flex-1 py-2.5 justify-center items-center bg-zinc-800 outline-2 outline-zinc-600 rounded-sm" direction={"row"} sx={{ boxShadow: `0 3px 0 5px ${grey[800]}` }}>
                <Box className="flex-1 place-content-center place-items-center">
                    <Typography className={`${FONT_FAMILY} ${TEXT_COLOR} text-xl!`}>{redStrikerScore}</Typography>
                </Box>
                <Typography className={`${FONT_FAMILY} ${TEXT_COLOR}`}>:</Typography>
                <Box className="flex-1 place-content-center place-items-center">
                    <Typography className={`${FONT_FAMILY} ${TEXT_COLOR} text-xl!`}>{blueStrikerScore}</Typography>
                </Box>
            </Stack>
            <Box className="place-content-center place-items-center">
                <Typography className={`${FONT_FAMILY} ${TEXT_COLOR}`}>{blueStrikerName}</Typography>
                <Box className="size-8 place-content-center place-items-center">
                    <Box className="w-1/3 h-1/2 bg-blue-500 border-t-2 border-blue-800 rounded-t-full"/>
                    <Box className="w-full h-1/3 bg-blue-500 rounded-xs border-t-2 border-b border-blue-800"/>
                </Box>
            </Box>
        </Stack>
    );
}