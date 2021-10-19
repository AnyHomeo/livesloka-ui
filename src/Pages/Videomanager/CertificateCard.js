import React from "react"
import {IconButton, makeStyles} from "@material-ui/core"
import {Edit, Play, Trash} from "react-feather"
import {useParams} from "react-router-dom"
import Axios from "axios"
import {useConfirm} from "material-ui-confirm"

const useStyles = makeStyles(() => ({
	folderCard: {
		height: 250,
		width: 250,
		borderRadius: 10,
		display: "flex",
		alignItems: "center",
		cursor: "pointer",
		margin: 10,
		flexDirection: "column",
		overflow: "hidden",
		backgroundColor: "white",
		boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
	},
}))

const CertificateCard = ({
	item,
	getBackData,
	setUpdateCertificateData,
	setUpdateCertificateFlag,
	setOpen,
	open,
}) => {
	const classes = useStyles()
	const confirm = useConfirm()
	let pdf = item?.image
	let pdfregExp = /%2..*%2F(.*?)\?alt/
	let pdfmatch = pdf.match(pdfregExp)
	const deleteCertificate = async () => {
		confirm({title: "Do you want to Delete the certificate?", confirmationText: "Delete"}).then(
			async () => {
				try {
					const data = await Axios.post(
						`${process.env.REACT_APP_API_KEY}/admin/delete/Videos/${item.id}`
					)

					if (data.status === 200) {
						getBackData(true)
					}
				} catch (error) {
					console.log(error)
				}
			}
		)
	}

	const updateCertificate = () => {
		setOpen(!open)
		setUpdateCertificateFlag(true)
		setUpdateCertificateData(item)
	}

	return (
		<div className={classes.folderCard}>
			{pdfmatch[1].split(".")[1] === "jpg" ||
			pdfmatch[1].split(".")[1] === "jpeg" ||
			pdfmatch[1].split(".")[2] === "jpeg" ? (
				<img
					src={item.image}
					style={{width: "100%", height: 200, objectFit: "contain"}}
					alt=""
					srcset=""
				/>
			) : (
				<object width="100%" height="400" data={item.image} type="application/pdf"></object>
			)}

			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					width: "100%",
					padding: 10,
					flexDirection: "column",
				}}
			>
				<div>
					<div style={{display: "flex"}}>
						<p style={{marginLeft: 10, fontWeight: "bold"}}>{item.name}</p>
					</div>
				</div>
				<div>
					<div>
						<IconButton onClick={deleteCertificate}>
							<Trash />
						</IconButton>
						<IconButton onClick={updateCertificate}>
							<Edit />
						</IconButton>
					</div>
				</div>
			</div>
		</div>
	)
}

export default CertificateCard
