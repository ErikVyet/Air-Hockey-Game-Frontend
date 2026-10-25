import { useGLTF } from "@react-three/drei";
import { ModelPath } from "../enums/ModelPath";

export default function useModel(path: ModelPath) {
    const { nodes, materials } = useGLTF(path);
    return { nodes, materials };
}

useGLTF.preload(ModelPath.AIR_HOCKEY_ITEMS);