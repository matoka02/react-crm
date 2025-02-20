import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  useTheme,
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
  const theme = useTheme();
  const title = dialogTitle && dialogTitle.length > 0 ? dialogTitle : 'Action Alert';
  const text =
    dialogText && dialogText.length > 0 ? dialogText : 'Are you sure to delete this data?';

  const dialogButtons = [
    <Fab
      key="cancel-btn"
      variant="extended"
      onClick={() => closeDialog(false)}
      sx={{
        color: 'white',
        backgroundColor: theme.palette.primary.main,
        '&:hover': {
          backgroundColor: theme.palette.primary.dark,
        },
      }}
    >
      Cancel
    </Fab>,
    <Fab
      key="confirm-btn"
      variant="extended"
      onClick={() => closeDialog(true)}
      sx={{
        color: 'white',
        backgroundColor: theme.palette.secondary.main,
        '&:hover': {
          backgroundColor: theme.palette.secondary.dark,
        },
      }}
    >
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

DeleteDialog.defaultProps = {
  dialogTitle: 'Action Alert',
  dialogText: 'Are you sure to delete this data?',
};

export default DeleteDialog;
