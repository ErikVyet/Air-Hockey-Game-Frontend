import { Physics, RapierRigidBody } from "@react-three/rapier";
import HockeyTable from "./HockeyTable";
import Striker from "./Striker";
import Puck from "./Puck";
import { useContext, useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { SessionContext } from "../../contexts/SessionContext";
import { Box3, MathUtils, Mesh, Vector3 } from "three";
import { BLUE_STRIKER_INITIAL_POSITION, BLUE_STRIKER_NAME, PHYSIC_TIME_STEP, POINTER_OFFSET_Z, PUCK_INITIAL_POSITION, RED_STRIKER_INITIAL_POSITION, RED_STRIKER_NAME, STRIKER_SPEED_MULTIPLIER } from "../../constants/scene";
import { SessionMessage } from "../../enums/SessionMessage";
import { SettingContext } from "../../contexts/SettingContext";

export function FixedGameScene() {
    return (
        <Physics>
            <HockeyTable />
            <Striker position={BLUE_STRIKER_INITIAL_POSITION} color={"blue"} />
            <Striker position={RED_STRIKER_INITIAL_POSITION} color={"red"} />
            <Puck initialPosition={[0, 0.5, 0]} />
        </Physics>
    );
}

export function DynamicGameScene() {
    const settingContext = useContext(SettingContext);
    if (!settingContext) return null;
    const { fps } = settingContext;

    const sessionContext = useContext(SessionContext);
    if (!sessionContext) return null;
    const { activeSession } = sessionContext;

    const redStrikerRef = useRef<RapierRigidBody>(null!);
    const blueStrikerRef = useRef<RapierRigidBody>(null!);
    const puckRef = useRef<RapierRigidBody>(null!);
    const boxRef = useRef<Box3>(new Box3());
    const tableSurfaceRef = useRef<Mesh>(null!);
    // const currentRedStrikerPositionRef = useRef<Vector3>(new Vector3(...RED_STRIKER_INITIAL_POSITION));
    // const currentBlueStrikerPositionRef = useRef<Vector3>(new Vector3(...BLUE_STRIKER_INITIAL_POSITION));
    // const currentPuckPositionRef = useRef<Vector3>(new Vector3(...PUCK_INITIAL_POSITION));
    const targetStrikerPosition = useRef<Vector3>(new Vector3());

    const [controlledStriker, setControlledStriker] = useState<"none" | "red" | "blue">("none");
    const [countDown, setCountDown] = useState(5);

    useEffect(() => {
        if (!activeSession) return;

        handleUpdateControlledStriker();

        activeSession.onStateChange(state => {
            // Update the count down
            setCountDown(state.countDown);

            // Update controlled striker
            if (controlledStriker === "none") {
                handleUpdateControlledStriker();
            }

            // Update opponent's striker position
            state.players.forEach(player => {
                if (player.role !== "player") return;

                if (player.sessionId === activeSession.sessionId) return;

                if (player.isHost) {
                    // currentRedStrikerPositionRef.current?.fromArray(player.position);
                    // redStrikerRef.current?.setNextKinematicTranslation(currentRedStrikerPositionRef.current);

                    const redStriker = redStrikerRef.current;
                    const targetPosition = player.position;
                    redStriker?.setTranslation({ x: targetPosition[0], y: targetPosition[1], z: targetPosition[2] }, true);
                } 
                else {
                    // currentBlueStrikerPositionRef.current?.fromArray(player.position);
                    // blueStrikerRef.current?.setNextKinematicTranslation(currentBlueStrikerPositionRef.current);
                
                    const blueStriker = blueStrikerRef.current;
                    const targetPosition = player.position;
                    blueStriker?.setTranslation({ x: targetPosition[0], y: targetPosition[1], z: targetPosition[2] }, true);
                }
            });
        });
    }, [activeSession]);

    useEffect(() => {
        const interval = setInterval(() => {
            const redStriker = redStrikerRef.current;
            const blueStriker = blueStrikerRef.current;
            let position: [number, number, number] | undefined = undefined;
            if (controlledStriker === "red" && redStriker) {
                const redStrikerPosition = redStriker.translation();
                position = [redStrikerPosition.x, redStrikerPosition.y, redStrikerPosition.z];
            }
            else if (controlledStriker === "blue") {
                const blueStrikerPosition = blueStriker.translation();
                position = [blueStrikerPosition.x, blueStrikerPosition.y, blueStrikerPosition.z];
            }
            
            if (position) {
                activeSession?.send(SessionMessage.UPDATE_STRIKER, position);
            }
        }, Math.floor(1000 / fps));

        return () => { clearInterval(interval); }
    }, [activeSession, controlledStriker, fps]);

    useFrame(({ raycaster, camera, pointer }, _delta) => {
        if (countDown > 0) return;

        const redStriker = redStrikerRef.current;
        const blueStriker = blueStrikerRef.current;
        const tableSurface = tableSurfaceRef.current;
        if (!redStriker || !blueStriker || !tableSurface) return;

        raycaster.setFromCamera(pointer, camera);
        const intersection = raycaster.ray.intersectBox(boxRef.current.setFromObject(tableSurface), targetStrikerPosition.current);

        /* Use these when striker is kinematic position */
        // if (controlledStriker === "red" && intersection) {
        //     const clampedX = MathUtils.clamp(intersection.x, -0.4, 0.4);
        //     const clampedZ = MathUtils.clamp(intersection.z - POINTER_OFFSET_Z, 0 - POINTER_OFFSET_Z, 0.82 - POINTER_OFFSET_Z);

        //     currentRedStrikerPositionRef.current.x = MathUtils.damp(currentRedStrikerPositionRef.current.x, clampedX, STRIKER_LAMBDA, delta);
        //     currentRedStrikerPositionRef.current.z = MathUtils.damp(currentRedStrikerPositionRef.current.z, clampedZ, STRIKER_LAMBDA, delta);

        //     redStriker.setNextKinematicTranslation(currentRedStrikerPositionRef.current);
        // }
        // else if (controlledStriker === "blue" && intersection) {
        //     const clampedX = MathUtils.clamp(intersection.x, -0.4, 0.4);
        //     const clampedZ = MathUtils.clamp(intersection.z + POINTER_OFFSET_Z, POINTER_OFFSET_Z - 0.82, POINTER_OFFSET_Z);

        //     currentBlueStrikerPositionRef.current.x = MathUtils.damp(currentBlueStrikerPositionRef.current.x, clampedX, STRIKER_LAMBDA, delta);
        //     currentBlueStrikerPositionRef.current.z = MathUtils.damp(currentBlueStrikerPositionRef.current.z, clampedZ, STRIKER_LAMBDA, delta);

        //     blueStriker.setNextKinematicTranslation(currentBlueStrikerPositionRef.current);
        // }
        
        /* Use these when striker is kinematic velocity */
        if (controlledStriker === "red") {
            if (intersection) {
                const targetX = MathUtils.clamp(intersection.x, -0.4, 0.4);
                const targetZ = MathUtils.clamp(intersection.z - POINTER_OFFSET_Z, -POINTER_OFFSET_Z, 0.82 - POINTER_OFFSET_Z);

                const currentRedPosition = redStriker.translation();

                const velocityX = (targetX - currentRedPosition.x) * STRIKER_SPEED_MULTIPLIER;
                const velocityZ = (targetZ - currentRedPosition.z) * STRIKER_SPEED_MULTIPLIER;

                redStriker.setLinvel({ x: velocityX, y: 0, z: velocityZ }, true);
            }
            else {
                redStriker.setLinvel({ x: 0, y: 0, z: 0 }, true);
            }
        }
        else if (controlledStriker === "blue") {
            if (intersection) {
                const targetX = MathUtils.clamp(intersection.x, -0.4, 0.4);
                const targetZ = MathUtils.clamp(intersection.z + POINTER_OFFSET_Z, POINTER_OFFSET_Z - 0.82, POINTER_OFFSET_Z);

                const currentBluePosition = blueStriker.translation();

                const velocityX = (targetX - currentBluePosition.x) * STRIKER_SPEED_MULTIPLIER;
                const velocityZ = (targetZ - currentBluePosition.z) * STRIKER_SPEED_MULTIPLIER;

                blueStriker.setLinvel({ x: velocityX, y: 0, z: velocityZ }, true);
            }
            else {
                blueStriker.setLinvel({ x: 0, y: 0, z: 0 }, true);
            }
        }

    });

    const handleUpdateControlledStriker = () => {
        if (!activeSession?.state?.players) return;

        const player = activeSession.state.players.get(activeSession.sessionId);
        if (player?.role === "player") {
            setControlledStriker(player.isHost ? "red" : "blue");
        }
    };

    return (
        <Physics timeStep={PHYSIC_TIME_STEP}>
            <HockeyTable surfaceRef={tableSurfaceRef}/>
            <Striker ref={redStrikerRef} name={RED_STRIKER_NAME} position={RED_STRIKER_INITIAL_POSITION} color={"red"} />
            <Striker ref={blueStrikerRef} name={BLUE_STRIKER_NAME} position={BLUE_STRIKER_INITIAL_POSITION} color={"blue"} />
            <Puck ref={puckRef} initialPosition={PUCK_INITIAL_POSITION}/>
        </Physics>
    );
}