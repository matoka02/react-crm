import { createTheme } from '@mui/material/styles';
import { blue, grey } from '@mui/material/colors';

const blue600 = blue[600];
const grey900 = grey[900];

const themeDefault = createTheme({
  palette: {
    primary: {
      main: blue600,
    },
    secondary: {
      main: grey900,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          height: 57,
          backgroundColor: blue600,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        root: {
          width: 230,
          backgroundColor: grey900,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: blue600,
        },
      },
    },
  },
});

export default themeDefault;
