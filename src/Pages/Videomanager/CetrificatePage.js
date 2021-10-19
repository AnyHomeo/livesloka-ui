import React from "react"
import {Grid} from "@material-ui/core"
import CertificateCard from "./CertificateCard"
const CertificatePage = ({
	data,
	getBackData,
	setUpdateCertificateFlag,
	setUpdateCertificateData,
	open,
	setOpen,
}) => {
	let array = []
	data &&
		data.map((item) => {
			if (item.image) {
				array.push(item)
			}
		})

	return (
		<Grid container direction="row" justifyContent="center" alignItems="center">
			{array &&
				array.map((item) => (
					<Grid item sm={3} key={item._id}>
						<CertificateCard
							item={item}
							getBackData={getBackData}
							setUpdateCertificateFlag={setUpdateCertificateFlag}
							setUpdateCertificateData={setUpdateCertificateData}
							open={open}
							setOpen={setOpen}
						/>
					</Grid>
				))}
		</Grid>
	)
}

export default CertificatePage
