import { Alert, Box, FormControl, IconButton, OutlinedInput, Slider, Snackbar, Stack, Tooltip, Typography, type OutlinedInputProps, type SliderProps } from "@mui/material";
import { useMemo, useState, type ChangeEvent, type SyntheticEvent } from "react";
import { FONT_FAMILY, INPUT_BG_COLOR, TEXT_COLOR } from "../../constants/style";
import { OUTLINED_INPUT_COMMON_PROPS, SNACKBAR_COMMON_PROPS } from "../../constants/props";
import { COMMON_INPUT_VALIDATOR, PASSWORD_INPUT_VALIDATOR } from "../../validators/input";
import { ContentCopy, HelpOutlineOutlined } from "@mui/icons-material";
import { blue, green, yellow } from "@mui/material/colors";
import { motion } from "framer-motion";

type CustomInputProps = {
    color: "blue" | "green" | "yellow",
    label?: string,
}

/* ------------------------------------------------------------------------------------------------------------------------------- */

type CustomTextFieldProps = {
    type: "text" | "password",
    value: string,
    placeholder?: string,
    limit?: number,
    tooltip?: string,
    copiable?: boolean,
    disableBoxShadow?: boolean,
    disableOutline?: boolean,
    onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

export function CustomTextField({ type, color, value, placeholder, limit = Infinity, label, tooltip, copiable = false, disableBoxShadow = false, disableOutline = false, onChange }: CustomInputProps & CustomTextFieldProps) {
    const [length, setLength] = useState(value.length);
    const [openAlert, setOpenAlert] = useState(false);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const outlineStyle = useMemo(() => {
        if (disableOutline) {
            return "";
        }
        else {
            switch (color) {
                case ("blue"): return "outline-3! outline-blue-500!";
                case ("green"): return "outline-3! outline-green-500!";
                case ("yellow"): return "outline-3! outline-yellow-500!";
            }
        }
    }, [color, disableOutline]);

    const boxShadow = useMemo(() => {
        if (disableBoxShadow) {
            return "none";
        }
        else {
            switch (color) {
                case ("blue"): return `-6px 6px 0 ${blue[300]} !important`;
                case ("green"): return `-6px 6px 0 ${green[300]} !important`;
                case ("yellow"): return `-6px 6px 0 ${yellow[300]} !important`;
            }
        }
    }, [color, disableBoxShadow]);

    const props: OutlinedInputProps = useMemo(() => {
        return { ...OUTLINED_INPUT_COMMON_PROPS, sx: { boxShadow } };
    }, [boxShadow]);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.currentTarget.value;
        const validator = type === "text" ? COMMON_INPUT_VALIDATOR : PASSWORD_INPUT_VALIDATOR;
        if (validator.test(value) && value.length <= limit) {
            setLength(value.length);
            onChange(event);
        }
    };
    const handleCopyInput = () => {
        navigator.clipboard.writeText(value).then(() => {
            handleOpenAlert(false, "Successfully copy password");
        }).catch(() => {
            handleOpenAlert(true, "Failed to copy password");
        });
    };
    const handleOpenAlert = (error: boolean, message: string) => {
        setIsError(error);
        setMessage(message);
        setOpenAlert(true);
    };
    const handleCloseAlert = () => setOpenAlert(false);

    return (
        <>
            <FormControl className="justify-center gap-3" fullWidth>
                {label && (
                    <Stack className="items-center" direction={"row"} spacing={1}>
                        <Typography className={`${FONT_FAMILY} ${TEXT_COLOR} font-semibold! text-xl!`}>{label}</Typography>
                        {copiable && (
                            <IconButton size={"small"} disableRipple onClick={handleCopyInput}>
                                <ContentCopy className={`size-4! ${TEXT_COLOR}`}/>
                            </IconButton>
                        )}
                    </Stack>
                )}
                <Stack className="items-center" direction={"row"} spacing={2.5}>
                    <Box className="relative w-full">
                        <OutlinedInput className={`${INPUT_BG_COLOR} ${type === "text" && FONT_FAMILY} ${TEXT_COLOR} ${outlineStyle} rounded-md! ${limit !== Infinity && 'pr-18!'}`} type={type} value={value} placeholder={placeholder} {...props} onChange={handleInputChange} />
                        {limit !== Infinity && (
                            <Typography className={`absolute top-1/2 right-3 -translate-y-1/2 ${FONT_FAMILY} text-sm! text-zinc-500`}>{length} / {limit}</Typography>
                        )}
                    </Box>
                    {tooltip && (
                        <Tooltip title={tooltip} placement={"top"} arrow>
                            <HelpOutlineOutlined className="size-5! text-zinc-500!" />
                        </Tooltip>
                    )}
                </Stack>
            </FormControl>
            <Snackbar open={openAlert} {...SNACKBAR_COMMON_PROPS} onClose={handleCloseAlert}>
                <Alert severity={isError ? "error" : "success"} variant={"filled"} onClose={handleCloseAlert}>{message}</Alert>
            </Snackbar>
        </>
    );
}

