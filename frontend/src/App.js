import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppBar, Toolbar, Typography, Container } from '@mui/material';
import NuevoPedido from './pages/NuevoPedido';
import Historial from './pages/Historial';
import Metricas from './pages/Metricas';
import DetallePedido from './pages/DetallePedido';
import EditarPedido from './pages/EditarPedido';
import Configuracion from './pages/Configuracion';
import Navigation from './components/Navigation';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setDarkMode(JSON.parse(savedMode));
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
      background: {
        default: darkMode ? '#121212' : '#f8fafc',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 500,
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: darkMode
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
              : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            borderRadius: 12,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 500,
          },
          contained: {
            color: 'white',
            '&:hover': {
              color: 'white',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? '#1e1e1e' : 'white',
            color: darkMode ? 'white' : '#1976d2',
            borderBottom: `1px solid ${darkMode ? '#333' : '#e5e7eb'}`,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            color: darkMode ? 'white' : 'inherit',
            borderBottom: `1px solid ${darkMode ? '#333' : '#e5e7eb'}`,
          },
          head: {
            backgroundColor: darkMode ? '#2a2a2a' : '#f8fafc',
            color: darkMode ? 'white' : 'inherit',
            fontWeight: 600,
          },
        },
      },
      MuiTableContainer: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? '#1e1e1e' : 'white',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? '#1e1e1e' : 'white',
            color: darkMode ? 'white' : 'inherit',
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <AppBar position="static" elevation={0}>
            <Toolbar>
              <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
                🍽️ Pedidos HPowerCo
              </Typography>
              <Navigation />
            </Toolbar>
          </AppBar>
          
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Routes>
              <Route path="/" element={<NuevoPedido />} />
              <Route path="/nuevo-pedido" element={<NuevoPedido />} />
              <Route path="/historial" element={<Historial />} />
              <Route path="/metricas" element={<Metricas />} />
              <Route path="/pedido/:id" element={<DetallePedido />} />
              <Route path="/editar-pedido/:id" element={<EditarPedido />} />
              <Route path="/configuracion" element={<Configuracion darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
            </Routes>
          </Container>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;