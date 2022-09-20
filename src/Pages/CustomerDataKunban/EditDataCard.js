import {Checkbox, FormControlLabel} from "@material-ui/core"
import React, {useState} from "react"
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd"
import {MoreVertical, XCircle} from "react-feather"
import {uuid} from "uuidv4"

let editableFields = [
	{
		id: uuid(),
		name: "Admission Name",
	},
	{
		id: uuid(),
		name: "Student Name",
	},
	{
		id: uuid(),
		name: "Age",
	},
	{
		id: uuid(),
		name: "Demo Date",
	},
	{
		id: uuid(),
		name: "Admission Owne",
	},
	{
		id: uuid(),
		name: "Parent Name",
	},
	{
		id: uuid(),
		name: "Amount + Closing Date",
	},
	{
		id: uuid(),
		name: "Description",
	},
]

const reorder = (list, startIndex, endIndex) => {
	const result = Array.from(list)
	const [removed] = result.splice(startIndex, 1)
	result.splice(endIndex, 0, removed)

	return result
}

function CheckBoxCard({data, index, lastElement}) {
	return (
		<Draggable draggableId={data.id} index={index}>
			{(provided) => (
				<div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
					<div
						style={{
							height: 50,
							width: "100%",
							borderTop: "1px solid #c8d6e5",
							borderBottom: lastElement[0].id === data.id ? "1px solid #c8d6e5" : "",
							padding: 5,
							display: "flex",
							alignItems: "center",
						}}
					>
						<div style={{marginTop: 5}}>
							<MoreVertical style={{color: "#576574"}} />
							<MoreVertical style={{marginLeft: -17, color: "#576574"}} />
						</div>

						<FormControlLabel
							style={{}}
							control={
								<Checkbox
									style={{color: "#27ae60"}}
									// checked={state.checkedA}
									// onChange={handleChange}
									name="checkedA"
								/>
							}
							label={data.name}
						/>
						{/* <p>{data.name}</p> */}
					</div>
				</div>
			)}
		</Draggable>
	)
}

const DragableCard = React.memo(function DragableCard({data}) {
	return data.map((item, index) => (
		<div>
			<CheckBoxCard data={item} index={index} key={item.id} lastElement={data.slice(-1)} />
		</div>
	))
})

function EditDataCard({drawerState, setDrawerState, statusData}) {
	const [state, setState] = useState({data: editableFields})

	console.log(statusData)
	function onDragEnd(result) {
		if (!result.destination) {
			return
		}

		if (result.destination.index === result.source.index) {
			return
		}

		const data = reorder(state.data, result.source.index, result.destination.index)

		setState({data})
	}

	return (
		<div style={{width: 300}}>
			<div
				style={{
					padding: 20,
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<p style={{fontWeight: 550, fontSize: 18}}>{statusData?.data?.classStatusName}</p>
				<div
					style={{
						height: 30,
						width: 30,
						borderRadius: "50%",
						backgroundColor: "#f1f2f6",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<XCircle
						onClick={() => setDrawerState({...drawerState, right: false})}
						style={{color: "#57606f"}}
					/>
				</div>
			</div>
			<div style={{paddingLeft: 20, paddingRight: 20, marginBottom: 20}}>
				<input
					style={{
						height: 40,
						width: "100%",
						borderRadius: 20,
						outline: "none",
						border: "2px solid #ced6e0",
						padding: 10,
					}}
					placeholder="Search"
				/>
			</div>

			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId="list">
					{(provided) => (
						<div ref={provided.innerRef} {...provided.droppableProps}>
							<DragableCard data={state.data} />
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>
		</div>
	)
}

export default EditDataCard
