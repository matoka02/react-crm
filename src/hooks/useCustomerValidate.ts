import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

import { setCustomer } from '@/stores/customers/customerSlice';
import { AppDispatch, RootState } from '@/stores/store';
import { NewCustomer } from '@/types';

const PHONE_REGEX = /^\d{3}-\d{3}-\d{3}$/;
const AVATAR_URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$|^\/assets\/.*/;

const validationSchema = Yup.object({
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .required('First Name is required'),
  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .required('Last Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  mobile: Yup.string()
    .matches(PHONE_REGEX, 'Phone number must be in the format 555-555-555')
    .required('Mobile number is required'),
  membership: Yup.boolean().required('Membership is required'),
  rewards: Yup.number().min(0, 'Rewards cannot be negative').required(),
  avatar: Yup.string()
    .nullable()
    .optional()
    .test(
      'is-valid-url-or-empty',
      'Invalid URL or path',
      (value) => !value || AVATAR_URL_REGEX.test(value)
    ),
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
      let newValue: unknown = value;
      if (name === 'membership') {
        newValue = value === 'yes';
      }

      setValues((prev) => ({ ...prev, [name]: newValue }));
      dispatch(setCustomer({ ...values, [name]: newValue }));
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
