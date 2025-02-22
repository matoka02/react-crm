import { ArrowBackIos, Save } from '@mui/icons-material';
import {
  Button,
  Card,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid2,
  Paper,
  Radio,
  RadioGroup,
  Snackbar,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Alert from '@/components/Alert';
import Layout from '@/components/Layout';
import SkeletonForm from '@/components/SkeletonForm';
import useCustomerForm from '@/hooks/useCustomerValidate';
import { addCustomer, clearError, setCustomer } from '@/stores/customers/customerSlice';
import { AppDispatch, RootState } from '@/stores/store';

export default function CustomerFormPage(): React.ReactElement {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, snackbarOpen, snackbarMessage, snackbarSeverity } = useSelector(
    (state: RootState) => state.customers
  );

  const theme = useTheme();
  const { values, errors, handleChange, validateForm } = useCustomerForm();

  // Snackbar
  const handleCloseSnackbar = () => {
    dispatch(clearError());
  };

  // Submit
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const isValid = await validateForm();

    if (isValid) {
      dispatch(addCustomer(values)).then((action) => {
        if (addCustomer.fulfilled.match(action)) {
          dispatch(setCustomer(null));
          setTimeout(() => {
            router.push('/customers');
          }, 3000);
        }
        if (addCustomer.rejected.match(action)) {
          dispatch(setCustomer(null));
          setTimeout(() => {
            router.push('/customers');
          }, 3000);
        }
      });
    }
  };

  return (
    <Layout title="Add new customer" navigation="Application / Customer">
      {isLoading ? (
        <SkeletonForm />
      ) : (
        <Paper elevation={3} sx={{ maxWidth: 800, mx: 'auto', p: 4, mt: 4 }}>
          <form onSubmit={handleSubmit}>
            <Grid2 container spacing={3} sx={{ mt: 2 }}>
              <Grid2 size={12} sx={{ md: 6 }}>
                <TextField
                  label="First Name"
                  name="firstName"
                  placeholder="Enter first name"
                  value={values.firstName}
                  onChange={handleChange}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  fullWidth
                />
              </Grid2>
              <Grid2 size={12} sx={{ md: 6 }}>
                <TextField
                  label="Last Name"
                  name="lastName"
                  placeholder="Enter last name"
                  value={values.lastName}
                  onChange={handleChange}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  fullWidth
                />
              </Grid2>
              <Grid2 size={12} sx={{ md: 6 }}>
                <TextField
                  label="Email"
                  name="email"
                  placeholder="Enter email"
                  value={values.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  fullWidth
                />
              </Grid2>
              <Grid2 size={12} sx={{ md: 6 }}>
                <TextField
                  label="Mobile"
                  name="mobile"
                  placeholder="Enter mobile number"
                  value={values.mobile}
                  onChange={handleChange}
                  error={!!errors.mobile}
                  helperText={errors.mobile}
                  fullWidth
                />
              </Grid2>
              <Grid2 size={12} sx={{ md: 6 }}>
                <FormControl component="fieldset" fullWidth>
                  <FormLabel component="legend">Membership</FormLabel>
                  <RadioGroup
                    row
                    name="membership"
                    value={values.membership ? 'yes' : 'no'}
                    onChange={handleChange}
                  >
                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                </FormControl>
                {errors.membership && (
                  <Typography color="error" variant="body2">
                    {errors.membership}
                  </Typography>
                )}
              </Grid2>
              <Grid2 size={12} sx={{ md: 6 }}>
                <TextField
                  label="Rewards"
                  name="rewards"
                  value={values.rewards}
                  onChange={handleChange}
                  error={!!errors.rewards}
                  helperText={errors.rewards}
                  fullWidth
                />
              </Grid2>
              <Grid2 size={12} sx={{ md: 6 }}>
                <TextField
                  label="Avatar URL"
                  name="avatar"
                  value={values.avatar}
                  placeholder="Enter the avatar URL"
                  onChange={handleChange}
                  error={!!errors.avatar}
                  helperText={errors.avatar}
                  fullWidth
                />
                {values.avatar && (
                  <Card
                    sx={{
                      width: 120,
                      maxWidth: 300,
                      mt: 4,
                      mb: 1,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Image
                      width={100}
                      height={100}
                      src={values.avatar}
                      alt="Avatar"
                      style={{ objectFit: 'cover' }}
                    />
                  </Card>
                )}
              </Grid2>

              {/* Buttons */}
              <Grid2
                container
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mt: 3,
                }}
              >
                <Button
                  variant="contained"
                  onClick={() => router.back()}
                  sx={{
                    gap: 1,
                    color: 'white',
                    backgroundColor: theme.palette.secondary.main,
                    '&:hover': {
                      backgroundColor: theme.palette.secondary.dark,
                    },
                  }}
                >
                  <ArrowBackIos /> Back
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={isLoading}
                  sx={{
                    gap: 2,
                    color: 'white',
                    backgroundColor: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                    },
                  }}
                >
                  <Save /> Save
                </Button>
              </Grid2>
            </Grid2>
          </form>

          {/* Notifications */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Paper>
      )}
    </Layout>
  );
}
