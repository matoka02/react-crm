import {
  Add as ContentCreate,
  ArrowBackIos,
  Delete as ActionDelete,
  Save,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormGroup,
  Grid2,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
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
import useOrderValidate from '@/hooks/useOrderValidate';
import { fetchAllCategories } from '@/stores/categories/categorySlice';
import { fetchAllCustomers } from '@/stores/customers/customerSlice';
import {
  addOrder,
  clearError,
  fetchOrderById,
  ORDER_DURATION,
  updateOrder,
} from '@/stores/orders/orderSlice';
import { fetchAllProducts } from '@/stores/products/productSlice';
import { AppDispatch, RootState } from '@/stores/store';
import { Order, NewOrder, Product } from '@/stores/types/modelTypes';

export default function OrderFormPage(): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id') || '';
  const dispatch = useDispatch<AppDispatch>();
  const { customers } = useSelector((state: RootState) => state.customers);
  const { categories } = useSelector((state: RootState) => state.categories);
  const { products } = useSelector((state: RootState) => state.products);
  const { isLoading, snackbarOpen, snackbarMessage, snackbarSeverity } = useSelector(
    (state: RootState) => state.orders
  );

  const theme = useTheme();
  const styles = theme.customStyles.formPage;
  const {
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
  } = useOrderValidate(categories, products);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!customers.length) {
      dispatch(fetchAllCustomers());
    }
    if (!categories.length) {
      dispatch(fetchAllCategories());
    }
    if (!products.length) {
      dispatch(fetchAllProducts());
    }
  }, [dispatch, customers.length, products.length, categories.length]);

  useEffect(() => {
    if (!orderId) {
      setIsEditing(false);
    }

    if (orderId) {
      setIsEditing(true);
      dispatch(fetchOrderById(orderId)).then((result) => {
        if (fetchOrderById.fulfilled.match(result)) {
          setValues(result.payload);
        }
      });
    }
  }, [customers, dispatch, orderId, setValues]);

  // Opening/closing a dialog
  const handleDialogOpen = () => {
    dispatch(fetchAllProducts());
    setOpen(true);
  };
  const handleDialogClose = () => setOpen(false);

  // Snackbar
  const handleCloseSnackbar = () => {
    dispatch(clearError());
  };

  // Submit
  const handleSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();

    const isValid = await validateForm();

    if (isValid) {
      const payload: NewOrder & Partial<{ id: string }> = orderId
        ? { ...values, id: orderId }
        : values;
      const action = orderId ? updateOrder(payload as Order) : addOrder(values);

      const isActionCompleted = (result: any) =>
        updateOrder.fulfilled.match(result) ||
        addOrder.fulfilled.match(result) ||
        updateOrder.rejected.match(result) ||
        addOrder.rejected.match(result);

      dispatch(action).then((result) => {
        if (isActionCompleted(result)) {
          setTimeout(() => {
            router.push('/orders');
          }, ORDER_DURATION);
        }
      });
    }
  };

  return (
    <Layout title={isEditing ? 'Edit Order' : 'Add Order'} navigation="Application / Order">
      {isLoading ? (
        <SkeletonForm />
      ) : (
        <Paper elevation={3} sx={styles.paper}>
          <form onSubmit={handleSubmit}>
            <Grid2 container spacing={3} sx={styles.formWrapper}>
              {/** General information */}
              <FormControl component="fieldset" fullWidth sx={{ marginBottom: 3 }}>
                <Typography
                  variant="h5"
                  color={theme.palette.primary.main}
                  component="legend"
                  sx={{ marginTop: 2 }}
                >
                  General information:
                </Typography>
                <FormGroup>
                  <Grid2 container spacing={3} sx={styles.formWrapper}>
                    <Grid2 size={12} sx={styles.inputWrapper}>
                      <FormControl fullWidth>
                        <InputLabel id="customerId">Select customer</InputLabel>
                        <Select
                          labelId="customerId"
                          label="Select customer4"
                          displayEmpty
                          name="customerId"
                          value={String(values.customerId) ||''}
                          onChange={(evt) => handleChange(evt as any)}
                        >
                          {customers.map((customer) => (
                            <MenuItem key={customer.id} value={String(customer.id)}>
                              {customer.firstName} {customer.lastName}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid2>

                    <Grid2 size={12} sx={styles.inputWrapper}>
                      <TextField
                        label="Reference"
                        name="reference"
                        placeholder="Enter reference"
                        value={values.reference}
                        onChange={handleChange}
                        error={!!errors.reference}
                        helperText={errors.reference}
                        fullWidth
                      />
                    </Grid2>

                    <Grid2 size={12} sx={styles.inputWrapper}>
                      <TextField
                        label="Amount"
                        name="amount"
                        value={values.amount}
                        onChange={handleChange}
                        error={!!errors.amount}
                        helperText={errors.amount}
                        fullWidth
                      />
                    </Grid2>

                    <Grid2 size={12} sx={styles.inputWrapper}>
                      <TextField
                        label="Quantity"
                        name="productsCount"
                        value={values.quantity}
                        onChange={handleChange}
                        error={!!errors.productsCount}
                        helperText={errors.productsCount}
                        fullWidth
                        disabled
                      />
                    </Grid2>
                  </Grid2>
                </FormGroup>
              </FormControl>

              {/** Date */}
              <FormControl component="fieldset" fullWidth sx={{ marginBottom: 3 }}>
                <Typography
                  variant="h5"
                  color={theme.palette.primary.main}
                  component="legend"
                  sx={{ marginTop: 2 }}
                >
                  Dates:
                </Typography>
                <FormGroup>
                  <Grid2 container spacing={3} sx={styles.formWrapper}>
                    <Grid2 size={12} sx={styles.inputWrapper}>
                      <TextField
                        label="Order Date"
                        name="orderDate"
                        type="date"
                        value={values.orderDate||''}
                        onChange={handleChange}
                        error={!!errors.orderDate}
                        helperText={errors.orderDate}
                        slotProps={{ inputLabel: { shrink: true } }}
                        fullWidth
                      />
                    </Grid2>
                    <Grid2 size={12} sx={styles.inputWrapper}>
                      <TextField
                        label="Shipped Date"
                        name="shippedDate"
                        type="date"
                        value={values.shippedDate||''}
                        onChange={handleChange}
                        error={!!errors.shippedDate}
                        helperText={errors.shippedDate}
                        slotProps={{ inputLabel: { shrink: true } }}
                        fullWidth
                      />
                    </Grid2>
                  </Grid2>
                </FormGroup>
              </FormControl>

              {/** Address */}
              <FormControl component="fieldset" fullWidth sx={{ marginBottom: 3 }}>
                <Typography
                  variant="h5"
                  color={theme.palette.primary.main}
                  component="legend"
                  sx={{ marginTop: 2 }}
                >
                  Shipped address:
                </Typography>
                <FormGroup>
                  <Grid2 container spacing={3} sx={styles.formWrapper}>
                    <Grid2 size={12} sx={styles.inputWrapper}>
                      <TextField
                        label="Address"
                        name="shipAddress.address"
                        value={values.shipAddress.address}
                        onChange={handleChange}
                        error={!!errors.address}
                        helperText={errors.address}
                        fullWidth
                      />
                    </Grid2>
                    <Grid2 size={12} sx={styles.inputWrapper}>
                      <TextField
                        label="City"
                        name="shipAddress.city"
                        value={values.shipAddress.city}
                        onChange={handleChange}
                        error={!!errors.city}
                        helperText={errors.city}
                        fullWidth
                      />
                    </Grid2>
                    <Grid2 size={12} sx={styles.inputWrapper}>
                      <TextField
                        label="Country"
                        name="shipAddress.country"
                        value={values.shipAddress.country}
                        onChange={handleChange}
                        error={!!errors.country}
                        helperText={errors.country}
                        fullWidth
                      />
                    </Grid2>
                    <Grid2 size={12} sx={styles.inputWrapper}>
                      <TextField
                        label="Zip Code"
                        name="shipAddress.zipcode"
                        value={values.shipAddress.zipcode}
                        onChange={handleChange}
                        error={!!errors.zipcode}
                        helperText={errors.zipcode}
                        fullWidth
                      />
                    </Grid2>
                  </Grid2>
                </FormGroup>
              </FormControl>

              {/** Products list */}
              <FormControl component="fieldset" fullWidth sx={{ marginBottom: 3 }}>
                <Typography
                  variant="h5"
                  color={theme.palette.primary.main}
                  component="legend"
                  sx={{ marginBottom: 2 }}
                >
                  List of customer products:
                </Typography>
                <FormGroup>
                  <Grid2 container spacing={3} sx={styles.formWrapper}>
                    <Grid2 size={12}>
                      <Paper elevation={3} sx={{ padding: 2 }}>
                        <List dense={false}>
                          {values.products.map((product: Product) => (
                            <ListItem
                              key={product.id}
                              secondaryAction={
                                <IconButton
                                  edge="end"
                                  onClick={() => handleRemoveProduct(product.id)}
                                >
                                  <ActionDelete />
                                </IconButton>
                              }
                            >
                              <ListItemText
                                primary={product.name}
                                secondary={`Price: $${product.unitPrice}`}
                              />
                            </ListItem>
                          ))}
                        </List>
                        <Box sx={styles.buttonContainer}>
                        <Button
                          variant="contained"
                          onClick={handleDialogOpen}
                          color="secondary"
                          startIcon={<ContentCreate />}
                        >
                          Add Product in Order
                        </Button>
                        </Box>
                      </Paper>
                    </Grid2>
                  </Grid2>
                </FormGroup>
              </FormControl>

              {/* Add product dialog */}
              <Dialog open={open} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ textAlign: 'center' }}>Add Product</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControl fullWidth sx={{ marginTop: 2 }} >
                    <InputLabel id="category-select-label">Select Category</InputLabel>
                    <Select
                      labelId="category-select-label"
                      value={selectedCategory||''}
                      onChange={handleCategoryChange}
                      label="Select Category"
                    >
                      <MenuItem value="" disabled>
                        Select Category
                      </MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel id="product-select-label">Select Product</InputLabel>
                    <Select
                      labelId="product-select-label"
                      value={selectedProduct ? selectedProduct.id : ''}
                      onChange={handleProductChange}
                      label="Select Product"
                      disabled={
                        !selectedCategory ||
                        !products.some((p) => p.categoryId === selectedCategory)
                      }
                    >
                      <MenuItem value="" disabled>
                        Select Product
                      </MenuItem>
                      {products
                        .filter((p) => p.categoryId === selectedCategory)
                        .map((product) => (
                          <MenuItem key={product.id} value={product.id}>
                            {product.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </DialogContent>
                <DialogActions>
                  <Box sx={{display:'flex', justifyContent:'center',width:'100%', gap:2}}>
                  <Button
                    variant="contained"
                    onClick={handleAddProduct}
                    color="primary"
                    disabled={!selectedProduct}
                  >
                    Ok
                  </Button>
                  <Button variant="contained" onClick={handleDialogClose} color="primary">
                    Cancel
                  </Button>
                  </Box>
                </DialogActions>
              </Dialog>

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
            autoHideDuration={ORDER_DURATION}
            onClose={handleCloseSnackbar}
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
