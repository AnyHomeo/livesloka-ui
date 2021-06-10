import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { getDemoAndInclassStudents } from "../Services/Services";
import { Card } from "@material-ui/core";
import useDocumentTitle from "./useDocumentTitle";

function DemoAndInclassStudents() {
  useDocumentTitle("In Class");
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    getDemoAndInclassStudents()
      .then((data) => {
        setCustomers(data.data.result);
      })
      .catch((err) => {});
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
          padding: "20px",
        }}
      >
        <Card
          style={{
            textAlign: "center",
            padding: "20px",
          }}
        >
          {customers.filter((customer) => customer.demo).length}
          <div>Demo</div>
        </Card>
        <Card
          style={{
            textAlign: "center",
            padding: "20px",
          }}
        >
          {customers.filter((customer) => !customer.demo).length}
          <div>In class</div>
        </Card>
      </div>
      <MaterialTable
        title="Demo And Inclass Students"
        style={{
          padding: 20,
          margin: 20,
        }}
        data={customers}
        columns={[
          {
            title: "Demo",
            field: "demo",
            type: "boolean",
          },
          {
            title: "Student",
            field: "firstName",
            type: "string",
          },
          {
            title: "Parent",
            field: "lastName",
            type: "string",
          },
          {
            title: "Email",
            field: "email",
            type: "string",
          },
          {
            title: "Class",
            field: "className",
            type: "string",
          },
        ]}
        options={{
          exportButton: true,
          paging: false,
        }}
      />
    </>
  );
}

export default DemoAndInclassStudents;
