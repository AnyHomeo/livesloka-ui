import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Card,
  CardActions,
  IconButton,
  Tooltip,
} from "@material-ui/core/";
import axios from "axios";
import moment from "moment";
import CameraFrontIcon from "@material-ui/icons/CameraFront";
import io from "socket.io-client";
import EditIcon from "@material-ui/icons/Edit";
import { Link } from "react-router-dom";
import OpenInBrowserIcon from "@material-ui/icons/OpenInBrowser";
import { getStudentList, getUserAttendance } from "../../Services/Services";
import MaterialTable from "material-table";
import { Refresh, WhatsApp } from "@material-ui/icons";
import BookIcon from '@material-ui/icons/Book';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


const socket = io(process.env.REACT_APP_API_KEY);

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: "10px",
    marginBottom: "10px",
    textAlign: "center",
  },
  titleCard: {
    fontSize: "16px",
    textAlign: "center",
    marginBottom: "10px",
    marginTop: "10px",
  },
}));

const getSlotFromTime = (date) => {
  let daysarr = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];
  let newDate = new Date(date);
  let dayToday = newDate.getDay();
  let hoursRightNow = newDate.getHours();
  let minutesRightNow = newDate.getMinutes();
  let secondsRightNow = newDate.getSeconds();
  let isAm = hoursRightNow < 12;
  hoursRightNow = !isAm ? hoursRightNow - 12 : hoursRightNow;
  let is30 = minutesRightNow > 30;
  let secondsLeft =
    (is30 ? 59 - minutesRightNow : 29 - minutesRightNow) * 60 +
    (60 - secondsRightNow);
  if ((hoursRightNow === 11) & is30) {
    return {
      slot: `${daysarr[dayToday]}-11:30 ${isAm ? "AM" : "PM"}-12:00 ${
        !isAm ? "AM" : "PM"
      }`,
      secondsLeft,
    };
  } else if (hoursRightNow === 12 && is30) {
    return {
      slot: `${daysarr[dayToday]}-12:30 ${isAm ? "AM" : "PM"}-01:00 ${
        isAm ? "AM" : "PM"
      }`,
      secondsLeft,
    };
  } else {
    return {
      slot: `${daysarr[dayToday]}-${("0" + hoursRightNow).slice(-2)}${
        is30 ? ":30" : ":00"
      } ${isAm ? "AM" : "PM"}-${
        is30
          ? ("0" + (hoursRightNow + 1)).slice(-2)
          : ("0" + hoursRightNow).slice(-2)
      }${is30 ? ":00" : ":30"} ${isAm ? "AM" : "PM"}`,
      secondsLeft,
    };
  }
};

