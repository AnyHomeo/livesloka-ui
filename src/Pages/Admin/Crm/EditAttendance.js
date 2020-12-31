import React, { useState, useEffect } from "react";
import moment from "moment";
import { withStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { Button } from "@material-ui/core";

import { Redirect } from "react-router-dom";
import {
  getScheduleAndDateAttendance,
  getStudentList,
  postStudentsAttendance,
} from "../../../Services/Services";
import { setDate } from "date-fns";

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
  useEffect(() => {
    studentListNAttendance();
  }, []);

  const [studentNameLists, setStudentNameLists] = useState([]);
  const [studentAttendance, setStudentAttendance] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const [requestedStudents, setRequestedStudents] = useState([]);

  const studentListNAttendance = async () => {
    const { data } = await getStudentList(match.params.scheduleId);
    console.log(data.result.students);
    setStudentNameLists(data.result.students);

    const res = await getScheduleAndDateAttendance(
      match.params.scheduleId,
      match.params.date
    );
    console.log(res.data.result);
    setStudentAttendance(
      res.data.result && res.data.result.customers
        ? res.data.result.customers
        : []
    );
    setRequestedStudents(
      res.data.result && res.data.result.customers
        ? res.data.result.requestedStudents
        : []
    );
  };

  const handleChange = (state, setState, id, other) => {
    if (!other.includes(id)) {
      if (state.includes(id)) {
        setState((prev) => {
          let tempAttendance = [...prev];
          let index = tempAttendance.indexOf(id);
          tempAttendance.splice(index, 1);
          return tempAttendance;
        });
      } else {
        setState((prev) => [...prev, id]);
      }
    }
  };

  const postAttendance = async () => {
    try {
      const formData = {
        date: match.params.date,
        scheduleId: match.params.scheduleId,
        customers: studentAttendance,
        requestedStudents,
      };
      console.log(formData);
      const data = await postStudentsAttendance(formData);
      console.log(data);
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

  return (
    <div>
      <h2
        style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px" }}
      >
        Edit Students Attendance
      </h2>
      <div style={{ textAlign: "center" }}>
        <h2 style={{ fontSize: "20px" }}>{match.params.date}</h2>
        <h2 style={{ marginTop: "30px" }}> Mark Attended students below </h2>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "40px",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <FormGroup style={{ marginBottom: "20px" }}>
            {typeof studentNameLists === "object" &&
              studentNameLists.map((student, i) => (
                <FormControlLabel
                  key={i}
                  control={
                    <GreenCheckbox
                      checked={studentAttendance.includes(student._id)}
                      onChange={() =>
                        handleChange(
                          studentAttendance,
                          setStudentAttendance,
                          student._id,
                          requestedStudents
                        )
                      }
                    />
                  }
                  label={`${student.firstName} ${
                    student.lastName ? student.lastName : ""
                  }`}
                />
              ))}
          </FormGroup>
        </div>
        <h2 style={{ marginTop: "30px" }}> Mark Requested students below </h2>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "40px",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <FormGroup style={{ marginBottom: "20px" }}>
            {typeof studentNameLists === "object" &&
              studentNameLists.map((student, i) => (
                <FormControlLabel
                  key={i}
                  control={
                    <GreenCheckbox
                      checked={requestedStudents.includes(student._id)}
                      onChange={() =>
                        handleChange(
                          requestedStudents,
                          setRequestedStudents,
                          student._id,
                          studentAttendance
                        )
                      }
                    />
                  }
                  label={`${student.firstName} ${
                    student.lastName ? student.lastName : ""
                  }`}
                />
              ))}
          </FormGroup>
        </div>
        <Button
          style={{ width: "140px" }}
          variant="contained"
          onClick={postAttendance}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default EditAttendance;
