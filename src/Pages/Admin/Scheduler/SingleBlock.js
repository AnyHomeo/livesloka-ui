import React from "react";

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
  return (
    <div
      key={j}
      className={`day-time-intersection-box `}
      style={{
        cursor:
          categorizedData[category][teacher].scheduledSlots[
            `${day.toUpperCase()}-${time}`
          ] || availableSlotsEditingMode
            ? "pointer"
            : "not-allowed",
        borderBottom: i % 2 !== 0 ? "1px solid rgba(0,0,0,0.5)" : "",
        backgroundColor: categorizedData[category][teacher].scheduledSlots[
          `${day.toUpperCase()}-${time}`
        ]
          ? "#EA7773"
          : categorizedData[category][teacher].availableSlots.includes(
              `${day.toUpperCase()}-${time}`
            )
          ? "#04E46C"
          : undefined,
      }}
      onClick={() => {
        if (
          categorizedData[category][teacher].scheduledSlots[
            `${day.toUpperCase()}-${time}`
          ]
        ) {
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
      {categorizedData[category][teacher].scheduledSlots[
        `${day.toUpperCase()}-${time}`
      ]
        ? allSchedules.filter(
            (schedule) =>
              schedule._id ===
              categorizedData[category][teacher].scheduledSlots[
                `${day.toUpperCase()}-${time}`
              ]
          )[0].className
        : categorizedData[category][teacher].availableSlots.includes(
            `${day.toUpperCase()}-${time}`
          )
        ? "Available"
        : ""}
    </div>
  );
}

export default SingleBlock;
