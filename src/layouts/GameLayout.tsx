import { Box, Container, Stack } from "@mui/material";
import { Loader, useProgress } from "@react-three/drei";
import { Outlet, useLocation } from "react-router-dom";
import ChatPanel from "../components/common/ChatPanel";
import GuidePanel from "../components/common/GuidePanel";
import Scoreboard from "../components/common/Scoreboard";

export function GameLayout() {
    const { active } = useProgress();

    const { pathname } = useLocation();

    return (
        <Container className="relative min-h-screen max-h-max place-content-center place-items-center" maxWidth={false} disableGutters>
            {active ? (
                <Loader containerStyles={{ background: "#0f172a" }} innerStyles={{ width: "300px" }} barStyles={{ background: "#9333ea" }} dataInterpolation={(progress) => `Loading Hockey Arena ${progress.toFixed(0)}%`}/>
            ) : (
                <>
                    {!pathname.includes("result") && (
                        <Stack className={"absolute! top-0 left-0 -z-10 w-full h-screen justify-between"} direction={"row"}>
                            <Box className="p-10">
                                <Scoreboard/>
                                <GuidePanel/>
                            </Box>
                            <ChatPanel/>
                        </Stack>
                    )}
                    <Outlet/>
                </>
            )}
        </Container>
    );
}