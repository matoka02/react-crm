import {
  Box,
  List,
  ListItemText,
  ListSubheader,
  // Menu, MenuItem,
  Paper,
} from '@mui/material';
import { common, cyan } from '@mui/material/colors';
import React from 'react';

interface Product {
  title: string;
  text: string;
}

interface RecentlyProductsProps {
  data: Product[];
}

const styles = {
  listSubheader: {
    fontSize: 24,
    fontWeight: 500,
    backgroundColor: cyan[600],
    color: common.white,
  },
};

function RecentlyProducts({ data }: RecentlyProductsProps): React.ReactElement {
  // const rightIconMenu = (
  //   <Menu open={true}>
  //     <MenuItem>View</MenuItem>
  //   </Menu>
  // );

  return (
    <Paper>
      <List>
        <ListSubheader sx={styles.listSubheader}>Recent Products</ListSubheader>
        {data.map((item) => (
          <Box component="div" key={item.title}>
            <ListItemText primary={item.title} secondary={item.text} />
          </Box>
        ))}
      </List>
    </Paper>
  );
}

export default RecentlyProducts;
