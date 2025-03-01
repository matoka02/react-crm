import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';

import { RootState } from '@/stores/store';
import { NewProduct } from '@/stores/types/modelTypes';

export const PRICE_REGEX = /^\d+(\.\d{1,2})?$/;

const productSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Product name must be at least 2 characters')
    .required('Product name is required'),
  categoryId: Yup.string().required('Category is required'),
  numInStock: Yup.number()
    .min(0, 'Stock cannot be negative')
    .integer('Stock must be an integer')
    .required(),
  unitPrice: Yup.number()
    .min(0, 'Price cannot be negative')
    .test('is-decimal', 'Price must have up to 2 decimal places', (value) => {
      if (!value) return true;
      return PRICE_REGEX.test(value.toString());
    })
    .required(),
});

function useProductValidate(initialValues?: NewProduct) {
  const categories = useSelector((state: RootState) => state.categories.categories);

  const [values, setValues] = useState<NewProduct>(
    initialValues || {
      name: '',
      categoryId: '',
      categoryName: '',
      numInStock: 0,
      unitPrice: 0,
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialValues) {
      setValues(initialValues);
    }
  }, [initialValues]);

  const handleChange = (evt: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = evt.target;

    if (!name) return;

    setValues((prev) => ({
      ...prev,
      [name]: value,
      categoryName:
        name === 'categoryId'
          ? categories.find((category) => category.id === value)?.name || ''
          : prev.categoryName,
    }));
  };

  const validateForm = async () => {
    try {
      await productSchema.validate(values, { abortEarly: false });
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

  return { values, setValues, errors, handleChange, validateForm };
}

export default useProductValidate;
