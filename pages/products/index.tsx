import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Drawer,
  Fab,
  Grid2,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Alert from '@/components/Alert';
import DataTable from '@/components/DataTable';
import DeleteDialog from '@/components/DeleteDialog';
import Layout from '@/components/Layout';
import SkeletonList from '@/components/SkeletonList';
import useProductSearch from '@/hooks/useProductSearch';
import { fetchAllCategories } from '@/stores/categories/categorySlice';
import {
  fetchAllProducts,
  clearError,
  setSearchOpen,
  deleteProduct,
} from '@/stores/products/productSlice';
import { AppDispatch, RootState } from '@/stores/store';

export default function ProductListPage(): React.ReactElement {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const {
    products,
    isLoading,
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    searchOpen,
    search,
  } = useSelector((state: RootState) => state.products);
  // console.table(products);

  useEffect(() => {
    // dispatch(fetchAllProducts());
    dispatch(fetchAllCategories()).then(() => {
      dispatch(fetchAllProducts());
    });
  }, [dispatch]);

  const theme = useTheme();
  const [page, setPage] = useState(1);
  const [items, setItems] = useState(products.slice(0, 10));
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const {
    search: localSearch,
    handleSearchChange,
    handleSearch,
    handleResetSearch,
  } = useProductSearch(search);

  useEffect(() => {
    setItems(products.slice((page - 1) * 10, page * 10));
  }, [products, page]);

  // Snackbar
  const handleCloseSnackbar = () => {
    dispatch(clearError());
  };

  // Search products
  const handleToggleSearch = (evt: SyntheticEvent) => {
    evt.preventDefault();
    dispatch(setSearchOpen(!searchOpen));
  };

  // Delete product
  const handleOpenDeleteDialog = (id?: number) => {
    if (id) {
      setSelectedProductId(id);
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteDialogClose = (confirmed: boolean) => {
    if (confirmed && selectedProductId) {
      dispatch(deleteProduct(selectedProductId))
        .unwrap()
        .finally(() => {
          dispatch(fetchAllProducts());
        });
    }
    setDeleteDialogOpen(false);
    setSelectedProductId(null);
  };

  // Add product
  const handleNewProduct = () => {
    router.push('/products/form');
  };

  return (
    <Layout title={`Products (${products.length})`} navigation="Application / Product">
      {isLoading ? (
        <SkeletonList />
      ) : (
        <Box suppressHydrationWarning>
          {/* Control buttons */}
          <Tooltip title="Add Product">
            <Fab
              onClick={handleNewProduct}
              sx={{
                position: 'fixed',
                bottom: 16,
                right: 80,
                zIndex: 1200,
                backgroundColor: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
              }}
            >
              <AddIcon sx={{ color: 'white' }} />
            </Fab>
          </Tooltip>
          <Tooltip title="Search">
            <Fab
              onClick={handleToggleSearch}
              sx={{
                position: 'fixed',
                bottom: 16,
                right: 16,
                zIndex: 1200,
                backgroundColor: theme.palette.secondary.main,
                '&:hover': {
                  backgroundColor: theme.palette.secondary.dark,
                },
              }}
            >
              <SearchIcon sx={{ color: 'white' }} />
            </Fab>
          </Tooltip>

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

          {/* Table with products */}
          <DataTable
            model="products"
            items={items}
            dataKeys={['name', 'categoryName', 'unitPrice', 'numInStock', 'action']}
            headers={['Name', 'Category Name', 'Price', 'Total In Stock', 'Actions']}
            page={page}
            totalPages={Math.ceil(products.length / 10)}
            onDelete={(evt, id) => handleOpenDeleteDialog(id)}
            onPageChange={(_, newPage) => setPage(newPage)}
          />

          {/* Delete dialog */}
          <DeleteDialog
            open={deleteDialogOpen}
            closeDialog={handleDeleteDialogClose}
            dialogTitle="Delete product"
            dialogText={`Are you sure you want to delete this product with ID ${selectedProductId}?`}
          />

          {/* Searchbar */}
          <Drawer
            anchor="right"
            open={searchOpen}
            onClose={handleToggleSearch}
            ModalProps={{
              sx: { backgroundColor: 'transparent' },
            }}
          >
            <Box sx={{ width: 300, p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Search Products
              </Typography>
              <form
                onSubmit={(evt) => {
                  evt.preventDefault();
                  handleSearch();
                }}
              >
                <TextField
                  fullWidth
                  margin="dense"
                  label="Name"
                  name="name"
                  placeholder="Enter name"
                  value={localSearch.name}
                  onChange={handleSearchChange}
                />
                <Grid2
                  container
                  spacing={2}
                  sx={{
                    width: '100%',
                    mt: 2,
                    flexDirection: 'column',
                    alignItems: 'center',
                    flexGrow: 1,
                  }}
                  component="div"
                >
                  <Grid2 size={12}>
                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      sx={{
                        minWidth: 120,
                        width: '100%',
                        color: 'white',
                        backgroundColor: theme.palette.primary.main,
                        '&:hover': {
                          backgroundColor: theme.palette.primary.dark,
                        },
                      }}
                    >
                      Search
                    </Button>
                  </Grid2>
                  <Grid2 size={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{
                        width: '100%',
                        whiteSpace: 'nowrap',
                        color: 'white',
                        backgroundColor: theme.palette.success.main,
                        '&:hover': {
                          backgroundColor: theme.palette.success.dark,
                        },
                      }}
                      onClick={handleResetSearch}
                    >
                      Show All
                    </Button>
                  </Grid2>
                  <Grid2 size={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{
                        minWidth: 120,
                        width: '100%',
                        color: 'white',
                        backgroundColor: theme.palette.secondary.main,
                        '&:hover': {
                          backgroundColor: theme.palette.secondary.dark,
                        },
                      }}
                      onClick={handleToggleSearch}
                    >
                      Close
                    </Button>
                  </Grid2>
                </Grid2>
              </form>
            </Box>
          </Drawer>
        </Box>
      )}
    </Layout>
  );
}
