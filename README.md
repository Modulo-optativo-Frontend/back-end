# 🖥️ Back-End  
## 🧑‍💻 Stack Tech

Antes de comenzar, asegúrate de tener instalado:
- [Node.js](https://nodejs.org/) (versión 14 o superior)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/try/download/community) instalado localmente O una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## ⚙️ Software / Tools
- [Node.js](https://nodejs.org/)  
- [Git](https://git-scm.com/)  
- [Docker](https://www.docker.com/)  
- [Docker Compose](https://docs.docker.com/compose/)  
- [Postman](https://www.postman.com/)  
- [MongoDB Compass](https://www.mongodb.com/products/tools/compass) / [TablePlus](https://tableplus.com/)

  # Backend - Módulo Optativo Frontend




## 📦 Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/Modulo-optativo-Frontend/back-end.git
cd back-end
```

2. **Instalar dependencias**
```bash
npm install
```



## 🏃 Ejecutar el Proyecto

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

El servidor estará disponible en `http://localhost:5000`

## 📁 Estructura del Proyecto

```
back-end/
├── src/
│   ├── models/           # Esquemas de Mongoose
│   ├── routes/           # Rutas y endpoints
│   ├── controllers/       # Lógica de controladores
│   ├── middleware/        # Middleware personalizado
│   ├── config/            # Configuración general
│   └── server.js          # Archivo principal
├── .env                   # Variables de entorno
├── .gitignore             # Archivos a ignorar en Git
├── package.json           # Dependencias del proyecto
└── README.md              # Este archivo
```

## 🏗️ Schemas de MongoDB

Los schemas definen la estructura de los documentos en MongoDB, ubicados en `src/models/`.

**Usuario:**
```javascript
{
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ['usuario', 'admin'], default: 'usuario' },
  createdAt: { type: Date, default: Date.now }
}
```

**Producto:**
```javascript
{
  nombre: { type: String, required: true },
  precio: { type: Number, required: true, min: 0 },
  stock: { type: Number, default: 0 },
  categoria: { type: String, required: true },
  autor: { type: ObjectId, ref: 'Usuario' },
  createdAt: { type: Date, default: Date.now }
}
```

**Validadores comunes:** `required`, `unique`, `min/max`, `enum`, `default`

## 🔌 Endpoints Principales

### Usuarios
- `GET /api/usuarios` - Obtener todos los usuarios
- `GET /api/usuarios/:id` - Obtener usuario por ID
- `POST /api/usuarios` - Crear nuevo usuario
- `PUT /api/usuarios/:id` - Actualizar usuario
- `DELETE /api/usuarios/:id` - Eliminar usuario

### [Agrega aquí otros endpoints según tu API]


## 💡 Comandos Útiles

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Ejecutar en modo producción
npm start

# Ver logs
npm run logs

# Ejecutar tests (si están configurados)
npm test
```

## 🐛 Troubleshooting

### Error: "Cannot find module"
Asegúrate de haber ejecutado `npm install` correctamente.

### Error: "Connection refused" MongoDB
Verifica que MongoDB esté ejecutándose localmente o que la URL de MongoDB Atlas sea correcta en el archivo `.env`.

### Error: "CORS error"
Revisa la variable `CORS_ORIGIN` en el archivo `.env` y que coincida con la URL del frontend.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Haz un Fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commitea tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo licencia MIT. Ver archivo `LICENSE` para más detalles.

## 👥 Autores

- **Equipo de Desarrollo** - Módulo Optativo Frontend

## 📧 Contacto

Para preguntas o sugerencias, contacta a través de los issues del repositorio.

---

**Última actualización:** Octubre 2025
