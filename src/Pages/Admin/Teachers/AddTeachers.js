import React, { useState } from "react";

import {
  Button,
  TextField,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
} from "@material-ui/core/";
import SaveIcon from "@material-ui/icons/Save";
import { makeStyles } from "@material-ui/core/styles";
import Adminsidebar from "../Adminsidebar";

import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import { postTeacher } from "../../../Services/Services";

const useStyles = makeStyles((theme) => ({
  saveButton: {
    marginTop: "1.5rem",
    marginBottom: "2rem",
  },

  content: {
    flexGrow: 1,
    marginTop: "-10px",
    textAlign: "center",
  },
  textfields: {
    marginTop: "20px",
    width: "300px",
    marginBottom: "10px",
  },
}));
const AddTeachers = () => {

  const [teacher, setTeacher] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [successOpen, setSuccessOpen] = React.useState(false);

  const handleSuccessClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccessOpen(false);
  };

  const submitForm = (e) => {
    e.preventDefault();
    postTeacher(teacher, password, email)
        .then(data => {
          console.log(data)
          if(data.data.success){
            setSuccessOpen(true)
          }
        })
        .catch(err => console.log(err))
  };

  const classes = useStyles();
  return (
      <>
        <Adminsidebar />
        <Snackbar
            open={successOpen}
            autoHideDuration={6000}
            onClose={handleSuccessClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <Alert onClose={handleSuccessClose} severity="success">
            Teacher added successfully
          </Alert>
        </Snackbar>
        <form className={classes.content} onSubmit={submitForm}>
          <div className={classes.toolbar} />
          <h1 className="heading">Add new teacher</h1>
          <div className="textgroup">
            <TextField
                className={classes.textfields}
                id="outlined-basic"
                label="First Name"
                variant="outlined"
                value={teacher}
                onChange={(e) => setTeacher(e.target.value)}
                required
            />
            <TextField
                className={classes.textfields}
                id="outlined-basic"
                label="Last Name"
                variant="outlined"
                value={teacher}
                onChange={(e) => setTeacher(e.target.value)}
                required
            />

            <FormControl variant="outlined" className={classes.textfields}>
              <InputLabel id="demo-simple-select-outlined-label">
                Gender
              </InputLabel>
              <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  // value={age}
                  // onChange={handleChange}
                  label="Age"
              >
                <MenuItem value={1}>Male</MenuItem>
                <MenuItem value={2}>Female</MenuItem>
              </Select>
            </FormControl>

            <TextField
                className={classes.textfields}
                id="outlined-basic"
                label="Address"
                variant="outlined"
                value={teacher}
                onChange={(e) => setTeacher(e.target.value)}
                required
            />

            <TextField
                className={classes.textfields}
                id="outlined-basic"
                label="Mobile Number"
                variant="outlined"
                value={teacher}
                onChange={(e) => setTeacher(e.target.value)}
                required
            />

            <TextField
                className={classes.textfields}
                id="outlined-basic"
                label="Email"
                variant="outlined"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            <TextField
                className={classes.textfields}
                id="outlined-basic"
                label="Password"
                variant="outlined"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
          </div>

          <div className={classes.saveButton}>
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
          </div>
        </form>
      </>
  );
};

export default AddTeachers;
