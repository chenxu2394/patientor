import { Dialog, DialogTitle, DialogContent, Divider, Alert } from '@mui/material';

import AddEntryToPatientForm from "./AddEntryToPatientForm";
import { onSubmitInterface, onCancelInterface, DiagnosisEntry } from "../../types";

interface Props {
  modalOpen: boolean;
  onClose: onCancelInterface;
  onSubmit: onSubmitInterface;
  error?: string;
  diagnoses: DiagnosisEntry[];
}

const AddEntryToPatientModal = ({ modalOpen, onClose, onSubmit, error, diagnoses }: Props) => (
  <Dialog fullWidth={true} open={modalOpen} onClose={() => onClose()}>
    <DialogTitle>New Entry</DialogTitle>
    <Divider />
    <DialogContent>
      {error && <Alert severity="error">{error}</Alert>}
      <AddEntryToPatientForm 
        onSubmit={onSubmit}
        onCancel={onClose}
        diagnoses={diagnoses}
      />
    </DialogContent>
  </Dialog>
);

export default AddEntryToPatientModal;