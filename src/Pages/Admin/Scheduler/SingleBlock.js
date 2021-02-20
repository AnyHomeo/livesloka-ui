import React, { useEffect, useState } from "react";

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
}) {
  const [schedule, setSchedule] = useState({});

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
    <div
      key={j}
      className={`day-time-intersection-box `}
      style={{
        fontSize: "14px",
        fontWeight: "bold",
        cursor:
          categorizedData[category][teacher].scheduledSlots[
            `${day.toUpperCase()}-${time}`
          ] || availableSlotsEditingMode
            ? "pointer"
            : "not-allowed",
        borderBottom: i % 2 !== 0 ? "1px solid rgba(0,0,0,0.5)" : "",
        backgroundColor: Object.keys(schedule).length
          ? schedule.isClassTemperarilyCancelled
            ? "#aaa"
            : schedule.demo
            ? "#B73427"
            : "#e67e22"
          : categorizedData[category][teacher].availableSlots.includes(
              `${day.toUpperCase()}-${time}`
            )
          ? "#2ecc71"
          : undefined,
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
      {Object.keys(schedule).length
        ? schedule.className
        : categorizedData[category][teacher].availableSlots.includes(
            `${day.toUpperCase()}-${time}`
          )
        ? "Available"
        : ""}
    </div>
  );
}

export default SingleBlock;
