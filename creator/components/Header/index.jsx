import { AppBar, Stack, Toolbar, Typography } from "@mui/material";

import { useColorScheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useState } from "react";
import { useEffect } from "react";

export default function Header({ title = "Tamaweb Creator" }) {
  return (
    <AppBar color="warning" position="static">
      <Toolbar variant="dense" sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6" color="inherit" component="div" noWrap>
          {title}
        </Typography>
        <ThemeToggle />
      </Toolbar>
    </AppBar>
  );
}

function ThemeToggle() {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <IconButton
      onClick={() => setMode(mode === "light" ? "dark" : "light")}
      color="inherit"
    >
      {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
    </IconButton>
  );
}
