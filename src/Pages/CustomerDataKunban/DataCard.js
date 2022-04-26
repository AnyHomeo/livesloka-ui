import {Chip, makeStyles} from "@material-ui/core"
import React, {useCallback, useEffect, useState} from "react"
import Teacher from "../../Images/teacher.png"
import money from "../../Images/money.png"
import "./Datacard.css"
import {Comment, WhatsApp} from "@material-ui/icons"
import {getComments, getCommentsByCustomerIds} from "../../Services/Services"
import {MessageCircle} from "react-feather"
import {colorArr} from "../../Services/ColorArr"
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
			minHeight: "auto",
			backgroundColor: snapshot.isDragging ? "#70a1ff" : "white",
			boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
			borderRadius: 5,
			...provided.draggableProps.style,
			overflow: "hidden",
		},
	})
	const classes = useStyles()

	let randomColor = () => {
		return "#" + Math.floor(Math.random() * 16777215).toString(16)
	}
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
					{data.lastName && (
						<p style={{fontSize: 15, fontWeight: 550, marginTop: 2}}>{data.lastName}</p>
					)}

					{data.whatsAppnumber && (
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
					)}
				</span>
				<span style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
					{data.firstName && (
						<p style={{fontSize: 12, fontWeight: 500, marginTop: 2}}>
							{data.firstName} {data.age && <>({data.age})</>}
						</p>
					)}

					<MessageCircle
						onClick={() => {
							setSelectedCommentsCustomerId(data._id)
							setDrawerState({...drawerState, left: true})
						}}
						style={{height: 20, width: 20}}
					/>
				</span>
				{data?.teacher?.TeacherName && (
					<p style={{fontSize: 12, fontWeight: 500, marginTop: 2}}>{data?.teacher?.TeacherName}</p>
				)}

				{/* <p style={{fontSize: 12, fontWeight: 500, marginTop: 2}}>{"Apr 15 09:30 PM"}</p> */}

				{data.proposedAmount && (
					<p
						style={{fontSize: 12, fontWeight: 500, marginTop: 2}}
					>{`$${data.proposedAmount}.00`}</p>
				)}
			</div>

			{data?.timeZone?.timeZoneName && data?.subject?.subjectName ? (
				<div style={{display: "flex", justifyContent: "space-between"}}>
					{data?.timeZone?.timeZoneName ? (
						<div
							style={{
								marginRight: 76,
								backgroundColor: "white",
								marginTop: 5,
								width: "50%",
								height: 25,
								width: 50,
								backgroundColor:
									colorArr[
										data?.timeZone?.timeZoneName
											? data?.timeZone?.timeZoneName.charCodeAt(0) - 64
											: "random".charCodeAt(0) - 64
									],
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
					) : (
						<div
							style={{
								marginRight: 76,
								backgroundColor: "white",
								marginTop: 5,
								width: "50%",
								height: 25,
								width: 50,
								borderTopRightRadius: 15,
								borderBottomRightRadius: 15,
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								marginBottom: 10,
								flex: 0.3,
							}}
						></div>
					)}

					{data?.subject?.subjectName ? (
						<div
							style={{
								marginTop: 5,
								height: 25,
								width: "50%",
								backgroundColor:
									colorArr[
										data?.subject?.subjectName
											? data?.subject?.subjectName.charCodeAt(0) - 64
											: "random".charCodeAt(0) - 64
									],
								borderTopLeftRadius: 15,
								borderBottomLeftRadius: 15,
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								marginBottom: 10,
								flex: 0.5,
							}}
						>
							<p style={{fontSize: 12, color: "white", padding: 10}}>
								{data?.subject?.subjectName}
							</p>
						</div>
					) : (
						<div
							style={{
								marginTop: 5,
								height: 25,
								width: "50%",
								borderTopLeftRadius: 15,
								borderBottomLeftRadius: 15,
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								marginBottom: 10,
								flex: 0.5,
							}}
						></div>
					)}
				</div>
			) : null}

			{data?.teacher?.TeacherName ? (
				<div style={{display: "flex", justifyContent: "space-between", marginTop: -3}}>
					<div></div>
					<div
						style={{
							height: 25,
							width: "auto",
							backgroundColor:
								colorArr[
									data?.subject?.subjectName
										? data?.subject?.subjectName.charCodeAt(0) - 64
										: "random".charCodeAt(0) - 64
								],
							borderTopLeftRadius: 15,
							borderBottomLeftRadius: 15,
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							marginBottom: 10,
							flex: 0.5,
						}}
					>
						<p style={{fontSize: 12, fontWeight: 500, marginTop: 2, color: "white"}}>
							{data?.teacher?.TeacherName}
						</p>
					</div>
				</div>
			) : null}
		</div>
	)
}

export default DataCard
