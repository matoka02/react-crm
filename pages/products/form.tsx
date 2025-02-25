import { ArrowBackIos, Save } from '@mui/icons-material';
import {
  Button,
  FormControl,
  FormLabel,
  Grid2,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Alert from '@/components/Alert';
import Layout from '@/components/Layout';
import SkeletonForm from '@/components/SkeletonForm';
import useProductValidate from '@/hooks/useProductValidate';
import { fetchAllCategories } from '@/stores/categories/categorySlice';
import {
  addProduct,
  clearError,
  fetchProductById,
  updateProduct,
} from '@/stores/products/productSlice';
import { AppDispatch, RootState } from '@/stores/store';
import { Product, NewProduct } from '@/stores/types/modelTypes';

export default function ProductFormPage(): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('id') ?? '';
  const dispatch = useDispatch<AppDispatch>();
  const { categories } = useSelector((state: RootState) => state.categories);
  const { isLoading, snackbarOpen, snackbarMessage, snackbarSeverity } = useSelector(
    (state: RootState) => state.products
  );

  const theme = useTheme();
  const { values, setValues, errors, handleChange, validateForm } = useProductValidate();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!categories.length) {
      dispatch(fetchAllCategories());
    }
  }, [dispatch, categories.length]);

  useEffect(() => {
    if (!productId) {
      setIsEditing(false);
    }

    if (productId) {
      setIsEditing(true);
      dispatch(fetchProductById(productId)).then((result) => {
        if (fetchProductById.fulfilled.match(result)) {
          const productData = result.payload;
          setValues({
            ...productData,
            categoryName:
              categories.find((cat) => cat.id === productData.categoryId)?.name || 'Unknown',
          });
        }
      });
    }
  }, [categories, dispatch, productId, setValues]);

  // Snackbar
  const handleCloseSnackbar = () => {
    dispatch(clearError());
  };

  // Submit
  const handleSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();

    const isValid = await validateForm();

    if (isValid) {
      const payload: NewProduct & Partial<{ id: string }> = productId
        ? { ...values, id: productId }
        : values;
      const action = productId ? updateProduct(payload as Product) : addProduct(values);

      const isActionCompleted = (result: any) =>
        updateProduct.fulfilled.match(result) ||
        addProduct.fulfilled.match(result) ||
        updateProduct.rejected.match(result) ||
        addProduct.rejected.match(result);

      dispatch(action).then((result) => {
        if (isActionCompleted(result)) {
          setTimeout(() => {
            router.push('/products');
          }, 2000);
        }
      });
    }
  };

  return (
    <Layout title={productId ? 'Edit Product' : 'Add Product'} navigation="Application / Product">
      {isLoading ? (
        <SkeletonForm />
      ) : (
        <Paper elevation={3} sx={{ maxWidth: 800, mx: 'auto', p: 4, mt: 4 }}>
          <form onSubmit={handleSubmit}>
            <Grid2 container spacing={3} sx={{ mt: 2 }}>
              <Grid2 size={12} sx={{ md: 6 }}>
                <TextField
                  label="Product Name"
                  name="name"
                  placeholder="Enter product name"
                  value={values.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  fullWidth
                />
              </Grid2>
              <Grid2 size={12} sx={{ md: 6 }}>
                <FormControl fullWidth>
                  <FormLabel sx={{ color: 'text.primary' }}>Category</FormLabel>
                  <Select
                    name="categoryId"
                    value={values.categoryId}
                    error={!!errors.categoryId}
                    onChange={(evt) => handleChange(evt as any)}
                    displayEmpty
                  >
                    {!productId ? (
                      <MenuItem value="" disabled>
                        <Typography color="textSecondary">Select category</Typography>
                      </MenuItem>
                    ) : null}
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid2>
              <Grid2 size={12} sx={{ md: 6 }}>
                <TextField
                  label="Stock Quantity"
                  name="numInStock"
                  type="number"
                  placeholder="Enter stock quantity"
                  value={values.numInStock}
                  onChange={handleChange}
                  error={!!errors.numInStock}
                  helperText={errors.numInStock}
                  fullWidth
                />
              </Grid2>
              <Grid2 size={12} sx={{ md: 6 }}>
                <TextField
                  label="Unit Price"
                  name="unitPrice"
                  type="number"
                  placeholder="Enter unit price"
                  value={values.unitPrice}
                  onChange={handleChange}
                  error={!!errors.unitPrice}
                  helperText={errors.unitPrice}
                  fullWidth
                />
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
                  <Save /> Save {isEditing ? 'Update' : ''}
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
