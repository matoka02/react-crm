import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';

import getCategoryNameById from '@/stores/products/categoryUtils';
import { RootState } from '@/stores/store';
import { NewProduct } from '@/stores/types/modelTypes';

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Product name must be at least 2 characters')
    .required('Product name is required'),
  categoryId: Yup.string().required('Category is required'),
  numInStock: Yup.number().min(0, 'Stock cannot be negative').required(),
  unitPrice: Yup.number().min(0, 'Price cannot be negative').required(),
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

    // setValues((prev) => {
    //   if (name === 'categoryId' && typeof value === 'string') {
    //     const categoryName = getCategoryNameById(value, () => ({ categories }));
    //     return { ...prev, categoryId: value, categoryName };
    //   }
    //   return { ...prev, [name]: value };
    // });
    setValues((prev) => ({
      ...prev,
      [name]: value,
      categoryName:
        name === 'categoryId'
          ? categories.find((cat) => cat.id === value)?.name || ''
          : prev.categoryName,
    }));
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

  return { values, setValues, errors, handleChange, validateForm };
}

export default useProductValidate;
