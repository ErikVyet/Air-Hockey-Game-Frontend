import { ActiveCollisionTypes } from "@dimforge/rapier3d-compat";
// import { Box, Stack } from "@mui/material";
import { purple } from "@mui/material/colors";
// import { Html } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useMemo, type Ref } from "react";
import { ExtrudeGeometry, Mesh, Path, Shape, type ExtrudeGeometryOptions } from "three";
import { BLUE_GOAL, RED_GOAL } from "../../constants/scene";

type HockeyTableSurfaceProps = {
    ref?: Ref<Mesh>
}

function HockeyTableSurface({ ref }: HockeyTableSurfaceProps) {
    return (
        <mesh ref={ref}>
            <boxGeometry args={[1, 0.1, 2]} />
            <meshStandardMaterial color={"white"} />
            {/* <Html className="w-66.75 h-133.5 select-none pointer-events-none" position={[0, 0.05001, 0]} rotation={[Math.PI / 2, 0, 0]} distanceFactor={1.5} wrapperClass={"table-surface"} occlude={"blending"} transform>
                <Stack className="size-full bg-zinc-200 justify-center items-center gap-15 rounded-4xl">
                    <Stack className="gap-20" direction={"row"}>
                        <Box className="size-15 border-2 border-zinc-900 rounded-full" />
                        <Box className="size-15 border-2 border-zinc-900 rounded-full" />
                    </Stack>
                    <Stack className="relative w-full h-50 justify-between items-center">
                        <Box className="w-full h-1 bg-blue-700/80" />
                        <Box className="w-full h-1 bg-zinc-900" />
                        <Box className="absolute top-1/2 left-1/2 size-30 place-content-center place-items-center rounded-full -translate-1/2 border-2 border-zinc-900 bg-zinc-200">
                            <Box className="size-4 rounded-full bg-red-800" />
                        </Box>
                        <Box className="w-full h-1 bg-blue-700/80" />
                    </Stack>
                    <Stack className="gap-20" direction={"row"}>
                        <Box className="size-15 border-2 border-zinc-900 rounded-full" />
                        <Box className="size-15 border-2 border-zinc-900 rounded-full" />
                    </Stack>
                </Stack>
            </Html> */}
        </mesh>
    );
}

