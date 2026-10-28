import { useState, SyntheticEvent } from "react";

import {  TextField, MenuItem, Select, Grid, Button, SelectChangeEvent, Box, InputLabel } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { FormControl } from '@mui/material';
import dayjs, {Dayjs} from "dayjs";

import { onSubmitInterface, onCancelInterface, Gender } from "../../types";

interface Props {
  onCancel: onCancelInterface;
  onSubmit: onSubmitInterface;
}

interface GenderOption{
  value: Gender;
  label: string;
}

const genderOptions: GenderOption[] = Object.values(Gender).map(v => ({
  value: v, label: v.toString()
}));

const AddPatientForm = ({ onCancel, onSubmit }: Props) => {
  const [name, setName] = useState('');
  const [occupation, setOccupation] = useState('');
  const [ssn, setSsn] = useState('');
  const [dateOfBirthDayjs, setDateOfBirthDayjs] = useState<Dayjs>(dayjs(new Date()));
  const [gender, setGender] = useState(Gender.Other);

  const onGenderChange = (event: SelectChangeEvent<string>) => {
    event.preventDefault();
    if ( typeof event.target.value === "string") {
      const value = event.target.value;
      const gender = Object.values(Gender).find(g => g.toString() === value);
      if (gender) {
        setGender(gender);
      }
    }
  };

  const addPatient = (event: SyntheticEvent) => {
    event.preventDefault();
    onSubmit({
      name,
      occupation,
      ssn,
      dateOfBirth: dateOfBirthDayjs.format('YYYY-MM-DD'),
      gender
    });
  };

  return (
    <div>
      <form onSubmit={addPatient}>
        <TextField
          label="Name"
          fullWidth 
          value={name}
          onChange={({ target }) => setName(target.value)}
        />
        <FormControl fullWidth style= {{ marginTop: 20 }}>
          <DatePicker 
            label="Date of birth" 
            format="YYYY-MM-DD"
            value={dateOfBirthDayjs}
            onChange={(target) => {
                setDateOfBirthDayjs(dayjs(target));
                setSsn(dayjs(target).format('DDMMYY-')); // Fill ssn with a default value
              }
            }
          />
        </FormControl>        
        <TextField
          style= {{ marginTop: 20 }}
          label="Social security number"
          fullWidth
          value={ssn}
          onChange={({ target }) => setSsn(target.value)}
        />
        <TextField
          style= {{ marginTop: 20 }}
          label="Occupation"
          fullWidth
          value={occupation}
          onChange={({ target }) => setOccupation(target.value)}
        />
        <Box style={{ marginTop: 20, top: 'auto' }}>
          <InputLabel>Gender</InputLabel>
          <Select
            label="Gender"
            fullWidth
            value={gender}
            onChange={onGenderChange}
          >
          {genderOptions.map(option =>
            <MenuItem
              key={option.label}
              value={option.value}
            >
              {option.label
            }</MenuItem>
          )}
          </Select>
        </Box>
        <Grid style= {{ marginTop: 20 }}>
          <Grid item>
            <Button
              color="secondary"
              variant="contained"
              style={{ float: "left" }}
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              style={{
                float: "right",
              }}
              type="submit"
              variant="contained"
            >
              Add
            </Button>
          </Grid>
        </Grid>

      </form>
    </div>
  );
};

export default AddPatientForm;