const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://admin:admin123@localhost:5432/pedidos_hpowerco'
});

app.get('/api/restaurantes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM restaurantes ORDER BY nombre');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error obteniendo restaurantes' });
  }
});

app.get('/api/restaurantes/:id/menu', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM menu_items WHERE restaurante_id = $1 ORDER BY precio, nombre',
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error obteniendo menú' });
  }
});

app.post('/api/restaurantes', async (req, res) => {
  try {
    const { nombre, telefono, direccion } = req.body;
    const result = await pool.query(
      'INSERT INTO restaurantes (nombre, telefono, direccion) VALUES ($1, $2, $3) RETURNING *',
      [nombre, telefono, direccion]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creando restaurante' });
  }
});

app.put('/api/restaurantes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, telefono, direccion } = req.body;
    const result = await pool.query(
      'UPDATE restaurantes SET nombre = $1, telefono = $2, direccion = $3 WHERE id = $4 RETURNING *',
      [nombre, telefono, direccion, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Restaurante no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error actualizando restaurante' });
  }
});

app.delete('/api/restaurantes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM restaurantes WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Restaurante no encontrado' });
    }
    res.json({ message: 'Restaurante eliminado exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error eliminando restaurante' });
  }
});

// Endpoints para items del menú
app.post('/api/menu-items', async (req, res) => {
  try {
    const { nombre, precio, restaurante_id } = req.body;
    const result = await pool.query(
      'INSERT INTO menu_items (nombre, precio, restaurante_id) VALUES ($1, $2, $3) RETURNING *',
      [nombre, precio, restaurante_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creando item del menú' });
  }
});

app.put('/api/menu-items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio } = req.body;
    const result = await pool.query(
      'UPDATE menu_items SET nombre = $1, precio = $2 WHERE id = $3 RETURNING *',
      [nombre, precio, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item del menú no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error actualizando item del menú' });
  }
});

app.delete('/api/menu-items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM menu_items WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item del menú no encontrado' });
    }
    res.json({ message: 'Item del menú eliminado exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error eliminando item del menú' });
  }
});

app.get('/api/usuarios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios ORDER BY nombre');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error obteniendo usuarios' });
  }
});

app.post('/api/usuarios', async (req, res) => {
  try {
    console.log('Request body:', req.body);
    const { nombre } = req.body;
    
    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }
    
    console.log('Creating user with name:', nombre);
    const result = await pool.query(
      'INSERT INTO usuarios (nombre) VALUES ($1) RETURNING *',
      [nombre.trim()]
    );
    console.log('User created successfully:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Error creando usuario: ' + err.message });
  }
});

app.put('/api/usuarios/:id', async (req, res) => {
  try {
    console.log('Update user request - ID:', req.params.id, 'Body:', req.body);
    const { id } = req.params;
    const { nombre } = req.body;
    
    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }
    
    const result = await pool.query(
      'UPDATE usuarios SET nombre = $1 WHERE id = $2 RETURNING *',
      [nombre.trim(), id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    console.log('User updated successfully:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Error actualizando usuario: ' + err.message });
  }
});

app.delete('/api/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error eliminando usuario' });
  }
});

app.post('/api/pedidos', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const { restaurante_id, usuario_responsable_id, valor_domicilio, items } = req.body;
    
    const total_pedido = items.reduce((sum, item) => sum + item.subtotal, 0);
    
    const pedidoResult = await client.query(
      'INSERT INTO pedidos (restaurante_id, usuario_responsable_id, valor_domicilio, total_pedido) VALUES ($1, $2, $3, $4) RETURNING *',
      [restaurante_id, usuario_responsable_id, valor_domicilio, total_pedido]
    );
    
    const pedido_id = pedidoResult.rows[0].id;
    
    for (const item of items) {
      await client.query(
        'INSERT INTO pedido_items (pedido_id, usuario_id, menu_item_id, cantidad, subtotal) VALUES ($1, $2, $3, $4, $5)',
        [pedido_id, item.usuario_id, item.menu_item_id, item.cantidad, item.subtotal]
      );
    }
    
    await client.query('COMMIT');
    
    const pedidoCompleto = await getPedidoCompleto(pedido_id);
    res.json(pedidoCompleto);
    
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Error creando pedido' });
  } finally {
    client.release();
  }
});

