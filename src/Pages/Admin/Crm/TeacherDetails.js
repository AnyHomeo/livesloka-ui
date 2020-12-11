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
} from "@material-ui/core/";
import SaveIcon from "@material-ui/icons/Save";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import Axios from "axios";
import { getData } from "../../../Services/Services";

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

export default function TeacherDetails() {
  const classes = useStyles();

  //UseEffect
  useEffect(() => {
    getStatus();
    getCat();
    getClasses();
  }, []);

  //states
  const [loading, setLoading] = useState(false);
  const [teachername, setteacherName] = useState("");
  const [tdesc, setdesc] = useState("");
  const [mail, setmail] = useState("");
  const [status, setStatus] = useState();
  const [cat, setcat] = useState();
  const [statId, setId] = useState();
  const [catId, setcatId] = useState();
  const [subj, setSubj] = useState();
  const [classess, setClasses] = useState();
  // functions
  const getStatus = () => {
    getData("Status")
      .then((data) => {
        setStatus(data.data.result);
        console.log(status);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getCat = () => {
    getData("Category")
      .then((data) => {
        setcat(data.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getClasses = () => {
    getData("classes")
      .then((data) => {
        console.log(data.data);
        setClasses(data.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // submit function
  const submitForm = async (e) => {
    e.preventDefault();
    console.log(teachername);
    console.log(mail);

    setteacherName(" ");
    setmail(" ");
    setdesc(" ");
  };

  return (
    <>
      <form onSubmit={submitForm}>
        <h1
          className="heading"
          style={{ fontSize: "20px", marginTop: "20px", textAlign: "center" }}
        >
          Teacher-Details Page
        </h1>
        <Grid container style={{ width: "100%" }}>
          <Grid item xs={12} md={4} />

          <div
            style={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <TextField
                id="outlined-basic"
                label="Teacher Name"
                variant="outlined"
                fullWidth
                onChange={(e) => setteacherName(e.target.value)}
                value={teachername}
                style={{
                  maxWidth: "400px",
                  minWidth: "300px",
                  marginTop: "10px",
                }}
              />
              <br></br>

              <TextField
                fullWidth
                id="outlined-basic"
                label="Email/teacherId"
                variant="outlined"
                value={mail}
                onChange={(e) => setmail(e.target.value)}
                style={{
                  maxWidth: "400px",
                  minWidth: "300px",
                  marginTop: "10px",
                }}
              />
              <br></br>

              <TextField
                fullWidth
                id="outlined-basic"
                label="Sujects"
                variant="outlined"
                value={tdesc}
                onChange={(e) => setSubj(e.target.value)}
                style={{
                  maxWidth: "400px",
                  minWidth: "300px",
                  marginTop: "10px",
                }}
              />

              <br></br>
              <TextField
                fullWidth
                id="outlined-basic"
                label="Teacher Description"
                variant="outlined"
                value={tdesc}
                onChange={(e) => setdesc(e.target.value)}
                style={{
                  maxWidth: "400px",
                  minWidth: "300px",
                  marginTop: "10px",
                }}
              />

              <Autocomplete
                style={{ maxWidth: "400px", minWidth: "300px" }}
                options={classes}
                getOptionLabel={(option) => option.className}
                onChange={(event, value) => {
                  console.log(value);
                  value && setId(value.id);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label=" Classes"
                    variant="outlined"
                    margin="normal"
                  />
                )}
              />

              <Autocomplete
                style={{ maxWidth: "400px", minWidth: "300px" }}
                options={status}
                getOptionLabel={(option) => option.statusName}
                onChange={(event, value) => {
                  console.log(value);
                  value && setId(value.statusId);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label=" Status"
                    variant="outlined"
                    margin="normal"
                  />
                )}
              />

              <Autocomplete
                style={{ maxWidth: "400px", minWidth: "300px" }}
                options={cat}
                getOptionLabel={(option) => option.categoryName}
                onChange={(event, value) => {
                  value && setcatId(value.id);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label=" Category"
                    variant="outlined"
                    margin="normal"
                  />
                )}
              />
            </div>

            <div className={classes.saveButton}>
              {loading ? (
                <CircularProgress />
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  type="submit"
                  className={classes.button}
                  startIcon={<SaveIcon />}
                >
                  Save
                </Button>
              )}
            </div>
          </div>
        </Grid>
      </form>
    </>
  );
}
