import { DetailEntryToPatient, DetailEntryToPatientType, HospitalEntry, HealthCheckEntry, OccupationalHealthcareEntry } from "../types";
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import WorkIcon from '@mui/icons-material/Work';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { assertNever } from "../utils";

const HospitalEntryComponent: React.FC<{ entry: HospitalEntry }> = ({ entry }) => {
  return (
    <div>
      <div>{entry.date} <LocalHospitalIcon/></div>
      <div><i>{entry.description}</i></div>
    </div>
  );
};

const HealthCheckEntryComponent: React.FC<{ entry: HealthCheckEntry }> = ({ entry }) => {
  return (
    <div>
      <div>{entry.date} <MedicalServicesIcon/></div>
      <div><i>{entry.description}</i></div>
    </div>
  );
};

const OccupationalHealthcareEntryComponent: React.FC<{ entry: OccupationalHealthcareEntry }> = ({ entry }) => {
  return (
    <div>
      <div>{entry.date} <WorkIcon/> {entry.employerName}</div>
      <div><i>{entry.description}</i></div>
    </div>
  );
};

const EntryDetails: React.FC<{ entry: DetailEntryToPatient }> = ({ entry }) => {
  switch (entry.type) {
    case DetailEntryToPatientType.Hospital:
      return <HospitalEntryComponent entry={entry} />;
    case DetailEntryToPatientType.HealthCheck:
      return <HealthCheckEntryComponent entry={entry} />;
    case DetailEntryToPatientType.OccupationalHealthcare:
      return <OccupationalHealthcareEntryComponent entry={entry} />;
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;