function HockeyTableWall({ surfaceWidth = 1, surfaceLength = 2, wallThickness = 0.1, wallHeight = 0.2, cornerRadius = 0.15, goalWidth = 0.45 }) {
    const { geometry } = useMemo(() => {
        const shape = new Shape();

        // Outer boundary math
        const outerW = surfaceWidth / 2 + wallThickness;
        const outerL = surfaceLength / 2 + wallThickness;
        const outerR = cornerRadius + wallThickness;

        // Inner playfield boundary math
        const innerW = surfaceWidth / 2;
        const innerL = surfaceLength / 2;
        const innerR = cornerRadius;
        const halfGoal = goalWidth / 2;

        // --- Outer Boundary (Clockwise) ---
        shape.moveTo(-outerW + outerR, -outerL);
        shape.lineTo(outerW - outerR, -outerL);
        shape.absarc(outerW - outerR, -outerL + outerR, outerR, -Math.PI / 2, 0, false);
        shape.lineTo(outerW, outerL - outerR);
        shape.absarc(outerW - outerR, outerL - outerR, outerR, 0, Math.PI / 2, false);
        shape.lineTo(-outerW + outerR, outerL);
        shape.absarc(-outerW + outerR, outerL - outerR, outerR, Math.PI / 2, Math.PI, false);
        shape.lineTo(-outerW, -outerL + outerR);
        shape.absarc(-outerW + outerR, -outerL + outerR, outerR, Math.PI, -Math.PI / 2, false);

        // --- Inner Boundary Cutout with Goal Openings (Counter-Clockwise) ---
        const hole = new Path();

        // Bottom Wall (-Z) with Goal Gap
        hole.moveTo(-halfGoal, -innerL);
        hole.lineTo(-innerW + innerR, -innerL);
        hole.absarc(-innerW + innerR, -innerL + innerR, innerR, -Math.PI / 2, Math.PI, true);

        // Left Wall (-X)
        hole.lineTo(-innerW, innerL - innerR);
        hole.absarc(-innerW + innerR, innerL - innerR, innerR, Math.PI, Math.PI / 2, true);

        // Top Wall (+Z) with Goal Gap
        hole.lineTo(-halfGoal, innerL);
        hole.lineTo(-halfGoal, innerL + wallThickness); // Cut through top goal
        hole.lineTo(halfGoal, innerL + wallThickness);
        hole.lineTo(halfGoal, innerL);
        hole.lineTo(innerW - innerR, innerL);
        hole.absarc(innerW - innerR, innerL - innerR, innerR, Math.PI / 2, 0, true);

        // Right Wall (+X)
        hole.lineTo(innerW, -innerL + innerR);
        hole.absarc(innerW - innerR, -innerL + innerR, innerR, 0, -Math.PI / 2, true);

        // Complete Bottom Goal Cutout
        hole.lineTo(halfGoal, -innerL);
        hole.lineTo(halfGoal, -innerL - wallThickness); // Cut through bottom goal
        hole.lineTo(-halfGoal, -innerL - wallThickness);
        hole.lineTo(-halfGoal, -innerL);

        shape.holes.push(hole);

        const extrudeSettings: ExtrudeGeometryOptions = {
            depth: wallHeight,
            bevelEnabled: true,
            bevelThickness: 0.02,
            bevelSize: 0.02,
            bevelSegments: 2,
            curveSegments: 24,
        };

        const geo = new ExtrudeGeometry(shape, extrudeSettings);
        return { geometry: geo };
    }, [surfaceWidth, surfaceLength, wallThickness, wallHeight, cornerRadius, goalWidth]);

    return (
        <group>
            <mesh position={[0, wallHeight - 0.026, 1.035]}>
                <boxGeometry args={[goalWidth, wallHeight - 0.17, wallThickness]}/>
                <meshStandardMaterial color={"white"} roughness={0.1} metalness={0.2}/>
            </mesh>
            <mesh geometry={geometry} position={[0, -0.031, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
                <meshStandardMaterial color={purple.A700} roughness={0.1} metalness={0.2}/>
            </mesh>
            <mesh position={[0, wallHeight - 0.026, -1.035]}>
                <boxGeometry args={[goalWidth, wallHeight - 0.17, wallThickness]}/>
                <meshStandardMaterial color={"white"} roughness={0.1} metalness={0.2}/>
            </mesh>
        </group>
    );
}

type HockeyTableProps = {
    surfaceRef?: Ref<Mesh>
}

export default function HockeyTable({ surfaceRef }: HockeyTableProps) {
    return (
        <group position={[0, -0.082, 0]}>
            <RigidBody type={"fixed"} colliders={"trimesh"} activeCollisionTypes={ActiveCollisionTypes.ALL}>
                <group>
                    <HockeyTableSurface ref={surfaceRef}/>
                    <HockeyTableWall />
                </group>
            </RigidBody>
            <RigidBody name={BLUE_GOAL} type={"fixed"} colliders={"cuboid"} activeCollisionTypes={ActiveCollisionTypes.ALL}>
                <mesh position={[0, 0.1, -1.04]}>
                    <boxGeometry args={[0.41, 0.118, 0.08]}/>
                    <meshStandardMaterial color={"black"} opacity={1} transparent/>
                </mesh>
            </RigidBody>
            <RigidBody name={RED_GOAL} type={"fixed"} colliders={"cuboid"} activeCollisionTypes={ActiveCollisionTypes.ALL}>
                <mesh position={[0, 0.1, 1.04]}>
                    <boxGeometry args={[0.41, 0.118, 0.08]}/>
                    <meshStandardMaterial color={"black"} opacity={1} transparent/>
                </mesh>
            </RigidBody>
        </group>
    );
}