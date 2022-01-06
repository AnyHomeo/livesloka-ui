import {Close, Delete, Edit} from "@material-ui/icons"
import React, {useState} from "react"
import ResponseForm from "./ResponseForm"

const Response = ({responses, removeResponse, updateResponse}) => {
	const [edit, setEdit] = useState({
		id: null,
		value: "",
	})

	const submitUpdate = (value) => {
		updateResponse(edit.id, value)
		setEdit({
			id: null,
			value: "",
		})
	}

	if (edit.id) {
		return <ResponseForm edit={edit} onSubmit={submitUpdate} />
	}

	return responses.map((response, index) => (
		<div className={response.isComplete ? "response-row complete" : "response-row"} key={index}>
			<div key={response.id}>{response.text}</div>
			<div className="icons">
				<Edit
					onClick={() => setEdit({id: response.id, value: response.text})}
					className="edit-icon"
				/>
				<Delete onClick={() => removeResponse(response.id)} className="delete-icon" />
			</div>
		</div>
	))
}

export default Response
