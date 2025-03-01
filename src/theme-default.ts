import { grey } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

// const pantone2022 = {
//   primaryLight: '#8383bb',
//   primaryMain: '#6868ab',
//   primaryDark: '#464677',
//   secondaryLight: '#f5ebff',
//   secondaryMain: '#e0c2ff',
//   secondaryDark: '#9c87b2',
//   contrastText: '#47008F',
// };

declare module '@mui/material/styles' {
  interface Theme {
    customStyles: {
      // navigation: object;
      // title: object;
      // paper: object;
      // clear: object;
      listPage: {
        fabAdd: (theme: Theme) => React.CSSProperties;
        fabSearch: (theme: Theme) => React.CSSProperties;
        fabIcon: object;
        drawerBox: object;
        drawerTitle: object;
        drawerButtonContainer: object;
        buttonSearch: (theme: Theme) => React.CSSProperties;
        buttonSetSearch: (theme: Theme) => React.CSSProperties;
        buttonBack: (theme: Theme) => React.CSSProperties;
      };
      formPage: {
        paper: object;
        formWrapper: object;
        inputWrapper: object;
        subtitle: (theme: Theme) => React.CSSProperties; // OrderFormPage
        fieldset: object; // OrderFormPage
        secondPaper: object; // OrderFormPage
        dialogTitle: object; // OrderFormPage
        dialogContent: object; // OrderFormPage
        dialogControl: object; // OrderFormPage
        dialogActions: object; // OrderFormPage
        card: object; // CustomerFormPage
        image: object; // CustomerFormPage
        buttonContainer: object;
        buttonBack: (theme: Theme) => React.CSSProperties;
        buttonSave: (theme: Theme) => React.CSSProperties;
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
      light: '#8383bb',
      main: '#6868ab',
      dark: '#464677',
    },
    secondary: {
      main: grey[800],
      dark: grey[900],
    },
  },
  components: {
    // MuiAppBar: {
    //   styleOverrides: {
    //     root: {
    //       height: 57,
    //       backgroundColor: blue600,
    //     },
    //   },
    // },
    // MuiDrawer: {
    //   styleOverrides: {
    //     root: {
    //       width: 230,
    //       backgroundColor: lightgrey,
    //     },
    //   },
    // },
    // MuiButton: {
    //   styleOverrides: {
    //     root: {
    //       color: blue600,
    //     },
    //   },
    // },
    MuiSnackbar: {
      defaultProps: {
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
      },
    },
    MuiDrawer: {
      defaultProps: {
        ModalProps: {
          sx: { backgroundColor: 'transparent' },
        },
      },
    },
  },
  customStyles: {
    // navigation: {
    //   fontSize: 15,
    //   fontWeight: 500,
    //   color: grey600,
    //   paddingBottom: 15,
    //   display: 'block',
    // },
    // title: {
    //   fontSize: 24,
    //   fontWeight: 500,
    //   marginBottom: 20,
    // },
    // paper: { padding: 30 },
    // clear: { clear: 'both' },

    // listPageStyle
    listPage: {
      fabAdd: (theme) => ({
        position: 'fixed',
        right: 80,
        bottom: 16,
        zIndex: 1200,
        backgroundColor: theme.palette.primary.main,
        '&:hover': {
          backgroundColor: theme.palette.primary.dark,
        },
      }),
      fabSearch: (theme) => ({
        position: 'fixed',
        right: 16,
        bottom: 16,
        zIndex: 1200,
        backgroundColor: theme.palette.secondary.main,
        '&:hover': {
          backgroundColor: theme.palette.secondary.dark,
        },
      }),
      fabIcon: { color: 'white' },
      drawerBox: {
        width: 300,
        p: 2,
      },
      drawerTitle: { mb: 2 },
      drawerButtonContainer: {
        width: '100%',
        mt: 2,
        flexDirection: 'column',
        alignItems: 'center',
        flexGrow: 1,
      },
      buttonSearch: (theme) => ({
        minWidth: 120,
        width: '100%',
        color: 'white',
        backgroundColor: theme.palette.primary.main,
        '&:hover': {
          backgroundColor: theme.palette.primary.dark,
        },
      }),
      buttonSetSearch: (theme) => ({
        width: '100%',
        whiteSpace: 'nowrap',
        color: 'white',
        backgroundColor: theme.palette.success.main,
        '&:hover': {
          backgroundColor: theme.palette.success.dark,
        },
      }),
      buttonBack: (theme) => ({
        minWidth: 120,
        width: '100%',
        color: 'white',
        backgroundColor: theme.palette.secondary.main,
        '&:hover': {
          backgroundColor: theme.palette.secondary.dark,
        },
      }),
    },

    // formPageStyles
    formPage: {
      paper: {
        maxWidth: 800,
        mx: 'auto',
        p: 4,
        mt: 4,
      },
      formWrapper: { mt: 2 },
      inputWrapper: { md: 6 },
      subtitle: (theme) => ({ marginTop: 2, color: theme.palette.primary.main }),
      fieldset: { marginBottom: 3 },
      secondPaper: { padding: 2 },
      dialogTitle: { textAlign: 'center' },
      dialogContent: { display: 'flex', flexDirection: 'column', gap: 2 },
      dialogControl: { marginTop: 2 },
      dialogActions: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
      },
      card: {
        width: 120,
        maxWidth: 300,
        mt: 4,
        mb: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
      image: { objectFit: 'cover' },
      buttonContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        mt: 3,
      },
      buttonBack: (theme) => ({
        gap: 1,
        color: 'white',
        backgroundColor: theme.palette.secondary.main,
        '&:hover': {
          backgroundColor: theme.palette.secondary.dark,
        },
      }),
      buttonSave: (theme) => ({
        gap: 2,
        color: 'white',
        backgroundColor: theme.palette.primary.main,
        '&:hover': {
          backgroundColor: theme.palette.primary.dark,
        },
      }),
    },
  },
});

export default themeDefault;
