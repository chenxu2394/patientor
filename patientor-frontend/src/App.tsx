import { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { Button, Divider, Container, Typography } from '@mui/material';

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { apiBaseUrl } from "./constants";
import { PatientEntry, DiagnosisEntry } from "./types";

import patientService from "./services/patients";
import diagnosisService from "./services/diagnoses";

import PatientListPage from "./components/PatientListPage";
import SinglePatient from "./components/SinglePatient";

const App = () => {
  const [patientsNoSSN, setPatientsNoSSN] = useState<PatientEntry[]>([]);
  const [diagnoses, setDiagnoses] = useState<DiagnosisEntry[]>([]);

  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientList = async () => {
      const patients = await patientService.getAll();
      setPatientsNoSSN(patients);
    };
    void fetchPatientList();

    const fetchDiagnosisDict = async () => {
      const diagnoses = await diagnosisService.getAll();
      setDiagnoses(diagnoses);
    };
    void fetchDiagnosisDict();
  }, []);
  
  return (
    <div className="App">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Router>
          <Container>
            <Typography variant="h3" style={{ marginBottom: "0.5em" }}>
              Patientor
            </Typography>
            <Button component={Link} to="/" variant="contained" color="primary">
              Home
            </Button>
            <Divider hidden />
            <Routes>
              <Route path="/" element={<PatientListPage patientsNoSSN={patientsNoSSN} setPatientsNoSSN={setPatientsNoSSN} />} />
              <Route path="patients/:id" element={<SinglePatient 
                                                    diagnoses={diagnoses}
                                                    patientsNoSSN={patientsNoSSN}
                                                    setPatientsNoSSN={setPatientsNoSSN}/>}
                                                    />
            </Routes>
          </Container>
        </Router>
      </LocalizationProvider>
    </div>
  );
};

export default App;