const Statistics = () => {
  const classes = useStyles();
  const [statisticsData, setStatisticsData] = useState();
  const [scheduleId, setScheduleId] = useState("");
  const [selectedScheduleData, setSelectedScheduleData] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    if (scheduleId) {
      getStudentList(scheduleId)
        .then((data) => {
          console.log(data.data.result.students);
          setSelectedScheduleData(data.data.result.students);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [scheduleId]);

  useEffect(() => {
    socket.on("teacher-joined", ({ scheduleId }) => {
      console.log(scheduleId);
      console.log(statisticsData);
      setStatisticsData((prev) => {
        let tempStatisticsData = { ...prev };
        tempStatisticsData = {
          ...tempStatisticsData,
          schedulesRightNow: tempStatisticsData.schedulesRightNow.map(
            (schedule) => ({
              ...schedule,
              isTeacherJoined:
                schedule._id == scheduleId ? true : schedule.isTeacherJoined,
            })
          ),
        };
        return tempStatisticsData;
      });
    });
  },[])

  useEffect(() => {
    getStatistics();
  }, [refresh]);

  const getStatistics = async () => {
    try {
      let date = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      });
      const { slot } = getSlotFromTime(date);
      let formattedDate = moment(date).format("DD-MM-YYYY");
      const res = await axios.get(
        `${process.env.REACT_APP_API_KEY}/customer/class/dashboard?date=${formattedDate}&slot=${slot}`
      );
      setStatisticsData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
        <Dialog
        open={!!attendance.length}
        onClose={() => setAttendance([])}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <MaterialTable
            data={attendance}
            columns={[
              {
                field:"date",
                title:"Date" 
              },
              {
                field:"time",
                title:"Time"
              }
            ]}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAttendance([])}  color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      {statisticsData && (
        <div>
          <Grid
            container
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div>
              <h1 className={classes.titleCard}>Classes Live Now</h1>
            </div>
            <Grid container justify={"center"} align={"center"}>
              {statisticsData &&
              statisticsData.schedulesRightNow.length === 0 ? (
                <p
                  style={{
                    color: "#e74c3c",
                  }}
                >
                  No classes found
                </p>
              ) : (
                statisticsData.schedulesRightNow.map((data) => {
                  return (
                    <Grid item xs={6} sm={2} style={{ height: "100%" }}>
                      <Card
                        className={classes.card}
                        style={{
                          height: "100%",
                          backgroundColor: data.isTeacherJoined
                            ? "#2ecc71"
                            : "#f39c12",
                        }}
                      >
                        <p
                          style={{
                            color: "white",
                          }}
                        >
                          {data.className}
                        </p>

                        <p
                          style={{
                            color: "white",
                            fontSize: "10px",
                          }}
                        >
                          {data.scheduleDescription}
                        </p>
                        <CardActions
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-evenly",
                          }}
                        >
                          <a href={data.meetingLink}>
                            <Tooltip title="Join Meeting">
                              <IconButton>
                                <CameraFrontIcon style={{ color: "white" }} />
                              </IconButton>
                            </Tooltip>
                          </a>
                          <Link
                            to={`/edit-schedule/${data._id}?goto=/statistics`}
                          >
                            <Tooltip title="Edit Meeting">
                              <IconButton>
                                <EditIcon style={{ color: "white" }} />
                              </IconButton>
                            </Tooltip>
                          </Link>
                          <Tooltip title="Open Schedule Table">
                            <IconButton onClick={() => setScheduleId(data._id)}>
                              <OpenInBrowserIcon style={{ color: "white" }} />
                            </IconButton>
                          </Tooltip>
                        </CardActions>
                      </Card>
                    </Grid>
                  );
                })
              )}
            </Grid>
          </Grid>

          <Grid
            container
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button style={{
              position:"absolute",
              right:"20px",
              top:"70px"
            }} 
            onClick={() => setRefresh(prev => !prev)}
            variant="contained"
            >
              Refresh
            </Button>
            <div>
              <h1 className={classes.titleCard}>Next Classes</h1>
            </div>
            <Grid
              container
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {statisticsData && statisticsData.nextSchedules.length === 0 ? (
                <p
                  style={{
                    color: "#e74c3c",
                  }}
                >
                  No classes found
                </p>
              ) : (
                statisticsData.nextSchedules.map((data) => {
                  return (
                    <Grid item xs={6} sm={2} style={{ height: "100%" }}>
                      <Card
                        className={classes.card}
                        style={{
                          height: "100%",
                          backgroundColor: data.isTeacherJoined
                            ? "#2ecc71"
                            : "#f39c12",
                        }}
                      >
                        <p
                          style={{
                            color: "white",
                          }}
                        >
                          {data.className}
                        </p>

                        <p
                          style={{
                            color: "white",
                            fontSize: "10px",
                          }}
                        >
                          {data.scheduleDescription}
                        </p>
                        <CardActions
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-evenly",
                          }}
                        >
                          <a href={data.meetingLink}>
                            <Tooltip title="Join Meeting">
                              <IconButton>
                                <CameraFrontIcon style={{ color: "white" }} />
                              </IconButton>
                            </Tooltip>
                          </a>
                          <Link
                            to={`/edit-schedule/${data._id}?goto=/statistics`}
                          >
                            <Tooltip title="Edit Meeting">
                              <IconButton>
                                <EditIcon style={{ color: "white" }} />
                              </IconButton>
                            </Tooltip>
                          </Link>
                          <Tooltip title="Open Schedule Table">
                            <IconButton onClick={() => setScheduleId(data._id)}>
                              <OpenInBrowserIcon style={{ color: "white" }} />
                            </IconButton>
                          </Tooltip>
                        </CardActions>
                      </Card>
                    </Grid>
                  );
                })
              )}
            </Grid>
          </Grid>
          {selectedScheduleData.length ? (
            <MaterialTable
              title="Customers of selected Schedule"
              data={selectedScheduleData}
              style={{
                margin:"20px",
                padding:"20px"
              }}
              actions={[
                {
                  icon: () => <BookIcon/>,
                  onClick:(e,v) => {
                    console.log(v)
                    getUserAttendance(v._id,"")
                    .then(data => {
                      console.log(data.data.result.reverse())
                      setAttendance(data.data.result)
                    }).catch(err => {
                      console.log(err)
                    })
                  }
                }
              ]}
              columns={[
                {
                  field: "firstName",
                  title: "First Name",
                },
                {
                  field: "lastName",
                  title: "Gaurdian Name",
                },
                {
                  field: "whatsAppnumber",
                  title: "Whatsapp Number",
                  render: (rowData) => (
                    <div>
                      {rowData.whatsAppnumber ? (
                        <a href={`https://wa.me/${rowData.whatsAppnumber}`}>
                          <Tooltip title="Open whatsapp Chat">
                            <IconButton>
                              <WhatsApp />
                            </IconButton>
                          </Tooltip>
                        </a>
                      ) : (
                        ""
                      )}
                      {rowData.whatsAppnumber}
                    </div>
                  ),
                },
              ]}
            />
          ) : (
            ""
          )}
        </div>
      )}
    </>
  );
};

export default Statistics;
