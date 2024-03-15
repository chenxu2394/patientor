import diagnoses from '../../data/diagnoses';

import { DiagnosisEntry } from '../types';

const getEntries = (): DiagnosisEntry[] => {
  return diagnoses;
};

export default {
  getEntries
};