import { CameraControls, CameraControlsImpl } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { BLUE_STRIKER_CAMERA_POSITION, CAMERA_TRANSITION_DURATION, DEFAULT_CAMERA_POSITION, RED_STRIKER_CAMERA_POSITION, SPECTATOR_CAMERA_POSITION } from "../constants/scene";
import { DynamicGameScene } from "../components/common/GameScene";
import { useContext, useEffect, useRef, useState } from "react";
import { SessionContext } from "../contexts/SessionContext";
import { useNavigate, useParams } from "react-router-dom";
import useClient from "../hooks/useClient";
import { Alert, Snackbar, Typography } from "@mui/material";
import { SNACKBAR_COMMON_PROPS } from "../constants/props";
import { SessionMessage } from "../enums/SessionMessage";
import { FONT_FAMILY } from "../constants/style";

export default function GameView() {
    const sessionContext = useContext(SessionContext);
    if (!sessionContext) return null;
    const { activeSession, setActiveSession } = sessionContext;

    const { reconnectionToken } = useParams();

    const navigate = useNavigate();

    const client = useClient();

    const cameraControlsRef = useRef<CameraControlsImpl>(null!);

    const [isControlsReady, setIsControlsReady] = useState(false);
    const [countDown, setCountDown] = useState(5);
    const [openAlert, setOpenAlert] = useState(false);
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!activeSession && reconnectionToken) {
                client.reconnect(reconnectionToken).then(session => {
                    setActiveSession(session);
                    handleOpenAlert(false, "Successfully reconnected to session");
                    navigate(`/game/${session.reconnectionToken}`, { replace: true });
                }).catch(() => {
                    handleOpenAlert(true, "Unable to connect to session");
                    navigate("/", { replace: true });
                });
            }
        }, 100);

        if (!activeSession) return;

        activeSession.onStateChange(state => {
            // Update count down
            setCountDown(state.countDown);
        });

        return () => { 
            clearTimeout(timeout);
            activeSession.removeAllListeners(); 
        }
    }, [activeSession]);

    useEffect(() => {
        if (activeSession && isControlsReady) {
            handleUpdatePlayerView();

            activeSession.send(SessionMessage.START_COUNT_DOWN);
        }
    }, [activeSession, isControlsReady]);

    const handleUpdatePlayerView = () => {
        const cameraControls = cameraControlsRef.current;
        if (!activeSession?.state?.players || !cameraControls) return;

        const player = activeSession.state.players.get(activeSession.sessionId);
        switch (player?.role) {
            case ("player"): {
                if (player.isHost) {
                    cameraControls.setLookAt(RED_STRIKER_CAMERA_POSITION[0], RED_STRIKER_CAMERA_POSITION[1], RED_STRIKER_CAMERA_POSITION[2], RED_STRIKER_CAMERA_POSITION[0], 0, 0, true);
                }
                else {
                    cameraControls.setLookAt(-BLUE_STRIKER_CAMERA_POSITION[0], BLUE_STRIKER_CAMERA_POSITION[1], BLUE_STRIKER_CAMERA_POSITION[2], -BLUE_STRIKER_CAMERA_POSITION[0], 0, 0, true);
                }
                break;
            }
            case ("spectator"): {
                cameraControls.setLookAt(SPECTATOR_CAMERA_POSITION[0], SPECTATOR_CAMERA_POSITION[1], SPECTATOR_CAMERA_POSITION[2], 0, 0, 0, true);
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
            {countDown >= 0 && (
                <Typography className={`absolute! top-1/2 left-1/2 -translate-1/2 z-10 ${FONT_FAMILY} text-green-600 text-6xl! xl:text-9xl! text-shadow-lg!`}>{countDown > 0 ? countDown : "Start!"}</Typography>
            )}
            <Canvas className="w-full h-screen!" camera={{ position: DEFAULT_CAMERA_POSITION, fov: 50 }} shadows>
                <ambientLight position={[1, 1, 1]} intensity={2} />
                <CameraControls ref={(node) => { cameraControlsRef.current = node!; if (node) setIsControlsReady(true); }} smoothTime={CAMERA_TRANSITION_DURATION} enabled={false}/>
                <DynamicGameScene />
            </Canvas>
            <Snackbar open={openAlert} {...SNACKBAR_COMMON_PROPS} onClose={handleCloseAlert}>
                <Alert severity={isError ? "error" : "success"} variant={"filled"} onClose={handleCloseAlert}>{message}</Alert>
            </Snackbar>
        </>
    );
}