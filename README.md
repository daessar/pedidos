# Pedidos HPowerCo

Aplicación web para simplificar el proceso de pedidos de comida en la oficina de HPowerCo.

## Características

- ✅ Selección de restaurantes (Mega Empanadas, La Morita)
- ✅ Cálculo automático de costos por usuario
- ✅ División automática del costo de domicilio
- ✅ Historial de pedidos
- ✅ Interfaz responsiva (PC y móvil)
- ✅ Gestión de usuarios
- ✅ Persistencia de datos con PostgreSQL

## Tecnologías

**Frontend:**
- React 18
- Material-UI 5
- React Router
- Axios

**Backend:**
- Node.js
- Express
- PostgreSQL
- Docker & Docker Compose

## Instalación y Ejecución

### Prerrequisitos
- Docker
- Docker Compose

### Ejecutar la aplicación

1. Clona el repositorio:
```bash
git clone <repo-url>
cd ordering
```

2. Ejecuta con Docker Compose:
```bash
docker-compose up --build
```

3. Accede a la aplicación:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### Desarrollo

Para desarrollo local (sin Docker):

1. **Backend:**
```bash
cd backend
npm install
npm run dev
```

2. **Frontend:**
```bash
cd frontend
npm install
npm start
```

## Estructura del Proyecto

```
ordering/
├── docker-compose.yml
├── backend/
│   ├── server.js
│   ├── init.sql
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.js
│   ├── public/
│   ├── package.json
│   └── Dockerfile
└── README.md
```

## Funcionalidades

### 1. Nuevo Pedido
- Seleccionar restaurante
- Elegir responsable del pedido
- Ingresar valor del domicilio
- Agregar items por usuario
- Calcular costos automáticamente

### 2. Historial
- Ver todos los pedidos realizados
- Filtrar por restaurante, fecha, responsable
- Ver detalle completo de cada pedido

### 3. Gestión de Usuarios
- Lista predefinida de usuarios de HPowerCo
- Posibilidad de agregar nuevos usuarios

## API Endpoints

- `GET /api/restaurantes` - Obtener restaurantes
- `GET /api/restaurantes/:id/menu` - Obtener menú de restaurante
- `GET /api/usuarios` - Obtener usuarios
- `POST /api/usuarios` - Crear usuario
- `GET /api/pedidos` - Obtener historial de pedidos
- `GET /api/pedidos/:id` - Obtener detalle de pedido
- `POST /api/pedidos` - Crear nuevo pedido

## Base de Datos

La aplicación utiliza PostgreSQL con las siguientes tablas:
- `usuarios` - Información de usuarios
- `restaurantes` - Restaurantes disponibles
- `menu_items` - Items del menú por restaurante
- `pedidos` - Pedidos realizados
- `pedido_items` - Items específicos de cada pedido

## Moneda

Todos los precios están en pesos colombianos (COP).

## Soporte

Para reportar problemas o solicitar nuevas funcionalidades, contacta al equipo de desarrollo.