/* ------------------------------------------------------------------------------------------------------------------------------- */

type CustomSliderProps = {
    value: number,
    range: [min: number, max: number],
    onChange: (event: Event, value: number | number[], activeThumb: number) => void,
    onChangeCommitted?: (event: SyntheticEvent | Event, value: number | number[]) => void
}

export function CustomSlider({ value, range, color, label, onChange, onChangeCommitted }: CustomInputProps & CustomSliderProps) {
    const rail = useMemo(() => {
        switch (color) {
            case ("blue"): return { height: "8px", color: blue[500] };
            case ("green"): return { height: "8px", color: green[500] };
            case ("yellow"): return { height: "8px", color: yellow[500] };
        }
    }, [color]);
    
    const track = useMemo(() => {
        switch (color) {
            case ("blue"): return { height: "8px", color: blue[500] };
            case ("green"): return { height: "8px", color: green[500] };
            case ("yellow"): return { height: "8px", color: yellow[500] };
        }
    }, [color]);

    const thumb = useMemo(() => {
        switch (color) {
            case ("blue"): return { className: `w-3! h-7! rounded-sm! bg-blue-500!` };
            case ("green"): return { className: `w-3! h-7! rounded-sm! bg-green-500!` };
            case ("yellow"): return { className: `w-3! h-7! rounded-sm! bg-yellow-500!` };
        }
    }, [color]);
    
    const props: SliderProps = useMemo(() => {
        return { 
            sx: {
                '& .MuiSlider-rail': rail,
                '& .MuiSlider-track': track
            },
            slotProps: { 
                thumb: { ...thumb, sx: {
                    '&:hover': {
                        boxShadow: 'none',
                    },
                    '&.Mui-active': {
                        boxShadow: 'none',
                    },
                    '&.Mui-focusVisible': {
                        boxShadow: 'none',
                    }
                }} 
            }
        };
    }, [track]);

    return (
        <FormControl className="justify-center gap-3" fullWidth>
            {label && (
                <Typography className={`${FONT_FAMILY} ${TEXT_COLOR} font-semibold! text-xl!`}>{label}</Typography>
            )}
            <Stack className="w-full justify-between items-center" direction={"row"} spacing={2}>
                <Slider min={range[0]} max={range[1]} value={value} {...props} onChange={onChange} onChangeCommitted={onChangeCommitted}/>
                <Typography className={`w-14! text-center ${FONT_FAMILY} ${TEXT_COLOR} font-semibold! text-xl!`}>{value}</Typography>
            </Stack>
        </FormControl>
    );
}

/* ------------------------------------------------------------------------------------------------------------------------------- */

type CustomSwitchProps = {
    checked: boolean,
    onText?: string,
    offText?: string,
    disableOutline?: boolean,
    disableBoxShadow?: boolean,
    onChange: () => void
}

export function CustomSwitch({ checked, color, label, onText = "On", offText = "Off", disableOutline = false, disableBoxShadow = false, onChange }: CustomInputProps & CustomSwitchProps) {
    const bgColor = useMemo(() => {
        switch (color) {
            case ("blue"): return "bg-blue-500";
            case ("green"): return "bg-green-500";
            case ("yellow"): return "bg-yellow-500";
        }
    }, [color]);

    const outlineColor = useMemo(() => {
        switch (color) {
            case ("blue"): return "outline-blue-500";
            case ("green"): return "outline-green-500";
            case ("yellow"): return "outline-yellow-500";
        }
    }, [color]);

    const boxShadowColor = useMemo(() => {
        switch (color) {
            case ("blue"): return blue[300];
            case ("green"): return green[300];
            case ("yellow"): return yellow[500];
        }
    }, [color]);

    return (
        <FormControl className="flex-row! justify-between items-center gap-3" fullWidth>
            {label && (
                <Typography className={`${FONT_FAMILY} ${TEXT_COLOR} font-semibold! text-xl!`}>{label}</Typography>
            )}
            <Stack className={`relative w-30 h-full ${INPUT_BG_COLOR} ${!disableOutline && 'outline-3'} ${outlineColor} rounded-xs cursor-pointer overflow-hidden`} direction={"row"} sx={{ boxShadow: disableBoxShadow ? "none" : `-5.5px 5.5px 0 ${boxShadowColor}` }} onClick={() => onChange()}>
                <Typography className={`flex-1 z-10 ${FONT_FAMILY} ${TEXT_COLOR} text-center place-content-center`}>{onText}</Typography>
                <Typography className={`flex-1 z-10 ${FONT_FAMILY} ${TEXT_COLOR} text-center place-content-center`}>{offText}</Typography>
                <Box className={`absolute top-0 left-0 w-1/2 h-full ${bgColor}`} component={motion.div} initial={{ left: checked ? "0%" : "50%" }} animate={{ left: checked ? "0%" : "50%" }}/>
            </Stack>
        </FormControl>
    )
}