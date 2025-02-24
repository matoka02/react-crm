import { ArrowBackIos, Save } from '@mui/icons-material';
import { Button, Grid2, Paper, Snackbar, useTheme } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Alert from '@/components/Alert';
import Layout from '@/components/Layout';
import SkeletonForm from '@/components/SkeletonForm';
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
  const { isLoading, snackbarOpen, snackbarMessage, snackbarSeverity, product } = useSelector(
    (state: RootState) => state.products
  );
  const { categories } = useSelector((state: RootState) => state.categories);

  const theme = useTheme();
  const [values, setValues] = useState<NewProduct>({
    name: '',
    categoryId: '',
    categoryName: '',
    numInStock: 0,
    unitPrice: 0,
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  useEffect(() => {
    if (!productId) {
      setIsEditing(false);
    }

    if (productId) {
      setIsEditing(true);
      dispatch(fetchProductById(productId)).then((result) => {
        if (fetchProductById.fulfilled.match(result)) {
          setValues({
            ...result.payload,
            categoryName:
              categories.find((c) => c.id === result.payload.categoryId)?.name || 'Unknown',
          });
        }
      });
    }
  }, [categories, dispatch, productId, setValues]);

  // Snackbar
  const handleCloseSnackbar = () => {
    dispatch(clearError());
  };

  const handleChange = (evt: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = evt.target;
    if (name) {
      setValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload: NewProduct & Partial<{ id: string }> = productId
      ? { ...values, id: productId }
      : values;
    const action = productId ? updateProduct(payload as Product) : addProduct(values);

    dispatch(action).then((result) => {
      if (updateProduct.fulfilled.match(result) || addProduct.fulfilled.match(result)) {
        setTimeout(() => {
          router.push('/products');
        }, 2000);
      }
    });
  };

  return (
    <Layout title={productId ? 'Edit Product' : 'Add Product'} navigation="Application / Product">
      {isLoading ? (
        <SkeletonForm />
      ) : (
        <Paper elevation={3} sx={{ maxWidth: 800, mx: 'auto', p: 4, mt: 4 }}>
          <form onSubmit={handleSubmit}>
            <Grid2 container spacing={3} sx={{ mt: 2 }}>
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
