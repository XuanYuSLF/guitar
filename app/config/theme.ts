import { createTheme } from '@mui/material/styles';

const bluesTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#D0BCFF',
      dark: '#381E72',
      contrastText: '#381E72',
    },
    secondary: {
      main: '#CCC2DC',
      dark: '#332D41',
    },
    background: {
      default: '#141218',
      paper: '#1D1B20',
    },
    text: {
      primary: '#E6E1E5',
      secondary: '#958DA5',
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#2B2930',
        },
      },
    },
  },
});

export default bluesTheme;