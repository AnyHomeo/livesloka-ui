import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { Button, FormLabel, Radio, RadioGroup } from "@material-ui/core";
import { Redirect } from "react-router-dom";
import {
  getScheduleAndDateAttendance,
  getStudentList,
  postStudentsAttendance,
} from "../../../Services/Services";
import Typography from "@material-ui/core/Typography";

const BooleanRadioBox = ({ value, onChange, label }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        width: "500px",
        margin: "0 auto",
        padding: "3px 0",
      }}
    >
      <div style={{ display: "flex" }}>
        <Radio checked={value === "present"} onChange={() => onChange("present")} />
        <Radio checked={value === "absent"} style={{marginLeft:"15px"}} onChange={() => onChange("absent")} />
        <Radio checked={value === "paid"} onChange={() => onChange("paid")} />
        <Radio checked={value === "unpaid"} onChange={() => onChange("unpaid")} />
      </div>
      <p>{label}</p>
    </div>
  );
};

const GreenCheckbox = withStyles({
  root: {
    color: green[400],
    "&$checked": {
      color: green[600],
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

const EditAttendance = ({ match }) => {
  const [studentNameLists, setStudentNameLists] = useState([]);
  const [studentAttendance, setStudentAttendance] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const [absentees, setAbsentees] = useState([]);
  const [requestedStudents, setRequestedStudents] = useState([]);
  const [requestedPaidStudents, setRequestedPaidStudents] = useState([]);

  useEffect(() => {
    setAbsentees((prev) => {
      let tempAbsentees = [];
      studentNameLists.forEach((student) => {
        if (
          !studentAttendance.includes(student._id) &&
          !requestedStudents.includes(student._id) &&
          !requestedPaidStudents.includes(student._id)
        ) {
          tempAbsentees.push(student._id);
        }
      });
      return tempAbsentees;
    });
  }, [
    studentAttendance,
    studentNameLists,
    requestedStudents,
    requestedPaidStudents,
  ]);

  useEffect(() => {
    studentListNAttendance();
  }, []);

  const studentListNAttendance = async () => {
    const { data } = await getStudentList(match.params.scheduleId);
    setStudentNameLists(data.result.students);

    const res = await getScheduleAndDateAttendance(
      match.params.scheduleId,
      match.params.date
    );
    setStudentAttendance(
      res.data.result.customers ? res.data.result.customers : []
    );
    setRequestedStudents(
      res.data.result.requestedStudents ? res.data.result.requestedStudents : []
    );
    setRequestedPaidStudents(
      res.data.result.requestedPaidStudents
        ? res.data.result.requestedPaidStudents
        : []
    );
  };

  const handleChange = (id) => {
      if (studentAttendance.includes(id)) {
        setStudentAttendance((prev) => {
          let tempAttendance = [...prev];
          let index = tempAttendance.indexOf(id);
          tempAttendance.splice(index, 1);
          return tempAttendance;
        });
      } else {
        setStudentAttendance((prev) => [...prev, id]);
      }
  };

  const postAttendance = async () => {
    try {
      const formData = {
        date: match.params.date,
        scheduleId: match.params.scheduleId,
        customers: studentAttendance,
        requestedStudents,
        requestedPaidStudents,
        absentees,
      };
      const data = await postStudentsAttendance(formData);
      if (data) {
        setRedirect(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (redirect) {
    return <Redirect to="/attendance/class" />;
  }

  const removeId = (prev,id) => {
    let prevValues = [...prev];
    let index = prevValues.indexOf(id)
    if(index !== -1){
      prevValues.splice(index,1)          
    }
    return prevValues
  }

  const changeIt = (name,id) => {
    if(name === "paid"){
      setRequestedPaidStudents(prev => [...prev,id])
      setRequestedStudents(prev => removeId(prev,id))
      setStudentAttendance(prev => removeId(prev,id))
    } else if(name === "unpaid") {
      setRequestedStudents(prev => [...prev,id])
      setRequestedPaidStudents(prev => removeId(prev,id))
      setStudentAttendance(prev => removeId(prev,id))
    } else if(name === "present"){
      setStudentAttendance(prev => [...prev,id])
      setRequestedPaidStudents(prev => removeId(prev,id))
      setRequestedStudents(prev => removeId(prev,id))
    } else {
      setRequestedPaidStudents(prev => removeId(prev,id))
      setRequestedStudents(prev => removeId(prev,id))
      setStudentAttendance(prev => removeId(prev,id))
    }
  }

  return (
    <div>
      <h2
        style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px" }}
      >
        Edit Students Attendance
      </h2>
      <div style={{ textAlign: "center" }}>
        <h2 style={{ fontSize: "20px" }}>{match.params.date}</h2>       
        <div style={{ width: "500px", margin: "0 auto", textAlign: "left" }}>
          <Typography variant="caption">
            {" "}
            Present | Absent | Paid | Unpaid{" "}
          </Typography>
        </div>
        {typeof studentNameLists === "object" &&
          studentNameLists.map((student) => (
            <BooleanRadioBox
              label={`${student.firstName} ${student.lastName}`}
              value={
                requestedStudents.includes(student._id)
                  ? "unpaid"
                  : requestedPaidStudents.includes(student._id)
                  ? "paid"
                  : studentAttendance.includes(student._id)
                  ? "present"
                  : absentees.includes(student._id)
                  ? "absent"
                  : ""
              }
              onChange={(name) => changeIt(name,student._id)}
            />
          ))}
        <Button
          style={{ width: "140px", margin: "40px 0" }}
          variant="contained"
          color="primary"
          onClick={postAttendance}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default EditAttendance;
