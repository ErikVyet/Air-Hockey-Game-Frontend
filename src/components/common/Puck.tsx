import { RapierRigidBody, RigidBody, type CollisionEnterPayload, type RigidBodyTypeString } from "@react-three/rapier";
import type { Ref } from "react";
import { PUCK_PROPERTIES } from "../../constants/props";

type PuckProps = {
    type: RigidBodyTypeString,
    ref?: Ref<RapierRigidBody>,
    onCollisionEnter?: (payload: CollisionEnterPayload) => void
}

export default function Puck({ ref, type, onCollisionEnter }: PuckProps) {
    return (
        <RigidBody ref={ref} type={type} {...PUCK_PROPERTIES} onCollisionEnter={onCollisionEnter}>
            <mesh castShadow receiveShadow>
                <cylinderGeometry args={[0.05, 0.05, 0.02, 32]} />
                <meshStandardMaterial  color="#1a1a1a" roughness={0.3}metalness={0.8}/>
            </mesh>
        </RigidBody>
        // <mesh ref={ref} castShadow receiveShadow>
        //     <cylinderGeometry args={[0.05, 0.05, 0.02, 32]} />
        //     <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
        // </mesh>
    );
}