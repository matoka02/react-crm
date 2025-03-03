import { GitHub, Menu } from '@mui/icons-material';
import { AppBar, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import React from 'react';

interface AppNavBarProps {
  handleDrawerToggle: () => void;
}

const styles = {
  container: { flexGrow: 1 },
  title: { flexGrow: 1 },
  toolbar: { minHeight: 0 },
};

function AppNavBar({ handleDrawerToggle }: AppNavBarProps): React.ReactElement {
  const handleClick = () => {
    window.open(process.env.NEXT_PUBLIC_GITHUB_URL, '_blank');
  };

  return (
    <AppBar position="fixed">
      <Toolbar sx={styles.toolbar}>
        <IconButton edge="end" onClick={handleDrawerToggle} color="inherit" aria-label="menu">
          <Menu />
        </IconButton>
        <Typography variant="h5" sx={styles.title}>
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
