import { Components, Theme } from '@mui/material/styles';

export const components: Components<Theme> = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        backgroundColor: '#FFFFFF',
        color: '#242424',
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
        borderRadius: 20,
        padding: '7px 18px',
        fontWeight: 600,
        textTransform: 'none',
        letterSpacing: '0.01em',
        transition: 'all 0.15s ease-in-out'
      },
      containedPrimary: {
        backgroundColor: '#2563EB',
        color: '#FFFFFF',
        '&:hover': {
          backgroundColor: '#1D4ED8'
        }
      },
      outlinedPrimary: {
        borderColor: '#E6E6E6',
        color: '#242424',
        borderRadius: 20,
        '&:hover': {
          borderColor: '#2563EB',
          backgroundColor: '#EFF6FF',
          color: '#2563EB'
        }
      },
      text: {
        borderRadius: 20,
        color: '#6B6B6B',
        '&:hover': {
          color: '#242424',
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
