import { Container } from '@mui/material';
import { Canvas } from '@react-three/fiber';
import {  } from '@react-three/postprocessing';
import { Outlet } from 'react-router-dom';
import { CameraControls, CameraControlsImpl, Loader, useProgress } from '@react-three/drei';
import GameScene from '../components/common/GameScene';
import { useEffect, useRef, useState } from 'react';
import { MenuAction } from '../enums/MenuAction';
import { MenuContext } from '../contexts/MenuContext';
import { CAMERA_TRANSITION_DURATION, DEFAULT_CAMERA_POSITION, HOSTING_CAMERA_POSITION, JOINING_CAMERA_POSITION } from '../constants/scene';

export default function MenuLayout() {
    const { active } = useProgress();

    const cameraControlsRef = useRef<CameraControlsImpl>(null!);

    const [menuAction, setMenuAction] = useState<MenuAction>(MenuAction.ORIGINAL); 

    useEffect(() => {
        const cameraControls = cameraControlsRef.current;
        if (cameraControls) {
            switch (menuAction) {
                case (MenuAction.HOSTING): {
                    cameraControls.setLookAt(HOSTING_CAMERA_POSITION[0], HOSTING_CAMERA_POSITION[1], HOSTING_CAMERA_POSITION[2], 0, 0, 0, true);
                    break;
                }
                case (MenuAction.JOINING): {
                    cameraControls.setLookAt(JOINING_CAMERA_POSITION[0], JOINING_CAMERA_POSITION[1], JOINING_CAMERA_POSITION[2], 0, 0, 0, true);
                    break;
                }
                default: {
                    cameraControls.setLookAt(DEFAULT_CAMERA_POSITION[0], DEFAULT_CAMERA_POSITION[1], DEFAULT_CAMERA_POSITION[2], 0, 0, 0, true);
                    break;
                }
            }
        }
    }, [menuAction]);

    return (
        <Container className="relative min-h-screen max-h-max place-content-center place-items-center" maxWidth={false} disableGutters>
            {active ? (
                <Loader containerStyles={{ background: "#0f172a" }} innerStyles={{ width: "300px" }} barStyles={{ background: "#9333ea" }} dataInterpolation={(progress) => `Loading Hockey Arena ${progress.toFixed(0)}%`}/>
            ) : (
                <MenuContext.Provider value={{ menuAction, setMenuAction }}>
                    <Canvas className="absolute! -z-10 top-0 left-0 size-full" camera={{ position: DEFAULT_CAMERA_POSITION, fov: 50 }} shadows>
                        <ambientLight position={[1, 1, 1]} intensity={2}/>
                        <CameraControls ref={cameraControlsRef} smoothTime={CAMERA_TRANSITION_DURATION}/>
                        <GameScene/>
                    </Canvas>
                    <Outlet/>
                </MenuContext.Provider>
            )}
        </Container>
    );
}