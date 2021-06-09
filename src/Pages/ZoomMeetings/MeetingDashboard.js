import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import useDocumentTitle from "../../Components/useDocumentTitle";
import useWindowDimensions from "../../Components/useWindowDimensions";
import {
  getAllSchedulesByZoomAccountId,
  getData,
} from "../../Services/Services";
const times = [
  "12:00 AM-12:30 AM",
  "12:30 AM-01:00 AM",
  "01:00 AM-01:30 AM",
  "01:30 AM-02:00 AM",
  "02:00 AM-02:30 AM",
  "02:30 AM-03:00 AM",
  "03:00 AM-03:30 AM",
  "03:30 AM-04:00 AM",
  "04:00 AM-04:30 AM",
  "04:30 AM-05:00 AM",
  "05:00 AM-05:30 AM",
  "05:30 AM-06:00 AM",
  "06:00 AM-06:30 AM",
  "06:30 AM-07:00 AM",
  "07:00 AM-07:30 AM",
  "07:30 AM-08:00 AM",
  "08:00 AM-08:30 AM",
  "08:30 AM-09:00 AM",
  "09:00 AM-09:30 AM",
  "09:30 AM-10:00 AM",
  "10:00 AM-10:30 AM",
  "10:30 AM-11:00 AM",
  "11:00 AM-11:30 AM",
  "11:30 AM-12:00 PM",
  "12:00 PM-12:30 PM",
  "12:30 PM-01:00 PM",
  "01:00 PM-01:30 PM",
  "01:30 PM-02:00 PM",
  "02:00 PM-02:30 PM",
  "02:30 PM-03:00 PM",
  "03:00 PM-03:30 PM",
  "03:30 PM-04:00 PM",
  "04:00 PM-04:30 PM",
  "04:30 PM-05:00 PM",
  "05:00 PM-05:30 PM",
  "05:30 PM-06:00 PM",
  "06:00 PM-06:30 PM",
  "06:30 PM-07:00 PM",
  "07:00 PM-07:30 PM",
  "07:30 PM-08:00 PM",
  "08:00 PM-08:30 PM",
  "08:30 PM-09:00 PM",
  "09:00 PM-09:30 PM",
  "09:30 PM-10:00 PM",
  "10:00 PM-10:30 PM",
  "10:30 PM-11:00 PM",
  "11:00 PM-11:30 PM",
  "11:30 PM-12:00 AM",
];
const hours = [
  "12 AM",
  "01 AM",
  "02 AM",
  "03 AM",
  "04 AM",
  "05 AM",
  "06 AM",
  "07 AM",
  "08 AM",
  "09 AM",
  "10 AM",
  "11 AM",
  "12 PM",
  "01 PM",
  "02 PM",
  "03 PM",
  "04 PM",
  "05 PM",
  "06 PM",
  "07 PM",
  "08 PM",
  "09 PM",
  "10 PM",
  "11 PM",
];
const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

function MeetingDashboard() {
  useDocumentTitle("Zoom Account Dashboard - LiveSloka");

  const { width } = useWindowDimensions();
  const [zoomAccounts, setZoomAccounts] = useState([]);
  const [selectedZoomAccount, setSelectedZoomAccount] = useState({});
  const [selectedZoomAccountSchedules, setSelectedZoomAccountSchedules] =
    useState([]);

  useEffect(() => {
    getData("Zoom Account")
      .then((zoomAccountsResponse) => {
        setZoomAccounts(zoomAccountsResponse.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <h1
        style={{
          textAlign: "center",
        }}
      >
        {" "}
        Zoom Accounts Dashboard{" "}
      </h1>
      <Autocomplete
        options={zoomAccounts}
        getOptionLabel={(option) =>
          `${option.ZoomAccountName}(${option.zoomEmail})`
        }
        onChange={(e, v) => {
          getAllSchedulesByZoomAccountId(v._id)
            .then((data) => {
              setSelectedZoomAccountSchedules(data.data.result);
            })
            .catch((err) => {
              console.log(err);
            });
          setSelectedZoomAccount(v);
        }}
        style={{ width: "60%", margin: "40px auto" }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select Zoom Account"
            variant="outlined"
            margin="normal"
          />
        )}
      />
      <div
        style={{
          height: "50px",
          display: "flex",
          flexDirection: "row",
          position: "sticky",
          top: "63px",
          backgroundColor: "white",
        }}
      >
        <div style={{ width: width < 700 ? "10%" : "5%" }} />
        <div style={{ width: width < 700 ? "90%" : "95%" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            {days.map((day, i) => (
              <div
                key={i}
                style={{
                  width: "14.2857%",
                  height: "50px",
                  textAlign: "center",
                  padding: "15px 0",
                  backgroundColor: "#3F51B5",
                  color: "white",
                  borderLeft: "1px solid #fff",
                  boxShadow:
                    "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
                }}
              >
                {" "}
                {width < 700
                  ? day.toUpperCase().slice(0, 3)
                  : day.toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ width: "100%", display: "flex", flexDirection: "row" }}>
        <div
          style={{
            width: width < 700 ? "10%" : "5%",
            backgroundColor: "#EAF0F1",
          }}
        >
          {hours.map((hour, i) => (
            <div key={i} className="time-header">
              {hour}
            </div>
          ))}
        </div>
        <div style={{ width: width < 700 ? "90%" : "95%" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            {times.map((time, i) => {
              return (
                <React.Fragment key={i}>
                  {days.map((day, j) => {
                    return (
                      <div
                        key={j}
                        className={`day-time-intersection-box `}
                        style={{
                          fontSize: "14px",
                          fontWeight: "bold",
                          borderBottom:
                            i % 2 !== 0 ? "1px solid rgba(0,0,0,0.5)" : "",
                          backgroundColor:
                            selectedZoomAccount &&
                            selectedZoomAccount.timeSlots &&
                            selectedZoomAccount.timeSlots.includes(
                              `${day.toUpperCase()}-${time}`
                            )
                              ? "#B73427"
                              : "",
                        }}
                      >
                        {selectedZoomAccount &&
                        selectedZoomAccount.timeSlots &&
                        selectedZoomAccount.timeSlots.includes(
                          `${day.toUpperCase()}-${time}`
                        )
                          ? selectedZoomAccountSchedules.filter((schedule) =>
                              schedule.slots[day].includes(
                                `${day.toUpperCase()}-${time}`
                              )
                            )[0]
                            ? selectedZoomAccountSchedules.filter((schedule) =>
                                schedule.slots[day].includes(
                                  `${day.toUpperCase()}-${time}`
                                )
                              )[0].className
                            : ""
                          : ""}
                      </div>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default MeetingDashboard;
