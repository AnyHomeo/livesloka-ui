import React, {useEffect, useRef, useState} from "react"
import ResponseForm from "./ResponseForm"
import Response from "./Response"
import axios from "axios"

function ResponseList({responseMessages}) {
	const [responses, setResponses] = useState(responseMessages || [])
	const firstUpdate = useRef(true)

	useEffect(() => {
		if (firstUpdate.current) {
			firstUpdate.current = false
			return
		}
		const result = responses.map((el) => el.text)
		console.log("posting ")
		axios
			.post(`${process.env.REACT_APP_API_KEY}/updateResponseMessagesNonChat`, {
				responses: result,
			})
			.then(({data}) => {
				console.log(data)
			})
			.catch((err) => {
				console.log(err)
			})
	}, [responses])

	const addResponse = (response) => {
		if (!response.text || /^\s*$/.test(response.text)) {
			return
		}

		const newResponses = [response, ...responses]

		setResponses(newResponses)
		console.log(responses)
	}

	const updateResponse = (responseId, newValue) => {
		if (!newValue.text || /^\s*$/.test(newValue.text)) {
			return
		}

		setResponses((prev) => prev.map((item) => (item.id === responseId ? newValue : item)))
	}

	const removeResponse = (id) => {
		const removedArr = [...responses].filter((response) => response.id !== id)

		setResponses(removedArr)
	}

	return (
		<>
			<h1>Add Your Responses?</h1>
			<ResponseForm onSubmit={addResponse} />
			<div className="response-list">
				<Response
					responses={responses}
					removeResponse={removeResponse}
					updateResponse={updateResponse}
				/>
			</div>
		</>
	)
}

export default ResponseList
