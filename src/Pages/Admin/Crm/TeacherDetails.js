import React, { useState, useEffect } from "react";
import { getData } from "../../../Services/Services";
import MaterialTableAddFields from "../../../Components/MaterialTableAddFields";
import TeacherDetailsTableMobile from "./MobileViews/TeacherDetailsTableMobile";
import useWindowDimensions from "../../../Components/useWindowDimensions";
import useDocumentTitle from "../../../Components/useDocumentTitle";

export default function TeacherDetails() {
  useDocumentTitle("Teacher Details");

  const item = "Teacher"

  const [lookup, setLookup] = useState({});
  const [categoryLookup, setCategoryLookup] = useState({});
  const [teachersdata, setTeachersdata] = useState();
  const [categoryData, setCategoryData] = useState();
  const [statusData, setStatusData] = useState();
  const [subjectsLookup, setSubjectsLookup] = useState({});
  const [selectedSubject, setSelectedSubject] = useState('');

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
    } catch (error) {
      console.error(error);
    }
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
          selectedSubject={selectedSubject}
          setSelectedSubject={setSelectedSubject}
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
