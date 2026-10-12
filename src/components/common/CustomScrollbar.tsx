import { Slider, type SliderProps } from "@mui/material"
import { useMemo } from "react"

type CustomScrollbarProps = {
    value: number,
    range?: [min: number, max: number],
    color: "blue" | "green" | "yellow",
    onChange?: (event: Event, value: number | number[], activeThumb: number) => void
}

export default function CustomScrollbar({ value, range = [0, 100], color, onChange }: CustomScrollbarProps) {
    const props: SliderProps = useMemo(() => {
        return {
            slotProps: {
                rail: {
                    className: `w-2! ${color === "blue" ? 'text-blue-500!' : color === "green" ? 'text-green-500!' : 'text-yellow-500!'}`
                },
                track: {
                    className: `w-2! ${color === "blue" ? 'text-blue-500!' : color === "green" ? 'text-green-500!' : 'text-yellow-500!'}`
                },
                thumb: {
                    className: `w-6.5! h-2.5! rounded-xs! ${color === "blue" ? 'text-blue-500!' : color === "green" ? 'text-green-500!' : 'text-yellow-500!'}`,
                    sx: {
                        '&:hover': {
                            boxShadow: 'none',
                        },
                        '&.Mui-active': {
                            boxShadow: 'none',
                        },
                        '&.Mui-focusVisible': {
                            boxShadow: 'none',
                        }
                    }
                }
            },
            min: range[0],
            max: range[1],
            orientation: "vertical",
            onChange
        };
    }, [color, range, onChange]);

    return (
        <Slider className="rotate-180!" value={value} {...props}/>
    )
}