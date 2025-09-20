import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Grid, FormControl, InputLabel, Select, MenuItem,
  TextField, Button, Box, Chip, Alert, Dialog, DialogTitle, DialogContent,
  DialogActions, List, ListItem, ListItemText, Divider, Paper
} from '@mui/material';
import { Add, Delete, ShoppingCart, Receipt, Save } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { restaurantesAPI, usuariosAPI, pedidosAPI, formatCurrency } from '../services/api';

function EditarPedido() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurantes, setRestaurantes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [selectedRestaurante, setSelectedRestaurante] = useState('');
  const [menu, setMenu] = useState([]);
  const [responsable, setResponsable] = useState('');
  const [valorDomicilio, setValorDomicilio] = useState('');
  const [carrito, setCarrito] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState({});
  const [quantities, setQuantities] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showResumen, setShowResumen] = useState(false);
  const [resumenPedido, setResumenPedido] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [restaurantesRes, usuariosRes, pedidoRes] = await Promise.all([
        restaurantesAPI.getAll(),
        usuariosAPI.getAll(),
        pedidosAPI.getById(id)
      ]);
      setRestaurantes(restaurantesRes.data);
      setUsuarios(usuariosRes.data);

      // Pre-fill form with existing pedido data
      const pedido = pedidoRes.data;
      setSelectedRestaurante(pedido.restaurante_id);
      setResponsable(pedido.usuario_responsable_id);
      setValorDomicilio(pedido.valor_domicilio.toString());

      // Load menu for the restaurant
      const menuRes = await restaurantesAPI.getMenu(pedido.restaurante_id);
      setMenu(menuRes.data);

      // Convert pedido items to carrito format
      const carritoItems = pedido.items.map(item => ({
        id: item.id,
        menu_item_id: item.menu_item_id,
        usuario_id: item.usuario_id,
        usuario_nombre: usuariosRes.data.find(u => u.id === item.usuario_id)?.nombre || '',
        item_nombre: item.item_nombre,
        precio_unitario: item.precio_unitario,
        cantidad: item.cantidad,
        subtotal: item.subtotal
      }));
      setCarrito(carritoItems);

    } catch (err) {
      setError('Error cargando datos del pedido');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleRestauranteChange = async (restauranteId) => {
    setSelectedRestaurante(restauranteId);
    setCarrito([]);
    try {
      const menuRes = await restaurantesAPI.getMenu(restauranteId);
      setMenu(menuRes.data);
    } catch (err) {
      setError('Error cargando menú');
    }
  };

  const agregarAlCarrito = (menuItem, usuario, cantidad = 1) => {
    const existingIndex = carrito.findIndex(ci => ci.menu_item_id === menuItem.id && ci.usuario_id === usuario.id);
    if (existingIndex !== -1) {
      const existingItem = carrito[existingIndex];
      existingItem.cantidad += cantidad;
      existingItem.subtotal = existingItem.cantidad * existingItem.precio_unitario;
      setCarrito([...carrito]);
    } else {
      const nuevoItem = {
        id: Date.now() + Math.random(),
        menu_item_id: menuItem.id,
        usuario_id: usuario.id,
        usuario_nombre: usuario.nombre,
        item_nombre: menuItem.nombre,
        precio_unitario: menuItem.precio,
        cantidad,
        subtotal: menuItem.precio * cantidad
      };
      setCarrito([...carrito, nuevoItem]);
    }
  };

  const eliminarDelCarrito = (itemId) => {
    setCarrito(carrito.filter(item => item.id !== itemId));
  };

  const actualizarPedido = async () => {
    if (!selectedRestaurante || !responsable || !valorDomicilio || carrito.length === 0) {
      setError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      const pedidoData = {
        restaurante_id: selectedRestaurante,
        usuario_responsable_id: responsable,
        valor_domicilio: parseInt(valorDomicilio),
        items: carrito.map(item => ({
          usuario_id: item.usuario_id,
          menu_item_id: item.menu_item_id,
          cantidad: item.cantidad,
          subtotal: item.subtotal
        }))
      };

      const response = await pedidosAPI.update(id, pedidoData);
      setResumenPedido(response.data);
      setShowResumen(true);
      setSuccess('Pedido actualizado exitosamente');
    } catch (err) {
      setError('Error actualizando pedido');
    }
    setLoading(false);
  };

  const totalCarrito = carrito.reduce((sum, item) => sum + item.subtotal, 0);

  if (initialLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Typography>Cargando pedido...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Editar Pedido #{id}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Configuración del Pedido
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Restaurante</InputLabel>
                    <Select
                      value={selectedRestaurante}
                      onChange={(e) => handleRestauranteChange(e.target.value)}
                      label="Restaurante"
                    >
                      {restaurantes.map(rest => (
                        <MenuItem key={rest.id} value={rest.id}>{rest.nombre}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Responsable del Pedido</InputLabel>
                    <Select
                      value={responsable}
                      onChange={(e) => setResponsable(e.target.value)}
                      label="Responsable del Pedido"
                    >
                      {usuarios.map(user => (
                        <MenuItem key={user.id} value={user.id}>{user.nombre}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Valor del Domicilio (COP)"
                    type="number"
                    value={valorDomicilio}
                    onChange={(e) => setValorDomicilio(e.target.value)}
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {menu.length > 0 && (
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Menú - {restaurantes.find(r => r.id == selectedRestaurante)?.nombre}
                </Typography>

                <TextField
                  fullWidth
                  label="Buscar items del menú"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{ mb: 2 }}
                />

                <Grid container spacing={2}>
                  {menu
                    .filter(item => item.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(item => (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                      <Paper elevation={1} sx={{ p: 2 }}>
                        <Typography variant="subtitle1" fontWeight={500}>
                          {item.nombre}
                        </Typography>
                        <Typography variant="h6" color="primary" gutterBottom>
                          {formatCurrency(item.precio)}
                        </Typography>

                        <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                          <InputLabel>Usuario</InputLabel>
                          <Select
                            value={selectedUsers[item.id] || ''}
                            label="Usuario"
                            onChange={(e) => setSelectedUsers(prev => ({ ...prev, [item.id]: e.target.value }))}
                          >
                            {usuarios.map(user => (
                              <MenuItem key={user.id} value={user.id}>{user.nombre}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                        <TextField
                          fullWidth
                          size="small"
                          label="Cantidad"
                          type="number"
                          value={quantities[item.id] || 1}
                          onChange={(e) => setQuantities(prev => ({ ...prev, [item.id]: parseInt(e.target.value) || 1 }))}
                          inputProps={{ min: 1 }}
                          sx={{ mb: 1 }}
                        />

                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<Add />}
                          onClick={() => {
                            const selectedUserId = selectedUsers[item.id];
                            if (selectedUserId) {
                              const usuario = usuarios.find(u => u.id == selectedUserId);
                              if (usuario) agregarAlCarrito(item, usuario, quantities[item.id] || 1);
                            }
                          }}
                        >
                          Agregar
                        </Button>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 20 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <ShoppingCart sx={{ mr: 1 }} />
                Carrito ({carrito.length} items)
              </Typography>

              {carrito.length === 0 ? (
                <Typography color="textSecondary">
                  Agrega items al carrito
                </Typography>
              ) : (
                <>
                  <List dense>
                    {carrito.map(item => (
                      <ListItem
                        key={item.id}
                        secondaryAction={
                          <Button
                            size="small"
                            onClick={() => eliminarDelCarrito(item.id)}
                          >
                            <Delete />
                          </Button>
                        }
                      >
                        <ListItemText
                          primary={`${item.item_nombre} x${item.cantidad}`}
                          secondary={`${item.usuario_nombre} - ${formatCurrency(item.subtotal)}`}
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="h6">
                    Subtotal: {formatCurrency(totalCarrito)}
                  </Typography>
                  {valorDomicilio && (
                    <Typography variant="body2" color="textSecondary">
                      + Domicilio: {formatCurrency(parseInt(valorDomicilio))}
                    </Typography>
                  )}

                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Save />}
                    onClick={actualizarPedido}
                    disabled={loading}
                    sx={{ mt: 2 }}
                  >
                    Actualizar Pedido
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={showResumen} onClose={() => setShowResumen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Receipt sx={{ mr: 1 }} />
          Pedido Actualizado
        </DialogTitle>
        <DialogContent>
          {resumenPedido && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {resumenPedido.restaurante_nombre}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Responsable: {resumenPedido.responsable_nombre}
              </Typography>

              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                Detalle por Usuario:
              </Typography>

              {resumenPedido.costos_por_usuario?.map(usuario => (
                <Paper key={usuario.usuario_id} elevation={1} sx={{ p: 2, mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight={500}>
                    {usuario.usuario_nombre}
                  </Typography>

                  {usuario.items.map(item => (
                    <Typography key={item.id} variant="body2" sx={{ ml: 2 }}>
                      • {item.item_nombre} x{item.cantidad} - {formatCurrency(item.subtotal)}
                    </Typography>
                  ))}

                  <Box sx={{ mt: 1, ml: 2 }}>
                    <Typography variant="body2">
                      Subtotal: {formatCurrency(usuario.subtotal)}
                    </Typography>
                    <Typography variant="body2">
                      Domicilio: {formatCurrency(usuario.costo_domicilio)}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={500} color="primary">
                      Total a pagar: {formatCurrency(usuario.total)}
                    </Typography>
                  </Box>
                </Paper>
              ))}

              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">
                Total del pedido: {formatCurrency(resumenPedido.total_pedido + resumenPedido.valor_domicilio)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowResumen(false)}>Cerrar</Button>
          <Button onClick={() => navigate(`/pedido/${id}`)}>Ver Detalle</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default EditarPedido;