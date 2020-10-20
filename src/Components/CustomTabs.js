import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import MaterialTableAddFields from "./MaterialTableAddFields";
import { getData } from "../Services/Services";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "block",
    margin: "0 auto",
    width: "80%",
    backgroundColor: theme.palette.background.paper,
  },
}));

const CustomTabs = () => {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [lookup, setLookup] = useState({});

  const tabs = [
    "Class",
    "Time Zone",
    "Class Status",
    "Currency",
    "Status",
    "Country",
  ];

  const status = [
    "classesStatus",
    "timeZoneStatus",
    "status",
    "currencyStatus",
    "",
    "countryStatus",
  ];

  const id = [
    "classId",
    "timeZoneId",
    "classStatusId",
    "currencyId",
    "",
    "countryId"
  ]

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    getData("Status").then((data) => {
      data.data.result.forEach((data) => {
        setLookup((prev) => {
          return { ...prev, [data.statusId]: data.statusName };
        });
      });
    });
  }, [value]);

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs"
        >
          {tabs.map((item, index) => {
            return <Tab label={item} {...a11yProps(index)} key={index} />;
          })}
        </Tabs>
      </AppBar>
      {tabs.map((item, index) => (
        <TabPanel value={value} key={index} index={index}>
          <MaterialTableAddFields
            name={item}
            status={status[index]}
            lookup={lookup}
            id={id[index]}
          />
        </TabPanel>
      ))}
    </div>
  );
};

export default CustomTabs;
