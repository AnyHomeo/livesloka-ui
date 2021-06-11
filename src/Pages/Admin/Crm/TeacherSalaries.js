import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Grid,
  FormControl,
  Radio,
  RadioGroup,
  FormLabel,
  CircularProgress,
  Select,
  InputLabel,
  MenuItem,
} from "@material-ui/core/";
import Axios from "axios";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";
import SaveIcon from "@material-ui/icons/Save";
import useDocumentTitle from "../../../Components/useDocumentTitle";

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

function TeacherSalaries() {
  useDocumentTitle("Teacher Salary");

  const classes = useStyles();

  const [teacherName, setTeacherName] = useState([]);
  const [teacherNameFullObject, setTeacherNameFullObject] = useState({
    id: "",
    TeacherName: "",
  });
  const [teacher, setInputTeacher] = useState("");

  useEffect(() => {
    getTeachers();
  }, []);

  const getTeachers = async () => {
    const teacherNames = await Axios.get(
      `${process.env.REACT_APP_API_KEY}/teacher?params=id,TeacherName`
    );
    setTeacherName(teacherNames.data.result);
  };

  const submitForm = async (e) => {
    // setLoading(true);
    e.preventDefault();
    const teacherAtt = await Axios.get(
      `${process.env.REACT_APP_API_KEY}/teacher/getTeacherAttendence/${teacherNameFullObject.id}`
    );
  };

  return (
    <>
      <div>
        <form onSubmit={submitForm}>
          <h1
            className="heading"
            style={{ fontSize: "20px", marginTop: "20px", textAlign: "center" }}
          >
            Get Salary Details
          </h1>
          <Grid container style={{ width: "100%" }}>
            <Grid item xs={false} md={4} />
            <Grid item xs={12} md={4}>
              {teacherName.length ? (
                <Autocomplete
                  style={{ width: "60%", margin: "0 auto" }}
                  options={teacherName}
                  value={teacherNameFullObject}
                  getOptionLabel={(option) => option.TeacherName}
                  onChange={(event, value) => {
                    value && setInputTeacher(value.id);
                    value && setTeacherNameFullObject(value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Teachers"
                      variant="outlined"
                      margin="normal"
                      required
                    />
                  )}
                />
              ) : (
                ""
              )}{" "}
            </Grid>
            <br></br>
            <br></br>
            <Grid item xs={12} md={4} />
            <Grid item xs={12} md={4} />
            <Grid
              item
              xs={12}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "10px",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                size="large"
                type="submit"
                className={classes.button}
                startIcon={<SaveIcon />}
              >
                get Data
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </>
  );
}

export default TeacherSalaries;
