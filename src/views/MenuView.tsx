import { Button, Stack, Typography } from "@mui/material";
import { FONT_FAMILY, TEXT_COLOR } from "../constants/style";
import { blue, green, yellow } from "@mui/material/colors";
import { useContext } from "react";
import { MenuContext } from "../contexts/MenuContext";
import { MenuAction } from "../enums/MenuAction";
import { motion } from "motion/react";
import Hosting from "../components/menu_view/Hosting";
import { MENU_ACTION_BUTTON_ANIMATION_DELAY } from "../constants/props";

export default function MenuView() {
    const menuContext = useContext(MenuContext);
    if (!menuContext) return null;
    const { menuAction, setMenuAction } = menuContext;

    const handleHostingClick = () => setMenuAction(MenuAction.HOSTING);
    const handleJoiningClick = () => setMenuAction(MenuAction.JOINING);
    const handleSettingClick = () => setMenuAction(MenuAction.OTHER);

    const menuActionButtons = [
        { label: "Host", background: "bg-blue-500!", shadow: blue[300], action: handleHostingClick },
        { label: "Join", background: "bg-green-500!", shadow: green[300], action: handleJoiningClick },
        { label: "Setting", background: "bg-yellow-500!", shadow: yellow[300], action: handleSettingClick }
    ];

    return (
        menuAction === MenuAction.ORIGINAL ? (
            <Stack className="w-sm h-screen justify-center items-center lg:place-self-start" spacing={12}>
                <Typography className={`${FONT_FAMILY} ${TEXT_COLOR} text-4xl!`}>Air Hockey</Typography>
                <Stack spacing={4}>
                    {menuActionButtons.map((button, index) =>
                        <Button className={`px-10! py-2.5! font-orbitron! text-2xl! ${button.background}`} variant={"contained"} sx={{ boxShadow: `-6px 6px 0 ${button.shadow}` }} key={index} component={motion.button} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: MENU_ACTION_BUTTON_ANIMATION_DELAY * index }} disableRipple onClick={button.action}>{button.label}</Button>
                    )}
                </Stack>
            </Stack>
        ) : menuAction === MenuAction.HOSTING ? (
            <Hosting/>
        ) : menuAction === MenuAction.JOINING ? (
            <>
                123
            </>
        ) : (
            <>

            </>
        )
    );
}