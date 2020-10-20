import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar";
import { getMeeting } from "../../Services/Services";
import { isAutheticated } from "../../auth";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import SendIcon from "@material-ui/icons/Send";
import { Redirect } from "react-router-dom";
const useStyles = makeStyles((theme) => ({
  main: {
    width: "100vw",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  displayText: {
    marginBottom: "2rem",
  },
  link: {
    textDecoration: "none",
    color: "white",
    padding: "8px 10px",
  },
}));
const Home = () => {
  const classes = useStyles();
  const { token,roleId } = isAutheticated();
  const meetingLink = `http://localhost:3001/meeting`;
  const [Time, setTime] = useState("");
  const [now, setNow] = useState(false);
  const [meeting, setMeeting] = useState(false);

  useEffect(() => {
    getMeeting(token, new Date())
      .then((data) => {
        if (data.data.startTime) {
          let unixStartTime = new Date(data.data.startTime);
          setMeeting(true);
          setTime(unixStartTime.toString().split(" ")[4]);
          if (unixStartTime.getTime() / 1000 <= new Date().getTime() / 1000) {
            setNow(true);
          } else {
            var timeLeft = unixStartTime - new Date().getTime();
            setTimeout(() => {
              setNow(true);
            }, timeLeft);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token]);

  return (
    <>
      <Navbar />
      {roleId === 1 && (<Redirect to='/admin' />)}
      <div className={classes.main}>
        {meeting ? (
          <>
            <h2
              className={classes.displayText}
              style={{ color: now ? "red" : "black" }}
            >
              {now
                ? ` Quick! Your meeting Started`
                : `your meeting will start at ${Time}`}
            </h2>
          </>
        ) : (
          <h2 className={classes.displayText}> You had no meetings now </h2>
        )}
        {now ? (
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            endIcon={<SendIcon />}
          >
            <a className={classes.link} href={`${meetingLink}/${token}`}>
              {" "}
              Join meeting{" "}
            </a>
          </Button>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default Home;
