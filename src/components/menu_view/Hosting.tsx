import { Button, Stack, Typography } from "@mui/material";
import { FONT_FAMILY, TEXT_COLOR } from "../../constants/style";
import { useContext, useState, type ChangeEvent } from "react";
import { CustomSlider, CustomTextField } from "../common/CustomInput";
import { blue, grey } from "@mui/material/colors";
import { motion } from "motion/react";
import { CAMERA_TRANSITION_DURATION } from "../../constants/scene";
import { MenuContext } from "../../contexts/MenuContext";
import { MenuAction } from "../../enums/MenuAction";

export default function Hosting() {
    const menuContext = useContext(MenuContext);
    if (!menuContext) return null;
    const { setMenuAction } = menuContext;

    const [sessionName, setSessionName] = useState("");
    const [spectators, setSpectators] = useState(0);
    const [password, setPassword] = useState("");

    const handleSessionNameChange = (event: ChangeEvent<HTMLInputElement>) => setSessionName(event.currentTarget.value);
    const handleSpectatorsChange = (_event: Event, value: number | number[], _activeThumb: number) => setSpectators(value as number);
    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => setPassword(event.currentTarget.value);
    const handleBackClick = () => setMenuAction(MenuAction.ORIGINAL);

    return (
        <Stack className="w-sm h-screen p-12 justify-center lg:place-self-start" spacing={5} component={motion.div} initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: CAMERA_TRANSITION_DURATION }}>
            <Typography className={`${FONT_FAMILY} ${TEXT_COLOR} text-3xl! uppercase`}>Hosting</Typography>
            <Stack className="w-full justify-center items-center" spacing={4}>
                <Stack className="w-full justify-center items-center" spacing={3}>
                    <CustomTextField type={"text"} color={"blue"} value={sessionName} limit={20} label={"Session Name"} onChange={handleSessionNameChange}/>
                    <CustomSlider color={"blue"} range={[0, 4]} value={spectators} label={"Spectators"} onChange={handleSpectatorsChange}/>
                    <CustomTextField type={"password"} color={"blue"} value={password} limit={20} label={"Password"} tooltip={"Leave empty if everyone can join"} copiable onChange={handlePasswordChange}/>
                </Stack>
                <Stack className="w-full justify-center" spacing={3}>
                    <Button className={`px-10! py-2.5! font-orbitron! text-xl! bg-blue-500! whitespace-nowrap!`} variant={"contained"} sx={{ boxShadow: `-6px 6px 0 ${blue[300]}` }} disableRipple fullWidth>Start Session</Button>
                    <Button className={`w-fit! px-8! py-2! font-orbitron! text-lg! bg-zinc-900! outline-3! outline-zinc-600! whitespace-nowrap!`} variant={"contained"} sx={{ boxShadow: `-6px 6px 0 ${grey[700]}` }} disableRipple onClick={handleBackClick}>Back</Button>
                </Stack>
            </Stack>
        </Stack>
    );
}