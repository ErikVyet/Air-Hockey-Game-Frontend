import { RapierRigidBody, RigidBody, type CollisionEnterPayload } from "@react-three/rapier";
import { ModelPath } from "../../enums/ModelPath";
import useModel from "../../hooks/useModel";
import { amber } from "@mui/material/colors";
import { PUCK_MESH_NAME } from "../../constants/model";
import type { Mesh } from "three";
import type { Ref } from "react";
import { PUCK_PROPERTIES } from "../../constants/props";

type PuckProps = {
    initialPosition: [x: number, y: number, z: number],
    ref?: Ref<RapierRigidBody>,
    onCollisionEnter?: (payload: CollisionEnterPayload) => void
}

export default function Puck({ initialPosition, ref, onCollisionEnter }: PuckProps) {
    const { nodes } = useModel(ModelPath.AIR_HOCKEY_PUCK);

    return (
        <RigidBody ref={ref} {...PUCK_PROPERTIES} onCollisionEnter={onCollisionEnter}>
            <mesh geometry={(nodes[PUCK_MESH_NAME] as Mesh).geometry} position={initialPosition} rotation={[Math.PI / 2, 0, 0]} scale={0.06} castShadow receiveShadow>
                <meshStandardMaterial color={amber[500]} roughness={0.5} metalness={0.4} />
            </mesh>
        </RigidBody>
    );
}