import { Button, Stack, Typography } from "@mui/material";
import { FONT_FAMILY, TEXT_COLOR } from "../../constants/style";
import { grey } from "@mui/material/colors";
import { MenuContext } from "../../contexts/MenuContext";
import { useContext } from "react";
import { MenuAction } from "../../enums/MenuAction";
import { motion } from "motion/react";
import { CAMERA_TRANSITION_DURATION } from "../../constants/scene";
import SessionList from "./SessionList";

export default function Joining() {
    const menuContext = useContext(MenuContext);
    if (!menuContext) return null;
    const { setMenuAction } = menuContext;

    const handleBackClick = () => setMenuAction(MenuAction.ORIGINAL);

    return (
        <Stack className="sm:w-md md:w-xl h-screen p-12 justify-center items-center lg:items-start lg:place-self-start" spacing={5} component={motion.div} initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: CAMERA_TRANSITION_DURATION }}>
            <Typography className={`${FONT_FAMILY} ${TEXT_COLOR} text-3xl! uppercase`}>Joining</Typography>
            <Stack className="w-full justify-center items-center" spacing={4}>
                <SessionList/>
                <Button className={`w-fit! px-8! py-2! font-orbitron! text-lg! place-self-start bg-zinc-900! outline-3! outline-zinc-600! whitespace-nowrap!`} variant={"contained"} sx={{ boxShadow: `-6px 6px 0 ${grey[700]}` }} disableRipple onClick={handleBackClick}>Back</Button>
            </Stack>
        </Stack>
    );
}