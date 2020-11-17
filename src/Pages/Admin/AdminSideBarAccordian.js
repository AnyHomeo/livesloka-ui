import React,{ useState } from 'react'
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
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
import BookmarkIcon from "@material-ui/icons/Bookmark";
import IconExpandLess from "@material-ui/icons/ExpandLess";
import IconExpandMore from "@material-ui/icons/ExpandMore";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    iconleft: {
        paddingLeft: "20px !important",
        fontSize: "20px",
    },
    links: {
        textDecoration: "none",
        "&:hover": {
            color: "blue",
        },
    },
}))


function AdminSideBarAccordian() {
    const [accordianOpen, setAccordianOpen] = useState(false)
    const classes = useStyles()
    const handleAccordianOpen = () => {
        setAccordianOpen(prev => !prev)
    }
    return (
        <>
          <ListItem
            button
            onClick={handleAccordianOpen}
          >
            <ListItemIcon>
              <BookmarkIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText primary="Meetings" />
            {accordianOpen ? <IconExpandLess /> : <IconExpandMore />}
          </ListItem>
          <Collapse in={accordianOpen} timeout="auto" unmountOnExit>
            <Divider />
            <List component="div" disablePadding>
              <ListItem button >
                <Link to="/admin-meeting" className={classes.links}>
                  <i
                    className={clsx("fas fa-calendar-alt customIcon", {
                      [classes.iconleft]: false,
                    })}
                  ></i>
                  <ListItemText inset primary="Schedule meeting" />
                </Link>
              </ListItem>
                            <ListItem button >
                <Link to="/admin-meeting" className={classes.links}>
                  <i
                    className={clsx("fas fa-calendar-alt customIcon", {
                      [classes.iconleft]: false,
                    })}
                  ></i>
                  <ListItemText inset primary="Schedule meeting" />
                </Link>
              </ListItem>
            </List>
          </Collapse>
        </>
    )
}

export default AdminSideBarAccordian
