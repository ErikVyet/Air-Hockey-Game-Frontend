import { Box, List, ListItem, Typography } from "@mui/material";
import { FONT_FAMILY, TEXT_COLOR } from "../../constants/style";
import { grey } from "@mui/material/colors";

export default function GuidePanel() {
    const guides = [
        { key: "T", description: "Press T to enter chat" },
        { key: "Enter", description: "Press Enter to send messages to chat" },
        { key: "Esc", description: "Press Esc to open menu" }
    ];

    return (
        <Box className="w-sm h-full py-5 self-start">
            <List className="" disablePadding>
                {guides.map((guide, index) =>
                    <ListItem className="gap-4 mb-3" key={index} disableGutters>
                        <Box className="size-8 aspect-square place-content-center place-items-center bg-zinc-900 outline outline-zinc-800 rounded-xs" sx={{ boxShadow: `0px 3.5px 0 3px ${grey[800]}` }}>
                            <Typography className={`${TEXT_COLOR} font-sans! text-xs!`}>{guide.key}</Typography>
                        </Box>
                        <Typography className={`${FONT_FAMILY} ${TEXT_COLOR} text-sm!`}>{guide.description}</Typography>
                    </ListItem>
                )}
                <ListItem className="gap-4" disableGutters>
                    <Box className="relative w-8 h-10 place-items-center bg-zinc-900 outline outline-zinc-800 rounded-t-2xl rounded-b-xl" sx={{ boxShadow: `0px 3px 0 2px ${grey[800]}` }}>
                        <Box className="h-1/2 border-l border-zinc-800 rounded-full"/>
                        <Box className="w-full border-t border-zinc-800 rounded-full"/>
                        <Box className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/4 w-1 h-2 bg-zinc-600 rounded-lg"/>
                    </Box>
                    <Typography className={`${FONT_FAMILY} ${TEXT_COLOR} text-sm!`}>Move mouse to move your striker</Typography>
                </ListItem>
            </List>
        </Box>
    );
}