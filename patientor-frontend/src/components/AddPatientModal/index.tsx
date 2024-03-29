import { Dialog, DialogTitle, DialogContent, Divider, Alert } from '@mui/material';

import AddPatientForm from "./AddPatientForm";
import { onSubmitInterface, onCancelInterface } from "../../types";

interface Props {
  modalOpen: boolean;
  onClose: onCancelInterface;
  onSubmit: onSubmitInterface;
  error?: string;
}

const AddPatientModal = ({ modalOpen, onClose, onSubmit, error }: Props) => (
  <Dialog fullWidth={true} open={modalOpen} onClose={() => onClose()}>
    <DialogTitle>Add a new patient</DialogTitle>
    <Divider />
    <DialogContent>
      {error && <Alert severity="error">{error}</Alert>}
      <AddPatientForm onSubmit={onSubmit} onCancel={onClose}/>
    </DialogContent>
  </Dialog>
);

export default AddPatientModal;
