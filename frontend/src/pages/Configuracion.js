import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Grid, Button, Box, Tab, Tabs,
  TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemText, ListItemSecondaryAction, IconButton,
  Alert, FormControlLabel, Switch, Accordion, AccordionSummary, 
  AccordionDetails, Divider
} from '@mui/material';
import { 
  Add, Edit, Delete, Person, Restaurant, Palette,
  LightMode, DarkMode, ExpandMore, MenuBook
} from '@mui/icons-material';
import { usuariosAPI, restaurantesAPI } from '../services/api';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function Configuracion({ darkMode, toggleDarkMode }) {
  const [tabValue, setTabValue] = useState(0);
  const [usuarios, setUsuarios] = useState([]);
  const [restaurantes, setRestaurantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Estados para diálogos
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [openRestaurantDialog, setOpenRestaurantDialog] = useState(false);
  const [openMenuDialog, setOpenMenuDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [selectedRestaurantForMenu, setSelectedRestaurantForMenu] = useState(null);

  // Estados para formularios
  const [userForm, setUserForm] = useState({ nombre: '' });
  const [restaurantForm, setRestaurantForm] = useState({ nombre: '', telefono: '', direccion: '' });
  const [menuForm, setMenuForm] = useState({ nombre: '', precio: '' });

  // Estados para menús
  const [restaurantMenus, setRestaurantMenus] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usuariosRes, restaurantesRes] = await Promise.all([
        usuariosAPI.getAll(),
        restaurantesAPI.getAll()
      ]);
      setUsuarios(usuariosRes.data);
      setRestaurantes(restaurantesRes.data);
    } catch (err) {
      setError('Error cargando datos');
    }
    setLoading(false);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Funciones para usuarios
  const openUserForm = (user = null) => {
    setEditingUser(user);
    setUserForm(user ? { nombre: user.nombre } : { nombre: '' });
    setOpenUserDialog(true);
  };

  const closeUserDialog = () => {
    setOpenUserDialog(false);
    setEditingUser(null);
    setUserForm({ nombre: '' });
  };

  const saveUser = async () => {
    if (!userForm.nombre.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    try {
      if (editingUser) {
        await usuariosAPI.update(editingUser.id, userForm);
        setSuccess('Usuario actualizado exitosamente');
      } else {
        await usuariosAPI.create(userForm);
        setSuccess('Usuario creado exitosamente');
      }
      closeUserDialog();
      loadData();
    } catch (err) {
      console.error('Error saving user:', err);
      setError(`Error al guardar usuario: ${err.response?.data?.error || err.message}`);
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        await usuariosAPI.delete(userId);
        setSuccess('Usuario eliminado exitosamente');
        loadData();
      } catch (err) {
        setError('Error al eliminar usuario');
      }
    }
  };

  // Funciones para restaurantes
  const openRestaurantForm = (restaurant = null) => {
    setEditingRestaurant(restaurant);
    setRestaurantForm(restaurant ? 
      { nombre: restaurant.nombre, telefono: restaurant.telefono, direccion: restaurant.direccion } 
      : { nombre: '', telefono: '', direccion: '' }
    );
    setOpenRestaurantDialog(true);
  };

  const closeRestaurantDialog = () => {
    setOpenRestaurantDialog(false);
    setEditingRestaurant(null);
    setRestaurantForm({ nombre: '', telefono: '', direccion: '' });
  };

  const saveRestaurant = async () => {
    try {
      if (editingRestaurant) {
        await restaurantesAPI.update(editingRestaurant.id, restaurantForm);
        setSuccess('Restaurante actualizado exitosamente');
      } else {
        await restaurantesAPI.create(restaurantForm);
        setSuccess('Restaurante creado exitosamente');
      }
      closeRestaurantDialog();
      loadData();
    } catch (err) {
      setError('Error al guardar restaurante');
    }
  };

  const deleteRestaurant = async (restaurantId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este restaurante?')) {
      try {
        await restaurantesAPI.delete(restaurantId);
        setSuccess('Restaurante eliminado exitosamente');
        loadData();
      } catch (err) {
        setError('Error al eliminar restaurante');
      }
    }
  };

  // Funciones para menús
  const loadRestaurantMenu = async (restaurantId) => {
    if (restaurantMenus[restaurantId]) return; // Ya está cargado
    
    try {
      const menuRes = await restaurantesAPI.getMenu(restaurantId);
      setRestaurantMenus(prev => ({
        ...prev,
        [restaurantId]: menuRes.data
      }));
    } catch (err) {
      setError('Error cargando menú');
    }
  };

  const openMenuForm = (restaurant, menuItem = null) => {
    setSelectedRestaurantForMenu(restaurant);
    setEditingMenuItem(menuItem);
    setMenuForm(menuItem ? 
      { nombre: menuItem.nombre, precio: menuItem.precio.toString() } 
      : { nombre: '', precio: '' }
    );
    setOpenMenuDialog(true);
  };

  const closeMenuDialog = () => {
    setOpenMenuDialog(false);
    setSelectedRestaurantForMenu(null);
    setEditingMenuItem(null);
    setMenuForm({ nombre: '', precio: '' });
  };

  const saveMenuItem = async () => {
    try {
      const menuItemData = {
        nombre: menuForm.nombre,
        precio: parseInt(menuForm.precio),
        restaurante_id: selectedRestaurantForMenu.id
      };

      if (editingMenuItem) {
        await restaurantesAPI.updateMenuItem(editingMenuItem.id, menuItemData);
        setSuccess('Item actualizado exitosamente');
      } else {
        await restaurantesAPI.createMenuItem(menuItemData);
        setSuccess('Item creado exitosamente');
      }
      closeMenuDialog();
      // Recargar el menú del restaurante
      delete restaurantMenus[selectedRestaurantForMenu.id];
      loadRestaurantMenu(selectedRestaurantForMenu.id);
    } catch (err) {
      setError('Error al guardar item del menú');
    }
  };

  const deleteMenuItem = async (restaurantId, menuItemId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este item?')) {
      try {
        await restaurantesAPI.deleteMenuItem(menuItemId);
        setSuccess('Item eliminado exitosamente');
        // Recargar el menú del restaurante
        delete restaurantMenus[restaurantId];
        loadRestaurantMenu(restaurantId);
      } catch (err) {
        setError('Error al eliminar item del menú');
      }
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Configuración
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

      <Card>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab icon={<Person />} label="Usuarios" />
          <Tab icon={<Restaurant />} label="Restaurantes" />
          <Tab icon={<Palette />} label="Tema" />
        </Tabs>

        {/* Panel de Usuarios */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Gestión de Usuarios</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => openUserForm()}
            >
              Agregar Usuario
            </Button>
          </Box>

          <List>
            {usuarios.map((user) => (
              <ListItem key={user.id} divider>
                <ListItemText
                  primary={user.nombre}
                />
                <ListItemSecondaryAction>
                  <IconButton onClick={() => openUserForm(user)} sx={{ mr: 1 }}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => deleteUser(user.id)}>
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </TabPanel>

        {/* Panel de Restaurantes */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Gestión de Restaurantes</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => openRestaurantForm()}
            >
              Agregar Restaurante
            </Button>
          </Box>

          {restaurantes.map((restaurant) => (
            <Accordion key={restaurant.id} sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMore />} onClick={() => loadRestaurantMenu(restaurant.id)}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">{restaurant.nombre}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {restaurant.telefono} - {restaurant.direccion}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton 
                      onClick={(e) => { e.stopPropagation(); openRestaurantForm(restaurant); }}
                      size="small"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton 
                      onClick={(e) => { e.stopPropagation(); deleteRestaurant(restaurant.id); }}
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center' }}>
                      <MenuBook sx={{ mr: 1 }} />
                      Menú
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Add />}
                      onClick={() => openMenuForm(restaurant)}
                    >
                      Agregar Item
                    </Button>
                  </Box>
                  
                  {restaurantMenus[restaurant.id]?.length > 0 ? (
                    <List dense>
                      {restaurantMenus[restaurant.id].map((menuItem) => (
                        <ListItem key={menuItem.id} divider>
                          <ListItemText
                            primary={menuItem.nombre}
                            secondary={`$${menuItem.precio.toLocaleString('es-CO')}`}
                          />
                          <ListItemSecondaryAction>
                            <IconButton onClick={() => openMenuForm(restaurant, menuItem)} size="small" sx={{ mr: 1 }}>
                              <Edit />
                            </IconButton>
                            <IconButton onClick={() => deleteMenuItem(restaurant.id, menuItem.id)} size="small">
                              <Delete />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography color="textSecondary" variant="body2">
                      No hay items en el menú. Haz clic en "Agregar Item" para comenzar.
                    </Typography>
                  )}
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </TabPanel>

        {/* Panel de Tema */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>Configuración de Tema</Typography>
          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={toggleDarkMode}
                icon={<LightMode />}
                checkedIcon={<DarkMode />}
              />
            }
            label={darkMode ? 'Modo Oscuro' : 'Modo Claro'}
          />
        </TabPanel>
      </Card>

      {/* Dialog para Usuario */}
      <Dialog open={openUserDialog} onClose={closeUserDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingUser ? 'Editar Usuario' : 'Agregar Usuario'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre"
            fullWidth
            variant="outlined"
            value={userForm.nombre}
            onChange={(e) => setUserForm({ ...userForm, nombre: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeUserDialog}>Cancelar</Button>
          <Button onClick={saveUser} variant="contained">
            {editingUser ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para Restaurante */}
      <Dialog open={openRestaurantDialog} onClose={closeRestaurantDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingRestaurant ? 'Editar Restaurante' : 'Agregar Restaurante'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre"
            fullWidth
            variant="outlined"
            value={restaurantForm.nombre}
            onChange={(e) => setRestaurantForm({ ...restaurantForm, nombre: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Teléfono"
            fullWidth
            variant="outlined"
            value={restaurantForm.telefono}
            onChange={(e) => setRestaurantForm({ ...restaurantForm, telefono: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Dirección"
            fullWidth
            variant="outlined"
            value={restaurantForm.direccion}
            onChange={(e) => setRestaurantForm({ ...restaurantForm, direccion: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeRestaurantDialog}>Cancelar</Button>
          <Button onClick={saveRestaurant} variant="contained">
            {editingRestaurant ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para Item de Menú */}
      <Dialog open={openMenuDialog} onClose={closeMenuDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingMenuItem ? 'Editar Item del Menú' : 'Agregar Item al Menú'}
          {selectedRestaurantForMenu && (
            <Typography variant="body2" color="textSecondary">
              {selectedRestaurantForMenu.nombre}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre del Item"
            fullWidth
            variant="outlined"
            value={menuForm.nombre}
            onChange={(e) => setMenuForm({ ...menuForm, nombre: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Precio (COP)"
            type="number"
            fullWidth
            variant="outlined"
            value={menuForm.precio}
            onChange={(e) => setMenuForm({ ...menuForm, precio: e.target.value })}
            InputProps={{ inputProps: { min: 0 } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeMenuDialog}>Cancelar</Button>
          <Button onClick={saveMenuItem} variant="contained">
            {editingMenuItem ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Configuracion;