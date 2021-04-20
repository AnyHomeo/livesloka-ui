import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { getData } from "../../../Services/Services";
import MaterialTableAddFields from "../../../Components/MaterialTableAddFields";

const useStyles = makeStyles((theme) => ({
  saveButton: {
    marginTop: "1.5rem",
    marginBottom: "2rem",
  },
  Startdate: {
    marginRight: "10px",
  },
  Starttime: {
    marginRight: "10px",
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
}));

const status = ["TeacherStatus"];

export default function TeacherDetails() {
  const classes = useStyles();
  //states
  const [lookup, setLookup] = useState({});
  const [categoryLookup, setCategoryLookup] = useState({});
  const [item, setitem] = useState("Teacher");

  useEffect(() => {
    getData("Status").then((data) => {
      let dummyLookup = {};
      data.data.result.forEach((data) => {
        dummyLookup[data.statusId] = data.statusName;
      });
      setLookup(dummyLookup);
    });
    getData("Category").then((data) => {
      let dummyLookup = {};
      data.data.result.forEach((data) => {
        dummyLookup[data.id] = data.categoryName;
      });
      setCategoryLookup(dummyLookup);
    });
  }, []);

  return (
    <div style={{ width: "95%", margin: "0 auto", marginTop: "20px" }}>
      <MaterialTableAddFields
        style={{ height: "100vh !important" }}
        name={item}
        status={status[0]}
        lookup={lookup}
        categoryLookup={categoryLookup}
      />
    </div>
  );
}
