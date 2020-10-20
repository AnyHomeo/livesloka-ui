import React, { useState, useEffect } from "react";
import MaterialTable, { MTableBodyRow } from "material-table";
import { css } from "@emotion/core";
import { ClipLoader } from "react-spinners";
import MuiAlert from "@material-ui/lab/Alert";
import { getData, addInField, editField, deleteField } from "../Services/Services";
import { Snackbar } from "@material-ui/core";

const MaterialTableAddFields = ({ name, status, lookup,id }) => {
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
            if (key.endsWith("Id")) {
              return { title: humanReadable(key), field: key, hidden: true };
            }
            if (key === status) {
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
          isDeleteHidden: (rowData) => (rowData && rowData.statusId) || data.length === 1,
          onRowAdd: (newData) =>{
            return addInField(`Add ${name}`, newData)
            .then((fetchedData) => {
              if (fetchedData.data.status === "OK") {
                if(fetchedData.data.result.classesStatus){
                  fetchedData.data.result.status = fetchedData.data.result.classesStatus
                }
                setData([...data, fetchedData.data.result]);
                setSuccess(true);
                setResponse(fetchedData.data.message);
                setOpen(true);
              } else {
                setSuccess(false);
                setResponse(fetchedData.data.message);
                setOpen(true);
              }
            })

            .catch((e) => {
              console.log(e, e.response);
            })
          },
          onRowUpdate: (newData, oldData) => {
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
          deleteField(`Delete ${name}`,oldData[id])
          .then(fetchedData => {
            if(fetchedData.data.status === "OK"){
              const dataDelete = [...data];
              const index = oldData.tableData.id;
              dataDelete.splice(index, 1);
              setData([...dataDelete]);
              setSuccess(true);
              setResponse(fetchedData.data.message);
              setOpen(true);
            } else {
              setSuccess(false);
              setResponse(fetchedData.data.message || "Something went wrong,Try again later" );
              setOpen(true);
            }
          })
          .catch(err => {
            console.log(err,err.response)
            setSuccess(false);
            setResponse("Something went wrong,Try again later");
            setOpen(true);
          })
        }}
      />
    </>
  );
};
export default MaterialTableAddFields;
