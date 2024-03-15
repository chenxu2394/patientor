import patients from '../../data/patients-full';
import { v1 as uuid } from 'uuid';

import { PatientEntry, 
  NonSensitivePatientEntry, 
  PatientEntryNoID, 
  DetailEntryNoIdToPatient
 } from '../types';

const getEntries = (): PatientEntry[] => {
  return patients;
};

const getNonSensitiveEntries = (): NonSensitivePatientEntry[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation}) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const getEntriesNoSSN = (): Omit<PatientEntry, 'ssn'>[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation, entries}) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
    entries
  }));
};

const addPatient = ( entry: PatientEntryNoID ): PatientEntry => {
  
  const newPatientEntry: PatientEntry = {
    id: uuid(),
    ...entry,
  };

  patients.push(newPatientEntry);
  return newPatientEntry;
};

const findById = (id: string): PatientEntry | undefined => {
  const patientEntry = patients.find(p => p.id === id);
  if (!patientEntry) {
    return undefined;
  } else {
    if (patientEntry.entries) {
      return patientEntry;
    } else {
      return {
        ...patientEntry,
        entries: []
      };
    }
  }
};

const addEntryToPatient = (entry: DetailEntryNoIdToPatient, patientId: string): PatientEntry | undefined => {
  const patientEntry = findById(patientId);
  if (!patientEntry) {
    return undefined;
  }
  const newEntryToPatient = {
    id: uuid(),
    ...entry
  };
  patientEntry.entries.push(newEntryToPatient);
  return patientEntry;
};

export default {
  getEntries,
  getNonSensitiveEntries,
  addPatient,
  findById,
  addEntryToPatient,
  getEntriesNoSSN
};