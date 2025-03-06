import { AccountCircle, ArrowBackIos } from '@mui/icons-material';
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
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Alert from '@/components/Alert';
import useUserValidate from '@/hooks/useUserValidate';
import { clearError, signIn, USER_DURATION } from '@/stores/auth/authSlice';
import { AppDispatch, RootState } from '@/stores/store';

const getStyles = (theme: any) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    overflowY: 'scroll',
  },
  paper: {
    maxWidth: 800,
    mx: 'auto',
    p: 4,
    mt: 4,
  },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  buttonWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    mt: 3,
  },
  buttonBack: {
    gap: 1,
    color: theme.palette.common.white,
    backgroundColor: theme.palette.secondary.main,
    '&:hover': {
      backgroundColor: theme.palette.secondary.dark,
    },
  },
  buttonLogin: {
    gap: 1,
    color: theme.palette.common.white,
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
});

export default function SignInPage(): React.ReactElement {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isFetching, snackbarOpen, snackbarMessage, snackbarSeverity } = useSelector(
    (state: RootState) => state.auth
  );

  const theme = useTheme();
  const styles = getStyles(theme);
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
            <Link href="/">
              <Button variant="contained" sx={styles.buttonBack}>
                <ArrowBackIos /> Back
              </Button>
            </Link>
            <Button
              type="submit"
              variant="contained"
              sx={styles.buttonLogin}
              disabled={isFetching}
              startIcon={isFetching ? <CircularProgress size={24} /> : <AccountCircle />}
            >
              Sign In
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
