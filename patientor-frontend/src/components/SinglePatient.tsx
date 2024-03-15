import { z } from 'zod';
import axios from 'axios';
import { fromZodError } from 'zod-validation-error';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Male, Female, QuestionMark } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import { Favorite } from '@mui/icons-material';
import schema, { PatientEntry, DiagnosisEntry, DetailEntryNoIdToPatient } from '../types';
import { getColorForRating } from '../utils';
import patientService from '../services/patients';
import EntryDetails from './EntryDetails';
import AddEntryToPatientModal from './AddEntryToPatientModal';

interface PropsColoredFavoriteIcon {
  rating: number;
}

const ColoredFavoriteIcon = ({rating} : PropsColoredFavoriteIcon) => {
  return (
    <Favorite sx={{ color: getColorForRating(rating) }} />
  );
};

interface Props {
  diagnoses: DiagnosisEntry[];
  patientsNoSSN : PatientEntry[]
  setPatientsNoSSN: React.Dispatch<React.SetStateAction<PatientEntry[]>>
}

const SinglePatient = ({diagnoses, patientsNoSSN, setPatientsNoSSN}: Props) => {
  const [onePatient, setOnePatient] = useState<undefined | PatientEntry>(undefined);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setModalError(undefined);
  };

  const submitNewEntryToPatient = async (values: unknown) => {
    console.log('submitNewEntryToPatient', values);
    let submitNewEntryToPatient : DetailEntryNoIdToPatient;
    try {
      submitNewEntryToPatient = schema.detailEntryNoIdToPatientSchema.parse(values);
    } catch (e: unknown) {
      if (e instanceof z.ZodError) {
        console.error("Data validation error", e.errors);
        setModalError(fromZodError(e).message);
      } else {
        console.error("Unknown form validation error", e);
        setModalError("Unknown form validation error occurred");
      }
      return;
    }
    if (id) {
      try {
        const patient = await patientService.addEntryToPatient(submitNewEntryToPatient, id);
        setOnePatient(patient);
        const index = patientsNoSSN.findIndex((patient) => patient.id === id);
        if (index !== -1) {
          const newPatientsNoSSN = [...patientsNoSSN];
          newPatientsNoSSN[index] = patient;
          setPatientsNoSSN(newPatientsNoSSN);
        }
        setModalOpen(false);
      } catch (e: unknown) {
        if (axios.isAxiosError(e)) {
          if (e?.response?.data && typeof e?.response?.data === "string") {
            const message = e.response.data.replace('Something went wrong. Error: ', '');
            console.error(message);
            setModalError(message);
          } else {
            setModalError("Unrecognized axios error");
          }
        } else {
          console.error("Unknown error", e);
          setModalError("Unknown error");
        }
      }
    }
  };

  useEffect(() => {
    if (id) {
      patientService.getOne(id)
        .then(response => {
          setOnePatient(response);
          setLoadingError(null);
        })
        .catch(error => {
          // console.error(error);
          setLoadingError(error.message);
        });
    }
  }, [id]);

  if (loadingError) {
    return <div><h2>Error loading patient data. Please try again later.</h2></div>;
  }

  if (!onePatient) {
    return <div><h2>Loading...</h2></div>;
  }

  const findDiagnosisNameByCode = (code: string) => {
    const found = diagnoses.find((diagnosis) => diagnosis.code === code);
    return found ? found.name : 'unknown code';
  };

  return ( onePatient &&
    <div>
      <h2>{onePatient.name} {onePatient.gender === 'male' ? <Male />: onePatient.gender === 'female' ? <Female /> : <QuestionMark/>}</h2>
      <div>ssn: {onePatient.ssn}</div>
      <div>occupation: {onePatient.occupation}</div>
      <br/>
      <AddEntryToPatientModal
        modalOpen={modalOpen}
        onClose={closeModal}
        onSubmit={submitNewEntryToPatient}
        error={modalError}
        diagnoses={diagnoses}
      />      
      <Button variant="contained" onClick={() => openModal()} >Add new entry</Button>
      <h3>Entries</h3>
      {onePatient.entries.map((entry) => {
        return (
          <Box key={entry.id} sx={{ border: '2px solid grey', marginBottom: 2, paddingLeft: 1, borderRadius: 2}}>
            <EntryDetails entry={entry} />
            {entry.diagnosisCodes && 
              <ul>
              {entry.diagnosisCodes.map((code) => {
                return (
                  <li key={code}>
                    {code} {findDiagnosisNameByCode(code)}
                  </li>
                );
              })}
            </ul>}
            {'healthCheckRating' in entry? <ColoredFavoriteIcon rating={entry.healthCheckRating} /> : null}
            {'specialist' in entry? <div>diagnose by {entry.specialist}</div>: null}
          </Box>
        );
      })}      
    </div>
  );
};

export default SinglePatient;
    