import { Container } from '@mui/material';
import { Canvas } from '@react-three/fiber';
import {  } from '@react-three/postprocessing';
import { Outlet } from 'react-router-dom';
import { CameraControls, CameraControlsImpl, Loader, useProgress } from '@react-three/drei';
import { FixedGameScene }from '../components/common/GameScene';
import { useEffect, useRef, useState } from 'react';
import { MenuAction } from '../enums/MenuAction';
import { MenuContext } from '../contexts/MenuContext';
import { BLUE_STRIKER_CAMERA_POSITION, CAMERA_TRANSITION_DURATION, DEFAULT_CAMERA_POSITION, HOSTING_CAMERA_POSITION, JOINING_CAMERA_POSITION, RED_STRIKER_CAMERA_POSITION, SPECTATOR_CAMERA_POSITION } from '../constants/scene';
import { SessionViewport } from '../enums/SessionViewport';

export default function MenuLayout() {
    const { active } = useProgress();

    const cameraControlsRef = useRef<CameraControlsImpl>(null!);

    const [menuAction, setMenuAction] = useState<MenuAction>(MenuAction.ORIGINAL);
    const [sessionViewport, setSessionViewport] = useState<SessionViewport>(SessionViewport.NONE);

    useEffect(() => {
        const cameraControls = cameraControlsRef.current;
        if (cameraControls && sessionViewport === SessionViewport.NONE) {
            switch (menuAction) {
                case (MenuAction.HOSTING): {
                    cameraControls.setLookAt(HOSTING_CAMERA_POSITION[0], HOSTING_CAMERA_POSITION[1], HOSTING_CAMERA_POSITION[2], 0, 0, 0, true);
                    break;
                }
                case (MenuAction.JOINING): {
                    cameraControls.setLookAt(JOINING_CAMERA_POSITION[0], JOINING_CAMERA_POSITION[1], JOINING_CAMERA_POSITION[2], 0, 0, 0, true);
                    break;
                }
                case (MenuAction.ORIGINAL): {
                    cameraControls.setLookAt(DEFAULT_CAMERA_POSITION[0], DEFAULT_CAMERA_POSITION[1], DEFAULT_CAMERA_POSITION[2], 0, 0, 0, true);
                    break;
                }
                default: break;
            }
        }
    }, [menuAction]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            const cameraControls = cameraControlsRef.current;
            if (!cameraControls) return;

            switch (sessionViewport) {
                case (SessionViewport.PLAYER_1): {
                    cameraControls.setLookAt(RED_STRIKER_CAMERA_POSITION[0], RED_STRIKER_CAMERA_POSITION[1], RED_STRIKER_CAMERA_POSITION[2], 0, 0, 0, true);
                    break;
                }
                case (SessionViewport.PLAYER_2): {
                    cameraControls.setLookAt(BLUE_STRIKER_CAMERA_POSITION[0], BLUE_STRIKER_CAMERA_POSITION[1], BLUE_STRIKER_CAMERA_POSITION[2], 0, 0, 0, true);
                    break;
                }
                case (SessionViewport.SPECTATOR): {
                    cameraControls.setLookAt(SPECTATOR_CAMERA_POSITION[0], SPECTATOR_CAMERA_POSITION[1], SPECTATOR_CAMERA_POSITION[2], 0, 0, 0, true);
                    break;
                }
            }
        }, 500);
        return () => { clearTimeout(timeout); }
    }, [sessionViewport]);

    return (
        <Container className="relative min-h-screen max-h-max place-content-center place-items-center" maxWidth={false} disableGutters>
            {active ? (
                <Loader containerStyles={{ background: "#0f172a" }} innerStyles={{ width: "300px" }} barStyles={{ background: "#9333ea" }} dataInterpolation={(progress) => `Loading Hockey Arena ${progress.toFixed(0)}%`}/>
            ) : (
                <MenuContext.Provider value={{ menuAction, setMenuAction, sessionViewport, setSessionViewport }}>
                    <Canvas className="absolute! -z-10 top-0 left-0 size-full" camera={{ position: DEFAULT_CAMERA_POSITION, fov: 50 }} shadows>
                        <ambientLight position={[1, 1, 1]} intensity={2}/>
                        <CameraControls ref={cameraControlsRef} smoothTime={CAMERA_TRANSITION_DURATION}/>
                        <FixedGameScene/>
                    </Canvas>
                    <Outlet/>
                </MenuContext.Provider>
            )}
        </Container>
    );
}