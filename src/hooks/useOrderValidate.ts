import { SelectChangeEvent } from '@mui/material';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';

import { useAppSelector } from '@/stores/hooks';
import { RootState } from '@/stores/store';
import { Category, NewOrder, Product } from '@/stores/types/modelTypes';

import { REFERENCE_REGEX } from './useOrderSearch';
import { PRICE_REGEX } from './useProductValidate';

const ZIPCODE_REGEX = /^\d{5}$/;

const productSchema = Yup.object({
  id: Yup.string().required('Product ID is required'),
});

const shipAddressSchema = Yup.object({
  address: Yup.string().min(5, 'Address must be at least 5 characters').required(),
  city: Yup.string().min(2, 'City must be at least 2 characters').required(),
  country: Yup.string().min(2, 'Country must be at least 2 characters').required(),
  zipcode: Yup.string()
    .matches(ZIPCODE_REGEX, 'Invalid Zip Code format')
    .required('Zip Code is required'),
});

const orderSchema = Yup.object({
  customerId: Yup.string().required('Customer is required'),
  reference: Yup.string()
    .min(3, 'Reference must be at least 3 characters')
    .matches(REFERENCE_REGEX)
    .required(),
  amount: Yup.number()
    .min(0, 'Amount cannot be negative')
    .test('is-decimal', 'Amount must have up to 2 decimal places', (value) => {
      if (!value) return true;
      return PRICE_REGEX.test(value.toString());
    })
    .required(),
  productsCount: Yup.number().min(1, 'The products list must not be empty!').integer().required(),
  orderDate: Yup.string().required('Order Date is required'),
  shippedDate: Yup.string()
    .required('Shipped Date is required')
    .test(
      'is-after-orderDate',
      'Shipped Date cannot be before Order Date',
      function validateShippedDate(value) {
        const { orderDate } = this.parent;
        return !orderDate || !value || new Date(value) >= new Date(orderDate);
      }
    ),
  shipAddress: shipAddressSchema,
  products: Yup.array().of(productSchema).required('Products are required'),
});

function useOrderValidate(categories: Category[], products: Product[], initialValues?: NewOrder) {
  const customers = useAppSelector((state: RootState) => state.customers.customers);

  const [values, setValues] = useState<NewOrder>(
    initialValues || {
      reference: '',
      customerId: '',
      customer: {} as any,
      customerName: '',
      products: [],
      amount: 0,
      quantity: 1,
      orderDate: '',
      shippedDate: '',
      shipAddress: { address: '', city: '', zipcode: '', country: '' },
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (initialValues) {
      setValues(initialValues);
    }
  }, [initialValues]);

  // Auto-update quantity based on products count
  useEffect(() => {
    setValues((prev) => ({
      ...prev,
      productsCount: prev.products.length,
    }));
  }, [values.products]);

  // Handler for changing form fields
  const handleChange = (evt: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = evt.target;
    if (!name) return;

    setValues((prev) => {
      if (name === 'customerId') {
        const customer = customers.find((c) => c.id === value);
        return {
          ...prev,
          customerId: String(value),
          customerName: customer ? customer.firstName : '',
        };
      }
      if (name.startsWith('shipAddress.')) {
        const addressField = name.split('.')[1];
        return { ...prev, shipAddress: { ...prev.shipAddress, [addressField]: value } };
      }
      return { ...prev, [name]: value };
    });
  };

  // Select category and filter products
  const handleCategoryChange = (evt: SelectChangeEvent) => {
    const categoryId = evt.target.value as string;
    setSelectedCategory(categoryId);
    setSelectedProduct(null);
  };

  // Product selection
  const handleProductChange = (evt: SelectChangeEvent) => {
    const productId = evt.target.value as string;
    const product = products.find((p) => p.id === productId);
    setSelectedProduct(product || null);
  };

  // Adding a product to an order
  const handleAddProduct = () => {
    if (selectedProduct) {
      setValues((prev) => ({
        ...prev,
        products: [...prev.products, selectedProduct],
      }));
      setSelectedCategory('');
      setSelectedProduct(null);
    }
  };

  // Removing a product from an order
  const handleRemoveProduct = (productId: string) => {
    setValues((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== productId),
    }));
  };

  // Form validation
  const validateForm = async () => {
    try {
      await orderSchema.validate(values, { abortEarly: false });
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

  return {
    values,
    setValues,
    selectedCategory,
    selectedProduct,
    errors,
    handleChange,
    handleCategoryChange,
    handleProductChange,
    handleAddProduct,
    handleRemoveProduct,
    validateForm,
  };
}

export default useOrderValidate;
