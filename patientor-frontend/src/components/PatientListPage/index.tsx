import { useState } from "react";
import { Box, Table, Button, TableHead, Typography, TableCell, TableRow, TableBody } from '@mui/material';
import axios from 'axios';
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

import schema, { PatientEntry, PatientFormValues, DetailEntryToPatient, DetailEntryToPatientType, HealthCheckEntry } from "../../types";
import AddPatientModal from "../AddPatientModal";

import HealthRatingBar from "../HealthRatingBar";

import patientService from "../../services/patients";
import { Link } from "react-router-dom";

interface Props {
  patientsNoSSN : PatientEntry[]
  setPatientsNoSSN: React.Dispatch<React.SetStateAction<PatientEntry[]>>
}

const PatientListPage = ({ patientsNoSSN, setPatientsNoSSN } : Props ) => {

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewPatient = async (values: unknown) => {
    let newPatient: PatientFormValues;
    try {
      newPatient = schema.patientFormValuesSchema.parse(values);
    } catch (e: unknown) {
      if (e instanceof z.ZodError) {
        console.error("Data validation error", e.errors);
        setError(fromZodError(e).message);
      } else {
        console.error("Unknown form validation error", e);
        setError("Unknown form validation error occurred");
      }
      return;
    }

    try {
      const patient = await patientService.create(newPatient);
      setPatientsNoSSN(patientsNoSSN.concat(patient));
      setModalOpen(false);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data && typeof e?.response?.data === "string") {
          const message = e.response.data.replace('Something went wrong. Error: ', '');
          console.error(message);
          setError(message);
        } else {
          setError("Unrecognized axios error");
        }
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };

  const ratingOfPatientToday = (entries: DetailEntryToPatient[]=[]) => {
    if (entries.length === 0) {
      return 4;
    }
    const healthCheckEntries = entries.filter(entry => entry.type === DetailEntryToPatientType.HealthCheck) as HealthCheckEntry[];
    return healthCheckEntries.sort((a, b) => a.date > b.date ? -1 : 1)[0].healthCheckRating??4;
  };

  return (
    <div className="App">
      <Box>
        <Typography align="center" variant="h6">
          Patient list
        </Typography>
      </Box>
      <Table style={{ marginBottom: "1em" }}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Occupation</TableCell>
            <TableCell>Health Rating</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.values(patientsNoSSN).map((patient: PatientEntry) => (
            <TableRow key={patient.id}>
              <TableCell>
                <Link to={`/patients/${patient.id}`}>
                {patient.name}
                </Link>
              </TableCell>
              <TableCell>{patient.gender}</TableCell>
              <TableCell>{patient.occupation}</TableCell>
              <TableCell>
                <HealthRatingBar showText={false} rating={ratingOfPatientToday(patient.entries)} />
                {/* <HealthRatingBar showText={false} rating={3} /> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <AddPatientModal
        modalOpen={modalOpen}
        onSubmit={submitNewPatient}
        error={error}
        onClose={closeModal}
      />
      <Button variant="contained" onClick={() => openModal()}>
        Add New Patient
      </Button>
    </div>
  );
};

export default PatientListPage;
