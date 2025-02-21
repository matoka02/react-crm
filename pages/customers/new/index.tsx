import { ArrowBackIos, SavedSearch } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  Divider,
  Grid2,
  Snackbar,
  Switch,
  TextField,
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
import { addCustomer, clearError } from '@/stores/customers/customerSlice';
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const isValid = await validateForm();
    if (isValid) {
      dispatch(addCustomer(values));
    }
  };

  return (
    <Layout title="Add new customer" navigation="Application / Customer">
      {isLoading ? (
        <SkeletonForm />
      ) : (
        <Grid2 container spacing={3} sx={{ mt: 2 }}>
          <form onSubmit={handleSubmit}>
            <Grid2 size={12} sx={{ md: 4 }}>
              <TextField
                label="First Name"
                name="firstName"
                value={values.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
                fullWidth
              />
            </Grid2>
            <Grid2 size={12} sx={{ md: 4 }}>
              <TextField
                label="Last Name"
                name="lastName"
                value={values.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
                fullWidth
              />
            </Grid2>
            <Grid2 size={12} sx={{ md: 4 }}>
              <TextField
                label="Email"
                name="email"
                value={values.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                fullWidth
              />
            </Grid2>
            <Grid2 size={12} sx={{ md: 4 }}>
              <TextField
                label="Mobile"
                name="mobile"
                value={values.mobile}
                onChange={handleChange}
                fullWidth
              />
            </Grid2>
            <Grid2 size={12} sx={{ md: 4 }}>
              <Switch checked={values.membership} name="membership" onChange={handleChange} />
            </Grid2>
            <Grid2 size={12} sx={{ md: 4 }}>
              <TextField
                label="Avatar URL"
                name="avatar"
                value={values.avatar}
                onChange={handleChange}
                fullWidth
              />
              {values.avatar && (
                <Card sx={{ width: 120, maxWidth: 300, mt: 4, mb: 1 }}>
                  <Image width={100} height={100} src={values.avatar} alt="Avatar" />
                </Card>
              )}
            </Grid2>
            <Grid2 size={12} sx={{ md: 4 }}>
              <TextField
                label="membership"
                name="membership"
                value={values.membership}
                onChange={handleChange}
                fullWidth
              />
            </Grid2>
            <Grid2 size={12} sx={{ md: 4 }}>
              <TextField
                label="Rewards"
                name="rewards"
                value={values.rewards}
                onChange={handleChange}
                fullWidth
              />
            </Grid2>
          </form>

          <Divider sx={{ my: 2 }} />
          <Box>
            <Button variant="contained" onClick={() => router.back()}>
              <ArrowBackIos /> Back
            </Button>
            <Button
              variant="contained"
              sx={{
                ml: 2,
                backgroundColor: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
              }}
              type="submit"
              disabled={isLoading}
            >
              <SavedSearch />
            </Button>
          </Box>

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
        </Grid2>
      )}
    </Layout>
  );
}
