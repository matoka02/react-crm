import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

import { setCustomer } from '@/stores/customers/customerSlice';
import { AppDispatch, RootState } from '@/stores/store';
import { NewCustomer } from '@/types';

const validationSchema = Yup.object({
  firstName: Yup.string().min(2).required('First Name is required'),
  lastName: Yup.string().min(2).required('Last Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  mobile: Yup.string().matches(/^\d{10}$/, 'Invalid mobile number'),
  membership: Yup.boolean(),
  rewards: Yup.number().min(0, 'Rewards cannot be negative'),
  avatar: Yup.string().url('Invalid URL'),
});

function useCustomerValidate() {
  const dispatch = useDispatch<AppDispatch>();
  const customer = useSelector((state: RootState) => state.customers.customer);

  const [values, setValues] = useState<NewCustomer>(
    customer || {
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      membership: false,
      rewards: 0,
      avatar: '',
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (customer) {
      setValues(customer);
    }
  }, [customer]);

  const handleChange = (evt: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = evt.target;
    if (name) {
      setValues((prev) => ({ ...prev, [name]: value }));
      dispatch(setCustomer({ ...values, [name]: value }));
    }
  };

  const validateForm = async () => {
    try {
      await validationSchema.validate(values, { abortEarly: false });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const formattedErrors: Record<string, string> = {};
        error.inner.forEach((err) => {
          if (err.path) {
            formattedErrors[err.path] = err.message;
          }
        });
        setErrors(formattedErrors);
      }
      return false;
    }
  };

  return { values, errors, handleChange, validateForm };
}

export default useCustomerValidate;
