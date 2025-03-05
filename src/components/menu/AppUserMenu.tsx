import { FilterList, SettingsPower, VpnKey } from '@mui/icons-material';
import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { common, purple } from '@mui/material/colors';
import React from 'react';

interface AppUserMenuProps {
  username: string;
  onSignOutClick: () => void;
  onChangePassClick: () => void;
}

const defaultImage = '/assets/img/leftdrawer-bg.jpg';
const defaultAvatar = '/assets/img/avatar0.png';

const getStyles = (theme: any) => ({
  container: {
    padding: '15px 0 10px 10px',
    backgroundImage: `url(${defaultImage})`,
    backgroundColor: 'silver',
  },
  avatar: { boxShadow: '0px 0px 0px 8px rgba(0,0,0,0.2)' },
  name: { color: purple[600], fontWeight: 400, fontSize: 19, textShadow: '1px 1px #444' },
  userName: { fontSize: 22, color: common.white },
  icon: { color: theme.palette.secondary.main },
  menuItem: { paddingLeft: '1em' },
});

function AppUserMenu({
  username,
  onSignOutClick,
  onChangePassClick,
}: AppUserMenuProps): React.ReactElement {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const theme = useTheme();
  const styles = getStyles(theme);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const signOutClick = (evt: React.MouseEvent) => {
    evt.preventDefault();
    onSignOutClick();
    handleClose();
  };

  const changePassClick = (evt: React.MouseEvent) => {
    evt.preventDefault();
    onChangePassClick();
    handleClose();
  };

  const handleMenu = (evt: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(evt.currentTarget);
  };

  return (
    <Box sx={styles.container}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar src={defaultAvatar} sx={styles.avatar} />
      </Stack>
      <Box>
        <Typography component='div' sx={styles.name}>
          <Typography component='span' sx={styles.userName} variant="inherit">
            {username}
          </Typography>
        </Typography>

        <IconButton
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
        >
          <FilterList />
        </IconButton>

        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          keepMounted
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={signOutClick}>
            <SettingsPower />
            <Typography sx={styles.menuItem} variant="inherit">
              Sign Out
            </Typography>
          </MenuItem>
          <MenuItem onClick={changePassClick}>
            <VpnKey />
            <Typography sx={styles.menuItem} variant="inherit">
              Change Password
            </Typography>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}

export default AppUserMenu;
