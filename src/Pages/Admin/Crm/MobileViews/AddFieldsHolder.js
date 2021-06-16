/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from "react"
import MaterialTable, {MTableBodyRow} from "material-table"
import MuiAlert from "@material-ui/lab/Alert"

import {Chip, CircularProgress, Snackbar, TextField} from "@material-ui/core"
import {Autocomplete} from "@material-ui/lab"
import {firebase} from "../../../../Firebase"
import {getData} from "../../../../Services/Services"
import useWindowDimensions from "../../../../Components/useWindowDimensions"
import AddFieldsMobile from "./AddFieldsMobile"

const AddFieldsHolder = ({name, status, lookup, categoryLookup, statusMob, category}) => {
	const [data, setData] = useState([])

	const [loading, setLoading] = useState(true)
	const [open, setOpen] = useState(false)
	const [success, setSuccess] = useState(false)
	const [response, setResponse] = useState("")
	const {height} = useWindowDimensions()
	const [imageLoading, setImageLoading] = useState(false)
	useEffect(() => {
		fetchTableData()
	}, [])

	const fetchTableData = () => {
		getData(name).then((response) => {
			console.log(response)
			setData(response.data.result)
			setLoading(false)
		})
	}

	const getbackdata = (res) => {
		if (res === 200) {
			console.log("HEllo")
			fetchTableData()
		}
	}
	const handleFileUpload = async (e, props) => {
		setImageLoading(true)
		if (e.target.files) {
			let storageRef = firebase.storage().ref(`${e.target.files[0].type}/${e.target.files[0].name}`)
			await storageRef.put(e.target.files[0])

			storageRef
				.getDownloadURL()
				.then(async (url) => {
					if (url) {
						setImageLoading(false)
						return props.onChange(url)
					} else {
						setImageLoading(false)
					}
				})
				.catch((err) => {
					console.log(err)
					setImageLoading(false)
				})
		}
	}

	return (
		<>
			{data.map((item) => {
				return (
					<AddFieldsMobile
						data={item}
						name={name}
						categoryData={category}
						statusData={statusMob}
						getbackdata={getbackdata}
					/>
				)
			})}
		</>
	)
}
export default AddFieldsHolder
