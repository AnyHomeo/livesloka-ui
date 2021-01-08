import React, { useState, useEffect } from "react";
import { Button, TextField, Grid, CircularProgress } from "@material-ui/core/";
import SaveIcon from "@material-ui/icons/Save";
import { makeStyles } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
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

const status = [
  "TeacherStatus",
];

export default function TeacherDetails() {
  const classes = useStyles();
  //states
  const [loading, setLoading] = useState(false);
  const [teachername, setteacherName] = useState("");
  const [value, setValue] = useState(0);
  const [lookup, setLookup] = useState({});
  const [categoryLookup, setCategoryLookup] = useState({});
  const [item, setitem] = useState("Teacher");

  //UseEffect
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
  }, [value]);

  return (
    <>
      <MaterialTableAddFields
        name={item}
        status={status[0]}
        lookup={lookup}
        categoryLookup={categoryLookup}
      />
    </>
  );
}
