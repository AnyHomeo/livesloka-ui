import React, {useState, useEffect, useRef} from "react"

function ResponseForm(props) {
	const [input, setInput] = useState(props.edit ? props.edit.value : "")

	const inputRef = useRef(null)

	useEffect(() => {
		inputRef.current.focus()
	})

	const handleChange = (e) => {
		setInput(e.target.value)
	}

	const handleSubmit = (e) => {
		e.preventDefault()

		props.onSubmit({
			id: Math.floor(Math.random() * 10000),
			text: input,
		})
		setInput("")
	}

	return (
		<form onSubmit={handleSubmit} className="response-form">
			{props.edit ? (
				<>
					<input
						placeholder="Update your item"
						value={input}
						onChange={handleChange}
						name="text"
						ref={inputRef}
						className="response-input edit"
					/>
					<button onClick={handleSubmit} className="response-button edit">
						Update
					</button>
				</>
			) : (
				<>
					<input
						placeholder="Add a response"
						value={input}
						onChange={handleChange}
						name="text"
						className="response-input"
						ref={inputRef}
					/>
					<button onClick={handleSubmit} className="response-button">
						Add response
					</button>
				</>
			)}
		</form>
	)
}

export default ResponseForm
