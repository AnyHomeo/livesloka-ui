import { Chip, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React, { useEffect, useState } from "react";

function AutocompleteMultipleCustom() {
  const [state, setState] = useState([  ]);
  const [options, setOptions] = useState([
      { id: 123, value: "first" },
      { id: 124, value: "second" },
      { id: 126, value: "third" },
      { id: 127, value: "fourth" },
      { id: 128, value: "fifth" },
      { id: 129, value: "sixth" },
  ])

  useEffect(() => {
      setTimeout(() => {
          setState([
              { id: 123, value: "first" },
              { id: 124, value: "second" },
              { id: 126, value: "third" },
          ])          
      }, 3000);

  }, [])

  const remove = (id) => {
      setState(prev => {
          let prevData = [...prev]
          let index = prevData.findIndex(i => i.id === id)
          prevData.splice(index,1)
          return prevData
      })
  }

  return <div>
      <Autocomplete 
      filterSelectedOptions
        getOptionSelected={(option,value) => option.id === value.id}
            options={options}
          getOptionLabel={(option) => option.value}
          onChange={(e,v) => {
              setState(v)
          }}
          multiple
          value={state}
          renderInput={(params) => (
              <TextField
                  {...params}
                  label="Students"
                  variant="outlined"
                  margin="normal"
                  required
              />
          )}
      />
  </div>;
}

export default AutocompleteMultipleCustom;
