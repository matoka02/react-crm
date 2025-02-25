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
import useOrderSearch from '@/hooks/useOrderSearch';
import { fetchAllCustomers } from '@/stores/customers/customerSlice';
import { fetchAllOrders, clearError, setSearchOpen, deleteOrder } from '@/stores/orders/orderSlice';
import { AppDispatch, RootState } from '@/stores/store';



export default function OrderListPage(): React.ReactElement {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { orders, isLoading, snackbarOpen, snackbarMessage, snackbarSeverity, searchOpen, search } =
    useSelector((state: RootState) => state.orders);

  useEffect(() => {
    dispatch(fetchAllCustomers()).then(() => {
      dispatch(fetchAllOrders());
    });
  }, [dispatch]);

  const theme = useTheme();
  const [page, setPage] = useState(1);
  const [items, setItems] = useState(orders.slice(0, 10));
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const {
    search: localSearch,
    handleSearchChange,
    handleSearch,
    handleResetSearch,
  } = useOrderSearch(search);

  useEffect(() => {
    setItems(orders.slice((page - 1) * 10, page * 10));
  }, [orders, page]);

  // Snackbar
  const handleCloseSnackbar = () => {
    dispatch(clearError());
  };

  // Search orders
  const handleToggleSearch = (evt: SyntheticEvent) => {
    evt.preventDefault();
    dispatch(setSearchOpen(!searchOpen));
  };

  // Delete order
  const handleOpenDeleteDialog = (id?: number) => {
    if (id) {
      setSelectedOrderId(id);
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteDialogClose = (confirmed: boolean) => {
    if (confirmed && selectedOrderId) {
      dispatch(deleteOrder(selectedOrderId))
        .unwrap()
        .finally(() => {
          dispatch(fetchAllOrders());
        });
    }
    setDeleteDialogOpen(false);
    setSelectedOrderId(null);
  };

  // Add order
  const handleNewOrder = () => {
    router.push('/orders/form');
  };

  return (
    <Layout title={`Orders (${orders.length})`} navigation="Application / Order">
      {isLoading ? (
        <SkeletonList />
      ) : (
        <Box suppressHydrationWarning>
          {/* Control buttons */}
          <Tooltip title="Add Order">
            <Fab
              onClick={handleNewOrder}
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

          {/* Table with orders */}
          <DataTable
            model="orders"
            items={items}
            dataKeys={[
              'reference',
              'productsCount',
              'amount',
              'customerName',
              'orderDate',
              'shippedDate',
              'action',
            ]}
            headers={[
              'Reference',
              'Quantity',
              'Amount',
              'Customer',
              'Order Date',
              'Shipping Date',
              'Actions',
            ]}
            page={page}
            totalPages={Math.ceil(orders.length / 10)}
            onDelete={(evt, id) => handleOpenDeleteDialog(id)}
            onPageChange={(_, newPage) => setPage(newPage)}
          />

          {/* Delete dialog */}
          <DeleteDialog
            open={deleteDialogOpen}
            closeDialog={handleDeleteDialogClose}
            dialogTitle="Delete order"
            dialogText={`Are you sure you want to delete this order with ID ${selectedOrderId}?`}
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
                Search Orders
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
                  label="Reference"
                  name="reference"
                  placeholder="Enter reference"
                  value={localSearch.reference}
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
