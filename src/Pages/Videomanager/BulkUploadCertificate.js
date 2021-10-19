import {
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	CircularProgress,
	TextField,
} from "@material-ui/core"
import React, {useState, useEffect} from "react"
import {useDropzone} from "react-dropzone"
import {firebase} from "../../Firebase"
import Axios from "axios"
import {useSnackbar} from "notistack"
const thumbsContainer = {
	display: "flex",
	flexDirection: "row",
	flexWrap: "wrap",
	marginTop: 16,
}

const thumb = {
	display: "inline-flex",
	borderRadius: 2,
	marginBottom: 8,
	marginRight: 8,
	width: 100,
	height: 100,
	padding: 4,
	boxSizing: "border-box",
}

const thumbInner = {
	display: "flex",
	minWidth: 0,
	overflow: "hidden",
}

const img = {
	display: "block",
	width: "auto",
	height: "100%",
}

const BulkUploadCertificate = ({open, setOpen, category, getBackData}) => {
	const {enqueueSnackbar} = useSnackbar()
	const [files, setFiles] = useState([])
	const [loading, setLoading] = useState(false)
	const [certificateTitle, setCertificateTitle] = useState("")
	const {getRootProps, getInputProps} = useDropzone({
		multiple: true,
		accept: "image/*",
		onDrop: (acceptedFiles) => {
			setFiles((prevState) => [...prevState, ...acceptedFiles])
		},
	})

	const thumbs = files.map((file) => (
		<div style={thumb} key={file.name}>
			<div style={thumbInner}>
				<img src={URL.createObjectURL(file)} style={img} />
			</div>
		</div>
	))
	useEffect(
		() => () => {
			// Make sure to revoke the data uris to avoid memory leaks
			files.forEach((file) => URL.revokeObjectURL(file.preview))
		},
		[files]
	)

	const onBulkUpload = async () => {
		if (files.length > 0) {
			setLoading(true)
			let finalArr = []
			await Promise.all(
				files &&
					files.map(async (item) => {
						try {
							let splittedFile = item.name.split("~")
							let image = ""
							let storageRef = firebase.storage().ref(`${item.type}/${item.name}`)
							await storageRef.put(item)
							image = await storageRef.getDownloadURL()

							let email = Number.isInteger(parseInt(splittedFile[1].trim().split(".")[0]))
								? splittedFile[1].trim().split(".")[0]
								: `${splittedFile[1].trim().split(".")[0]}.com`
							let obj = {
								name: `${splittedFile[0].trim()} ${certificateTitle} certificate`,
								email,
								image,
								category,
							}
							finalArr.push(obj)
						} catch (error) {
							console.log("error" + error)
						}
					})
			)

			try {
				const data = await Axios.post(`${process.env.REACT_APP_API_KEY}/videos/bulk`, finalArr)

				if (data.status === 200) {
					enqueueSnackbar(`Bulk uploading successful`, {variant: "success"})
					setLoading(false)
					setOpen(false)
					getBackData(true)
				}
			} catch (error) {
				console.log(error)
				setLoading(false)
			}
		} else {
			enqueueSnackbar(`Select atleast one file`, {variant: "error"})
		}
	}

	function ValidateEmail(mail) {
		if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)) {
			return true
		}
		return false
	}

	return (
		<Dialog open={open} onClose={() => setOpen(false)}>
			<DialogTitle>Bulk Upload Certificates</DialogTitle>
			<DialogContent style={{display: "flex", flexDirection: "column"}}>
				<section
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						flexDirection: "column",
					}}
				>
					<TextField
						onChange={(e) => setCertificateTitle(e.target.value)}
						fullWidth
						label="Certificate Title"
						variant="outlined"
						style={{marginBottom: 10}}
						value={certificateTitle}
					/>
					<div
						style={{
							width: 500,
							height: 150,
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							border: "1px dotted black",
						}}
						{...getRootProps({className: "dropzone"})}
					>
						<input {...getInputProps()} />
						<p>Drag 'n' drop some files here, or click to select files</p>
					</div>
					<aside style={thumbsContainer}>{thumbs}</aside>
				</section>

				<Button disabled={loading} variant="contained" color="primary" onClick={onBulkUpload}>
					{loading ? (
						<CircularProgress style={{color: "white", height: 30, width: 30}} />
					) : (
						"Submit"
					)}
				</Button>
			</DialogContent>
		</Dialog>
	)
}

export default BulkUploadCertificate
