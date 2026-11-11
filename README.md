# Clínica Dental Koral — clinicadentalkoral.es

Web de Clínica Dental Koral (Vera, Almería) en 5 idiomas: español (sin prefijo), inglés `/en/`, alemán `/de/`, neerlandés `/nl/` y francés `/fr/`.

- **Astro 7** genera la web como HTML estático (`dist/`).
- **Tailwind CSS 4** para los estilos (`src/styles/global.css` contiene el sistema de diseño "Coral & Mediterráneo").
- **Cloudflare Pages** la publica. El formulario envía los emails con una Pages Function: `functions/api/send-email.js` (API de Resend).

## Comandos

| Comando | Qué hace |
| :-- | :-- |
| `npm install` | Instala las dependencias (Node 22.23 o superior) |
| `npm run dev` | Servidor de desarrollo en `localhost:4321` (el formulario no envía emails) |
| `npm run build` | Genera la web en `dist/` |
| `npm run preview:pages` | Compila y sirve la web con la función de email, como en Cloudflare |
| `npm run check` | Comprueba tipos y plantillas |

## Estructura

- `src/i18n/ui.ts` y `src/i18n/extra.ts`: textos de los 5 idiomas.
- `src/i18n/routes.ts`: URL de cada página en cada idioma. Lo usan el hreflang, el selector de idioma, las migas de pan, los menús y los enlaces internos. Si añades una página, regístrala aquí.
- `src/templates/`: una plantilla por página (cada idioma en `src/pages/` solo la importa).
- `src/components/ui/`: piezas comunes (cabecera de página, preguntas frecuentes, tratamientos relacionados…).
- `src/components/svg/`: ilustraciones e iconos propios (coral, olas, mapa, tratamientos).

## Cloudflare Pages

- Comando de build: `npm run build` · Carpeta de salida: `dist`.
- Variables del proyecto (Settings → Variables and Secrets):
  - `RESEND_API_KEY` (secreta): clave de Resend para enviar los emails.
  - `RECIPIENT_EMAILS`: buzones que reciben los formularios, separados por comas.
