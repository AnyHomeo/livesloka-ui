import { Card, Chip, Icon, IconButton, Tooltip } from "@material-ui/core";
import React from "react";
import VideocamIcon from "@material-ui/icons/Videocam";
import PersonIcon from "@material-ui/icons/Person";
import { UserCheck, UserMinus } from "react-feather";
function SingleRow({
  setDialogOpen,
  todayData,
  time,
  day,
  prevTime,
  selectedSlot,
  setDialogData,
}) {
  return (
    <div
      className="single-row-container"
      style={{
        backgroundColor:
          selectedSlot === time || selectedSlot === prevTime
            ? "rgba(56,103,214,0.5)"
            : undefined,
      }}
    >
      {todayData.map((singleData) => (
        <>
          {singleData.slots[day.toLowerCase()].includes(time) &&
          !singleData.slots[day.toLowerCase()].includes(prevTime) ? (
            <Card
              className="single-card"
              // style={{
              //   backgroundColor: !singleData.isTeacherJoined
              //     ? "rgb(237, 159, 157)"
              //     : "#38CC77",
              // }}
              style={{
                backgroundColor: "white",
                borderLeft: singleData.isTeacherJoined
                  ? "10px solid #56AE69"
                  : "10px solid #ff7675",
              }}
            >
              {singleData.demo ? (
                <Chip
                  label="Demo"
                  size="small"
                  style={{
                    position: "absolute",
                    top: "5%",
                    transform: "translateX(-50%)",
                    left: "82%",
                    border: "1px dotted #74b9ff",
                    backgroundColor: "#74b9ff",
                    fontWeight: "bold",
                    color: "#0984e3",
                  }}
                />
              ) : (
                ""
              )}
              <div
                onClick={() => {
                  setDialogOpen((prev) => !prev);
                  setDialogData(singleData);
                }}
                className="teacher-name"
                style={{
                  fontSize: 12,
                  width: "67%",
                }}
              >
                {singleData.teacher && singleData.teacher.TeacherName}
              </div>
              <div
                className="students"
                style={{ marginLeft: 10, marginBottom: 10, cursor: "pointer" }}
              >
                {singleData.students.map((student) => (
                  <>
                    {student.isStudentJoined ? (
                      <Tooltip
                        title={student.firstName}
                        key={student.firstName}
                      >
                        <UserCheck
                          style={{
                            color: "#2ecc71",
                            height: 18,
                            width: 18,
                          }}
                        />
                      </Tooltip>
                    ) : (
                      <Tooltip
                        title={student.firstName}
                        key={student.firstName}
                      >
                        <UserMinus
                          style={{
                            color: "#ff7675",
                            height: 18,
                            width: 18,
                          }}
                        />
                      </Tooltip>
                    )}
                  </>
                ))}
              </div>
              <a className="zoom-link" href={singleData.meetingLink}>
                <Tooltip title="Join Zoom">
                  <IconButton size="small">
                    <img
                      style={{ height: "18px", width: "18px" }}
                      src={require("../../Images/ZOOM LOGO.png")}
                    />
                  </IconButton>
                </Tooltip>
              </a>
            </Card>
          ) : (
            ""
          )}
        </>
      ))}
    </div>
  );
}

export default SingleRow;
