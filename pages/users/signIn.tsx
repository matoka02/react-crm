import { ArrowBackIos } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid2,
  Paper,
  Snackbar,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Alert from '@/components/Alert';
import useUserValidate from '@/hooks/useUserValidate';
import { clearError, signIn, USER_DURATION } from '@/stores/auth/authSlice';
import { AppDispatch, RootState } from '@/stores/store';
import { User } from '@/stores/types/userTypes';

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' },
  paper: { padding: 20, maxWidth: 800, width: '100%' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  buttonWrapper: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
};

export default function SigInPage(): React.ReactElement {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isFetching, snackbarOpen, snackbarMessage, snackbarSeverity } = useSelector(
    (state: RootState) => state.auth
  );

  // const theme = useTheme();
  const { values, errors, handleChange, validateForm } = useUserValidate();

  // Snackbar
  const handleCloseSnackbar = () => {
    dispatch(clearError());
  };

  // Submit
  const handleSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();
    if (!(await validateForm())) return;
    dispatch(signIn(values)).then((result) => {
      if (signIn.fulfilled.match(result)) {
        setTimeout(() => {
          router.push('/dashboard');
        }, USER_DURATION);
      }
    });
  };

  return (
    <Box sx={styles.container}>
      <Paper elevation={3} sx={styles.paper}>
        <Typography variant="h2" align="center" gutterBottom>
          React Redux CRM
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" gutterBottom>
          Version 2.0.0
        </Typography>
        <form onSubmit={handleSubmit} autoComplete="off">
          <FormControl component="fieldset" fullWidth sx={styles.form}>
            <TextField
              label="Email"
              name="email"
              placeholder="Enter email"
              value={values.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              autoComplete="off"
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              variant="outlined"
              fullWidth
              value={values.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              autoComplete="off"
            />
          </FormControl>

          {/* Buttons */}
          <Grid2 container sx={styles.buttonWrapper}>
            <Button variant="contained" onClick={() => router.push('/')}>
              <ArrowBackIos /> Back
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={isFetching}>
              {isFetching ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
          </Grid2>
        </form>

        {/* Notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={USER_DURATION}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
}
