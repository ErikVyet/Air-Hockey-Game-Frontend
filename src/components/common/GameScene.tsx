import { Physics, RapierRigidBody, type CollisionEnterPayload } from "@react-three/rapier";
import HockeyTable from "./HockeyTable";
import Striker from "./Striker";
import Puck from "./Puck";
import { useContext, useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { SessionContext } from "../../contexts/SessionContext";
import { Box3, MathUtils, Mesh, Vector3 } from "three";
import { BLUE_GOAL, BLUE_STRIKER_INITIAL_POSITION, BLUE_STRIKER_NAME, CAMERA_TRANSITION_DURATION, PHYSIC_TIME_STEP, POINTER_OFFSET_Z, PUCK_INITIAL_POSITION, RED_GOAL, RED_STRIKER_INITIAL_POSITION, RED_STRIKER_NAME, STRIKER_SPEED_MULTIPLIER } from "../../constants/scene";
import { SessionMessage } from "../../enums/SessionMessage";
import { SettingContext } from "../../contexts/SettingContext";
import type { IRestoreStatePayload } from "../../interfaces/IRestoreStatePayload";
import { useNavigate } from "react-router-dom";

export function FixedGameScene() {
    return (
        <Physics>
            <HockeyTable />
            <Striker position={BLUE_STRIKER_INITIAL_POSITION} color={"blue"} />
            <Striker position={RED_STRIKER_INITIAL_POSITION} color={"red"} />
            <Puck type={"dynamic"}/>
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

    const navigate = useNavigate();

    const redStrikerRef = useRef<RapierRigidBody>(null!);
    const blueStrikerRef = useRef<RapierRigidBody>(null!);
    const puckRef = useRef<RapierRigidBody>(null!);
    const boxRef = useRef<Box3>(new Box3());
    const tableSurfaceRef = useRef<Mesh>(null!);
    const targetPuckPositionRef = useRef<Vector3>(new Vector3());
    const targetStrikerPositionRef = useRef<Vector3>(new Vector3());
    const targetRedStrikerPositionRef = useRef<Vector3>(new Vector3());
    const targetBlueStrikerPositionRef = useRef<Vector3>(new Vector3());

    const [controlledStriker, setControlledStriker] = useState<"none" | "red" | "blue">("none");
    const [countDown, setCountDown] = useState(5);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if (!activeSession) return;

        handleUpdateControlledStriker();

        const timeout = setTimeout(() => setIsInitialized(true), CAMERA_TRANSITION_DURATION * 100 + 1000);

        activeSession.onStateChange(state => {
            // Update the count down
            setCountDown(state.countDown);

            // Update controlled striker
            if (controlledStriker === "none") {
                handleUpdateControlledStriker();
            }

            if (state.countDown > 0) return;

            // Update opponent's striker position
            state.players.forEach(player => {
                if (player.role !== "player" || player.sessionId === activeSession.sessionId) return;

                if (player.isHost) {
                    targetRedStrikerPositionRef.current.set(
                        MathUtils.clamp(state.redStrikerPosition[0], -0.4, 0.4),
                        state.redStrikerPosition[1],
                        MathUtils.clamp(state.redStrikerPosition[2] - POINTER_OFFSET_Z, -POINTER_OFFSET_Z, 0.82 - POINTER_OFFSET_Z)
                    );
                } 
                else {                
                    targetBlueStrikerPositionRef.current.set(
                        MathUtils.clamp(state.blueStrikerPosition[0], -0.4, 0.4),
                        state.blueStrikerPosition[1],
                        MathUtils.clamp(state.blueStrikerPosition[2] + POINTER_OFFSET_Z, POINTER_OFFSET_Z - 0.82, POINTER_OFFSET_Z)
                    );
                }
            });

            return () => { clearTimeout(timeout); }
        });

        activeSession.onMessage(SessionMessage.NAVIGATE_TO_RESULT, () => {
            activeSession.leave(true).then(() => {
                let redName = "";
                let blueName = "";
                activeSession.state.players.forEach(player => {
                    if (player.role !== "player") return;

                    if (player.isHost) {
                        redName = player.name;
                    }
                    else {
                        blueName = player.name;
                    }
                });
                navigate("/game/result", { replace: true, state: {
                    redName, blueName,
                    redScore: activeSession.state.redScore,
                    blueScore: activeSession.state.blueScore
                } });
            }).catch(() => {
                navigate("/", { replace: true });  
            });   
        });

        activeSession.onMessage(SessionMessage.RESTORE_STATE, ({ redStrikerPosition, blueStrikerPosition, puckPosition }: IRestoreStatePayload) => {
            const puck = puckRef.current;
            const redStriker = redStrikerRef.current;
            const blueStriker = blueStrikerRef.current;
            if (!puck || !redStriker || !blueStriker) return;

            puck.setTranslation({ x: puckPosition[0], y: puckPosition[1], z: puckPosition[2] }, true);
            redStriker.setTranslation({ x: redStrikerPosition[0], y: redStrikerPosition[1], z: redStrikerPosition[2] }, true);
            blueStriker.setTranslation({ x: blueStrikerPosition[0], y: blueStrikerPosition[1], z: blueStrikerPosition[2] }, true);
        });
    }, [activeSession]);

    useEffect(() => {
        if (controlledStriker === "none" || !isInitialized) return;

        const interval = setInterval(() => {
            const redStriker = redStrikerRef.current;
            const blueStriker = blueStrikerRef.current;
            let position: [number, number, number] | undefined = undefined;
            if (controlledStriker === "red" && redStriker) {
                const redStrikerPosition = redStriker.translation();
                position = [redStrikerPosition.x, redStrikerPosition.y, redStrikerPosition.z + POINTER_OFFSET_Z];
            
                const puck = puckRef.current;
                if (puck) {
                    const puckPosition = puck.translation();
                    activeSession?.send(SessionMessage.UPDATE_PUCK, [puckPosition.x, puckPosition.y, puckPosition.z]);
                }
            }
            else if (controlledStriker === "blue" && blueStriker) {
                const blueStrikerPosition = blueStriker.translation();
                position = [blueStrikerPosition.x, blueStrikerPosition.y, blueStrikerPosition.z - POINTER_OFFSET_Z];
            }
            
            if (position) {
                activeSession?.send(SessionMessage.UPDATE_STRIKER, position);
            }
        }, Math.floor(1000 / fps));

        return () => { clearInterval(interval); }
    }, [activeSession, controlledStriker, fps, isInitialized]);

    useFrame(({ raycaster, camera, pointer }, delta) => {
        if (countDown > 0 || !isInitialized || !activeSession?.state || activeSession?.state?.isPaused) return;

        const tableSurface = tableSurfaceRef.current;
        if (!tableSurface) return;

        raycaster.setFromCamera(pointer, camera);
        const intersection = raycaster.ray.intersectBox(boxRef.current.setFromObject(tableSurface), targetStrikerPositionRef.current);

        handleUpdateControlledStrikerPosition(intersection);
        handleUpdateOpponentStrikerPosition();
        handleUpdatePuckPosition(delta);
        
    });

    const handleUpdateControlledStriker = () => {
        if (!activeSession?.state?.players) return;

        const player = activeSession.state.players.get(activeSession.sessionId);
        if (player?.role === "player") {
            setControlledStriker(player.isHost ? "red" : "blue");
        }
    };
    const handleUpdateControlledStrikerPosition = (intersection: Vector3 | null) => {
        const redStriker = redStrikerRef.current;
        const blueStriker = blueStrikerRef.current;
        if (!redStriker || !blueStriker || !activeSession?.state || activeSession?.state?.isPaused) return;
        
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
    };
    const handleUpdateOpponentStrikerPosition = () => {
        const blueStriker = blueStrikerRef.current;
        const redStriker = redStrikerRef.current;

        if (!blueStriker || !redStriker || !activeSession?.state || activeSession?.state?.isPaused) return;

        if (controlledStriker === "red") {
            const currentBluePosition = blueStriker.translation();
            const targetBluePosition = targetBlueStrikerPositionRef.current;
            const blueStrikerVelocityX = (targetBluePosition.x - currentBluePosition.x) * STRIKER_SPEED_MULTIPLIER;
            const blueStrikerVelocityZ = (targetBluePosition.z - currentBluePosition.z) * STRIKER_SPEED_MULTIPLIER;
            blueStriker.setLinvel({ x: blueStrikerVelocityX, y: 0, z: blueStrikerVelocityZ }, true);
        }
        else if (controlledStriker === "blue") {
            const currentRedPosition = redStriker.translation();
            const targetRedPosition = targetRedStrikerPositionRef.current;
            const redStrikerVelocityX = (targetRedPosition.x - currentRedPosition.x) * STRIKER_SPEED_MULTIPLIER;
            const redStrikerVelocityZ = (targetRedPosition.z - currentRedPosition.z) * STRIKER_SPEED_MULTIPLIER;
            redStriker.setLinvel({ x: redStrikerVelocityX, y: 0, z: redStrikerVelocityZ }, true);
        }
        else {
            const currentBluePosition = blueStriker.translation();
            const targetBluePosition = targetBlueStrikerPositionRef.current;
            const blueStrikerVelocityX = (targetBluePosition.x - currentBluePosition.x) * STRIKER_SPEED_MULTIPLIER;
            const blueStrikerVelocityZ = (targetBluePosition.z - currentBluePosition.z) * STRIKER_SPEED_MULTIPLIER;
            blueStriker.setLinvel({ x: blueStrikerVelocityX, y: 0, z: blueStrikerVelocityZ }, true);

            const currentRedPosition = redStriker.translation();
            const targetRedPosition = targetRedStrikerPositionRef.current;
            const redStrikerVelocityX = (targetRedPosition.x - currentRedPosition.x) * STRIKER_SPEED_MULTIPLIER;
            const redStrikerVelocityZ = (targetRedPosition.z - currentRedPosition.z) * STRIKER_SPEED_MULTIPLIER;
            redStriker.setLinvel({ x: redStrikerVelocityX, y: 0, z: redStrikerVelocityZ }, true);
        }
    };
    const handleUpdatePuckPosition = (delta: number) => {
        const puck = puckRef.current;
        if (!puck) return;

        const puckPosition = activeSession?.state?.puckPosition;
        if (controlledStriker !== "red" && puckPosition) {
            targetPuckPositionRef.current.set(...puckPosition);
            const puckCurrentPosition = puck.translation();

            const targetX = MathUtils.damp(puckCurrentPosition.x, targetPuckPositionRef.current.x, 20, delta);
            const targetZ = MathUtils.damp(puckCurrentPosition.z, targetPuckPositionRef.current.z, 20, delta);

            puck.setNextKinematicTranslation({ x: targetX, y: targetPuckPositionRef.current.y, z: targetZ });
        }
    };
    const handleResetStrikersVelocity = () => {
        const redStriker = redStrikerRef.current;
        const blueStriker = blueStrikerRef.current;
        if (!redStriker || !blueStriker) return;

        redStriker.setLinvel({ x: 0, y: 0, z: 0 }, true);
        blueStriker.setLinvel({ x: 0, y: 0, z: 0 }, true);
    };
    const handleResetStrikersPosition = () => {
        const redStriker = redStrikerRef.current;
        const blueStriker = blueStrikerRef.current;
        if (!redStriker || !blueStriker) return;

        targetRedStrikerPositionRef.current.set(...RED_STRIKER_INITIAL_POSITION);
        redStriker.setTranslation(targetRedStrikerPositionRef.current, true);
        redStriker.setLinvel({ x: 0, y: 0, z: 0 }, true);

        targetBlueStrikerPositionRef.current.set(...BLUE_STRIKER_INITIAL_POSITION);
        blueStriker.setTranslation(targetBlueStrikerPositionRef.current, true);
        blueStriker.setLinvel({ x: 0, y: 0, z: 0 }, true);
    };
    const handleResetPuckPosition = () => {
        const puck = puckRef.current;
        if (!puck) return;

        targetPuckPositionRef.current.set(...PUCK_INITIAL_POSITION);
        puck.setTranslation(targetPuckPositionRef.current, true);
    }
    const handleCollisionEnter = (payload: CollisionEnterPayload) => {
        if (!activeSession?.state || (payload.other.rigidBodyObject?.name !== RED_GOAL && payload.other.rigidBodyObject?.name !== BLUE_GOAL)) return;

        activeSession.send(SessionMessage.PAUSE_GAME);
        handleResetStrikersVelocity();
        if (controlledStriker === "red") {
            const updateScoreTimeout = setTimeout(() => {
                switch (payload.other.rigidBodyObject?.name) {
                    case (RED_GOAL): {
                        activeSession?.send(SessionMessage.UPDATE_SCORES, "blue");
                        break;
                    }
                    case (BLUE_GOAL): {
                        activeSession?.send(SessionMessage.UPDATE_SCORES, "red");
                        break;
                    }
                }
                return () => { clearTimeout(updateScoreTimeout); }
            }, 300);
        }

        const timeout = setTimeout(() => {
            if (activeSession.state.round === activeSession.state.maxRounds) {
                activeSession.send(SessionMessage.NAVIGATE_TO_RESULT);
            }
            else {
                activeSession.send(SessionMessage.UPDATE_ROUND);
                handleResetStrikersPosition();
                handleResetPuckPosition();
                activeSession.send(SessionMessage.START_COUNT_DOWN);
            }
        }, 3000);

        return () => { clearTimeout(timeout); }
    };

    return (
        <Physics timeStep={PHYSIC_TIME_STEP}>
            <HockeyTable surfaceRef={tableSurfaceRef}/>
            <Striker ref={redStrikerRef} name={RED_STRIKER_NAME} position={RED_STRIKER_INITIAL_POSITION} color={"red"} />
            <Striker ref={blueStrikerRef} name={BLUE_STRIKER_NAME} position={BLUE_STRIKER_INITIAL_POSITION} color={"blue"} />
            <Puck ref={puckRef} type={controlledStriker === "red" ? "dynamic" : "kinematicPosition"} onCollisionEnter={handleCollisionEnter}/>
        </Physics>
    );
}