/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import MaterialTable, { MTableBodyRow } from "material-table";
import { css } from "@emotion/core";
import { ClipLoader } from "react-spinners";
import MuiAlert from "@material-ui/lab/Alert";
import {
  getData,
  addInField,
  editField,
  deleteField,
} from "../Services/Services";
import { Chip, Snackbar, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

const DropdownEditor = ({ onChange, value }) => {
  const [arr, setArr] = useState(value);
  return (
    <Autocomplete
      multiple
      options={[
        { _id: "2345455", className: "CLASS OLD" },
        { _id: "12345", className: "class1" },
        { _id: "12348", className: "class2" },
        { _id: "12349", className: "class3" },
      ]}
      value={arr}
      filterSelectedOptions
      getOptionSelected={(option) => arr.map((i) => i._id).includes(option._id)}
      getOptionLabel={(option) => option.className}
      onChange={(_, newVal) => {
        setArr(newVal);
        onChange(newVal);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={"Subjects"}
          variant="standard"
          margin="dense"
        />
      )}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            variant="outlined"
            label={option.className}
            {...getTagProps({ index })}
          />
        ))
      }
    />
  );
};

const MaterialTableAddFields = ({ name, status, lookup }) => {
  const [column, setColumn] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [response, setResponse] = useState("");

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const loaderCss = css`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  `;

  function humanReadable(name) {
    var words = name.match(/[A-Za-z][^_\-A-Z]*|[0-9]+/g) || [];

    return words.map(capitalize).join(" ");
  }

  function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.substring(1);
  }

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    getData(name)
      .then((data) => {
        setColumn(
          Object.keys(data.data.result[0]).map((key) => {
            if (key === "id" || key === "statusId") {
              return { title: humanReadable(key), field: key, hidden: true };
            } else if (key === "TeacherSubjectsId") {
              return {
                title: humanReadable(key),
                field: key,
                render: (rowData) =>
                  rowData[key] &&
                  rowData[key].map((subject) => (
                    <Chip
                      variant="outlined"
                      key={subject._id}
                      label={subject.className}
                    />
                  )),
                editComponent: (props) => (
                  <DropdownEditor
                    {...props}
                    value={[{ _id: "2345455", className: "CLASS OLD" }]}
                  />
                ),
              };
            } else if (key === status) {
              return { title: humanReadable(key), field: key, lookup };
            } else {
              return { title: humanReadable(key), field: key };
            }
          })
        );
        setData(data.data.result);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(true);
        console.log(err, err.response);
        setLoading(false);
      });
  }, [lookup]);

  if (loading) {
    return <ClipLoader size={48} color="blue" css={loaderCss} loading={true} />;
  }

  return (
    <>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={success ? "success" : "warning"}>
          {response}
        </Alert>
      </Snackbar>
      <MaterialTable
        title={`${name} Table`}
        columns={column}
        options={{
          paging: false,
          addRowPosition: "first",
          actionsColumnIndex: -1,
        }}
        components={{
          Row: (props) => (
            <MTableBodyRow
              {...props}
              onDoubleClick={(e) => {
                console.log(props.actions);
                props.actions[1]().onClick(e, props.data);
              }}
            />
          ),
        }}
        data={data}
        editable={{
          isDeleteHidden: (rowData) =>
            (rowData && rowData.statusId) || data.length === 1,
          onRowAdd: (newData) => {
            console.log(newData);
            return addInField(`Add ${name}`, newData)
              .then((fetchedData) => {
                if (fetchedData.data.status === "ok") {
                  console.log("inside");
                  if (fetchedData.data.result.classesStatus) {
                    fetchedData.data.result.status =
                      fetchedData.data.result.classesStatus;
                  }
                  setData([...data, fetchedData.data.result]);
                  setSuccess(true);
                  setResponse(fetchedData.data.message);
                  setOpen(true);
                  setLoading(false);
                } else {
                  setSuccess(false);
                  setResponse(fetchedData.data.message);
                  setOpen(true);
                  setLoading(false);
                }
              })

              .catch((e) => {
                console.log(e, e.response);
              });
          },
          onRowUpdate: (newData, oldData) => {
            console.log(newData);
            return editField(`Update ${name}`, newData).then((fetchedData) => {
              if (fetchedData.data.status === "OK") {
                const dataUpdate = [...data];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;
                setData([...dataUpdate]);
                setSuccess(true);
                setResponse(fetchedData.data.message);
                setOpen(true);
              } else {
                setSuccess(false);
                setResponse(fetchedData.data.message);
                setOpen(true);
              }
            });
          },
          onRowDelete: (oldData) =>
            deleteField(`Delete ${name}`, oldData["id"])
              .then((fetchedData) => {
                if (fetchedData.data.status === "ok") {
                  const dataDelete = [...data];
                  const index = oldData.tableData.id;
                  dataDelete.splice(index, 1);
                  setData([...dataDelete]);
                  setSuccess(true);
                  setResponse(fetchedData.data.message);
                  setOpen(true);
                } else {
                  setSuccess(false);
                  setResponse(
                    fetchedData.data.message ||
                      "Something went wrong,Try again later"
                  );
                  setOpen(true);
                }
              })
              .catch((err) => {
                console.log(err, err.response);
                setSuccess(false);
                setResponse("Something went wrong,Try again later");
                setOpen(true);
              }),
        }}
      />
    </>
  );
};
export default MaterialTableAddFields;
