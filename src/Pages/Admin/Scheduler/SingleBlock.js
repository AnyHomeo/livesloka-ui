import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Checkbox from "@material-ui/core/Checkbox";

function SingleBlock({
  day,
  time,
  i,
  j,
  categorizedData,
  category,
  teacher,
  addOrRemoveAvailableSlot,
  setScheduleId,
  availableSlotsEditingMode,
  allSchedules,
  teacherID,
  selectedSlots,
  setSelectedSlots
}) {
  const [schedule, setSchedule] = useState({});
  let history = useHistory();

  const [checked, setChecked] = React.useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  useEffect(() => {
    if (
      categorizedData[category][teacher].scheduledSlots[
        `${day.toUpperCase()}-${time}`
      ]
    ) {
      setSchedule(
        allSchedules.filter(
          (schedule) =>
            schedule._id ===
            categorizedData[category][teacher].scheduledSlots[
              `${day.toUpperCase()}-${time}`
            ]
        )[0]
      );
    } else {
      setSchedule({});
    }
  }, [allSchedules, categorizedData, teacher, category, day, time]);

  return (
    <>
      <div
        key={j}
        className={`day-time-intersection-box `}
        style={{
          fontSize: "14px",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          cursor:
            categorizedData[category][teacher].scheduledSlots[
              `${day.toUpperCase()}-${time}`
            ] || availableSlotsEditingMode
              ? "pointer"
              : "not-allowed",
        }}
        onClick={() => {
          if (Object.keys(schedule).length) {
            setScheduleId(
              categorizedData[category][teacher].scheduledSlots[
                `${day.toUpperCase()}-${time}`
              ]
            );
          } else if (availableSlotsEditingMode) {
            addOrRemoveAvailableSlot(`${day.toUpperCase()}-${time}`);
          }
        }}
      >
        <div
          style={{
            cursor:
              categorizedData[category][teacher].scheduledSlots[
                `${day.toUpperCase()}-${time}`
              ] || availableSlotsEditingMode
                ? "pointer"
                : "default",
            background: Object.keys(schedule).length
              ? schedule.isClassTemperarilyCancelled
                ? "#aaa"
                : schedule.demo
                ? "linear-gradient(315deg, #e84118 0%, #e84118 74%)"
                : schedule.isSummerCampClass ? "#3867D6" : "linear-gradient(315deg, #f39c12 0%, #f39c12 74%)"
              : categorizedData[category][teacher].availableSlots.includes(
                  `${day.toUpperCase()}-${time}`
                )
              ? "linear-gradient(315deg, #3bb78f 0%, #0bab64 74%)"
              : undefined,
          }}
          className="blockName"
        >
          {Object.keys(schedule).length
            ? schedule.className
            : categorizedData[category][teacher].availableSlots.includes(
                `${day.toUpperCase()}-${time}`
              )
            ? 
            (
              <>
              <Checkbox
                style={{ position: "absolute",left:"5px",top:"5px" }}
                checked={selectedSlots.includes(`${day.toUpperCase()}-${time}`)}
                onChange={() => setSelectedSlots(prev => {
                  let prevData = [...prev]
                  let str = `${day.toUpperCase()}-${time}`
                  if(prevData.includes(str)){
                    let index = prevData.indexOf(str)
                    prevData.splice(index,1)
                    return prevData
                  } else {
                    return [...prevData,str]
                  }
                })}
                inputProps={{ "aria-label": "primary checkbox" }}
              />
            Available
            </>
            )
            : ""}
        </div>
      </div>
    </>
  );
}

export default SingleBlock;
