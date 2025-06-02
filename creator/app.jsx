// import '@fontsource/roboto/300.css';
// import '@fontsource/roboto/400.css';
// import '@fontsource/roboto/500.css';
// import '@fontsource/roboto/700.css';
import "@fontsource/roboto";
import "./global.css";

import ReactDOM from "react-dom/client";

import Header from "./components/Header";
// import Modal from "./components/Modal"

import Home from "./pages/Home";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    {/* <ModalProvider> */}
    <Header title="Tamaweb Mod Package Creator" />
    <Home />
    {/* <Modal /> */}
    {/* </ModalProvider> */}
  </>
);
