import {
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Paper,
  Box,
  Grid,
  Typography,
} from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import MuiAlert from "@material-ui/lab/Alert";
import React, { useState } from "react";
import { login } from "../../Services/Services";
import { Redirect } from "react-router-dom";
import { authenticate, isAutheticated } from "../../auth/index";
import Background from "../../Images/Captureblue_buuble.PNG";
import Copyright from "../../Components/Copyright";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: `url(${Background})`,
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  Logo: {
    width: "20%",
    marginTop: "-4rem",
    [theme.breakpoints.down("sm")]: {
      marginTop: "1rem",
      marginBottom: "1rem",
      width: "40%",
    },
  },
  image1: {
    display: "block",
    marginBottom: "1rem",
    margin: "0 auto",
  },
  imgbutton: {
    display: "block",
    margin: "0 auto",
  },
  fg: {
    marginTop: "12px",
    fontSize: "1rem",
  },
  ImageGroup: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  AlertMsg: {
    fontSize: "1.1rem",
    textAlign: "center",
    color: "white",
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Login = () => {
  const classes = useStyles();
  const [user, setUser] = useState({
    userId: "",
    password: "",
    remember: false,
    isLoading: false,
    errors: false,
    didRedirect: false,
  });

  const { userId, password, remember, isLoading, errors, didRedirect } = user;

  const onChange = (e) =>
    setUser({ ...user, errors: false, [e.target.name]: e.target.value });

  const rememberChange = () =>
    setUser({ ...user, errors: false, remember: !remember });

  const onSubmit = (event) => {
    event.preventDefault();
    setUser({ ...user, isLoading: true, errors: false });
    login(userId, password)
      .then((res) => res.json())
      .then((data) => {
        if (data.result.token) {
          authenticate(data.result, remember, () => {
            setUser({
              ...user,
              errors: false,
              isLoading: false,
              didRedirect: true,
            });
          });
        } else {
          setUser({
            ...user,
            errors: data.details,
            isLoading: false,
            didRedirect: true,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        setUser({
          ...user,
          errors: "Invalid userName or Password",
          isLoading: false,
          didRedirect: false,
        });
      });
  };
  const performRedirect = () => {
    if (didRedirect) {
      if (isAutheticated() && isAutheticated().firstTimeLogin === "Y") {
        return <Redirect to="/password-reset" />;
      }
      if (isAutheticated() && isAutheticated().roleId === 1) {
        return <Redirect to="/home" />;
      } else if (isAutheticated() && isAutheticated().roleId === 3) {
        return <Redirect to="/admin" />;
      }
    }
    if (isAutheticated()) {
      if (isAutheticated() && isAutheticated().roleId === 1) {
        return <Redirect to="/home" />;
      } else if (isAutheticated() && isAutheticated().roleId === 3) {
        return <Redirect to="/admin" />;
      }
    }
  };

  const errorsMessage = () => {
    if (errors) {
      if (typeof errors === "object") {
        return errors.map((err, i) => (
          <Alert severity="error" key={i}>
            {err}
          </Alert>
        ));
      } else {
        return <Alert severity="error" className={classes.AlertMsg}>{errors}</Alert>;
      }
    }
  };

  const loginForm = () => (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image}>
        <div className={classes.ImageGroup}>
          <img
            className={classes.image1}
            src={require("../../Images/childrens.png")}
            alt=""
          />
          <img
            className={classes.image1}
            src={require("../../Images/QR_Code.png")}
            alt=""
          />
          <Button
            className={classes.image1}
            type="submit"
            variant="contained"
            color="primary"
          >
            QR CODE
          </Button>
        </div>
      </Grid>
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <img
            className={classes.Logo}
            src={require("../../Images/Logo.png")}
            alt=""
          />
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} onSubmit={onSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="userId"
              label="User ID"
              name="userId"
              autoFocus
              value={userId}
              onChange={onChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={onChange}
            />
            <Grid container>
              <Grid item xs>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={remember}
                      name="remember"
                      color="primary"
                      onChange={rememberChange}
                    />
                  }
                  label="Remember me"
                />
              </Grid>
              <Grid item>
                <Link href="#">
                  <p className={classes.fg}>Forgot password?</p>
                </Link>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              {isLoading ? "Logging in" : "Login"}
            </Button>
            {errorsMessage()}
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );

  return (
    <>
      {performRedirect()}
      {loginForm()}
    </>
  );
};

export default Login;
