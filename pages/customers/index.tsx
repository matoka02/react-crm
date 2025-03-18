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

import Alert from '@/components/Alert';
import DataTable from '@/components/DataTable';
import DeleteDialog from '@/components/DeleteDialog';
import PageContainer from '@/components/PageContainer';
import SkeletonList from '@/components/SkeletonList';
import useCustomerSearch from '@/hooks/useCustomerSearch';
import { clearError, setSearchOpen, CUSTOMER_DURATION } from '@/stores/customers/customerSlice';
import { fetchAllCustomers, deleteCustomer } from '@/stores/customers/customerThunk';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { RootState } from '@/stores/store';

const defaultProps = {
  model: 'customers',
  dataKeys: ['avatar', 'firstName', 'lastName', 'email', 'mobile', 'membership', 'action'],
  headers: ['Avatar', 'First Name', 'Last Name', 'Email', 'Mobile', 'Membership', 'Actions'],
};

export default function CustomerListPage(): React.ReactElement {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    customers,
    isLoading,
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    searchOpen,
    search,
  } = useAppSelector((state: RootState) => state.customers);
  // console.table(customers);

  useEffect(() => {
    dispatch(fetchAllCustomers());
  }, [dispatch]);

  const theme = useTheme();
  const styles = theme.customStyles.listPage;
  const [page, setPage] = useState(1);
  const [items, setItems] = useState(customers.slice(0, 10));
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const {
    search: localSearch,
    handleSearchChange,
    handleSearch,
    handleResetSearch,
  } = useCustomerSearch(search);

  useEffect(() => {
    setItems(customers.slice((page - 1) * 10, page * 10));
  }, [customers, page]);

  // Snackbar
  const handleCloseSnackbar = () => {
    dispatch(clearError());
  };

  // Search customers
  const handleToggleSearch = (evt: SyntheticEvent) => {
    evt.preventDefault();
    dispatch(setSearchOpen(!searchOpen));
  };

  // Delete customer
  const handleOpenDeleteDialog = (id?: number) => {
    if (id) {
      setSelectedCustomerId(id);
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteDialogClose = (confirmed: boolean) => {
    if (confirmed && selectedCustomerId) {
      dispatch(deleteCustomer(selectedCustomerId))
        .unwrap()
        .finally(() => {
          dispatch(fetchAllCustomers());
        });
    }
    setDeleteDialogOpen(false);
    setSelectedCustomerId(null);
  };

  // Add customer
  const handleNewCustomer = () => {
    router.push('/customers/form');
  };

  return (
    <PageContainer title={`Customers (${customers.length})`} navigation="Application / Customer">
      {isLoading ? (
        <SkeletonList />
      ) : (
        <Box suppressHydrationWarning>
          {/* Control buttons */}
          <Tooltip title="Add Customer">
            <Fab onClick={handleNewCustomer} sx={styles.fabAdd}>
              <AddIcon sx={styles.fabIcon} />
            </Fab>
          </Tooltip>
          <Tooltip title="Search">
            <Fab onClick={handleToggleSearch} sx={styles.fabSearch}>
              <SearchIcon sx={styles.fabIcon} />
            </Fab>
          </Tooltip>

          {/* Notifications */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={CUSTOMER_DURATION}
            onClose={handleCloseSnackbar}
          >
            <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
              {snackbarMessage}
            </Alert>
          </Snackbar>

          {/* Table with clients */}
          <DataTable
            model={defaultProps.model}
            items={items}
            dataKeys={defaultProps.dataKeys}
            headers={defaultProps.headers}
            page={page}
            totalPages={Math.ceil(customers.length / 10)}
            onDelete={(evt, id) => handleOpenDeleteDialog(id)}
            onPageChange={(_, newPage) => setPage(newPage)}
          />

          {/* Delete dialog */}
          <DeleteDialog
            open={deleteDialogOpen}
            closeDialog={handleDeleteDialogClose}
            dialogTitle="Delete customer"
            dialogText={`Are you sure you want to delete this customer with ID ${selectedCustomerId}?`}
          />

          {/* Searchbar */}
          <Drawer anchor="right" open={searchOpen} onClose={handleToggleSearch}>
            <Box sx={styles.drawerBox}>
              <Typography variant="h6" sx={styles.drawerTitle}>
                Search Customers
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
                  label="First Name"
                  name="firstName"
                  placeholder="Enter first name"
                  value={localSearch.firstName}
                  onChange={handleSearchChange}
                />
                <TextField
                  fullWidth
                  margin="dense"
                  label="Last Name"
                  name="lastName"
                  placeholder="Enter last name"
                  value={localSearch.lastName}
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
    </PageContainer>
  );
}
