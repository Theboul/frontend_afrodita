# Afrodita Lentes - Frontend

Sistema de gestión para Afrodita Lentes construido con React + TypeScript + Vite.

## 🚀 Tecnologías

- **React 19** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework CSS
- **Axios** - Cliente HTTP
- **React Hook Form** - Manejo de formularios
- **React Router Dom** - Enrutamiento
- **Bun** - Runtime y package manager

## 📋 Requisitos Previos

- Node.js 18+ o Bun 1.0+
- Git

## 🛠️ Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd frontend_Afrodita
```

2. Instala las dependencias:
```bash
bun install
# o
npm install
```

3. Copia el archivo de variables de entorno:
```bash
cp .env.example .env
```

4. Configura las variables de entorno en `.env`:
```env
VITE_API_URL=http://localhost:8000
VITE_API_TIMEOUT=30000
VITE_TOKEN_REFRESH_INTERVAL=840000
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true
VITE_APP_NAME=Afrodita Lentes
VITE_APP_VERSION=1.0.0
```

## 🏃 Desarrollo

Inicia el servidor de desarrollo:
```bash
bun run dev
# o
npm run dev
```

La aplicación estará disponible en `http://localhost:5173/`

## 🏗️ Build para Producción

Construir la aplicación:
```bash
bun run build
# o
npm run build
```

Preview del build de producción:
```bash
bun run preview
# o
npm run preview
```

## 🚢 Despliegue en Netlify

Para desplegar en Netlify, consulta el archivo [DEPLOY.md](./DEPLOY.md) que contiene instrucciones detalladas.

### Pasos rápidos:

1. Asegúrate de que tu código esté en GitHub
2. Conecta tu repositorio con Netlify
3. Configura las variables de entorno en Netlify
4. ¡Deploy automático! 🎉

Los archivos de configuración ya están listos:
- `netlify.toml` - Configuración de build
- `public/_redirects` - Redirects para SPA

## 📁 Estructura del Proyecto

```
frontend_Afrodita/
├── public/          # Archivos estáticos
├── src/
│   ├── assets/      # Imágenes y recursos
│   ├── components/  # Componentes reutilizables
│   ├── hooks/       # Custom hooks
│   ├── layouts/     # Layouts de la aplicación
│   ├── pages/       # Páginas/Vistas
│   ├── services/    # Servicios y API
│   ├── styles/      # Estilos globales
│   ├── types/       # Tipos TypeScript
│   ├── utils/       # Utilidades
│   ├── App.tsx      # Componente principal
│   └── main.tsx     # Punto de entrada
├── .env.example     # Template de variables de entorno
├── netlify.toml     # Configuración de Netlify
├── DEPLOY.md        # Guía de despliegue
└── package.json     # Dependencias
```

## 🔧 Scripts Disponibles

- `bun run dev` - Inicia servidor de desarrollo
- `bun run build` - Build para producción
- `bun run preview` - Preview del build
- `bun run lint` - Ejecuta ESLint

## 🌐 Variables de Entorno

Las variables de entorno deben tener el prefijo `VITE_` para ser accesibles en el frontend.

Ver `.env.example` para la lista completa de variables necesarias.

## 📝 Lint

Ejecutar el linter:
```bash
bun run lint
# o
npm run lint
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

[Especifica tu licencia aquí]

## 👥 Autores

[Tu nombre/equipo]

---

Para más información sobre el despliegue, consulta [DEPLOY.md](./DEPLOY.md)

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
