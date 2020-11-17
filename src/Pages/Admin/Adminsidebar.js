import React, { useState } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import AdminSideBarAccordian from "./AdminSideBarAccordian";
import {
  Drawer,
  AppBar,
  Toolbar,
  List,
  CssBaseline,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@material-ui/core";

import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import "./Admin.scss";
import { Link } from "react-router-dom";
import { logout } from "../../Services/Services";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import IconExpandLess from "@material-ui/icons/ExpandLess";
import IconExpandMore from "@material-ui/icons/ExpandMore";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  iconleft: {
    paddingLeft: "20px !important",
    fontSize: "20px",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    textAlign: "center",
  },
  links: {
    textDecoration: "none",
    "&:hover": {
      color: "blue",
    },
  },
}));

const Adminsidebar = ({ history }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [meetingsOpen, setMeetingsOpen] = useState(false);
  const [teachersOpen, setTeachersOpen] = useState(false);
  const [studentsOpen, setStudentsOpen] = useState(false);
  const [crmOpen, setcrmOpen] = useState(false);
  const [invoicingOpen, setInvoicingOpen] = useState(false);

  const handleMeetingsOpen = () => {
    setMeetingsOpen(!meetingsOpen);
  };
  const handleTeachersOpen = () => {
    setTeachersOpen(!teachersOpen);
  };
  const handleStudentsOpen = () => {
    setStudentsOpen(!studentsOpen);
  };
  const handleCrmOpen = () => {
    setcrmOpen(!crmOpen);
  };
  const handleInvoicingOpen = () => {
    setInvoicingOpen(!invoicingOpen);
  };
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className="schedule-form">
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, {
                [classes.hide]: open,
              })}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              Live Kumon
            </Typography>
            <Link
              to="/login"
              style={{ marginLeft: "auto", textDecoration: "none" }}
              onClick={() => logout(() => console.log("logout successful"))}
            >
              <Button variant="contained" endIcon={<ExitToAppIcon />}>
                {" "}
                logout{" "}
              </Button>
            </Link>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            }),
          }}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </div>
          <Divider />
          {/* Meetings */}
          <ListItem button onClick={handleMeetingsOpen}>
            <ListItemIcon className={classes.menuItemIcon}>
              <BookmarkIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText primary="Meetings" />
            {meetingsOpen ? <IconExpandLess /> : <IconExpandMore />}
          </ListItem>
          <Collapse in={meetingsOpen} timeout="auto" unmountOnExit>
            <Divider />
            <List component="div" disablePadding>
              <ListItem button className={classes.menuItem}>
                <Link to="/admin-meeting" className={classes.links}>
                  <i
                    className={clsx("fas fa-calendar-alt customIcon", {
                      [classes.iconleft]: !open,
                    })}
                  ></i>
                  <ListItemText inset primary="Schedule meeting" />
                </Link>
              </ListItem>
            </List>
          </Collapse>
          {/* Teachers */}
          <ListItem
            button
            onClick={handleTeachersOpen}
            className={classes.menuItem}
          >
            <ListItemIcon className={classes.menuItemIcon}>
              <i className="fas fa-chalkboard-teacher icons"></i>
            </ListItemIcon>
            <ListItemText primary="Teachers" />
            {teachersOpen ? <IconExpandLess /> : <IconExpandMore />}
          </ListItem>
          <Collapse in={teachersOpen} timeout="auto" unmountOnExit>
            <Divider />
            <List component="div" disablePadding>
              <ListItem button className={classes.menuItem}>
                <Link to="/add-teacher" className={classes.links}>
                  <i
                    className={clsx("fas fa-chalkboard customIcon", {
                      [classes.iconleft]: !open,
                    })}
                  ></i>
                  <ListItemText inset primary="Add new teacher" />
                </Link>
              </ListItem>
            </List>
          </Collapse>

          {/* Students */}
          <ListItem
            button
            onClick={handleStudentsOpen}
            className={classes.menuItem}
          >
            <ListItemIcon className={classes.menuItemIcon}>
              <i className="fas fa-user-graduate icons"></i>
            </ListItemIcon>
            <ListItemText primary="Students" />
            {studentsOpen ? <IconExpandLess /> : <IconExpandMore />}
          </ListItem>
          <Collapse in={studentsOpen} timeout="auto" unmountOnExit>
            <Divider />
            <List component="div" disablePadding>
              <Link to="/add-student" className={classes.links}>
                <ListItem button className={classes.menuItem}>
                  <i
                    className={clsx("fas fa-user-graduate customIcon", {
                      [classes.iconleft]: !open,
                    })}
                  ></i>
                  <ListItemText inset primary="Add new Student" />
                </ListItem>
              </Link>
            </List>
          </Collapse>

          {/* CRM */}
          <ListItem button onClick={handleCrmOpen} className={classes.menuItem}>
            <ListItemIcon className={classes.menuItemIcon}>
              <i className="fas fa-business-time icons"></i>
            </ListItemIcon>
            <ListItemText primary="CRM" />
            {crmOpen ? <IconExpandLess /> : <IconExpandMore />}
          </ListItem>
          <Collapse in={crmOpen} timeout="auto" unmountOnExit>
            <Divider />
            <List component="div" disablePadding>
              <Link to="/customer-data" className={classes.links}>
                <ListItem button className={classes.menuItem}>
                  <i
                    className={clsx("fas fa-business-time customIcon", {
                      [classes.iconleft]: !open,
                    })}
                  ></i>
                  <ListItemText inset primary="Customers Data" />
                </ListItem>
              </Link>
              <Link to="/add-fields" className={classes.links}>
                <ListItem button className={classes.menuItem}>
                  <i
                    className={clsx("fas fa-text-height customIcon", {
                      [classes.iconleft]: !open,
                    })}
                  ></i>
                  <ListItemText inset primary="Add Fields" />
                </ListItem>
              </Link>
              <Link to="/attendance" className={classes.links}>
                <ListItem button className={classes.menuItem}>
                  <i
                    className={clsx("fas fa-clipboard customIcon", {
                      [classes.iconleft]: !open,
                    })}
                  ></i>
                  <ListItemText inset primary="Attendance" />
                </ListItem>
              </Link>
            </List>
          </Collapse>

          {/* Invoicing */}
          <ListItem
            button
            onClick={handleInvoicingOpen}
            className={classes.menuItem}
          >
            <ListItemIcon className={classes.menuItemIcon}>
              <i className="fas fa-file-invoice-dollar icons"></i>
            </ListItemIcon>
            <ListItemText primary="Invoicing" />
            {invoicingOpen ? <IconExpandLess /> : <IconExpandMore />}
          </ListItem>
          <Collapse in={invoicingOpen} timeout="auto" unmountOnExit>
            <Divider />
            <List component="div" disablePadding>
              <Link to="/manual-invoice" className={classes.links}>
                <ListItem button className={classes.menuItem}>
                  <i
                    className={clsx("fas fa-file-invoice customIcon", {
                      [classes.iconleft]: !open,
                    })}
                  ></i>
                  <ListItemText inset primary="Manual Invoice" />
                </ListItem>
              </Link>
              <Link to="/invoices" className={classes.links}>
                <ListItem button className={classes.menuItem}>
                  <i
                    className={clsx("fas fa-file-invoice customIcon", {
                      [classes.iconleft]: !open,
                    })}
                  ></i>
                  <ListItemText inset primary="Invoice Data" />
                </ListItem>
              </Link>
            </List>
          </Collapse>
          <AdminSideBarAccordian />
        </Drawer>
      </div>
      <main className={classes.content}>
        <div className={classes.toolbar} />
      </main>
    </div>
  );
};
export default Adminsidebar;
