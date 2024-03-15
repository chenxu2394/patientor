import axios from "axios";
import { PatientEntry, PatientFormValues, DetailEntryNoIdToPatient } from "../types";

import { apiBaseUrl } from "../constants";

const getAll = async () => {
  const { data } = await axios.get<PatientEntry[]>(
    `${apiBaseUrl}/patients`
  );

  return data;
};

const create = async (object: PatientFormValues) => {
  const { data } = await axios.post<PatientEntry>(
    `${apiBaseUrl}/patients`,
    object
  );

  return data;
};

const getOne = async (id: string) => {
  const { data } = await axios.get<PatientEntry>(
    `${apiBaseUrl}/patients/${id}`
  );
  return data;
};

const addEntryToPatient = async (entry: DetailEntryNoIdToPatient, patientId: string) => {
  const { data } = await axios.post<PatientEntry>(
    `${apiBaseUrl}/patients/${patientId}/entries`,
    entry
  );
  return data;
};

export default {
  getAll, create, getOne, addEntryToPatient
};

