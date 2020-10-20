import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core/";
import { logout } from "../Services/Services";
import { Link } from "react-router-dom";
import { isAutheticated } from "../auth";
import { makeStyles } from "@material-ui/core/styles";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
const useStyles = makeStyles((theme) => ({
  name: {
    display: "block",
    margin: "0 auto",
    fontWeight: "700",
    fontSize: "1.5rem",
  },
  link: {
    textDecoration: "none",
    color: "black",
  },
}));
const Navbar = ({ history }) => {
  const classes = useStyles();
  const { userName } = isAutheticated();

  return (
    <AppBar>
      <Toolbar>
        <Typography variant="h4" className={classes.name}>
          Welcome {userName[0][1]}
        </Typography>
        <Button variant="contained" endIcon={<ExitToAppIcon />}>
          <Link
            className={classes.link}
            to="/login"
            onClick={() => {
              logout(() => console.log("logout successful!"));
            }}
          >
            Logout
          </Link>
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
