# ✅ Checklist de Pre-Despliegue

Usa esta lista para asegurarte de que todo está listo antes de desplegar a producción.

## 📋 Código y Configuración

- [ ] Todas las dependencias están en `package.json`
- [ ] El build local funciona sin errores (`bun run build`)
- [ ] No hay errores de TypeScript
- [ ] No hay errores de ESLint críticos
- [ ] Las rutas de importación son correctas
- [ ] Los archivos `.env.*` NO están en el repositorio (verificar `.gitignore`)

## 🔧 Archivos de Configuración

- [x] `netlify.toml` configurado
- [x] `public/_redirects` creado para SPA
- [x] `.env.example` actualizado con todas las variables
- [x] `.env.production.example` creado
- [x] `.gitignore` incluye archivos `.env`

## 🌐 Variables de Entorno

- [ ] `VITE_API_URL` configurada con la URL del backend de producción
- [ ] `VITE_ENABLE_DEBUG` establecida en `false` para producción
- [ ] `VITE_ENABLE_ANALYTICS` configurada según necesidad
- [ ] Todas las variables tienen el prefijo `VITE_`
- [ ] Variables configuradas en la UI de Netlify

## 🔒 Seguridad

- [ ] Las credenciales sensibles NO están en el código
- [ ] CORS configurado en el backend para el dominio de Netlify
- [ ] Headers de seguridad configurados (ya están en `netlify.toml`)
- [ ] Certificado SSL habilitado (automático en Netlify)

## 🧪 Testing

- [ ] La aplicación funciona en modo producción local (`bun run preview`)
- [ ] Todas las rutas funcionan correctamente
- [ ] Los formularios funcionan sin errores
- [ ] La autenticación funciona correctamente
- [ ] Las peticiones a la API funcionan

## 📱 Responsividad

- [ ] La UI se ve bien en móvil
- [ ] La UI se ve bien en tablet
- [ ] La UI se ve bien en desktop
- [ ] No hay problemas de scroll
- [ ] Los formularios son usables en móvil

## 🚀 Git y GitHub

- [ ] Todos los cambios están commiteados
- [ ] El código está en la rama correcta (main/master)
- [ ] El código está pusheado a GitHub
- [ ] No hay archivos temporales o de desarrollo en el repo

## 🏗️ Netlify

- [ ] Repositorio conectado a Netlify
- [ ] Build command configurado: `bun run build`
- [ ] Publish directory configurado: `dist`
- [ ] Variables de entorno configuradas en Netlify
- [ ] Deploy hooks configurados (opcional)
- [ ] Dominio personalizado configurado (opcional)

## 📊 Post-Despliegue

Después del primer despliegue, verifica:

- [ ] El sitio está accesible desde la URL de Netlify
- [ ] Todas las páginas cargan correctamente
- [ ] No hay errores 404 al navegar entre páginas
- [ ] La consola del navegador no muestra errores
- [ ] La API responde correctamente
- [ ] Los formularios funcionan
- [ ] La autenticación funciona
- [ ] Las imágenes y assets se cargan correctamente

## 🐛 Debugging en Producción

Si algo falla:

1. **Verifica los logs de build en Netlify**
   - Site > Deploys > [último deploy] > Deploy log

2. **Verifica la consola del navegador**
   - Busca errores de JavaScript
   - Verifica peticiones de red fallidas

3. **Verifica las variables de entorno**
   - Site settings > Environment variables
   - Asegúrate de que todas estén configuradas

4. **Verifica el CORS**
   - Si hay errores de CORS, configura el backend

5. **Verifica las rutas**
   - Asegúrate de que `_redirects` esté en `public/`

## 📞 Contacto de Soporte

- Netlify Support: https://answers.netlify.com/
- Documentación: https://docs.netlify.com/

---

**Última actualización:** 23 de octubre de 2025

**Estado:** ✅ Listo para desplegar
