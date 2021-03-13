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

        // backgroundColor: Object.keys(schedule).length
        //   ? schedule.isClassTemperarilyCancelled
        //     ? "#aaa"
        //     : schedule.demo
        //     ? "#B73427"
        //     : "#e67e22"
        //   : categorizedData[category][teacher].availableSlots.includes(
        //       `${day.toUpperCase()}-${time}`
        //     )
        //   ? "#2ecc71"
        //   : undefined,
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
              : "not-allowed",

          background: Object.keys(schedule).length
            ? schedule.isClassTemperarilyCancelled
              ? "#aaa"
              : schedule.demo
              ? "#B73427"
              : "linear-gradient(315deg, #ee9617 0%, #fe5858 74%)"
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
          ? "Available"
          : ""}
      </div>
    </div>
  );
}

export default SingleBlock;
