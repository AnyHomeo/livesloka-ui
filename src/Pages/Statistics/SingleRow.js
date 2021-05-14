import { Card, Chip, Icon, IconButton, Tooltip } from "@material-ui/core";
import React from "react";
import VideocamIcon from "@material-ui/icons/Videocam";
import PersonIcon from "@material-ui/icons/Person";
import { UserCheck, UserMinus, Video, Clipboard } from "react-feather";
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
              style={{
                backgroundColor: singleData.isTeacherJoined
                  ? "#2ecc7075"
                  : singleData.demo
                  ? "#f1c40fb6"
                  : "#ff757562",
                border: singleData.isTeacherJoined
                  ? "2px solid #56AE69"
                  : "2px solid #d63031",
                overflow: "initial",
              }}
            >
              <div
                onClick={() => {
                  setDialogOpen((prev) => !prev);
                  setDialogData(singleData);
                }}
                className="teacher-name"
                style={{
                  fontSize: 12,
                  width: "67%",
                  marginTop: singleData.demo ? 10 : 0,
                }}
              >
                {singleData.teacher && singleData.teacher.TeacherName}
              </div>
              <div
                className="students"
                style={{ marginLeft: 3, marginBottom: 10, cursor: "pointer" }}
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
                    <Video
                      style={{ height: 18, width: 18, color: "#0984e3" }}
                    />
                  </IconButton>
                </Tooltip>
              </a>

              {singleData.demo ? (
                <Tooltip title="Demo" style={{ cursor: "pointer" }}>
                  <Chip
                    label="DEMO"
                    style={{
                      position: "absolute",
                      top: "-1%",
                      transform: "translateX(-50%)",
                      left: "50%",
                      height: 40,
                      width: "100%",
                      borderRadius: 20,
                      height: 16,
                      backgroundColor: "#d63031",
                      color: "white",
                    }}
                  />
                </Tooltip>
              ) : (
                ""
              )}
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
