import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { FormHelperText } from "@mui/material";

export default function Dropdown({
  label,
  valueHandler = ["", () => {}],
  itemList = [],
  errorHandler = { state: false, message: "" }
}) {
  const [currentSelectedValue, changeCurrentSelectedValue] = valueHandler;

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    changeCurrentSelectedValue(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  console.log("Current Selected Value: ", currentSelectedValue);

  return (
    <div className="dropdown-container" style={{ width: "100%" }}>
      <FormControl sx={{ m: 1, width: "50%" }} error={errorHandler.state}>
        <InputLabel id="demo-simple-select-label">{label}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={currentSelectedValue}
          label={label}
          onChange={handleChange}
        >
          {itemList.map((item, index) => {
            return (
              <MenuItem key={index} value={item}>
                {item}
              </MenuItem>
            );
          })}
        </Select>
        {
          errorHandler.state && (
            <FormHelperText>{errorHandler.message}</FormHelperText>
          )
        }
      </FormControl>
    </div>
  );
}
