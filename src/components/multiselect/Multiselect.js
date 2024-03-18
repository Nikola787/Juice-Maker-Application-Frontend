import React from "react";
import { TextField, Autocomplete } from "@mui/material";

export default function MultiSelect(props) {
  return (
    <Autocomplete
      sx={{ width: 500, height: 10 }}
      multiple
      options={props.options}
      onChange={(event, newValue) => props.setField(newValue)}
      getOptionLabel={(option) => option}
      disableCloseOnSelect
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label={props.label}
          placeholder=""
        />
      )}
    />
  );
}
