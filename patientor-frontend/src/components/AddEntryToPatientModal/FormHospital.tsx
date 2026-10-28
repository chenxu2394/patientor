import React from "react";
import { TextField } from "@mui/material";
import Stack from '@mui/material/Stack';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, {Dayjs} from "dayjs";

interface Props {
  dischargeDate: Dayjs;
  setDischargeDate: React.Dispatch<React.SetStateAction<Dayjs>>;
  dischargeCriteria: string;
  setDischargeCriteria: React.Dispatch<React.SetStateAction<string>>;
}

const FormHospital = ({
  dischargeDate,
  setDischargeDate,
  dischargeCriteria,
  setDischargeCriteria,
}: Props) => 
    <Stack spacing={2}>
      <DatePicker
        label="Discharge Date"
        format="YYYY-MM-DD"
        value={dischargeDate}
        onChange={(target) => setDischargeDate(target??dayjs(new Date()))}
      />
      <TextField
        label="Discharge Criteria"
        fullWidth
        value={dischargeCriteria}
        onChange={({ target }) => setDischargeCriteria(target.value)}
      />
    </Stack>;

export default FormHospital;