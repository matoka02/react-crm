import { AlertProps, Alert as MuiAlert } from '@mui/material';
import React from 'react';

function Alert(props: AlertProps): React.ReactElement {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default Alert;
