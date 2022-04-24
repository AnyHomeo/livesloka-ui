import {Chip, makeStyles} from "@material-ui/core"
import React, {useCallback, useEffect, useState} from "react"
import Teacher from "../../Images/teacher.png"
import money from "../../Images/money.png"
import "./Datacard.css"
import {Comment, WhatsApp} from "@material-ui/icons"
import {getComments, getCommentsByCustomerIds} from "../../Services/Services"
import {MessageCircle} from "react-feather"
const DataCard = ({
	data,
	provided,
	snapshot,
	setSelectedCommentsCustomerId,
	drawerState,
	setDrawerState,
	editCustomerData,
	setEditCustomerData,
	setSelectedCustomer,
}) => {
	const useStyles = makeStyles({
		root: {
			userSelect: "none",
			// padding: 5,
			margin: "0 0 8px 0",
			minHeight: "50px",
			backgroundColor: snapshot.isDragging ? "#70a1ff" : "white",
			boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
			borderRadius: 5,
			...provided.draggableProps.style,
			overflow: "hidden",
		},
	})
	const classes = useStyles()

	return (
		<div
			className={classes.root}
			ref={provided.innerRef}
			{...provided.draggableProps}
			{...provided.dragHandleProps}
			onClick={() => {
				setEditCustomerData({...editCustomerData, right: true})
				setSelectedCustomer(data)
			}}
		>
			<div className="fontchange" style={{padding: 10}}>
				<span style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
					<p style={{fontSize: 15, fontWeight: 550, marginTop: 2}}>{data.lastName}</p>
					<WhatsApp
						onClick={() =>
							window.open(
								`https://api.whatsapp.com/send?phone=${
									data.whatsAppnumber.indexOf("+") !== -1
										? data.whatsAppnumber.split("+")[1].split(" ").join("")
										: data.countryCode
										? data.countryCode + data.whatsAppnumber.split(" ").join("")
										: data.whatsAppnumber.split(" ").join("")
								}`
							)
						}
						style={{height: 20, width: 20, color: "#27ae60"}}
					/>
				</span>
				<span style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
					<p style={{fontSize: 12, fontWeight: 500, marginTop: 2}}>
						{data.firstName} {data.age && <>({data.age})</>}
					</p>
					<MessageCircle
						onClick={() => {
							setSelectedCommentsCustomerId(data._id)
							setDrawerState({...drawerState, left: true})
						}}
						style={{height: 20, width: 20}}
					/>
				</span>

				<p style={{fontSize: 12, fontWeight: 500, marginTop: 2}}>{data?.teacher?.TeacherName}</p>
				<p style={{fontSize: 12, fontWeight: 500, marginTop: 2}}>{"Apr 15 09:30 PM"}</p>

				<p style={{fontSize: 12, fontWeight: 500, marginTop: 2}}>{`$${data.proposedAmount}.00`}</p>
			</div>

			<div style={{display: "flex", justifyContent: "space-between"}}>
				<div
					style={{
						marginRight: 76,
						backgroundColor: "white",
						marginTop: 5,
						width: "50%",
						height: 25,
						width: 50,
						backgroundColor: "#e74c3c",
						borderTopRightRadius: 15,
						borderBottomRightRadius: 15,
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						marginBottom: 10,
						flex: 0.3,
					}}
				>
					<p style={{fontSize: 12, color: "white"}}>{data?.timeZone?.timeZoneName}</p>
				</div>

				<div
					style={{
						backgroundColor: "white",
						marginTop: 5,
						height: 25,
						width: "50%",
						backgroundColor: "#3867d6",
						borderTopLeftRadius: 15,
						borderBottomLeftRadius: 15,
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						marginBottom: 10,
						flex: 0.5,
					}}
				>
					<p style={{fontSize: 12, color: "white", padding: 10}}>{data?.subject?.subjectName}</p>
				</div>
			</div>
		</div>
	)
}

export default DataCard
