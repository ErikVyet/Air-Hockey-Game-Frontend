import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { grey } from "@mui/material/colors";
import { FONT_FAMILY, TEXT_COLOR } from "../../constants/style";
import { CustomTextField } from "./CustomInput";
import type { ChangeEvent } from "react";

type CustomDialogWithTextFieldProps = {
    open?: boolean,
    title: string,
    placeholder?: string,
    limit?: number,
    textFieldType?: "text" | "password"
    textFieldValue: string,
    textFieldOnChange: (event: ChangeEvent<HTMLInputElement>) => void,
    positiveLabel: string,
    negativeLabel: string,
    positiveAction: () => void,
    negativeAction: () => void,
    loading?: boolean,
}

export default function CustomDialogWithTextField({ open = false, title, placeholder, limit = 20, textFieldType = "text", textFieldValue, textFieldOnChange, positiveLabel, negativeLabel, positiveAction, negativeAction, loading = false }: CustomDialogWithTextFieldProps) {

    return (
        <Dialog open={open} slotProps={{ paper: { className: "px-2.5 bg-zinc-900! outline-3! outline-zinc-800!" } }} sx={{ boxShadow: `-6px 6px 0 ${grey[700]}` }}> 
            <DialogTitle className={`${FONT_FAMILY} ${TEXT_COLOR}`}>{title}</DialogTitle>
            <DialogContent className="py-2!">
                <CustomTextField value={textFieldValue} color={"zinc"} type={textFieldType} placeholder={placeholder} limit={limit} onChange={textFieldOnChange} />
            </DialogContent>
            <DialogActions className="py-4.5! gap-4">
                <Button className={`${FONT_FAMILY} ${TEXT_COLOR} normal-case! bg-zinc-900! outline-2! outline-zinc-600!`} variant={"contained"} size={"small"} sx={{ boxShadow: `-5px 5px 0 ${grey[800]}` }} loading={loading} disableRipple onClick={positiveAction}>{positiveLabel}</Button>
                <Button className={`${FONT_FAMILY} ${TEXT_COLOR} normal-case! bg-zinc-900! outline-2! outline-zinc-600!`} variant={"contained"} size={"small"} sx={{ boxShadow: `-5px 5px 0 ${grey[800]}` }} disabled={loading} disableRipple onClick={negativeAction}>{negativeLabel}</Button>
            </DialogActions>
        </Dialog>   
    );
}