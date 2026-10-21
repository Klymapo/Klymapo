# Centro de Control · Guía de uso y publicación

Este dashboard es un **catálogo público** de repositorios públicos de Klymapo. Es una app estática (HTML/CSS/JavaScript) sin servicios de pago, compilación, claves ni autenticación.

## Publicar con GitHub Pages

1. Abre `https://github.com/Klymapo/Klymapo/settings/pages` con tu cuenta.
2. En **Build and deployment → Source**, selecciona **Deploy from a branch**.
3. Selecciona **Branch: main**, **Folder: /docs** y pulsa **Save**.
4. Consulta en la misma pantalla **Visit site** para confirmar el enlace desplegado. La dirección esperada para este repositorio, **solo después de habilitar Pages**, es `https://klymapo.github.io/Klymapo/`.

> Un repo público solo con archivos en `docs/` **no implica** que Pages ya esté publicado. La configuración se hace desde la interfaz de GitHub porque la conexión actual no ofrece esa operación administrativa.

## Contenido y privacidad

- `index.html`: estructura semántica.
- `styles.css`: apariencia adaptable para teléfono y escritorio.
- `app.js`: proyectos públicos curados, filtros, buscador, favoritos y consulta de actividad.
- El catálogo contiene únicamente los **8 repositorios públicos de proyecto** identificados al crearlo; `Klymapo/Klymapo` es el repositorio del perfil y se excluye.
- **No incluir aquí nombres, links, capturas, Issues ni avances de repositorios privados.** GitHub Pages expone públicamente los archivos y el contenido de este dashboard.
- El botón **GitHub Projects** apunta a la lista de proyectos de la cuenta; tu tablero privado exige iniciar sesión y sus contenidos no se copian a este sitio.
- Los favoritos y la caché son locales del navegador (`localStorage`); no se sincronizan entre dispositivos. La página, en cambio, sí se puede abrir desde cualquier dispositivo una vez publicada.
- Los estados **Activo**, **Herramienta** e **Histórico** son orientativos, asignados manualmente. **No** son el estado de los Issues, la última build, GitHub Actions, ni se actualizan solos.
- Para una aproximación a la actividad, `app.js` consulta `api.github.com/users/Klymapo/repos` sin token y reutiliza caché 4 h cuando es posible. Si la API falla, la navegación funciona igualmente.

## Mantener el catálogo

1. Para cambiar la presentación de un proyecto público, editar su objeto dentro de `CURATED` en `app.js`.
2. Para agregar un nuevo proyecto público, añadir una entrada en `CURATED` con `slug`, `title`, `category`, `status`, `description`, `tags`, `icon`, `tone`, `rank`.
3. Categorías válidas: `videojuegos`, `modelado`, `apps`, `datos`, `escritura`, `historico`.
4. Para evitar revelar trabajo privado, **revisar la visibilidad en GitHub antes de añadirlo**. No registrar tokens de acceso en código cliente.
5. Publicar con un Pull Request y verificar el sitio en móvil y escritorio.

### Relación con otros sistemas

El dashboard es el **explorador público**. [GitHub Projects](https://github.com/users/Klymapo/projects) es el **gestor privado de tareas**; no todos los repositorios caben en el catálogo público. Se mantienen separados para no exponer información de proyectos privados.

Última preparación documental: 2026-10-12.