app.get('/api/pedidos', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, r.nombre as restaurante_nombre, u.nombre as responsable_nombre
      FROM pedidos p
      JOIN restaurantes r ON p.restaurante_id = r.id
      JOIN usuarios u ON p.usuario_responsable_id = u.id
      ORDER BY p.fecha_pedido DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error obteniendo pedidos' });
  }
});

app.put('/api/pedidos/:id', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { id } = req.params;
    const { restaurante_id, usuario_responsable_id, valor_domicilio, items } = req.body;

    // Verificar que el pedido existe
    const pedidoExistente = await client.query('SELECT * FROM pedidos WHERE id = $1', [id]);
    if (pedidoExistente.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    const total_pedido = items.reduce((sum, item) => sum + item.subtotal, 0);

    // Actualizar pedido
    await client.query(
      'UPDATE pedidos SET restaurante_id = $1, usuario_responsable_id = $2, valor_domicilio = $3, total_pedido = $4 WHERE id = $5',
      [restaurante_id, usuario_responsable_id, valor_domicilio, total_pedido, id]
    );

    // Eliminar items existentes
    await client.query('DELETE FROM pedido_items WHERE pedido_id = $1', [id]);

    // Insertar nuevos items
    for (const item of items) {
      await client.query(
        'INSERT INTO pedido_items (pedido_id, usuario_id, menu_item_id, cantidad, subtotal) VALUES ($1, $2, $3, $4, $5)',
        [id, item.usuario_id, item.menu_item_id, item.cantidad, item.subtotal]
      );
    }

    await client.query('COMMIT');

    const pedidoActualizado = await getPedidoCompleto(id);
    res.json(pedidoActualizado);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Error actualizando pedido' });
  } finally {
    client.release();
  }
});

app.get('/api/pedidos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pedido = await getPedidoCompleto(id);
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    res.json(pedido);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error obteniendo pedido' });
  }
});

async function getPedidoCompleto(pedido_id) {
  const pedidoResult = await pool.query(`
    SELECT p.*, r.nombre as restaurante_nombre, u.nombre as responsable_nombre
    FROM pedidos p
    JOIN restaurantes r ON p.restaurante_id = r.id
    JOIN usuarios u ON p.usuario_responsable_id = u.id
    WHERE p.id = $1
  `, [pedido_id]);
  
  if (pedidoResult.rows.length === 0) return null;
  
  const pedido = pedidoResult.rows[0];
  
  const itemsResult = await pool.query(`
    SELECT pi.*, u.nombre as usuario_nombre, mi.nombre as item_nombre, mi.precio as precio_unitario
    FROM pedido_items pi
    JOIN usuarios u ON pi.usuario_id = u.id
    JOIN menu_items mi ON pi.menu_item_id = mi.id
    WHERE pi.pedido_id = $1
    ORDER BY u.nombre, mi.nombre
  `, [pedido_id]);
  
  pedido.items = itemsResult.rows;
  
  const usuariosConCostos = calcularCostosPorUsuario(pedido);
  pedido.costos_por_usuario = usuariosConCostos;
  
  return pedido;
}

function calcularCostosPorUsuario(pedido) {
  const usuarios = {};
  
  pedido.items.forEach(item => {
    if (!usuarios[item.usuario_id]) {
      usuarios[item.usuario_id] = {
        usuario_id: item.usuario_id,
        usuario_nombre: item.usuario_nombre,
        subtotal: 0,
        items: []
      };
    }
    usuarios[item.usuario_id].subtotal += item.subtotal;
    usuarios[item.usuario_id].items.push(item);
  });
  
  const usuariosArray = Object.values(usuarios);
  const numeroUsuarios = usuariosArray.length;
  const costoDomicilioPorUsuario = Math.ceil(pedido.valor_domicilio / numeroUsuarios);
  
  usuariosArray.forEach(usuario => {
    usuario.costo_domicilio = costoDomicilioPorUsuario;
    usuario.total = usuario.subtotal + costoDomicilioPorUsuario;
  });
  
  return usuariosArray;
}

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});