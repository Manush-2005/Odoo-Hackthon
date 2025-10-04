import { createTheme } from '@mui/material/styles';

// Odoo-inspired Color Palette
const colors = {
  primary: {
    main: '#714B67',
    light: '#8F6B84',
    dark: '#5A3B52',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#141A29',
    light: '#2A3441',
    dark: '#0A0F1A',
    contrastText: '#FFFFFF',
  },
  success: {
    main: '#28A745',
    light: '#5CBB75',
    dark: '#1E7E34',
  },
  error: {
    main: '#DC3545',
    light: '#E85D6B',
    dark: '#A02834',
  },
  warning: {
    main: '#FFC107',
    light: '#FFD54F',
    dark: '#F57C00',
  },
  info: {
    main: '#17A2B8',
    light: '#58C4DC',
    dark: '#117A8B',
  },
};

// Light Theme Background Colors
const lightBackgrounds = {
  default: '#F3F4F6',
  paper: '#FFFFFF',
  card: '#FFFFFF',
  surface: '#E6E9ED',
  elevated: '#FAFAFA',
};

// Dark Theme Background Colors  
const darkBackgrounds = {
  default: '#111827',
  paper: '#1F2937',
  card: '#1F2937',
  surface: '#374151',
  elevated: '#4B5563',
};

// Typography Configuration
const typography = {
  fontFamily: [
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
  ].join(','),
  h1: {
    fontFamily: 'Caveat, cursive',
    fontWeight: 700,
    fontSize: '2.5rem',
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
  },
  h2: {
    fontFamily: 'Caveat, cursive',
    fontWeight: 700,
    fontSize: '2rem',
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
  },
  h3: {
    fontFamily: 'Caveat, cursive',
    fontWeight: 700,
    fontSize: '1.75rem',
    lineHeight: 1.4,
  },
  h4: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    fontSize: '1.5rem',
    lineHeight: 1.4,
  },
  h5: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    fontSize: '1.25rem',
    lineHeight: 1.4,
  },
  h6: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    fontSize: '1.125rem',
    lineHeight: 1.4,
  },
  body1: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 400,
    fontSize: '1rem',
    lineHeight: 1.6,
  },
  body2: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 400,
    fontSize: '0.875rem',
    lineHeight: 1.6,
  },
  subtitle1: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    fontSize: '1rem',
    lineHeight: 1.5,
  },
  subtitle2: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    fontSize: '0.875rem',
    lineHeight: 1.5,
  },
  button: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    fontSize: '0.875rem',
    textTransform: 'none',
    letterSpacing: '0.02em',
  },
  caption: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 400,
    fontSize: '0.75rem',
    lineHeight: 1.4,
  },
  overline: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
};

// Component Customizations
const components = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        padding: '10px 24px',
        fontWeight: 600,
        textTransform: 'none',
        boxShadow: 'none',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(113, 75, 103, 0.3)',
          transform: 'translateY(-1px)',
        },
      },
      contained: {
        '&:hover': {
          boxShadow: '0 6px 20px rgba(113, 75, 103, 0.4)',
        },
      },
      outlined: {
        borderWidth: 2,
        '&:hover': {
          borderWidth: 2,
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)',
          transform: 'translateY(-2px)',
        },
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 12,
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.primary.main,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.primary.main,
            borderWidth: 2,
          },
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        fontWeight: 500,
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 12,
      },
      elevation1: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      },
      elevation2: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
      },
      elevation3: {
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.16)',
      },
    },
  },
  MuiTableContainer: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        overflow: 'hidden',
      },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontWeight: 600,
        fontSize: '0.875rem',
      },
    },
  },
};

// Create Light Theme
export const createLightTheme = () => createTheme({
  palette: {
    mode: 'light',
    primary: colors.primary,
    secondary: colors.secondary,
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
    info: colors.info,
    background: lightBackgrounds,
    text: {
      primary: '#1F2937',
      secondary: '#6B7280',
      disabled: '#9CA3AF',
    },
    divider: '#E5E7EB',
    action: {
      hover: 'rgba(113, 75, 103, 0.04)',
      selected: 'rgba(113, 75, 103, 0.08)',
    },
  },
  typography,
  components,
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
});

// Create Dark Theme
export const createDarkTheme = () => createTheme({
  palette: {
    mode: 'dark',
    primary: {
      ...colors.primary,
      main: '#8F6B84', // Lighter primary for dark mode
    },
    secondary: colors.secondary,
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
    info: colors.info,
    background: darkBackgrounds,
    text: {
      primary: '#F9FAFB',
      secondary: '#D1D5DB',
      disabled: '#6B7280',
    },
    divider: '#374151',
    action: {
      hover: 'rgba(143, 107, 132, 0.08)',
      selected: 'rgba(143, 107, 132, 0.12)',
    },
  },
  typography,
  components: {
    ...components,
    MuiButton: {
      ...components.MuiButton,
      styleOverrides: {
        ...components.MuiButton.styleOverrides,
        root: {
          ...components.MuiButton.styleOverrides.root,
          '&:hover': {
            boxShadow: '0 4px 12px rgba(143, 107, 132, 0.3)',
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 6px 20px rgba(143, 107, 132, 0.4)',
          },
        },
      },
    },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
});

// Odoo-inspired CSS variables for additional styling
export const odooVariables = {
  '--odoo-primary': colors.primary.main,
  '--odoo-primary-light': colors.primary.light,
  '--odoo-primary-dark': colors.primary.dark,
  '--odoo-secondary': colors.secondary.main,
  '--odoo-surface-light': lightBackgrounds.surface,
  '--odoo-surface-dark': darkBackgrounds.surface,
  '--odoo-border-radius': '12px',
  '--odoo-border-radius-lg': '16px',
  '--odoo-spacing-xs': '4px',
  '--odoo-spacing-sm': '8px',
  '--odoo-spacing-md': '16px',
  '--odoo-spacing-lg': '24px',
  '--odoo-spacing-xl': '32px',
  '--odoo-shadow-sm': '0 2px 8px rgba(0, 0, 0, 0.08)',
  '--odoo-shadow-md': '0 4px 12px rgba(0, 0, 0, 0.12)',
  '--odoo-shadow-lg': '0 8px 25px rgba(0, 0, 0, 0.16)',
  '--odoo-transition': 'all 0.2s ease-in-out',
};