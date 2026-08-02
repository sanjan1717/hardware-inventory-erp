import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",

    primary: {
      main: "#4F46E5",
    },

    secondary: {
      main: "#06B6D4",
    },

    background: {
      default: "#0F172A",
      paper: "#1E293B",
    },

    success: {
      main: "#22C55E",
    },

    warning: {
      main: "#F59E0B",
    },

    error: {
      main: "#EF4444",
    },
  },

  shape: {
    borderRadius: 16,
  },

  typography: {
    fontFamily: "Inter, Roboto, sans-serif",

    h4: {
      fontWeight: 700,
    },

    h5: {
      fontWeight: 700,
    },

    h6: {
      fontWeight: 600,
    },

    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },

  components: {

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          border: "1px solid rgba(255,255,255,0.06)",
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          height: 46,
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
        },
      },
    },
  },
});

export default theme;