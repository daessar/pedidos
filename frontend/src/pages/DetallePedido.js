import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Grid, Chip, Button, Box,
  Paper, Alert, Divider, List, ListItem, ListItemText, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import { ArrowBack, Receipt, Restaurant, Person, LocalShipping, Edit } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { pedidosAPI, formatCurrency } from '../services/api';

function DetallePedido() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPedido();
  }, [id]);

  const loadPedido = async () => {
    try {
      const response = await pedidosAPI.getById(id);
      setPedido(response.data);
    } catch (err) {
      setError('Error cargando detalle del pedido');
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

  const getResumenItems = () => {
    if (!pedido || !pedido.items) return [];

    const resumen = {};
    pedido.items.forEach(item => {
      if (resumen[item.item_nombre]) {
        resumen[item.item_nombre] += item.cantidad;
      } else {
        resumen[item.item_nombre] = item.cantidad;
      }
    });

    return Object.entries(resumen).map(([nombre, cantidad]) => ({
      nombre,
      cantidad
    }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Typography>Cargando detalle del pedido...</Typography>
      </Box>
    );
  }

  if (error || !pedido) {
    return (
      <Box>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/historial')}
          sx={{ mb: 2 }}
        >
          Volver al Historial
        </Button>
        <Alert severity="error">
          {error || 'Pedido no encontrado'}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" gap={2} sx={{ mb: 2 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/historial')}
        >
          Volver al Historial
        </Button>
        <Button
          startIcon={<Edit />}
          variant="outlined"
          onClick={() => navigate(`/editar-pedido/${id}`)}
        >
          Editar Pedido
        </Button>
      </Box>

      <Typography variant="h4" gutterBottom>
        <Receipt sx={{ mr: 1 }} />
        Detalle del Pedido #{pedido.id}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Información General
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Restaurant sx={{ mr: 1, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        Restaurante
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {pedido.restaurante_nombre}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Person sx={{ mr: 1, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        Responsable
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {pedido.responsable_nombre}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <LocalShipping sx={{ mr: 1, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        Valor Domicilio
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {formatCurrency(pedido.valor_domicilio)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        Estado
                      </Typography>
                      <br />
                      <Chip
                        label={pedido.estado}
                        color={getEstadoColor(pedido.estado)}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              
              <Box mt={2}>
                <Typography variant="caption" color="textSecondary">
                  Fecha del Pedido
                </Typography>
                <Typography variant="body1">
                  {formatDate(pedido.fecha_pedido)}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Detalle por Usuario
              </Typography>
              
              {pedido.costos_por_usuario?.map((usuario, index) => (
                <Paper key={usuario.usuario_id} elevation={1} sx={{ p: 2, mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight={500} color="primary" gutterBottom>
                    {usuario.usuario_nombre}
                  </Typography>
                  
                  <List dense sx={{ mb: 2 }}>
                    {usuario.items.map(item => (
                      <ListItem key={item.id} sx={{ px: 0 }}>
                        <ListItemText
                          primary={
                            <Box display="flex" justifyContent="space-between">
                              <Typography variant="body2">
                                {item.item_nombre} x{item.cantidad}
                              </Typography>
                              <Typography variant="body2" fontWeight={500}>
                                {formatCurrency(item.subtotal)}
                              </Typography>
                            </Box>
                          }
                          secondary={`Precio unitario: ${formatCurrency(item.precio_unitario)}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        Subtotal: {formatCurrency(usuario.subtotal)}
                      </Typography>
                      <Typography variant="body2">
                        Domicilio: {formatCurrency(usuario.costo_domicilio)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle1" fontWeight={600} color="primary" align="right">
                        Total a pagar: {formatCurrency(usuario.total)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={{ position: 'sticky', top: 20 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resumen del Pedido
              </Typography>
              
              <Box mb={2}>
                <Typography variant="body2" color="textSecondary">
                  Subtotal Comida
                </Typography>
                <Typography variant="h6">
                  {formatCurrency(pedido.total_pedido)}
                </Typography>
              </Box>
              
              <Box mb={2}>
                <Typography variant="body2" color="textSecondary">
                  Costo Domicilio
                </Typography>
                <Typography variant="h6">
                  {formatCurrency(pedido.valor_domicilio)}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Total General
                </Typography>
                <Typography variant="h5" color="primary" fontWeight={600}>
                  {formatCurrency(pedido.total_pedido + pedido.valor_domicilio)}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Participantes
              </Typography>
              <Typography variant="body1">
                {pedido.costos_por_usuario?.length || 0} personas
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" color="textSecondary" gutterBottom>
                Resumen de Items Pedidos
              </Typography>
              <TableContainer component={Paper} sx={{ mt: 1 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell align="right">Cantidad</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getResumenItems().map((item) => (
                      <TableRow key={item.nombre}>
                        <TableCell>{item.nombre}</TableCell>
                        <TableCell align="right">{item.cantidad}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DetallePedido;