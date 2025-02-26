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
  PRODUCT_DURATION,
} from '@/stores/products/productSlice';
import { AppDispatch, RootState } from '@/stores/store';

const defaultProps = {
  model: 'products',
  dataKeys: ['name', 'categoryName', 'unitPrice', 'numInStock', 'action'],
  headers: ['Name', 'Category Name', 'Price', 'Total In Stock', 'Actions'],
};

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
  const styles = theme.customStyles.listPage;
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
            <Fab onClick={handleNewProduct} sx={styles.fabAdd}>
              <AddIcon sx={styles.fabIcon} />
            </Fab>
          </Tooltip>
          <Tooltip title="Search">
            <Fab onClick={handleToggleSearch} sx={styles.fabSearch}>
              <SearchIcon sx={styles.fabIcon} />
            </Fab>
          </Tooltip>

          {/* Notifications */}
          <Snackbar open={snackbarOpen} autoHideDuration={PRODUCT_DURATION} onClose={handleCloseSnackbar}>
            <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
              {snackbarMessage}
            </Alert>
          </Snackbar>

          {/* Table with products */}
          <DataTable
            model={defaultProps.model}
            items={items}
            dataKeys={defaultProps.dataKeys}
            headers={defaultProps.headers}
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
          <Drawer anchor="right" open={searchOpen} onClose={handleToggleSearch}>
            <Box sx={styles.drawerBox}>
              <Typography variant="h6" sx={styles.drawerTitle}>
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
                <Grid2 container spacing={2} sx={styles.drawerButtonContainer} component="div">
                  <Grid2 size={12}>
                    <Button fullWidth type="submit" variant="contained" sx={styles.buttonSearch}>
                      Search
                    </Button>
                  </Grid2>
                  <Grid2 size={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      sx={styles.buttonSetSearch}
                      onClick={handleResetSearch}
                    >
                      Show All
                    </Button>
                  </Grid2>
                  <Grid2 size={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      sx={styles.buttonBack}
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
