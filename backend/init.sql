-- Crear base de datos y tablas para Pedidos HPowerCo

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de restaurantes
CREATE TABLE IF NOT EXISTS restaurantes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de items del menú
CREATE TABLE IF NOT EXISTS menu_items (
    id SERIAL PRIMARY KEY,
    restaurante_id INTEGER REFERENCES restaurantes(id),
    nombre VARCHAR(100) NOT NULL,
    precio INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    id SERIAL PRIMARY KEY,
    restaurante_id INTEGER REFERENCES restaurantes(id),
    usuario_responsable_id INTEGER REFERENCES usuarios(id),
    valor_domicilio INTEGER NOT NULL,
    total_pedido INTEGER NOT NULL,
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(50) DEFAULT 'activo'
);

-- Tabla de items del pedido (relación muchos a muchos)
CREATE TABLE IF NOT EXISTS pedido_items (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER REFERENCES pedidos(id) ON DELETE CASCADE,
    usuario_id INTEGER REFERENCES usuarios(id),
    menu_item_id INTEGER REFERENCES menu_items(id),
    cantidad INTEGER NOT NULL DEFAULT 1,
    subtotal INTEGER NOT NULL
);

-- Insertar usuarios iniciales
INSERT INTO usuarios (nombre) VALUES 
    ('Daniel Castañeda'),
    ('Daniel Sanchez'),
    ('Sebastian Mosquera'),
    ('Alejandro Grajales'),
    ('Ali Rayo'),
    ('Andres Mejia'),
    ('Diego Tapias'),
    ('Juan Diego Escobar'),
    ('Felipe Duque'),
    ('Pacho Rendon'),
    ('Ivan Solarte'),
    ('Juan David Alzate'),
    ('Laura Perez'),
    ('Mateo Ortiz'),
    ('Santiago'),
    ('Zurdo Hernandez'),
    ('Daniel Jaramillo')
ON CONFLICT DO NOTHING;

-- Insertar restaurantes
INSERT INTO restaurantes (nombre) VALUES 
    ('Mega Empanadas'),
    ('La Morita')
ON CONFLICT DO NOTHING;

-- Insertar menú de Mega Empanadas
INSERT INTO menu_items (restaurante_id, nombre, precio) 
SELECT 1, nombre, precio FROM (VALUES
    ('Vegana', 2000),
    ('Papa y Carne', 2000),
    ('Arroz y Carne', 2400),
    ('Paisa', 3000),
    ('Hawaiana', 3500),
    ('Queso Mozzarella', 3300),
    ('Ranchera', 3400),
    ('Pollo y Tocineta', 3300),
    ('Carne Desmechada', 3800),
    ('Pastel de Pollo', 3500),
    ('Coctelera de Papa', 700),
    ('Pastel Coctelero', 1000)
) AS menu_data(nombre, precio)
ON CONFLICT DO NOTHING;

-- Insertar menú de La Morita
INSERT INTO menu_items (restaurante_id, nombre, precio) 
SELECT 2, nombre, precio FROM (VALUES
    ('Jamón y Queso', 5000),
    ('Pizza', 5000),
    ('Champiñones con Queso', 5000),
    ('Queso con Papa', 5000),
    ('Hawaiano', 5000),
    ('Queso con Tocineta', 5000),
    ('Pollo', 5000),
    ('Ranchero', 5000),
    ('Paisa', 5000),
    ('Andino', 5000),
    ('Sifrino', 6000),
    ('Carne Desmechada', 6000),
    ('Camarones al Ajillo', 6000),
    ('Chuleta', 6000),
    ('Carne Asada', 6000),
    ('Asado Negro', 6000),
    ('Cordon Blue', 6000),
    ('4 Quesos', 6000),
    ('Tequeños Queso', 3000),
    ('Tequeños Chocolate', 2000),
    ('Tequeños Chocolate con Maní', 2000),
    ('Tequeños Queso y Bocadillo', 3500),
    ('Tequeños Queso, Tajada y Tocineta', 4000)
) AS menu_data(nombre, precio)
ON CONFLICT DO NOTHING;