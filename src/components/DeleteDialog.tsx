import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
} from '@mui/material';
import React from 'react';

type DeleteDialogProps = {
  closeDialog: (confirm: boolean) => void;
  open: boolean;
  dialogTitle?: string;
  dialogText?: string;
};

function DeleteDialog({
  open,
  closeDialog,
  dialogTitle,
  dialogText,
}: DeleteDialogProps): React.ReactElement {
  const title = dialogTitle && dialogTitle.length > 0 ? dialogTitle : 'Action Alert';
  const text =
    dialogText && dialogText.length > 0 ? dialogText : 'Are you sure to delete this data?';

  const dialogButtons = [
    <Fab key="cancel-btn" color="primary" variant="extended" onClick={() => closeDialog(false)}>
      Cancel
    </Fab>,
    <Fab key="confirm-btn" color="secondary" variant="extended" onClick={() => closeDialog(true)}>
      Confirm
    </Fab>,
  ];
  return (
    <Dialog open={open} onClose={() => closeDialog(false)} fullWidth maxWidth="xs">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{text}</DialogContentText>
      </DialogContent>
      <DialogActions>{dialogButtons}</DialogActions>
    </Dialog>
  );
}

export default DeleteDialog;
