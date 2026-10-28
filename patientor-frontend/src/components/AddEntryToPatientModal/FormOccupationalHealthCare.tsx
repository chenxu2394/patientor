import React, {useState, useEffect} from 'react';
import {Box, TextField, FormControlLabel, Checkbox, SelectChangeEvent} from '@mui/material';
import dayjs from 'dayjs';
import { DateRange } from 'react-date-range';
import { Range as DateRangeType } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

interface Props  {
  employerName: string;
  setEmployerName: React.Dispatch<React.SetStateAction<string>>;
  sickLeaveFlag: boolean;
  handleSickLeaveFlagChange: (event: SelectChangeEvent<string>) => void;
  setSickLeaveStartDayjs: React.Dispatch<React.SetStateAction<dayjs.Dayjs | undefined>>;
  setSickLeaveEndDayjs: React.Dispatch<React.SetStateAction<dayjs.Dayjs | undefined>>;
}

const FormOccupationalHealthCare = ({
  employerName,
  setEmployerName,
  sickLeaveFlag: sickLeave,
  handleSickLeaveFlagChange: handleSickLeaveChange,
  setSickLeaveStartDayjs,
  setSickLeaveEndDayjs,
}: Props) => {
  const [dateRange, setDateRange] = useState<DateRangeType>(
    {
      startDate: new Date(),
      endDate: new Date((new Date()).getTime() + (24 * 60 * 60 * 1000)),
      key: 'selection'
    }
  );

  useEffect(() => {
    setSickLeaveStartDayjs(dayjs(dateRange.startDate));
    setSickLeaveEndDayjs(dayjs(dateRange.endDate));
  }, [dateRange, setDateRange, setSickLeaveStartDayjs, setSickLeaveEndDayjs]);

  return (
    <Box>
      <TextField
        label="Employer Name"
        fullWidth
        value={employerName}
        onChange={({ target }) => setEmployerName(target.value)}
      >
      </TextField>
      <FormControlLabel 
        label="Sick Leave"
        control={
          <Checkbox
            checked={sickLeave}
            onChange={handleSickLeaveChange}
          />
        }
      />
      {sickLeave &&
        <Box>
          <DateRange
            editableDateInputs={false}
            moveRangeOnFirstSelection={false}
            ranges={[dateRange]}
            onChange={(target) => {
              console.log(target);
              setDateRange(target.selection);
          }}/>
        </Box>
      }
    </Box>
  );
};

export default FormOccupationalHealthCare;
