import * as React from "react"
import {Autocomplete} from "@material-ui/lab"
import {Button, TextField} from "@material-ui/core"
import {addInField} from "../../../Services/Services"

export default function CommentAutoComplete({options, setOptions, addComment}) {
	const [value, setValue] = React.useState({})

	const addValueToComment = React.useCallback(() => {
		addComment(value._id)

	}, [addComment, value])

	return (
		<div style={{padding: 30, display: "flex", gap: 15}}>
			<Autocomplete
				value={value}
				style={{width: 300}}
				onChange={async (event, newValue) => {
					if (newValue) {
						if (newValue && newValue.inputValue) {
							let newlyAddedTemplate = await addInField("Add Customer Message Templates", {
								text: newValue.inputValue,
							})
							setOptions((prev) => {
								let prevData = [...prev, newlyAddedTemplate.data.result]
								return prevData
							})
							setValue(newlyAddedTemplate.data.result)
						} else {
							setValue(newValue)
						}
					}
				}}
				filterOptions={(options, params) => {
					const {inputValue} = params
					const filtered = options.filter((option) =>
						option.text.toLowerCase().includes(inputValue.toLowerCase())
					)

					const isExisting = options.some((option) => inputValue === option.text)
					if (inputValue !== "" && !isExisting) {
						filtered.push({
							inputValue,
							text: `Add "${inputValue}"`,
						})
					}

					return filtered
				}}
				selectOnFocus
				clearOnBlur
				handleHomeEndKeys
				id="comments-message"
				options={options}
				getOptionLabel={(option) => {
					if (typeof option === "string") {
						return option
					}
					if (option.inputValue) {
						return option.inputValue
					}
					return option.text
				}}
				freeSolo
				renderOption={(option) => <li> {option.text}</li>}
				renderInput={(params) => (
					<TextField {...params} variant="outlined" fullWidth label="Add new comment" />
				)}
			/>
			<Button variant="contained" color="secondary" onClick={addValueToComment} disabled={!value?._id} >
				Submit
			</Button>
		</div>
	)
}
