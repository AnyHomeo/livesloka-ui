import MaterialTable from 'material-table'
import React from 'react'
import useWindowDimensions from '../../../Components/useWindowDimensions'

function SummerCampsCustomerTable() {

    const { width,height } = useWindowDimensions()

    return (
        <MaterialTable
            style={{
                padding:"20px",
                margin:"20px"
            }}
            title="Summer Camp Customers"
            columns={[
                {
                    title: 'Student',
                    field: "firstName",
                },
                {
                    title: 'Parent',
                    field: "lastName",
                },
                {
                    title: 'Email',
                    field: "email",
                },
                {
                    title: 'Phone/Whatsapp Number',
                    field: "whatsAppnumber",
                },
                {
                    title: 'Subject',
                    field: "subjectId",
                },
                {
                    title:"Teacher",
                    field:"teacherId"
                }
            ]}
            options={{
                paging:false,
                actionsColumnIndex: 0,
                addRowPosition: "first",
                maxBodyHeight: height - 220,
                exportButton: true,
                rowStyle: (rowData) => ({
                  backgroundColor: "#fff",
                  color: "#000",
                }),
            }}
        />
    )
}

export default SummerCampsCustomerTable
