import { Box, ListItemIcon, MenuItem, Typography, useTheme } from '@mui/material';
import Link from 'next/link';
import React from 'react';

import data from '@/lib/demo-dashboard';

const getStyles = (theme: any) => ({
  menuItem: {
    color: theme.palette.primary.main,
    fontWeight: 800,
    paddingTop: '0.2em',
    paddingBottom: '0.2em',
    fontSize: 16,
  },
  menuIcon: { color: theme.palette.primary.main },
});

function AppDrawerMenu(): React.ReactElement {
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <Box component="div">
      {data.menus.map((menu) => (
        <Link key={menu.link} href={menu.link} passHref legacyBehavior>
          <MenuItem>
            <ListItemIcon sx={styles.menuIcon}>{menu.icon}</ListItemIcon>
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
