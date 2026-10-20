import { Avatar, Box, Grid, IconButton, List, ListItem, Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { FONT_FAMILY, TEXT_COLOR } from "../../constants/style";
import { useContext, useEffect, useRef, useState, type ChangeEvent } from "react";
import { CustomTextField } from "./CustomInput";
import { Person, Send } from "@mui/icons-material";
import { SessionContext } from "../../contexts/SessionContext";
import { SessionMessage } from "../../enums/SessionMessage";
import type { IMessage } from "../../interfaces/IMessage";
import dayjs from "dayjs";

type ChatMessageProps = {
    sender: string,
    content: string,
    timestamp: number,
    isHost?: boolean,
    isSelf?: boolean,
}

export function ChatMessage({ sender, content, timestamp, isHost = false, isSelf = false }: ChatMessageProps) {
    return (
        <ListItem disableGutters>
            <Grid className="w-full" rowSpacing={1} container>
                <Grid size={1.3}></Grid>
                <Grid className="pl-3 pr-2" size={10.7}>
                    <Stack className="justify-between items-center" direction={"row"}>
                        <Stack className="items-center" direction={"row"} spacing={1}>
                            <Typography className={`max-w-18 text-sm! ${FONT_FAMILY} ${TEXT_COLOR} text-ellipsis overflow-hidden`}>{sender}</Typography>
                            {isHost && (<Typography className={`text-sm! ${FONT_FAMILY} text-green-500 font-semibold!`}>(Host)</Typography>)}
                            {isSelf && (<Typography className={`text-sm! ${FONT_FAMILY} text-blue-500 font-semibold!`}>(You)</Typography>)}
                        </Stack>
                        <Typography className={`text-xs! ${FONT_FAMILY} text-zinc-500`}>{dayjs(timestamp).format("HH : mm : ss")}</Typography>
                    </Stack>
                </Grid>
                <Grid size={1.3}>
                    <Avatar className="size-8! bg-zinc-800! border-2 border-zinc-600 place-self-center">
                        <Person className={`size-4.5! ${TEXT_COLOR}`} />
                    </Avatar>
                </Grid>
                <Grid className="pl-3 pr-2" size={10.7}>
                    <Box className="px-3 py-2 size-full bg-zinc-800 outline-2 outline-zinc-600 rounded-md">
                        <Typography className={`${FONT_FAMILY} ${TEXT_COLOR} text-sm! text-ellipsis overflow-hidden`}>{content}</Typography>
                    </Box>
                </Grid>
            </Grid>
        </ListItem>
    );
}

export default function ChatPanel() {
    const sessionContext = useContext(SessionContext);
    if (!sessionContext) return null;
    const { activeSession } = sessionContext;

    const messageListRef = useRef<HTMLUListElement>(null!);
    const textFieldRef = useRef<HTMLInputElement>(null!);
    const submitButtonRef = useRef<HTMLButtonElement>(null!);

    const [content, setContent] = useState("");
    const [messages, setMessages] = useState<IMessage[]>([]);

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            switch(event.key) {
                case ("t"): {
                    textFieldRef.current?.focus();
                    break;
                }
                case ("Enter"): {
                    submitButtonRef.current?.click();
                    textFieldRef.current?.blur();
                    break;
                }
                default: break;
            }
        };

        window.addEventListener("keypress", handleKeyPress);

        return () => {
            window.removeEventListener("keypress", handleKeyPress);
        };
    }, []);

    useEffect(() => {
        const messageList = messageListRef.current;
        if (!messageList) return;

        messageList.scrollTo({ top: messageList.scrollHeight, behavior: "smooth" });
    }, [messageListRef.current]);

    useEffect(() => {
        if (!activeSession) return;

        handleUpdateChat();

        activeSession.onStateChange(() => {
            // Update chat messages
            handleUpdateChat();
        });

        return () => { }
    }, [activeSession]);

    const handleUpdateChat = () => {
        setMessages(activeSession?.state?.messages ? [...activeSession?.state?.messages] : []);
    };
    const handleMessageSubmit = () => {
        if (content.trim() === "") return;

        activeSession?.send(SessionMessage.SEND_MESSAGE, content);
        setContent("");
        
        const timeout = setTimeout(() => {
            messageListRef.current?.scrollTo({ top: messageListRef.current?.scrollHeight ?? 0, behavior: "smooth" });
        }, 300);

        return () => { clearTimeout(timeout); }
    };
    const handleContentChange = (event: ChangeEvent<HTMLInputElement>) => {
        setContent(event.currentTarget.value);
    };

    return (
        <Box className="w-md h-full p-10 self-start">
            <Stack className="h-full p-6 items-center rounded-lg bg-zinc-900/70 outline-3 outline-zinc-800" spacing={1.5} sx={{ boxShadow: `10px 10px 0 ${grey[800]}` }}>
                <Typography className={`${TEXT_COLOR} ${FONT_FAMILY} font-semibold! text-xl! self-start`}>Chat</Typography>
                <List className="w-full flex-1 rounded-lg overflow-auto scrollbar-thin scrollbar-thumb-zinc-700" ref={messageListRef}>
                    {messages.map((message, index) =>
                        <ChatMessage sender={message.senderName} content={message.content} timestamp={message.timestamp} isHost={activeSession?.state?.hostSessionId === message.senderId} isSelf={activeSession?.sessionId === message.senderId} key={index}/>
                    )}
                </List>
                <Stack className="justify-between items-center" direction={"row"} spacing={3}>
                    <CustomTextField ref={textFieldRef} value={content} type={"text"} color={"zinc"} placeholder={"Enter message..."} limit={50} validation={"none"} disableBoxShadow onChange={handleContentChange} />
                    <IconButton className="bg-zinc-800! outline-2! outline-zinc-500!" ref={submitButtonRef} onClick={handleMessageSubmit}>
                        <Send className={`size-4! ${TEXT_COLOR}`} />
                    </IconButton>
                </Stack>
            </Stack>
        </Box>
    );
}