import React, { useState } from "react";
import { Link, Link as RouterLink } from "react-router-dom";
import clsx from "clsx";
import PropTypes from "prop-types";
import {
  AppBar,
  Badge,
  Box,
  Hidden,
  IconButton,
  Toolbar,
  makeStyles,
  Typography,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import NotificationsIcon from "@material-ui/icons/NotificationsOutlined";
import InputIcon from "@material-ui/icons/Input";
// import Logo from 'src/components/Logo';
import { logout } from "../Services/Services";

const useStyles = makeStyles(() => ({
  root: {},
  avatar: {
    width: 60,
    height: 60,
  },
  name: {
    fontWeight: "bold",
    color: "white",
  },
}));

const TopBar = ({ className, onMobileNavOpen, ...rest }) => {
  const classes = useStyles();

  return (
    <AppBar className={clsx(classes.root, className)} elevation={0} {...rest}>
      <Toolbar>
        <IconButton color="inherit" onClick={onMobileNavOpen}>
          <MenuIcon />
        </IconButton>
        <Typography className={classes.name} color="textPrimary" variant="h4">
          Welcome Admin
        </Typography>
        <Box flexGrow={1} />
        <Link
          to="/login"
          onClick={() => logout(() => console.log("logout successful"))}
          style={{ color: "white" }}
        >
          <IconButton color="inherit">
            <InputIcon />
          </IconButton>
        </Link>
      </Toolbar>
    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
  onMobileNavOpen: PropTypes.func,
};

export default TopBar;
