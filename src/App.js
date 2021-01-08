import "react-perfect-scrollbar/dist/css/styles.css";
import React from "react";
import { ThemeProvider } from "@material-ui/core";
import GlobalStyles from "./Components/GlobalStyles";
import theme from "./theme";
import Routes from "./Routes/Routes";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Routes />
    </ThemeProvider>
  );
};

export default App;
