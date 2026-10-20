import { Components, Theme } from '@mui/material/styles';

export const components: Components<Theme> = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        fontFamily: "'Open Sans', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
        fontSize: '15px',
        lineHeight: 1.6,
        fontWeight: 400,
        backgroundColor: '#FFFFFF',
        color: '#222222',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale'
      }
    }
  },
  MuiDivider: {
    styleOverrides: {
      root: {
        borderColor: '#E6E6E6'
      }
    }
  },
  MuiButton: {
    defaultProps: {
      disableElevation: true
    },
    styleOverrides: {
      root: {
        fontFamily: "'Open Sans', sans-serif",
        transition: 'all 0.15s ease-in-out'
      },
      containedPrimary: {
        backgroundColor: '#0d3b66',
        color: '#FFFFFF',
        borderRadius: '4px',
        fontWeight: 600,
        textTransform: 'none',
        '&:hover': {
          backgroundColor: '#0f2a4a'
        }
      },
      outlined: {
        fontFamily: "'Open Sans', sans-serif",
        fontSize: '12px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        border: '1px solid #0d3b66',
        borderRadius: '4px',
        color: '#0d3b66',
        padding: '5px 14px',
        '&:hover': {
          border: '1px solid #0d3b66',
          backgroundColor: 'rgba(13, 59, 102, 0.06)',
          color: '#0d3b66'
        }
      },
      outlinedPrimary: {
        fontFamily: "'Open Sans', sans-serif",
        fontSize: '12px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        borderColor: '#0d3b66',
        borderWidth: 1,
        borderRadius: '4px',
        color: '#0d3b66',
        padding: '5px 14px',
        '&:hover': {
          borderColor: '#0d3b66',
          backgroundColor: 'rgba(13, 59, 102, 0.06)',
          color: '#0d3b66'
        }
      },
      text: {
        fontFamily: "'Open Sans', sans-serif",
        color: '#6B6B6B',
        '&:hover': {
          color: '#222222',
          backgroundColor: '#F7F7F7'
        }
      }
    }
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 6,
        border: '1px solid #E6E6E6',
        boxShadow: 'none',
        backgroundColor: '#FFFFFF'
      }
    }
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 6,
        border: '1px solid #E6E6E6',
        boxShadow: 'none',
        backgroundColor: '#FFFFFF'
      }
    }
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        fontWeight: 500,
        fontSize: '0.8125rem',
        backgroundColor: '#F7F7F7',
        color: '#242424',
        border: '1px solid #E6E6E6',
        '&:hover': {
          backgroundColor: '#EAEAEA'
        }
      }
    }
  },
  MuiTextField: {
    defaultProps: {
      variant: 'outlined',
      size: 'small'
    }
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#E6E6E6'
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: '#CCCCCC'
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: '#2563EB',
          borderWidth: '1.5px'
        }
      }
    }
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundColor: '#FFFFFF',
        color: '#242424',
        borderBottom: '1px solid #E6E6E6',
        boxShadow: 'none'
      }
    }
  },
  MuiTabs: {
    styleOverrides: {
      root: {
        borderBottom: '1px solid #E6E6E6',
        minHeight: 44
      },
      indicator: {
        backgroundColor: '#242424',
        height: 1.5
      }
    }
  },
  MuiTab: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontWeight: 500,
        fontSize: '0.9375rem',
        color: '#6B6B6B',
        minHeight: 44,
        padding: '8px 16px',
        '&.Mui-selected': {
          color: '#242424',
          fontWeight: 600
        },
        '&:hover': {
          color: '#242424'
        }
      }
    }
  },
  MuiTableHead: {
    styleOverrides: {
      root: {
        backgroundColor: '#F7F7F7',
        '& .MuiTableCell-head': {
          color: '#242424',
          fontWeight: 600,
          borderBottom: '1px solid #E6E6E6'
        }
      }
    }
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        borderColor: '#E6E6E6'
      }
    }
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: 8,
        border: '1px solid #E6E6E6',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)'
      }
    }
  },
  MuiPaginationItem: {
    styleOverrides: {
      root: {
        borderRadius: 20,
        borderColor: '#E6E6E6',
        '&.Mui-selected': {
          backgroundColor: '#2563EB',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#1D4ED8'
          }
        }
      }
    }
  }
};
