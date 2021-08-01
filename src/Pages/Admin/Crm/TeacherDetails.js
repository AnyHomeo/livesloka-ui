import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { getData } from "../../../Services/Services";
import MaterialTableAddFields from "../../../Components/MaterialTableAddFields";
import TeacherDetailsTableMobile from "./MobileViews/TeacherDetailsTableMobile";
import useWindowDimensions from "../../../Components/useWindowDimensions";
import useDocumentTitle from "../../../Components/useDocumentTitle";

const useStyles = makeStyles((theme) => ({
  saveButton: {
    marginTop: "1.5rem",
    marginBottom: "2rem",
  },
  Startdate: {
    marginRight: "10px",
  },
  Starttime: {
    marginRight: "10px",
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
}));

export default function TeacherDetails() {
  useDocumentTitle("Teacher Details");
  const classes = useStyles();
  //states
  const [lookup, setLookup] = useState({});
  const [categoryLookup, setCategoryLookup] = useState({});
  const [item, setitem] = useState("Teacher");
  const [teachersdata, setTeachersdata] = useState();
  const [categoryData, setCategoryData] = useState();
  const [statusData, setStatusData] = useState();
  const [subjectsLookup, setSubjectsLookup] = useState({})
  useEffect(() => {
    getData("Status").then((data) => {
      let dummyLookup = {};
      data.data.result.forEach((data) => {
        dummyLookup[data.statusId] = data.statusName;
      });
      setLookup(dummyLookup);
      setStatusData(data);
    });
    getData("Category").then((data) => {
      let dummyLookup = {};
      data.data.result.forEach((data) => {
        dummyLookup[data.id] = data.categoryName;
      });
      setCategoryLookup(dummyLookup);
      setCategoryData(data);
    });
    getData("Subject").then((data) => {
      let dummyLookup = {};
      data.data.result.forEach((data) => {
        dummyLookup[data.id] = data.subjectName;
      });
      console.log(dummyLookup,data)
      setSubjectsLookup(dummyLookup);
      fetchTeachersData();
    });
  }, []);

  const { width } = useWindowDimensions();

  const getbackdata = (data) => {
    if (data === 200) {
      fetchTeachersData();
    }
  };

  const fetchTeachersData = async () => {
    try {
      const res = await getData("Teacher");
      if (res.status === 200) {
        setTeachersdata(res.data);
      }
    } catch (error) {}
  };

  return (
    <div style={{ width: "95%", margin: "0 auto", marginTop: "20px" }}>
      {width > 768 ? (
        <MaterialTableAddFields
          style={{ height: "100vh !important" }}
          name={item}
          status={"TeacherStatus"}
          lookup={lookup}
          categoryLookup={categoryLookup}
          subjectLookup={subjectsLookup}
        />
      ) : (
        <>
          {teachersdata &&
            teachersdata.result.map((item) => (
              <TeacherDetailsTableMobile
                key={item.id}
                data={item}
                categoryData={categoryData}
                statusData={statusData}
                getbackdata={getbackdata}
              />
            ))}
        </>
      )}
    </div>
  );
}
