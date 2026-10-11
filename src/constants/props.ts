import type { OutlinedInputProps, SnackbarProps } from "@mui/material";

export const MENU_ACTION_BUTTON_ANIMATION_DELAY = 0.4;

export const OUTLINED_INPUT_COMMON_PROPS: OutlinedInputProps = {
    size: "small",
    sx: {
        '& .MuiOutlinedInput-notchedOutline': {
            border: "none"
        }
    },
    slotProps: {
        input: {
            sx: { 
                "::-ms-reveal": { display: "none" }
            }
        }
    },
    fullWidth: true
};

export const SNACKBAR_COMMON_PROPS: SnackbarProps = {
    autoHideDuration: 3000,
    anchorOrigin: {
        horizontal: "right",
        vertical: "bottom"
    },
    onClick: (event) => event.stopPropagation()
}