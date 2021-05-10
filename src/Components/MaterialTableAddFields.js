/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import MaterialTable, { MTableBodyRow } from "material-table";
import MuiAlert from "@material-ui/lab/Alert";
import {
  getData,
  addInField,
  editField,
  deleteField,
} from "../Services/Services";
import { Chip, CircularProgress, Snackbar, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import useWindowDimensions from "./useWindowDimensions";
import { isAutheticated } from "../auth";
import { firebase } from "../Firebase";
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

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function humanReadable(name) {
  var words = name.match(/[A-Za-z][^_\-A-Z]*|[0-9]+/g) || [];

  return words.map(capitalize).join(" ");
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.substring(1);
}

const MaterialTableAddFields = ({ name, status, lookup, categoryLookup }) => {
  const [column, setColumn] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [response, setResponse] = useState("");
  const { height } = useWindowDimensions();
  const [imageLoading, setImageLoading] = useState(true);
  useEffect(() => {
    getData(name).then((response) => {
      setData(response.data.result);
      console.log(response.data.result);
      setLoading(false);
    });
  }, []);

  const handleFileUpload = async (e, props) => {
    setImageLoading(false);

    if (e.target.files) {
      let storageRef = firebase
        .storage()
        .ref(`${e.target.files[0].type}/${e.target.files[0].name}`);
      await storageRef.put(e.target.files[0]);

      storageRef.getDownloadURL().then(async (url) => {
        if (url) {
          return props.onChange(url);
        }
      });
    }

    setImageLoading(true);
  };
  useEffect(() => {
    if (data.length) {
      let lengths = data.map((item) => Object.keys(item).length);
      let v = Object.keys(data[lengths.indexOf(Math.max(...lengths))]).map(
        (key) => {
          if (name === "Teacher" && key === "isDemoIncludedInSalaries") {
            return {
              title: "Include Demo Classes in Salaries",
              type: "boolean",
              field: "isDemoIncludedInSalaries",
            };
          }
          if (name === "Teacher" && key === "category") {
            return {
              title: "Category",
              field: key,
              lookup: categoryLookup,
            };
          }
          if (
            key === "zoomJwt" ||
            key === "zoomSecret" ||
            key === "zoomApi" ||
            key === "summerCampDescription" ||
            key == "summerCampImageLink"
          ) {
            return {
              title: humanReadable(key),
              field: key,
              render: (rowData) => (
                <span>
                  {rowData[key]
                    ? rowData[key].slice(0, 6) +
                      "...." +
                      rowData[key].slice(-10)
                    : ""}
                </span>
              ),
            };
          }
          if (
            key === "timeSlots" ||
            key === "id" ||
            key === "_id" ||
            key === "statusId" ||
            key === "tableData"
          ) {
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
          } else if (key === "amount") {
            return {
              title: humanReadable(key),
              field: key,
              type: "numeric",
              align: "left",
            };
          } else if (key === "AgentRole") {
            return {
              title: humanReadable(key),
              field: key,
              type: "",
              lookup: { 3: "Admin", 4: "Sales", 5: "Customer Support" },
              editable: !(isAutheticated().roleId == 3) ? "never" : undefined,
            };
          } else if (key === "teacherImageLink") {
            return {
              title: humanReadable(key),
              field: key,
              type: "file",
              cellStyle: { whiteSpace: "nowrap" },
              headerStyle: { whiteSpace: "nowrap" },
              render: (rowData) => {
                return (
                  <span>
                    {rowData[key] === "" ? null : (
                      <img
                        style={{ height: 50, width: 50 }}
                        src={rowData[key]}
                        alt=""
                      />
                    )}
                  </span>
                );
              },
              editComponent: (props) => (
                <input
                  type="file"
                  onChange={(e) => handleFileUpload(e, props)}
                />
              ),
            };
          } else {
            return { title: humanReadable(key), field: key };
          }
        }
      );
      setColumn(v);
    }
  }, [lookup, categoryLookup, data]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => handleClose()}
      >
        <Alert
          onClose={() => handleClose()}
          severity={success ? "success" : "warning"}
        >
          {response}
        </Alert>
      </Snackbar>
      <MaterialTable
        title={`${name} Table`}
        columns={column}
        isLoading={loading}
        options={{
          paging: false,
          maxBodyHeight: height - 230,
          addRowPosition: "first",
          actionsColumnIndex: -1,
          exporting: true,
        }}
        components={{
          Row: (props) => (
            <MTableBodyRow
              {...props}
              onDoubleClick={(e) => {
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
            newData.isDemoIncludedInSalaries = !!newData.isDemoIncludedInSalaries;
            return addInField(`Add ${name}`, newData)
              .then((fetchedData) => {
                if (fetchedData.data.status === "ok") {
                  if (fetchedData.data.result.classesStatus) {
                    fetchedData.data.result.status =
                      fetchedData.data.result.classesStatus;
                  }
                  const { id, _id } = fetchedData.data.result;
                  newData = { ...newData, id, _id };
                  setData([...data, newData]);
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
                console.error(e, e.response);
              });
          },
          onRowUpdate: (newData, oldData) => {
            console.log(newData);
            newData.isDemoIncludedInSalaries = !!newData.isDemoIncludedInSalaries;

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
                console.error(err, err.response);
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
