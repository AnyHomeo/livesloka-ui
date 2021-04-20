import MaterialTable from 'material-table';
import React, { useEffect, useState } from 'react'
import { getData } from '../../../Services/Services';

function NewTeacherData() {

    const [categoryLookup, setCategoryLookup] = useState({});
    const [item, setitem] = useState("Teacher");
    const [data, setData] = useState([])

    useEffect(() => {
        getData("Teacher").then(data => {
            console.log(data.data.result)
            setData(data.data.result)
        })
        getData("Category").then((data) => {
          let dummyLookup = {};
          data.data.result.forEach((data) => {
            dummyLookup[data.id] = data.categoryName;
          });
          setCategoryLookup(dummyLookup);
        });
      }, []);

    return (
        <MaterialTable
        style={{
            margin:"20px",
            padding:"20px"
        }}
        title="Teacher Data"
            columns={[
            {
                field:"TeacherName",
                title:"Teacher Name"
            },
            {
                field:"teacherMail",
                title:"Teacher Mail"
            },
            {
                field:"Phone_number",
                title:"Phone Number"
            },
            {
                field:"TeacherDesc",
                title:"Teacher Description"
            },
            {
                field:"category",
                title:"Subject",
                lookup:categoryLookup
            },
            {
                field:"leaveDifferenceHours",
                title:"Leave Difference Hours "
            }
        ]}
        data={data}
        options={{
            paging:false
        }}
        />
    )
}

export default NewTeacherData
