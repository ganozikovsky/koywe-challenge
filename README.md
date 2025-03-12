# 🚀 API de Cotización de Divisas (Fiat ⇄ Crypto)

Esta API permite la conversión entre monedas tradicionales (fiat) y criptomonedas, ofreciendo endpoints para crear y consultar cotizaciones con tasas de cambio en tiempo real.

## 🛠️ Tecnologías utilizadas

- **Backend:** NestJS, TypeScript
- **Base de datos:** MongoDB con Mongoose
- **Autenticación:** JWT (JSON Web Tokens)
- **Documentación:** Swagger/OpenAPI
- **Testing:** Jest
- **Contenedorización:** Docker y Docker Compose

## 🔍 Características principales

- Arquitectura modular y escalable usando NestJS
- Patrón Facade para centralizar la lógica de negocio
- Autenticación JWT para proteger endpoints
- Consulta en tiempo real a proveedores de precios (CryptoMKT)
- Respuesta estandarizada para todos los endpoints
- Manejo centralizado de errores
- Documentación automática con Swagger

## 📋 Requisitos previos

- Node.js (v16+)
- MongoDB
- Docker y Docker Compose (opcionales para despliegue en contenedores)

## 🚀 Instalación y ejecución

### Usando Node.js local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/ganozikovsky/koywe-challenge.git
   cd koywe-challenge
   
2. **Instalar las dependencias:**
   ```bash
   npm install
    ```

3. **Configurar las variables de entorno:**
    ```bash
    cp .env.example .env
    ```

4. **Ejecutar la aplicación en modo desarrollo:**
    ```bash
    npm run start:dev
    ```

5. **Compilar para produccion**
    ```bash
    npm run build
    npm run start:prod
    ```

### Usando Docker

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/ganozikovsky/koywe-challenge.git
   cd koywe-challenge
   ```

2. **Configurar las variables de entorno:**
    ```bash
    cp .env.example .env
    ```

3. **Ejecutar la aplicación en modo desarrollo:**
    ```bash
    docker-compose up -d 
    ```

4. **La aplicación estará disponible en http://localhost:3000**

### 🧪 Ejecutar pruebas

#### Pruebas unitarias

```bash
npm run test
```

#### Pruebas de cobertura

```bash
npm run test:cov
```

#### Pruebas e2e

```bash 
npm run test:e2e
```

### 📊 Estructura del proyecto

```
src/
├── app.module.ts              # Módulo principal
├── main.ts                    # Punto de entrada
├── auth/                      # Módulo de autenticación
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── dto/
│   ├── guards/
│   └── strategies/
├── common/                    # Código compartido
│   ├── decorators/
│   ├── filters/
│   └── interceptors/
├── config/                    # Configuración
├── quotes/                    # Módulo de cotizaciones
│   ├── quotes.controller.ts
│   ├── quotes.facade.ts       # Implementación del patrón Facade
│   ├── dao/                   # Acceso a datos
│   ├── dto/
│   ├── services/              # Servicios y estrategias
│   └── schemas/
└── users/                     # Módulo de usuarios
    ├── users.controller.ts
    ├── users.service.ts
    ├── dto/
    └── schemas/
```

### 📝 Documentación API

La documentación de la API se genera automáticamente con Swagger y está disponible en la ruta `/api`.

### 🔐 Autenticación

La API utiliza autenticación JWT. Para acceder a endpoints protegidos:

1. Registrar un usuario 

```bash
POST /auth/register
{
  "username": "usuario",
  "password": "contraseña"
}
```

2. Iniciar sesión para obtener token

```bash
POST /auth/login
{
  "username": "usuario",
  "password": "contraseña"
}
```

3. Incluir el token en el header `Authorization` para acceder a los endpoints protegidos

```bash
Authorization: Bearer {token}
```

### 🤖 Uso de Inteligencia Artificial

Durante el desarollo de este proyecto, se utilizaron la ssiguientes herramientas de IA:

* GitHub Copilot: Para autocompletar código, generar implementaciones de funciones y sugerencias de buenas prácticas.
* ChatGPT: Para consultas específicas sobre patrones de diseño, configuración de NestJS y resolución de problemas.

Estas herramientas fueron utilizadas como asistentes para agilizar el desarrollo, pero todo el código generado fue revisado y refactorizado para asegurar que cumpla con los estándares de calidad y las especificaciones del proyecto.

### 🌐 Proveedores de precios

La aplicación está configurada para usar múltiples proveedores de precios:

* CryptoMKT API: Proveedor principal para cotizaciones en tiempo real
* Simulador: Proveedor de respaldo que genera tasas de cambio simuladas

La selección del proveedor se realiza automáticamente según la configuración de la aplicación o puede especificarse explícitamente.

### 👥 Autor

ganozikovsky






