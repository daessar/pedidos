import React from 'react';
import { Button, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { Add, History, BarChart, Settings } from '@mui/icons-material';

function Navigation() {
  const location = useLocation();
  
  const getButtonStyle = (path) => ({
    color: location.pathname === path ? 'white' : 'inherit'
  });
  
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Button
        component={Link}
        to="/nuevo-pedido"
        variant={location.pathname === '/nuevo-pedido' || location.pathname === '/' ? 'contained' : 'text'}
        startIcon={<Add />}
        sx={getButtonStyle('/nuevo-pedido')}
      >
        Nuevo Pedido
      </Button>
      <Button
        component={Link}
        to="/historial"
        variant={location.pathname === '/historial' ? 'contained' : 'text'}
        startIcon={<History />}
        sx={getButtonStyle('/historial')}
      >
        Historial
      </Button>
      <Button
        component={Link}
        to="/metricas"
        variant={location.pathname === '/metricas' ? 'contained' : 'text'}
        startIcon={<BarChart />}
        sx={getButtonStyle('/metricas')}
      >
        Métricas
      </Button>
      <Button
        component={Link}
        to="/configuracion"
        variant={location.pathname === '/configuracion' ? 'contained' : 'text'}
        startIcon={<Settings />}
        sx={getButtonStyle('/configuracion')}
      >
        Configuración
      </Button>
    </Box>
  );
}

export default Navigation;