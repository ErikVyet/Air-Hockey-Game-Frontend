import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { ModelPath } from "../../enums/ModelPath"
import useModel from "../../hooks/useModel"
import { Mesh } from "three";
import { STRIKER_MESH_NAME } from "../../constants/model";
import { blue, red } from "@mui/material/colors";
import type { Ref } from "react";
import { STRIKER_PROPERTIES } from "../../constants/props";

type StrikerProps = {
    color: "blue" | "red",
    position: [x: number, y: number, z: number],
    name?: string,
    ref?: Ref<RapierRigidBody>
}

export default function Striker({ color, position, name, ref }: StrikerProps) {
    const { nodes } = useModel(ModelPath.AIR_HOCKEY_ITEMS);

    return (
        <RigidBody ref={ref} name={name} {...STRIKER_PROPERTIES}>
            <mesh geometry={(nodes[STRIKER_MESH_NAME] as Mesh).geometry} scale={0.08} position={position} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
                <meshStandardMaterial color={color === "blue" ? blue[500] : red[500]}/>
            </mesh>
        </RigidBody>
    );
}