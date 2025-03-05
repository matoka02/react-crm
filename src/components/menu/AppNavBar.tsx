import { GitHub, Menu } from '@mui/icons-material';
import { AppBar, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import React from 'react';

interface AppNavBarProps {
  handleDrawerToggle: () => void;
  styles: {
    appBar: React.CSSProperties;
  };
}

const getStyles = {
  container: { flexGrow: 1 },
  toolbar: {
    minHeight: 0,
    justifyContent: 'space-between',
    gap: 2,
  },
  title: { flexGrow: 1 },
};

function AppNavBar({ styles, handleDrawerToggle }: AppNavBarProps): React.ReactElement {
  const handleClick = () => {
    window.open(process.env.NEXT_PUBLIC_GITHUB_URL, '_blank');
  };

  return (
    <AppBar position="fixed" sx={styles.appBar}>
      <Toolbar sx={getStyles.toolbar}>
        <IconButton onClick={handleDrawerToggle} color="inherit" aria-label="menu">
          <Menu />
        </IconButton>
        <Typography variant="h5" sx={getStyles.title}>
          Demo
        </Typography>
        <Tooltip title="Github" aria-label="Github">
          <IconButton onClick={handleClick} color="inherit">
            <GitHub />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}

export default AppNavBar;
