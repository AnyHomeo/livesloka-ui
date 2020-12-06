import React, { useEffect, useState } from "react";
import "./scheduler.css";
import OccupancyBars from "./OccupancyBars";
import useWindowDimensions from "../../../Components/useWindowDimensions";
import {
  addAvailableTimeSlot,
  deleteAvailableTimeSlot,
  getOccupancy,
} from "../../../Services/Services";

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
  "11:30 PM-12:00 PM",
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

function Scheduler() {
  const [teacher, setTeacher] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [category, setCategory] = useState("");
  const { width } = useWindowDimensions();
  const [categorizedData, setCategorizedData] = useState({});

  useEffect(() => {
    getOccupancy().then((data) => {
      console.log(data.data);
      setCategorizedData(data.data);
    });
  }, []);

  const addOrRemoveAvailableSlot = (slot) => {
    if (!categorizedData[category][teacher].availableSlots.includes(slot)) {
      addAvailableTimeSlot(teacherId, slot)
        .then((data) => {
          console.log(data);
          setCategorizedData((prev) => ({
            ...prev,
            [category]: {
              ...prev[category],
              [teacher]: {
                ...prev[category][teacher],
                availableSlots: [
                  ...prev[category][teacher].availableSlots,
                  slot,
                ],
              },
            },
          }));
        })
        .catch((err) => console.log(err));
    } else {
      deleteAvailableTimeSlot(teacherId, slot)
        .then((data) => {
          console.log(data);
          setCategorizedData((prev) => {
            let allData = { ...prev };
            let data = [...allData[category][teacher].availableSlots];
            let index = data.indexOf(slot);
            data.splice(index, 1);
            allData[category][teacher].availableSlots = data;
            return allData;
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <>
      <OccupancyBars
        categorizedData={categorizedData}
        setTeacher={setTeacher}
        setTeacherId={setTeacherId}
        setCategory={setCategory}
      />
      {teacher && teacherId ? (
        <>
          <h1 style={{ textAlign: "center", textTransform: "capitalize" }}>
            {" "}
            {teacher} Week Schedule{" "}
          </h1>
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
                              borderBottom:
                                i % 2 !== 0 ? "1px solid rgba(0,0,0,0.5)" : "",
                              backgroundColor: categorizedData[category][
                                teacher
                              ].availableSlots.includes(
                                `${day.toUpperCase()}-${time}`
                              )
                                ? "#04E46C"
                                : undefined,
                            }}
                            onClick={() =>
                              addOrRemoveAvailableSlot(
                                `${day.toUpperCase()}-${time}`
                              )
                            }
                          >
                            {categorizedData[category][
                              teacher
                            ].availableSlots.includes(
                              `${day.toUpperCase()}-${time}`
                            )
                              ? "available"
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
      ) : (
        <span />
      )}
    </>
  );
}

export default Scheduler;
