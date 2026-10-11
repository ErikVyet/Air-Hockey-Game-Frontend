import { Alert, Box, FormControl, IconButton, OutlinedInput, Slider, Snackbar, Stack, Tooltip, Typography, type OutlinedInputProps, type SliderProps } from "@mui/material";
import { useMemo, useState, type ChangeEvent } from "react";
import { FONT_FAMILY, INPUT_BG_COLOR, TEXT_COLOR } from "../../constants/style";
import { OUTLINED_INPUT_COMMON_PROPS, SNACKBAR_COMMON_PROPS } from "../../constants/props";
import { COMMON_INPUT_VALIDATOR, PASSWORD_INPUT_VALIDATOR } from "../../validators/input";
import { ContentCopy, HelpOutlineOutlined } from "@mui/icons-material";
import { blue, green, yellow } from "@mui/material/colors";

type CustomInputProps = {
    color: "blue" | "green" | "yellow",
    label?: string,
}

/* ------------------------------------------------------------------------------------------------------------------------------- */

type CustomTextFieldProps = {
    type: "text" | "password",
    value: string,
    limit?: number,
    tooltip?: string,
    copiable?: boolean,
    disableBoxShadow?: boolean,
    disableOutline?: boolean,
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void
}

export function CustomTextField({ type, color, value, limit = Infinity, label, tooltip, copiable = false, disableBoxShadow = false, disableOutline = false, onChange }: CustomInputProps & CustomTextFieldProps) {
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
                        <OutlinedInput className={`${INPUT_BG_COLOR} ${type === "text" && FONT_FAMILY} ${TEXT_COLOR} ${outlineStyle} rounded-md! ${limit !== Infinity && 'pr-18!'}`} type={type} value={value} {...props} onChange={handleInputChange} />
                        {limit !== Infinity && (
                            <Typography className={`absolute top-1/2 right-3 -translate-y-1/2 ${FONT_FAMILY} text-sm! text-zinc-500`}>{length} / {limit}</Typography>
                        )}
                    </Box>
                    {tooltip && (
                        <Tooltip title={tooltip} placement={"top"} arrow>
                            <HelpOutlineOutlined className="text-zinc-500!" />
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
    orientation: "horizontal" | "vertical",
    onChange?: (event: Event, value: number) => void
}

export function CustomSlider({ value, range, color, label, orientation, onChange }: CustomInputProps & CustomSliderProps) {
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
            slotProps: { thumb }
        };
    }, [track]);

    return (
        <FormControl className="justify-center gap-3" fullWidth>
            {label && (
                <Typography className={`${FONT_FAMILY} ${TEXT_COLOR} font-semibold! text-xl!`}>{label}</Typography>
            )}
            <Stack className="justify-between items-center" direction={"row"} spacing={3}>
                <Slider className="w-2xs!" min={range[0]} max={range[1]} value={value} orientation={orientation} {...props} onChange={onChange} />
                <Typography className={`w-5! text-center ${FONT_FAMILY} ${TEXT_COLOR} font-semibold! text-xl!`}>{value}</Typography>
            </Stack>
        </FormControl>
    )
}