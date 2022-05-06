import { Fade, Icon, IconButton, Paper, Popper, PopperPlacementType, Typography } from "@mui/material";
import React, { useRef, useState } from "react";

type Props = {
    text: string;
    placement: PopperPlacementType;
}

export const Copy: React.FC<React.PropsWithChildren<Props>> = (props) => {
    let ref = useRef<HTMLButtonElement | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [timer, setTimer] = useState<NodeJS.Timeout>();

    const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        navigator.clipboard.writeText(props.text).then(() => {
            setOpen(true);
            // restart timer if a new one is requested
            if (timer) clearTimeout(timer);
            let id = setTimeout(() => {
                setOpen(false);
                setTimer(undefined);
            }, 2000);
            setTimer(id);
        }, () => {
            // do nothing on failure
        });
    }
    
    return <>
        <IconButton ref={ref} aria-label="copy" size="small" onClick={onClick}>
            <Icon>content_copy</Icon>
        </IconButton>
        <Popper open={open} anchorEl={ref.current} placement={props.placement} transition sx={{ zIndex: 1 }}>
            {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={350}>
                    <Paper>
                        <Typography sx={{ p: 1 }}>Copied!</Typography>
                    </Paper>
                </Fade>
            )}
        </Popper>
    </>
}