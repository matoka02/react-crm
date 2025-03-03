import {} from '@mui/icons-material';
import { Box, ListItemIcon, MenuItem, Typography } from '@mui/material';
import { blue } from '@mui/material/colors';
import Link from 'next/link';
import React from 'react';

import data from '@/lib/demo-dashboard';

const styles = {
  menuItem: {
    color: blue[600],
    fontWeight: 800,
    paddingTop: '0.2em',
    paddingBottom: '0.2em',
    fontSize: 16,
  },
};

function AppDrawerMenu(): React.ReactElement {
  return (
    <Box component="div">
      {data.menus.map((menu) => (
        <Link key={menu.link} href={menu.link} passHref legacyBehavior>
          <MenuItem>
            <ListItemIcon>{menu.icon}</ListItemIcon>
            <Typography variant="h6" component="h6" sx={styles.menuItem}>
              {menu.text}
            </Typography>
          </MenuItem>
        </Link>
      ))}
    </Box>
  );
}

export default AppDrawerMenu;
