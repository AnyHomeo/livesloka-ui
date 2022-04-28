import {makeStyles, Menu} from "@material-ui/core"
import React, {useState} from "react"
import {MoreVertical} from "react-feather"
import {colorArr} from "../../Services/ColorArr"

const StatusColumn = ({data, drawerState, setDrawerState, statusData, setStatusData}) => {
	const useStyles = makeStyles({
		root: {
			height: 60,
			width: 220,
			borderTop: `4px solid ${
				colorArr[
					data?.data?.classStatusName
						? data?.data?.classStatusName.charCodeAt(0) - 64
						: "random".charCodeAt(0) - 64
				]
			}`,
			borderRadius: 3,
			padding: 5,
			background: "white",
			// marginBottom: 15,
			boxShadow: "rgba(0, 0, 0, 0.05) 0px 1px 2px 0px",
		},
	})
	const classes = useStyles()

	const [userFilterMenu, setUserFilterMenu] = useState(null)

	const handleClick = (event) => setUserFilterMenu(event.currentTarget)

	return (
		<div className={classes.root}>
			<div>
				<Menu
					anchorEl={userFilterMenu}
					keepMounted={false}
					open={Boolean(userFilterMenu)}
					onClose={() => setUserFilterMenu(null)}
				>
					<div style={{width: 200, height: "auto", cursor: "pointer"}}>
						<div style={{padding: 5}}>
							<p>Card 1</p>
						</div>
						<div style={{padding: 5}}>
							<p>Card 2</p>
						</div>
						<div style={{padding: 5}}>
							<p>Card 3</p>
						</div>
					</div>
				</Menu>
			</div>

			<span style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
				<p
					onClick={() => {
						setDrawerState({...drawerState, right: true})
						setStatusData(data)
					}}
					style={{fontWeight: 600, cursor: "pointer"}}
				>
					{data.data.classStatusName}
				</p>
				<MoreVertical style={{height: 20, width: 20}} onClick={handleClick} />
			</span>
			<span style={{display: "flex", justifyContent: "space-between"}}>
				<p style={{fontSize: 14}}>{"$50.00"}</p>
				<p style={{fontSize: 14, color: "#2d3436"}}> {data.data.admission} Admission</p>
			</span>
		</div>
	)
}

export default StatusColumn
