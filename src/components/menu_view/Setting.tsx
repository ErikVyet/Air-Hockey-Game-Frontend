import { Button, Stack, Typography } from "@mui/material";
import { FONT_FAMILY, TEXT_COLOR } from "../../constants/style";
import { grey } from "@mui/material/colors";
import { motion } from "motion/react";
import { useContext, type SyntheticEvent } from "react";
import { SettingContext } from "../../contexts/SettingContext";
import { MenuContext } from "../../contexts/MenuContext";
import { MenuAction } from "../../enums/MenuAction";
import { CustomSlider, CustomSwitch } from "../common/CustomInput";

export default function Setting() {
    const settingContext = useContext(SettingContext);
    if (!settingContext) return null;
    const { masterVolumn, setMasterVolumn, fps, setFps, fullScreen, setFullScreen, vrMode, setVrMode, arMode, setArMode } = settingContext;

    const menuContext = useContext(MenuContext);
    if (!menuContext) return null;
    const { setMenuAction } = menuContext;

    const handleMasterVolumnChange = (_event: Event, value: number | number[], _activeThumb: number) => setMasterVolumn(value as number);
    const handleMasterVolumnChangeCommitted = (_event: SyntheticEvent | Event, value: number | number[]) => localStorage.setItem("master-volumn", value.toString());
    const handleFpsChange = (_event: Event, value: number | number[], _activeThumb: number) => setFps(value as number);
    const handleFpsChangeCommitted = (_event: SyntheticEvent | Event, value: number | number[]) => localStorage.setItem("fps", value.toString());
    const handleFullScreenChange = () => setFullScreen(prev => !prev);
    const handleVrModeChange = () => setVrMode(prev => !prev);
    const handleArModeChange = () => setArMode(prev => !prev);
    const handleBackClick = () => setMenuAction(MenuAction.ORIGINAL);

    return (
        <Stack className="w-sm h-screen p-12 justify-center lg:place-self-start" spacing={5} component={motion.div} initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
            <Typography className={`${FONT_FAMILY} ${TEXT_COLOR} text-3xl! uppercase`}>Setting</Typography>
            <Stack className="w-full justify-center items-center" spacing={4}>
                <Stack className="w-full justify-center items-center" spacing={3}>
                    <CustomSlider value={masterVolumn} range={[0, 100]} color={"yellow"} label={"Master Volumn"} onChange={handleMasterVolumnChange} onChangeCommitted={handleMasterVolumnChangeCommitted}/>
                    <CustomSlider value={fps} range={[30, 120]} color={"yellow"} label={"Frame Rate"} onChange={handleFpsChange} onChangeCommitted={handleFpsChangeCommitted}/>
                    <CustomSwitch checked={fullScreen} color={"yellow"} label={"Fullscreen"} onChange={handleFullScreenChange}/>
                    <CustomSwitch checked={vrMode} color={"yellow"} label={"VR Mode"} onChange={handleVrModeChange}/>
                    <CustomSwitch checked={arMode} color={"yellow"} label={"AR Mode"} onChange={handleArModeChange}/>
                </Stack>
                <Button className={`w-fit! px-8! py-2! font-orbitron! text-lg! place-self-start bg-zinc-900! outline-3! outline-zinc-600! whitespace-nowrap!`} variant={"contained"} sx={{ boxShadow: `-6px 6px 0 ${grey[700]}` }} disableRipple onClick={handleBackClick}>Back</Button>
            </Stack>
        </Stack>
    );
}