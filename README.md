# BarberShop Catálogo 💈

Catálogo de productos de barbería con panel de administración. Sin base de datos — todo se guarda en el navegador (localStorage).

## 🚀 Deploy rápido en Vercel

### Opción 1 — GitHub + Vercel (recomendado)

1. **Sube a GitHub:**
   ```bash
   git init
   git add .
   git commit -m "feat: catálogo barbería"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/barber-catalog.git
   git push -u origin main
   ```

2. **Conecta en Vercel:**
   - Entra a [vercel.com](https://vercel.com) → New Project
   - Importa tu repositorio de GitHub
   - Clic en **Deploy** (sin configuración extra)
   - ¡Listo! Tu catálogo estará en `https://barber-catalog.vercel.app`

### Opción 2 — Vercel CLI

```bash
npm i -g vercel
vercel --prod
```

---

## 🔐 Cambiar credenciales de admin

Abre `app.js` y edita las primeras líneas:

```js
const ADMIN_USER = 'admin';      // ← cambia el usuario
const ADMIN_PASS = 'barber2026'; // ← cambia la contraseña
```

---

## 📱 Cómo usar el panel admin

1. Haz clic en **⚙ Admin** en la barra de navegación
2. Ingresa usuario y contraseña
3. En el panel puedes:
   - **Agregar** productos con foto, precio, categoría y descripción
   - **Editar** cualquier producto existente (botón ✏)
   - **Eliminar** productos (botón 🗑)
   - Las fotos se guardan en formato base64 en el navegador

> ⚠️ **Importante:** Los datos se guardan en `localStorage` del navegador. Si limpias el historial o cambias de navegador, los productos vuelven a los de demo. Para producción real, considera conectar una base de datos.

---

## 📁 Estructura de archivos

```
barber-catalog/
├── index.html     → Estructura de la página
├── style.css      → Diseño y estilos
├── app.js         → Lógica de la app (productos, admin, filtros)
├── vercel.json    → Configuración de Vercel
└── README.md      → Este archivo
```

---

## 🛠 Personalización rápida

| Qué cambiar | Dónde |
|-------------|-------|
| Nombre de la tienda | `index.html` → sección `.brand` |
| WhatsApp de contacto | `app.js` → `DEFAULT_WHATSAPP` |
| Colores del tema | `style.css` → variables `:root` |
| Productos demo | `app.js` → array `DEMO_PRODUCTS` |
| Credenciales admin | `app.js` → `ADMIN_USER` y `ADMIN_PASS` |

---

## 💡 Tips

- **Fotos:** Las imágenes se guardan en base64. Para catálogos grandes (30+ productos con fotos de alta resolución), el localStorage puede llenarse (~5MB límite). Usa imágenes comprimidas al 80% calidad.
- **Categorías:** Se generan automáticamente desde los productos que agregues.
- **WhatsApp:** Cada producto puede tener su propio número, o usa el número por defecto.

---

Hecho con ❤️ para barberos colombianos 🇨🇴
