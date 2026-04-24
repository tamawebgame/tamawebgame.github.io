import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import "./global.css";
import "@fontsource/roboto";

import React from "react";
import ReactDOM from "react-dom/client";
import Header from "./components/Header";
import Home from "./pages/Home";
import { CssBaseline, Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material';
import theme from './theme';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <CssVarsProvider theme={theme}>
    <CssBaseline />
    <Header title="Create Tamaweb Resource Override Package" />
    <Home />
  </CssVarsProvider >
);
