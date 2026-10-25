import { ActiveCollisionTypes } from "@dimforge/rapier3d-compat";
import type { OutlinedInputProps, SnackbarProps } from "@mui/material";
import type { RigidBodyProps } from "@react-three/rapier";
import { PUCK_INITIAL_POSITION } from "./scene";

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
                "::-ms-reveal": { display: "none" },
                '::placeholder': { fontFamily: "Orbitron !important" }
            }
        },
        notchedOutline: {
            sx: {
                border: "none"
            }
        }
    },
    fullWidth: true
};

export const SNACKBAR_COMMON_PROPS: SnackbarProps = {
    autoHideDuration: 2000,
    anchorOrigin: {
        horizontal: "right",
        vertical: "bottom"
    },
    onClick: (event) => event.stopPropagation()
}

export const STRIKER_PROPERTIES: RigidBodyProps = {
    type: "kinematicVelocity",
    colliders: "hull",
    activeCollisionTypes: ActiveCollisionTypes.ALL,
    ccd: true
}

export const PUCK_PROPERTIES: RigidBodyProps = {
    position: PUCK_INITIAL_POSITION,
    colliders: "hull",
    activeCollisionTypes: ActiveCollisionTypes.ALL,
    ccd: true,
    friction: 0.05,
    restitution: 0.95,
    linearDamping: 0.01,
    enabledRotations: [false, true, false]
}