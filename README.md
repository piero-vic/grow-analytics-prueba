# Grow Analytics Prueba Técnica

## Instrucciones

En el archivo `docker-compose.yml` hay un servicio para la base de datos de desarrollo.

```bash
docker compose up -d
```

### Backend

```bash
cd backend

# Copiar las variables de entorno para desarrollo
cp .env.example .env

# Instalar dependencias
npm ci

# Configurar base de datos
npm run db:push
npm run db:seed

# Correr aplicación en modo desarrollo
npm run dev
```

### Frontend

En otra ventana de terminal correr los siguientes comandos para levantar el frontend.

```bash
cd frontend

# Instalar dependencias
npm ci

# Correr aplicación en modo desarrollo
npm run dev
```

### Usuarios de prueba

```
Email: user1@example.com
Password: password
```
