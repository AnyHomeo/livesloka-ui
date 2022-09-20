import React from "react"
import useDocumentTitle from "../../../Components/useDocumentTitle"
import CustomerData from "../Crm/CustomerData"

function SummerCampsCustomerTable() {
	useDocumentTitle("Summer camp data")

	return <CustomerData isSummerCampStudents />
}

export default SummerCampsCustomerTable
