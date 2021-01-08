import React, { useEffect, useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { isAutheticated } from "../../auth";
import {
  Lock as LockIcon,
  Settings as SettingsIcon,
  User as UserIcon,
  UserPlus as UserPlusIcon,
  FileText,
  Edit,
  Trello,
  DollarSign,
  Info,
  BarChart,
  Video,
} from "react-feather";
import NavItem from "./NavItem";
const user = {
  avatar: "/static/images/avatars/avatar_6.png",
  jobTitle: "Admin",
  name: "Ram Kishore",
};

const items = [
  {
    href: "/customer-data",
    icon: FileText,
    title: "Customers Data",
  },
  {
    href: "/dashboard",
    icon: DollarSign,
    title: "Financial Dashboard",
  },
  {
    href: "/add-fields",
    icon: Edit,
    title: "Add Fields",
  },
  {
    href: "/attendance",
    icon: Trello,
    title: "Attendance",
  },
  {
    href: "/scheduler",
    icon: UserIcon,
    title: "Timetable",
  },
  {
    href: "/meeting-scheduler",
    icon: SettingsIcon,
    title: "Scheduler",
  },
  {
    href: "/reset/password",
    icon: LockIcon,
    title: "Reset Password",
  },
  {
    href: "/zoom-dashboard",
    icon: Video,
    title: "Zoom Dashboard",
  },
];

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256,
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: "calc(100% - 64px)",
  },
  avatar: {
    cursor: "pointer",
    width: 64,
    height: 64,
    backgroundColor: "#f39c12",
  },
  name: {
    fontWeight: "bold",
    marginTop: "10px",
    textTransform: "capitalize",
  },
  iconName: {
    fontWeight: "bold",
    textTransform: "capitalize",
    fontSize: 20,
    color: "white",
  },
}));

const NavBar = ({ onMobileClose, openMobile }) => {
  const classes = useStyles();
  const location = useLocation();
  const [userDetails, setUserDetails] = useState();
  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname]);

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = () => {
    const data = isAutheticated();
    setUserDetails(data);
  };
  const content = (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
      className="backgroundimage"
    >
      <Box alignItems="center" display="flex" flexDirection="column" p={2}>
        <Avatar
          className={classes.avatar}
          component={RouterLink}
          to="/dashboard"
        >
          <Typography
            color="textSecondary"
            variant="body2"
            className={classes.iconName}
          >
            {userDetails && userDetails.username[0]}
          </Typography>
        </Avatar>
        <Typography className={classes.name} color="textPrimary" variant="h5">
          {userDetails && userDetails.username}
        </Typography>
        <Typography
          color="textSecondary"
          variant="body2"
          className={classes.name}
        >
          Admin
        </Typography>
      </Box>
      <Divider />
      <Box p={2}>
        <List>
          {items.map((item) => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
            />
          ))}
        </List>
      </Box>
      <Box flexGrow={1} />
    </Box>
  );

  return (
    <>
      <Drawer
        anchor="left"
        classes={{ paper: classes.mobileDrawer }}
        onClose={onMobileClose}
        open={openMobile}
        variant="temporary"
      >
        {content}
      </Drawer>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool,
};

NavBar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false,
};

export default NavBar;
