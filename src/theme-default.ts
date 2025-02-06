import { createTheme, ThemeOptions } from '@mui/material/styles';
import { blue, grey, pink } from '@mui/material/colors';

const blue600 = blue[600];
const grey900 = grey[900];
const grey600 = grey[600];
const pink500 = pink[500];

declare module '@mui/material/styles' {
  interface Theme {
    customStyles: {
      navigation: object;
      title: object;
      paper: object;
      clear: object;
      listPage: {
        fab: object;
        fabSearch: object;
        searchButton: object;
        drawer: object;
        searchDrawer: object;
        searchGrid: object;
        searchField: object;
      };
      formPage: {
        buttons: object;
        saveButton: object;
        card: object;
        container: object;
        cell: object;
        productList: object;
        textField: object;
      };
    };
  }
  interface ThemeOptions {
    customStyles?: Theme['customStyles'];
  }
}

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
  customStyles: {
    navigation: {
      fontSize: 15,
      fontWeight: 500,
      color: grey600,
      paddingBottom: 15,
      display: 'block',
    },
    title: {
      fontSize: 24,
      fontWeight: 500,
      marginBottom: 20,
    },
    paper: { padding: 30 },
    clear: { clear: 'both' },

    // listPageStyle
    listPage: {
      fab: {
        position: 'fixed',
        right: 20,
        bottom: 20,
        backgroundColor: pink500,
      },
      fabSearch: {
        position: 'fixed',
        right: 100,
        bottom: 20,
        backgroundColor: 'lightblue',
      },
      searchButton: { marginRight: 20 },
      drawer: { backgroundColor: 'lightgrey' },
      searchDrawer: { overflow: 'hidden', width: 280 },
      searchGrid: { width: 250 },
      searchField: { margin: 10 },
    },

    // formPageStyles
    formPage: {
      buttons: { marginTop: 30, float: 'right' },
      saveButton: { marginLeft: 5 },
      card: { width: 120, maxWidth: 300, marginTop: 40, marginBottom: 5 },
      container: { marginTop: '2em' },
      cell: { padding: '1em' },
      productList: { color: 'navy', paddingTop: 20, fontWeight: 'bold' },
      textField: {
        marginLeft: 4,
        marginRight: 4,
        width: '100%',
      },
    },
  },
});

export default themeDefault;
