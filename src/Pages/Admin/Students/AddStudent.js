import React, { useState } from "react";

import { Button, TextField } from "@material-ui/core/";
import SaveIcon from "@material-ui/icons/Save";
import { makeStyles } from "@material-ui/core/styles";
import Adminsidebar from "../Adminsidebar";

import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
// import { isAutheticated } from "../../../auth";
import { postStudent } from "../../../Services/Services";

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
const AddStudent = () => {

  const [student, setStudent] = useState("");
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
    postStudent(student, password, email)
    .then(data => {
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
          Student added successfully
        </Alert>
      </Snackbar>
      <form className={classes.content} onSubmit={submitForm}>
        <div className={classes.toolbar} />
        <h1 className="heading">Add new student</h1>
        <div className="textgroup">
          <label htmlFor="student">Student Name: </label>

          <TextField
            className={classes.textfields}
            id="outlined-basic"
            label="Student Name"
            variant="outlined"
            value={student}
            onChange={(e) => setStudent(e.target.value)}
            required
          />
          <label htmlFor="student">Email: </label>
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
          <label htmlFor="student">Password: </label>
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

export default AddStudent;
