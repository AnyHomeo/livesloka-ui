import React from "react"
import {Grid} from "@material-ui/core"
import Videocard from "./Videocard"
const VideoPage = ({data, getBackData, open, setOpen, setUpdateVidoeFlag, setUpdateVideoData}) => {
	let array = []
	data &&
		data.forEach((item) => {
			if (item.url !== "") {
				array.push(item)
			}
		})
	return (
		<Grid container direction="row" justifyContent="center" alignItems="center">
			{array &&
				array.map((item) => (
					<Grid item sm={3} key={item._id}>
						<Videocard
							item={item}
							getBackData={getBackData}
							open={open}
							setOpen={setOpen}
							setUpdateVidoeFlag={setUpdateVidoeFlag}
							setUpdateVideoData={setUpdateVideoData}
						/>
					</Grid>
				))}
		</Grid>
	)
}

export default VideoPage
