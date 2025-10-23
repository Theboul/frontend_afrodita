# 🚀 Guía de Despliegue en Netlify

## Pasos para desplegar en Netlify

### 1. Preparación del Proyecto
✅ Ya está listo con los archivos de configuración necesarios:
- `netlify.toml` - Configuración de build y redirects
- `public/_redirects` - Redirects para SPA
- `.env.example` - Template de variables de entorno

### 2. Subir el código a GitHub
```bash
git add .
git commit -m "Configuración para despliegue en Netlify"
git push origin main
```

### 3. Conectar con Netlify

#### Opción A: Desde la UI de Netlify (Recomendado)
1. Ve a [https://app.netlify.com/](https://app.netlify.com/)
2. Click en "Add new site" > "Import an existing project"
3. Selecciona tu repositorio de GitHub
4. Netlify detectará automáticamente la configuración de `netlify.toml`
5. Click en "Deploy site"

#### Opción B: Usando Netlify CLI
```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login en Netlify
netlify login

# Inicializar el sitio
netlify init

# Desplegar
netlify deploy --prod
```

### 4. Configurar Variables de Entorno en Netlify

**IMPORTANTE:** Debes configurar estas variables en la UI de Netlify:

1. Ve a: `Site settings` > `Environment variables`
2. Agrega las siguientes variables:

```
VITE_API_URL=https://tu-api-backend.com
VITE_API_TIMEOUT=30000
VITE_TOKEN_REFRESH_INTERVAL=840000
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=false
VITE_APP_NAME=Afrodita Lentes
VITE_APP_VERSION=1.0.0
```

⚠️ **Nota:** Cambia `VITE_API_URL` por la URL real de tu backend en producción.

### 5. Configuración del Build

Netlify usará automáticamente:
- **Build command:** `bun run build`
- **Publish directory:** `dist`
- **Node version:** Detectada automáticamente

Si usas Node en lugar de Bun en Netlify, el comando de build será:
- **Build command:** `npm run build` o `yarn build`

### 6. Verificar el Despliegue

Después del despliegue:
1. Verifica que todas las rutas funcionen correctamente
2. Abre la consola del navegador para verificar errores
3. Verifica que la API se conecte correctamente
4. Prueba el routing de React (actualizar en diferentes URLs)

### 7. Configuración Adicional (Opcional)

#### Dominio personalizado
1. Ve a `Site settings` > `Domain management`
2. Click en "Add custom domain"
3. Sigue las instrucciones para configurar tu DNS

#### HTTPS
- Netlify proporciona HTTPS gratuito automáticamente con Let's Encrypt

#### Build Hooks
Si quieres deployar automáticamente:
1. Ve a `Site settings` > `Build & deploy` > `Build hooks`
2. Crea un webhook para trigger builds desde GitHub

## 🔧 Solución de Problemas

### Error 404 en las rutas
- ✅ Ya está solucionado con `_redirects` y `netlify.toml`

### Variables de entorno no funcionan
- Verifica que tengan el prefijo `VITE_`
- Reconstruye el sitio después de agregar variables

### Error en el build
- Verifica que todas las dependencias estén en `package.json`
- Asegúrate de que no haya errores de TypeScript: `npm run build` localmente

### Problemas de CORS
- Configura tu backend para permitir el dominio de Netlify
- Agrega tu dominio de Netlify a la lista de orígenes permitidos

## 📊 Monitoreo

Netlify proporciona:
- 📈 Analytics básicos gratuitos
- 📝 Logs de build
- 🔍 Logs de funciones (si las usas)
- 📧 Notificaciones de build

## 🔄 Despliegues Automáticos

Con la configuración actual, cada push a `main` triggereará un nuevo despliegue automáticamente.

Para despliegues por rama:
- Branch deploys: Configurable en `Site settings` > `Build & deploy` > `Branches`

## 💰 Límites del Plan Gratuito

- 100 GB de ancho de banda/mes
- 300 minutos de build/mes
- Deploy automático en cada commit
- HTTPS gratis
- Dominio personalizado gratis

## ✅ Checklist Final

- [ ] Código subido a GitHub
- [ ] Sitio conectado en Netlify
- [ ] Variables de entorno configuradas
- [ ] VITE_API_URL apunta al backend de producción
- [ ] Build exitoso
- [ ] Rutas funcionando correctamente
- [ ] API conectándose correctamente
- [ ] Dominio personalizado configurado (opcional)

---

¡Tu aplicación está lista para producción! 🎉
