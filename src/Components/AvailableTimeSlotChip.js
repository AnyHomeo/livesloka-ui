import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function AvailableTimeSlotChip({
  data,
  timeSlotState,
  setTimeSlotState,
}) {
  const classes = useStyles();

  const handleChange = (event) => {
    setTimeSlotState(event.target.value);
  };

  return (
    <div>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="label">Available Time Slots</InputLabel>
        <Select
          style={{ width: "300px" }}
          labelId="demo-mutiple-chip-label"
          id="demo-mutiple-chip"
          multiple
          value={timeSlotState}
          onChange={handleChange}
          input={<Input id="select-multiple-chip" variant="outlined" />}
          renderValue={(selected) => (
            <div className={classes.chips}>
              {selected &&
                selected.map((value) => (
                  <Chip key={value} label={value} className={classes.chip} />
                ))}
            </div>
          )}
          MenuProps={MenuProps}
        >
          {data &&
            data.map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </div>
  );
}
