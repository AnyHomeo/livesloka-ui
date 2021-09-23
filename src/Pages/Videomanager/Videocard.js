import {IconButton, makeStyles} from "@material-ui/core"
import {Play} from "react-feather"
import React, {useState} from "react"
import Vimeo from "@u-wave/react-vimeo"
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

const Videocard = ({item}) => {
	const [playVideo, setPlayVideo] = useState(false)
	let url = item.url
	let regExp = /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(?:(?:[a-z0-9]*\/)*\/?)?([0-9]+)/
	let match = url.match(regExp)
	const classes = useStyles()

	if (item.url === "") {
		let pdf = item.image
		let pdfregExp = /%2..*%2F(.*?)\?alt/
		let pdfmatch = pdf.match(pdfregExp)
		console.log(pdfmatch)
		return (
			<div className={classes.folderCard}>
				{pdfmatch[1].split(".")[1] === "jpg" || pdfmatch[1].split(".")[1] === "jpeg" ? (
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
						justifyContent: "space-between",
						alignItems: "center",
						width: "100%",
						padding: 10,
					}}
				>
					<div>
						<div style={{display: "flex"}}>
							<p style={{marginLeft: 10, fontWeight: "bold"}}>{item.name}</p>
						</div>
					</div>
				</div>
			</div>
		)
	}
	return (
		<div className={classes.folderCard}>
			{match && <Vimeo paused={playVideo} width="250px" height="150px" video={match[1]} />}

			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					width: "100%",
					padding: 10,
				}}
			>
				<div>
					<div style={{display: "flex"}}>
						<p style={{marginLeft: 10, fontWeight: "bold"}}>{item.name}</p>
					</div>
				</div>
				<div>
					<div>
						<IconButton
							style={{
								backgroundColor: "#3867d6",
								boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
								height: 40,
								width: 40,
							}}
						>
							<Play onClick={() => setPlayVideo(!playVideo)} style={{color: "white"}} />
						</IconButton>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Videocard
