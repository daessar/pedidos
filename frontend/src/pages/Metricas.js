import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Grid, Chip, Button, Box,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Alert
} from '@mui/material';
import { Visibility, Restaurant, BarChart } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { pedidosAPI, formatCurrency } from '../services/api';

function Metricas() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadPedidos();
  }, []);

  const loadPedidos = async () => {
    try {
      const response = await pedidosAPI.getAll();
      setPedidos(response.data);
    } catch (err) {
      setError('Error cargando métricas de pedidos');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'activo': return 'success';
      case 'completado': return 'primary';
      case 'cancelado': return 'error';
      default: return 'default';
    }
  };

  const getTotalPedidos = () => pedidos.length;

  const getTotalIngresos = () => {
    return pedidos.reduce((sum, pedido) => sum + pedido.total_pedido + pedido.valor_domicilio, 0);
  };

  const getPromedioPedido = () => {
    if (pedidos.length === 0) return 0;
    return getTotalIngresos() / pedidos.length;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Typography>Cargando métricas...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        <BarChart sx={{ mr: 1 }} />
        Métricas de Pedidos
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {pedidos.length > 0 && (
        <>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary">
                    Total de Pedidos
                  </Typography>
                  <Typography variant="h4">
                    {getTotalPedidos()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary">
                    Ingresos Totales
                  </Typography>
                  <Typography variant="h4">
                    {formatCurrency(getTotalIngresos())}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary">
                    Promedio por Pedido
                  </Typography>
                  <Typography variant="h4">
                    {formatCurrency(getPromedioPedido())}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pedidos Más Costosos
              </Typography>
              <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e5e7eb' }}>
                <Table>
                  <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                    <TableRow>
                      <TableCell><strong>Fecha</strong></TableCell>
                      <TableCell><strong>Restaurante</strong></TableCell>
                      <TableCell><strong>Responsable</strong></TableCell>
                      <TableCell align="right"><strong>Total</strong></TableCell>
                      <TableCell align="right"><strong>Domicilio</strong></TableCell>
                      <TableCell><strong>Estado</strong></TableCell>
                      <TableCell align="center"><strong>Acciones</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pedidos
                      .sort((a, b) => (b.total_pedido + b.valor_domicilio) - (a.total_pedido + a.valor_domicilio))
                      .map((pedido) => (
                      <TableRow key={pedido.id} hover>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(pedido.fecha_pedido)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Restaurant sx={{ mr: 1, fontSize: 20, color: '#666' }} />
                            <Typography variant="body2" fontWeight={500}>
                              {pedido.restaurante_nombre}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {pedido.responsable_nombre}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={500}>
                            {formatCurrency(pedido.total_pedido)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">
                            {formatCurrency(pedido.valor_domicilio)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={pedido.estado}
                            color={getEstadoColor(pedido.estado)}
                            size="small"
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Visibility />}
                            onClick={() => navigate(`/pedido/${pedido.id}`)}
                          >
                            Ver Detalle
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </>
      )}

      {pedidos.length === 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" textAlign="center" color="textSecondary">
              No hay pedidos registrados para mostrar métricas
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default Metricas;