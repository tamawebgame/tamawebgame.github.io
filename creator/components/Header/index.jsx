import React from 'react';
import { AppBar, Toolbar, Typography } from "@mui/material";

export default function Header({title = "Tamaweb Creator"}) {
    return (
        <AppBar color='warning' position="static">
            <Toolbar variant="dense">
                <Typography variant="h6" color="inherit" component="div" noWrap>
                    {title}
                </Typography>
            </Toolbar>
        </AppBar>
    )
}