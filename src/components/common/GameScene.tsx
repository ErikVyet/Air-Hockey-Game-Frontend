import { Physics } from "@react-three/rapier";
import HockeyTable from "./HockeyTable";
import Striker from "./Striker";
import Puck from "./Puck";

export default function GameScene() {

    return (
        <Physics>
            <HockeyTable />
            <Striker position={[0, 0.083, -0.71]} color={"blue"} />
            <Striker position={[0, 0.083, 0.71]} color={"red"} />
            <Puck initialPosition={[0, 0.5, 0]} />
        </Physics>
    );
}