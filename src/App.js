import "react-perfect-scrollbar/dist/css/styles.css";
import React from "react";
import { ThemeProvider } from "@material-ui/core";
import GlobalStyles from "./Components/GlobalStyles";
import theme from "./theme";
import Routes from "./Routes/Routes";
import { ConfirmProvider } from 'material-ui-confirm';
import "./main.css";
const App = () => {
  if (process.env.REACT_APP_STAGING === "PROD")
    console.log = function no_console() {};
  return (
    <ThemeProvider theme={theme}>
      <ConfirmProvider>
      <GlobalStyles />
      <Routes />
      </ConfirmProvider>
    </ThemeProvider>
  );
};

export default App;
