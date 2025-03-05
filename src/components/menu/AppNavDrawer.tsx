import { Box, Drawer } from '@mui/material';
import React from 'react';

import AppDrawerMenu from './AppDrawerMenu';
import AppUserMenu from './AppUserMenu';

interface AppDrawerBarProps {
  navDrawerOpen: boolean;
  username: string;
  onSignoutClick: () => void;
  onChangePassClick: () => void;
  handleDrawerToggle: () => void;
  isSmallScreen: boolean;
  drawerStyle: React.CSSProperties;
  // children?: React.ReactNode;
}

const drawerWidth = 250;

const styles = {
  container: { display: 'flex' },
  drawerPaper: {
    width: drawerWidth,
    flexShrink: 0,
    backgroundColor: 'rgba(227, 231, 232, 1)',
    overflow: 'auto',
  },
  drawerContent:{width:drawerWidth}
};

function AppDrawerBar(props: AppDrawerBarProps): React.ReactElement {
  const {
    username,
    navDrawerOpen,
    isSmallScreen,
    onSignoutClick,
    onChangePassClick,
    handleDrawerToggle,
    drawerStyle,
  } = props;

  // const theme = useTheme();
  // const styles = getStyles(theme);

  const drawer = (
    <Box sx={styles.drawerContent}>
      <AppUserMenu
        username={username}
        onSignOutClick={onSignoutClick}
        onChangePassClick={onChangePassClick}
      />
      <AppDrawerMenu />
    </Box>
  );

  return (
    <Box sx={styles.container}>
      <nav aria-label="app navigation" style={drawerStyle}>
        {!isSmallScreen ? (
          <Drawer
            variant="persistent"
            anchor="left"
            open={navDrawerOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={styles.drawerPaper}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="temporary"
            anchor="left"
            open={navDrawerOpen}
            onClose={handleDrawerToggle}
            sx={styles.drawerPaper}
          >
            {drawer}
          </Drawer>
        )}
      </nav>
    </Box>
  );
}

export default AppDrawerBar;
