import MaterialTable from "material-table";
import React from "react";
import useWindowDimensions from "./../../Components/useWindowDimensions";
import { Axios } from "axios";
import { deleteALeave, getAllLeaves, updateLeave } from "./../../Services/Services";
import { useEffect } from "react";
import { useState } from "react";
import { Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

function LeavesTable() {
  const { height } = useWindowDimensions();
  const [rows, setRows] = useState([]);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [response, setResponse] = useState("");

  useEffect(() => {
    getAllLeaves()
      .then((data) => {
        setRows(
          data.data.result.map((leave) => ({
            _id:leave._id,
            firstName: leave.studentId.firstName,
            lastName: leave.studentId.lastName,
            className: leave.scheduleId.className,
            cancelledDate: leave.cancelledDate,
          }))
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  let columns = [
    {
      title: "First Name",
      field: "firstName",
      type: "string",
      editable:"never"
    },
    {
      title: "Last Name",
      field: "lastName",
      type: "string",
      editable:"never"

    },
    {
      title: "Class Name",
      field: "className",
      editable:"never",
      type: "string",
    },
    {
      title: "Date",
      field: "cancelledDate",
      type: "date",
    },
  ];

  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarOpen(false);
  };

  return (
    <div>
      <Snackbar
        open={snackBarOpen}
        autoHideDuration={6000}
        onClose={handleSnackBarClose}
      >
        <Alert
          onClose={handleSnackBarClose}
          severity={success ? "success" : "warning"}
        >
          {response}
        </Alert>
      </Snackbar>
      <h1
        style={{
          textAlign: "center",
        }}
      >
        {" "}
        Leaves Applied by Customers{" "}
      </h1>
      <MaterialTable
        title=""
        columns={columns}
        style={{
          margin: "20px",
          padding: "20px",
        }}
        data={rows}
        options={{
          exportButton: true,
          paging: false,
          maxBodyHeight: height - 240,
        }}
        editable={{
            onRowUpdate: (newData, oldData) => {
                return updateLeave(newData)
                  .then((fetchedData) => {
                    if (fetchedData.data) {
                      const dataUpdate = [...rows];
                      const index = oldData.tableData.id;
                      dataUpdate[index] = newData;
                      setRows([...dataUpdate]);
                      setSuccess(true);
                      setResponse(fetchedData.data.message);
                      setSnackBarOpen(true);
                    } else {
                      setSuccess(false);
                      setResponse(
                        fetchedData.data.error ||
                          "Something went wrong,Try again later"
                      );
                      setSnackBarOpen(true);
                    }
                  })
                  .catch((err) => {
                    console.error(err);
                    setSuccess(false);
                    setResponse("Something went wrong,Try again later");
                    setSnackBarOpen(true);
                  });

            },
            onRowDelete: (oldData) =>
              deleteALeave(oldData._id)
                .then((res) => {
                  const dataDelete = [...rows];
                  const index = oldData.tableData.id;
                  dataDelete.splice(index, 1);
                  setRows([...dataDelete]);
                  setSuccess(true);
                  setResponse(res.data.message);
                  setSnackBarOpen(true);
                })
                .catch((err) => {
                  console.error(err, err.response);
                  setSuccess(false);
                  setResponse("unable to delete customer, Try again");
                  setSnackBarOpen(true);
                }),
          }}
      />
    </div>
  );
}

export default LeavesTable;
