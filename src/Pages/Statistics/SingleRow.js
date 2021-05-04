import { Card, Chip, Icon, IconButton, Tooltip } from "@material-ui/core";
import React from "react";
import VideocamIcon from "@material-ui/icons/Videocam";
import PersonIcon from "@material-ui/icons/Person";

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
      style={{ backgroundColor: selectedSlot === time || selectedSlot === prevTime ? "rgba(56,103,214,0.5)" : undefined }}
    >
      {todayData.map((singleData) => (
        <>
          {singleData.slots[day.toLowerCase()].includes(time) &&
          !singleData.slots[day.toLowerCase()].includes(prevTime) ? (
            <Card
              className="single-card"
              style={{
                backgroundColor:!singleData.isTeacherJoined ? "rgb(237, 159, 157)" : "#38CC77",
              }}
            >
              {
                singleData.demo ? (
                  <Chip label="Demo"
                  size="small"
                  style={{
                    position:"absolute",
                    top:0,
                    transform:"translateX(-50%)",
                    left:"50%"
                  }} />
                ) : ""
              }
              <div
              onClick={() => {
                setDialogOpen((prev) => !prev)
                setDialogData(singleData)
              }}
                className="teacher-name"
              >
                {singleData.teacher && singleData.teacher.TeacherName}
              </div>
              <div className="students">
                {singleData.students.map((student) => (
                  <Tooltip title={student.firstName} key={student.firstName}>
                    <IconButton size="small">
                      <PersonIcon
                        style={{
                          color: !student.isStudentJoined ? "red" : "green",
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                ))}
              </div>
              <a className="zoom-link" href={singleData.meetingLink}>
                <Tooltip title="Join Zoom" >
                  <IconButton size="small" >
                        <img style={{height:"30px",width:"30px"}}  src={require("../../Images/ZOOM LOGO.png")} />
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
