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
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import Alert from '@/components/Alert';
import PageContainer from '@/components/PageContainer';
import SkeletonForm from '@/components/SkeletonForm';
import useCustomerForm from '@/hooks/useCustomerValidate';
import { clearError, CUSTOMER_DURATION } from '@/stores/customers/customerSlice';
import { addCustomer, fetchCustomerById, updateCustomer } from '@/stores/customers/customerThunk';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { RootState } from '@/stores/store';
import { Customer, NewCustomer } from '@/stores/types/modelTypes';

export default function CustomerFormPage(): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const customerId = searchParams.get('id') ?? '';
  const dispatch = useAppDispatch();
  const { isLoading, snackbarOpen, snackbarMessage, snackbarSeverity } = useAppSelector(
    (state: RootState) => state.customers
  );

  const theme = useTheme();
  const styles = theme.customStyles.formPage;
  const { values, setValues, errors, handleChange, validateForm } = useCustomerForm();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!customerId) {
      setIsEditing(false);
    }

    if (customerId) {
      setIsEditing(true);
      dispatch(fetchCustomerById(customerId)).then((result) => {
        if (fetchCustomerById.fulfilled.match(result)) {
          setValues(result.payload);
        }
      });
    }
  }, [customerId, dispatch, setValues]);

  // Snackbar
  const handleCloseSnackbar = () => {
    dispatch(clearError());
  };

  // Submit
  const handleSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();

    const isValid = await validateForm();

    if (isValid) {
      const payload: NewCustomer & Partial<{ id: string }> = customerId
        ? { ...values, id: customerId }
        : values;
      const action = customerId ? updateCustomer(payload as Customer) : addCustomer(values);

      const isActionCompleted = (result: any) =>
        updateCustomer.fulfilled.match(result) ||
        addCustomer.fulfilled.match(result) ||
        updateCustomer.rejected.match(result) ||
        addCustomer.rejected.match(result);

      dispatch(action).then((result) => {
        if (isActionCompleted(result)) {
          setTimeout(() => {
            router.push('/customers');
          }, CUSTOMER_DURATION);
        }
      });
    }
  };

  return (
    <PageContainer
      title={isEditing ? 'Edit Customer' : 'Add Customer'}
      navigation="Application / Customer"
    >
      {isLoading ? (
        <SkeletonForm />
      ) : (
        <Paper elevation={3} sx={styles.paper}>
          <form onSubmit={handleSubmit}>
            <Grid2 container spacing={3} sx={styles.formWrapper}>
              <Grid2 size={12} sx={styles.inputWrapper}>
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
              <Grid2 size={12} sx={styles.inputWrapper}>
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
              <Grid2 size={12} sx={styles.inputWrapper}>
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
              <Grid2 size={12} sx={styles.inputWrapper}>
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
              <Grid2 size={12} sx={styles.inputWrapper}>
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
              <Grid2 size={12} sx={styles.inputWrapper}>
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
              <Grid2 size={12} sx={styles.inputWrapper}>
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
                  <Card sx={styles.card}>
                    <Image
                      width={100}
                      height={100}
                      src={values.avatar}
                      alt="Avatar"
                      style={styles.image}
                    />
                  </Card>
                )}
              </Grid2>

              {/* Buttons */}
              <Grid2 container sx={styles.buttonContainer}>
                <Button variant="contained" onClick={() => router.back()} sx={styles.buttonBack}>
                  <ArrowBackIos /> Back
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={isLoading}
                  sx={styles.buttonSave}
                >
                  <Save /> Save {isEditing ? 'Update' : ''}
                </Button>
              </Grid2>
            </Grid2>
          </form>

          {/* Notifications */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={CUSTOMER_DURATION}
            onClose={handleCloseSnackbar}
          >
            <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Paper>
      )}
    </PageContainer>
  );
}
