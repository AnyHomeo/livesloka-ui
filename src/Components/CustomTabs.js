import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
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
    width: "90vw",
    backgroundColor: theme.palette.background.paper,
  },
}));

const CustomTabs = () => {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [lookup, setLookup] = useState({});
  const [categoryLookup, setCategoryLookup] = useState({});

  const tabs = [
    "Class",
    "Time Zone",
    "Subject",
    "Zoom Account",
    "Class Status",
    "Currency",
    "Status",
    "Country",
    "Teacher",
    "Agent",
    "Category",
  ];

  const status = [
    "classesStatus",
    "timeZoneStatus",
    "",
    "",
    "status",
    "currencyStatus",
    "",
    "countryStatus",
    "TeacherStatus",
    "AgentStatus",
    "categoryStatus",
  ];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    getData("Status").then((data) => {
      let dummyLookup = {};
      data.data.result.forEach((data) => {
        dummyLookup[data.statusId] = data.statusName;
      });
      setLookup(dummyLookup);
    });
    if (value === 8) {
      getData("Category").then((data) => {
        let dummyLookup = {};
        data.data.result.forEach((data) => {
          dummyLookup[data.id] = data.categoryName;
        });
        setCategoryLookup(dummyLookup);
      });
    }
  }, [value]);

  return (
    <div className={classes.root}>
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
      {tabs.map((item, index) => (
        <TabPanel value={value} key={index} index={index}>
          <MaterialTableAddFields
            name={item}
            status={status[index]}
            lookup={lookup}
            categoryLookup={categoryLookup}
          />
        </TabPanel>
      ))}
    </div>
  );
};

export default CustomTabs;
