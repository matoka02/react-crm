import { useState } from 'react';
import * as Yup from 'yup';

import { User } from '@/stores/types/userTypes';

const userValidationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

function useUserValidate(initialValues?: User) {
  const [values, setValues] = useState<User>(initialValues || { email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [evt.target.name]: evt.target.value });
  };

  const validateForm = async () => {
    try {
      await userValidationSchema.validate(values, { abortEarly: false });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const formattedErrors: Record<string, string> = {};
        error.inner.forEach((err) => {
          if (err.path) formattedErrors[err.path] = err.message;
        });
        setErrors(formattedErrors);
      }
      return false;
    }
  };
  return { values, errors, handleChange, validateForm };
}

export default useUserValidate;
