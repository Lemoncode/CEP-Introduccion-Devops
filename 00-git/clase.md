# Flujo Git colaborativo — Guía de la clase

En esta práctica vas a trabajar con una aplicación React+TypeScript que ya está creada. El objetivo no es entender el código: es aprender el flujo de trabajo con Git que se usa en equipos profesionales. Harás un fork, crearás ramas, abrirás Pull Requests, provocarás un conflicto a propósito y lo resolverás.

Al final de la clase habrás pasado por todo el ciclo de vida de un cambio en un proyecto real.

---

## 0. Puesta en marcha — ver la app antes de tocar nada

Antes de hacer nada con Git, arranca la app para entender qué vas a modificar.

```bash
cd proyecto-demo
npm install
npm run dev
```

Abre <http://localhost:5173> en el navegador.

Verás una página con tarjetas. Cada tarjeta tiene un título y una descripción; al pulsarla se abre un modal con un mensaje más largo. La app es deliberadamente sencilla porque el protagonista de esta clase es Git, no el código.

Ahora abre `src/app.tsx` en VS Code. El núcleo de la app es este array:

```tsx
const OPTIONS: Option[] = [
  {
    id: 1,
    title: "Opción 1",
    description: "Commits",
    message: "Todo repositorio empieza con un commit...",
    featureFlag: false,
  },
  {
    id: 2,
    title: "Opción 2",
    description: "Ramas",
    message: "Una rama es como una línea de tiempo alternativa de tu código...",
    featureFlag: false,
  },
  ...
];
```

Añadir una nueva tarjeta es añadir un objeto a este array. Eso es lo que harás en la práctica. Cierra el servidor con `Ctrl+C` cuando estés listo para continuar.

---

## 1. Fork — crear tu propia copia del repositorio

Un **fork** es una copia completa de un repositorio en tu cuenta de GitHub. A diferencia de clonar, un fork vive en GitHub (no solo en tu ordenador) y mantiene una conexión con el repositorio original. Esto permite que puedas proponer tus cambios de vuelta al repo original mediante un Pull Request.

El flujo es el habitual en open source y en muchos equipos: el repositorio del instructor es el "oficial" y cada alumno trabaja sobre su propio fork.

**Pasos:**

1. Ve al [repositorio](https://github.com/Lemoncode/punto-partida-practica-modulo-git) en GitHub.
2. Haz clic en el botón **Fork** (esquina superior derecha).
3. Selecciona tu cuenta personal como destino.
4. Haz clic en **Create fork**.

GitHub te redirige automáticamente a tu fork. Fíjate en la URL: ahora pone `github.com/<tu-usuario>/punto-partida-practica-modulo-git`, no la del instructor. En la cabecera de la página aparece también "forked from `lemoncode/punto-partida-practica-modulo-git`".

---

## 2. Clonar — bajar tu fork al ordenador

Clonar es descargar el repositorio de GitHub a tu máquina local. Al clonar, Git también guarda automáticamente la dirección de GitHub de la que lo descargaste — esa dirección se llama `origin`.

```bash
git clone https://github.com/<tu-usuario>/punto-partida-practica-modulo-git.git
cd punto-partida-practica-modulo-git/proyecto-demo
npm install
npm run dev
```

Sustituye `<tu-usuario>` por tu nombre de usuario real de GitHub.

Abre <http://localhost:5173> para confirmar que la app funciona igual que antes. Si `npm install` falla, comprueba tu versión de Node:

```bash
node -v
```

Necesitas Node 18 o superior. Si tienes una versión anterior, actualízala antes de continuar.

Para el resto de la práctica cierra el servidor con `Ctrl+C` — lo arrancarás de nuevo cuando quieras ver cambios en el navegador.

---

## 3. Configurar los dos remotes — `origin` y `upstream`

Un **remote** es simplemente un nombre que Git usa para referirse a una URL de repositorio remoto. Cuando clonaste, Git registró automáticamente uno llamado `origin` que apunta a tu fork. Pero el repositorio del instructor todavía no está registrado. Añádelo:

```bash
git remote add upstream https://github.com/Lemoncode/punto-partida-practica-modulo-git.git
```

Sustituye `<instructor>` por el usuario GitHub del instructor.

Ahora comprueba que tienes los dos:

```bash
git remote -v
```

Deberías ver esto (con tus nombres reales):

```
origin    https://github.com/<tu-usuario>/curso-git.git     (fetch)
origin    https://github.com/<tu-usuario>/curso-git.git     (push)
upstream  https://github.com/<instructor>/curso-git.git     (fetch)
upstream  https://github.com/<instructor>/curso-git.git     (push)
```

La convención es siempre la misma:

- **`origin`** es tu fork. Es el sitio donde subirás tus cambios.
- **`upstream`** es el repositorio original. Si el instructor publica algo nuevo, lo traerás desde aquí con `git fetch upstream`.

---

## 4. Crear la rama `dev`

En proyectos profesionales nunca se trabaja directamente en `main`. La rama `main` representa el código que está (o podría estar) en producción: tiene que ser siempre estable.

El flujo habitual es:

- `main` → producción, siempre estable
- `dev` → integración, aquí se juntan las features antes de ir a producción
- `feature/xxx` → una por cada funcionalidad nueva, siempre creadas desde `dev`

Crea la rama `dev` y súbela a tu fork:

```bash
git switch -c dev
git push -u origin dev
```

El flag `-u` le dice a Git que en el futuro, cuando estés en la rama `dev` y ejecutes `git push` o `git pull` sin más argumentos, lo haga contra `origin/dev`. Solo hace falta ponerlo la primera vez.

Ve a GitHub y comprueba que la rama `dev` aparece en tu repositorio (desplegable de ramas).

---

## 5. Feature 1 — añadir la Opción 4

Las features siempre se crean desde `dev`, nunca desde `main`. Así, si necesitas hacer cambios urgentes en producción, `main` está limpia y puedes trabajar sobre ella sin arrastrar trabajo en curso.

```bash
git switch dev
git switch -c feature/opcion-4
```

Después del primer comando estás en `dev`. El segundo crea la rama `feature/opcion-4` a partir de ese punto exacto.

### Qué cambiar

Abre `src/app.tsx` y haz **dos cambios**:

**Cambio 1 — añadir la Opción 4.**
Localiza el bloque comentado al final del array `OPTIONS` y reemplázalo por:

```tsx
  {
    id: 4,
    title: "Opción 4",
    description: "Tags",
    message:
      "Un tag es una referencia fija a un commit. Se usa para marcar versiones: v1.0.0, v2.3.1…",
    featureFlag: false,
  },
```

Elimina las líneas comentadas (`//`) — el objeto va directamente dentro del array, justo antes del `]` de cierre.

**Cambio 2 — mejorar la descripción de la Opción 2.**
Localiza la Opción 2 y cambia su campo `description`:

```tsx
// Antes:
description: "Ramas",

// Después:
description: "Ramas de Git",
```

Estos dos cambios son independientes pero los hacemos en la misma feature branch. En el mundo real ocurre constantemente: mientras trabajas en algo, notas una pequeña mejora y la incluyes en el mismo commit o en un commit separado.

### Verificar en el navegador

```bash
npm run dev
```

Abre <http://localhost:5173>. Deberías ver ahora cuatro tarjetas. La cuarta abre un modal con el texto de los tags. Cierra el servidor con `Ctrl+C`.

### Commit y push

```bash
git add src/app.tsx
git commit -m "feat: añadir Opción 4 y mejorar descripción de Opción 2"
git push -u origin feature/opcion-4
```

Si después del `git add` ejecutas `git diff --staged` puedes ver exactamente qué has marcado para el commit, línea a línea. Es un buen hábito antes de confirmar.

---

## 6. Feature 2 — mejorar el mensaje de la Opción 2 (aquí plantamos el conflicto)

Esta rama también parte de `dev`. El punto clave es que la creas **ahora**, antes de que la Feature 1 esté mergeada. Eso significa que ambas ramas parten del mismo commit base y las dos tocan la misma línea del fichero. Cuando intentemos mezclarlas, habrá un conflicto. Es exactamente lo que queremos.

```bash
git switch dev
git switch -c feature/mejorar-opcion2
```

### Qué cambiar

Abre `src/app.tsx` y localiza la Opción 2. Haz **dos cambios**:

**Cambio 1 — mejorar el mensaje largo.**
Sustituye el campo `message` de la Opción 2:

```tsx
// Antes:
message:
  "Una rama es como una línea de tiempo alternativa de tu código. Puedes experimentar, cometer errores y fusionar solo lo que funciona, sin afectar nunca a main.",

// Después:
message:
  "Una rama es una línea de desarrollo independiente. Puedes crear, fusionar y eliminar ramas sin afectar a main.",
```

**Cambio 2 — cambiar la descripción corta.**
En el mismo objeto, cambia el campo `description`:

```tsx
// Antes:
description: "Ramas",

// Después:
description: "Ramas y merges",
```

Fíjate: la Feature 1 cambió `description` a `"Ramas de Git"` y esta rama la cambia a `"Ramas y merges"`. Las dos parten del mismo valor original `"Ramas"` y las dos lo modifican de forma distinta. Eso es exactamente la definición de conflicto en Git.

### Commit y push

```bash
git add src/app.tsx
git commit -m "feat: mejorar descripción y mensaje de Opción 2"
git push -u origin feature/mejorar-opcion2
```

---

## 7. Pull Request 1 — Feature 1 a `dev`

Un **Pull Request** (PR) es una petición formal para que tus cambios se incorporen a otra rama. Es el mecanismo central de colaboración en GitHub. Aunque trabajes solo, los PRs son útiles porque te obligan a revisar el diff antes de mergear y dejan un historial claro de qué se hizo y por qué.

### Crear el PR en GitHub

1. Ve a tu fork en GitHub.
2. Haz clic en **Pull requests** → **New pull request**.
3. Configura las ramas:
   - **base:** `dev`
   - **compare:** `feature/opcion-4`
4. Haz clic en **Compare & pull request** (o en **Create pull request**).
5. Pon como título: `feat: añadir Opción 4 y mejorar descripción de Opción 2`
6. Haz clic en la pestaña **Files changed** y revisa el diff. Verás en verde las líneas añadidas y en rojo las eliminadas. Esto es lo que verá un revisor en un proyecto real.
7. Vuelve a la pestaña **Conversation** y haz clic en **Create pull request**.

### Mergear el PR

Una vez creado, verás el botón **Merge pull request**. Haz clic en él → **Confirm merge**.

GitHub te confirma que el merge se ha hecho correctamente. La Feature 1 ya está en `dev`.

### Actualizar tu copia local

El merge se hizo en GitHub, pero tu `dev` local todavía no lo sabe. Tráelo:

```bash
git switch dev
git pull origin dev
```

`git pull` hace dos cosas: primero `git fetch` (descarga los cambios del remote) y luego `git merge` (los fusiona en tu rama local). Ahora tu `dev` local tiene la Opción 4 y la descripción "Ramas de Git" en la Opción 2.

---

## 8. Pull Request 2 — Feature 2 a `dev`, aparece el conflicto

### Crear el PR

1. En GitHub → **Pull requests** → **New pull request**.
2. **base:** `dev` ← **compare:** `feature/mejorar-opcion2`
3. Título: `feat: mejorar descripción y mensaje de Opción 2`
4. **Create pull request**.

GitHub analiza si puede fusionar automáticamente y detecta que no puede. Verás este mensaje en rojo:

> **This branch has conflicts that must be resolved**

¿Por qué? Porque `dev` ahora tiene `description: "Ramas de Git"` (que vino de la Feature 1) y la rama `feature/mejorar-opcion2` intenta cambiar esa misma línea a `description: "Ramas y merges"`. Las dos parten del valor `"Ramas"` y lo cambian de forma distinta. Git no puede decidir por sí solo cuál es la versión correcta.

Un conflicto no es un error ni un fallo tuyo. Es Git siendo honesto: hay dos versiones incompatibles de la misma línea y necesita que un humano decida.

---

## 9. Resolver el conflicto

Los conflictos se resuelven siempre en local, nunca directamente en GitHub. El proceso es:

1. Traer los cambios de `dev` a tu rama `feature/mejorar-opcion2`
2. Decirle a Git qué versión conservar (o combinar ambas)
3. Hacer commit de la resolución
4. Hacer push y mergear el PR

### Paso 1 — Ponerte en la rama con conflicto

```bash
git switch feature/mejorar-opcion2
```

### Paso 2 — Traer dev y mezclar

```bash
git fetch origin dev
git merge origin/dev
```

La terminal muestra algo así:

```
Auto-merging src/app.tsx
CONFLICT (content): Merge conflict in src/app.tsx
Automatic merge failed; fix conflicts and then commit the result.
```

Git ha fusionado todo lo que ha podido (por ejemplo, la Opción 4 que vino con `dev` no colisiona con nada de tu rama, así que la incorpora sin problema). Solo deja sin resolver la parte que no puede decidir solo.

### Paso 3 — Ver el conflicto en VS Code

Abre `src/app.tsx` en VS Code. Busca la Opción 2. Verás algo así:

```
<<<<<<< HEAD
    description: "Ramas y merges",
=======
    description: "Ramas de Git",
>>>>>>> origin/dev
```

Esto se llama **marcador de conflicto**. Significa:

- Todo lo que hay entre `<<<<<<< HEAD` y `=======` es **tu versión** (la de `feature/mejorar-opcion2`).
- Todo lo que hay entre `=======` y `>>>>>>> origin/dev` es **la versión de `dev`** (que incluye los cambios de Feature 1).

### Paso 4 — Resolver en VS Code

VS Code detecta los marcadores y muestra botones de ayuda justo encima del conflicto:

- **Accept Current Change** → conserva solo tu versión (`"Ramas y merges"`)
- **Accept Incoming Change** → conserva solo la versión de `dev` (`"Ramas de Git"`)
- **Accept Both Changes** → pone las dos líneas (no tiene sentido aquí)
- **Compare Changes** → abre una vista lado a lado

En este caso, la decisión lógica es quedarte con **tu versión** (`"Ramas y merges"`) porque es la que más información aporta. Haz clic en **Accept Current Change**.

VS Code elimina los marcadores y el fichero queda limpio:

```tsx
{
  id: 2,
  title: "Opción 2",
  description: "Ramas y merges",
  message:
    "Una rama es una línea de desarrollo independiente. Puedes crear, fusionar y eliminar ramas sin afectar a main.",
  featureFlag: false,
},
```

Comprueba también que la Opción 4 está presente más abajo — Git la incorporó automáticamente durante el merge.

Guarda el fichero (`Cmd+S` / `Ctrl+S`).

### Paso 5 — Arrancar la app para verificar

```bash
npm run dev
```

Abre <http://localhost:5173>. Debes ver cuatro tarjetas. La Opción 2 muestra "Ramas y merges" como descripción y el mensaje mejorado en el modal. Todo funciona. Cierra el servidor.

### Paso 6 — Commit de resolución y push

```bash
git add src/app.tsx
git commit -m "merge: resolver conflicto de descripción en Opción 2"
git push origin feature/mejorar-opcion2
```

### Paso 7 — Mergear el PR en GitHub

Vuelve al PR en GitHub. El banner de conflicto ha desaparecido. Ahora puedes hacer **Merge pull request** → **Confirm merge**.

Actualiza tu `dev` local:

```bash
git switch dev
git pull origin dev
```

`dev` tiene ahora los cambios de las dos features: la Opción 4 y el mensaje mejorado de la Opción 2.

---

## 10. Feature flag — controlar qué llega a producción

Antes de mergear `dev` a `main` hay que plantearse qué está listo para producción. La Opción 3 existe en el código pero su `featureFlag` es `true`, lo que significa que todavía no debería ser visible en producción.

¿Por qué no simplemente borrarla? Porque puede estar en desarrollo activo, puede tener trabajo a medias, o puede que esté esperando a que otra parte del sistema esté lista. Borrar y volver a añadir genera ruido en el historial. La solución profesional es una **feature flag**: una variable de entorno que activa o desactiva la funcionalidad en cada entorno.

### Cómo está implementado

En `src/app.tsx`:

```tsx
// Se evalúa una sola vez cuando arranca la app
const isOpcion3Enabled = import.meta.env.VITE_FEATURE_OPCION_3 === "true";

// Solo se muestran las opciones sin featureFlag, o las que tienen featureFlag
// si la variable de entorno lo permite
const visibleOptions = OPTIONS.filter(
  (opt) => !opt.featureFlag || isOpcion3Enabled,
);
```

La lógica es: muestra la opción si no tiene feature flag, o si tiene feature flag pero la variable de entorno está activa.

### Los ficheros de entorno

El proyecto tiene dos ficheros relacionados con las variables de entorno:

```
.env          →  valores reales, NO está en Git (está en .gitignore)
.env.example  →  plantilla documentada, SÍ está en Git
```

Puedes verlos con:

```bash
cat .env
cat .env.example
```

`.env` contiene los valores reales de tu entorno local (puede contener contraseñas, tokens, claves de API). Si estuviera en Git, cualquiera con acceso al repo podría verlos. Por eso está en `.gitignore`.

`.env.example` es la documentación: lista qué variables existen y qué formato tienen, sin revelar valores sensibles. Es lo que otro desarrollador usa para saber qué tiene que configurar en su propio `.env` al incorporarse al proyecto.

### Probarlo en vivo

Abre el fichero `.env` en VS Code y cambia la línea:

```
VITE_FEATURE_OPCION_3=false
```

Arranca el servidor:

```bash
npm run dev
```

Abre el navegador. La Opción 3 ha desaparecido. No has tocado el código, solo el valor de una variable de entorno.

Vuelve a cambiar el valor a `true` y reinicia el servidor para restaurar el estado de desarrollo.

Cuando esto llegue a producción, el servidor de producción tendrá su propio `.env` con `VITE_FEATURE_OPCION_3=false`. El código es idéntico en todos los entornos; los valores de las variables cambian según dónde corre la app.

---

## 11. PR final — mergear `dev` a `main`

`dev` está estable: tiene la Opción 4, el mensaje mejorado de la Opción 2, y el conflicto resuelto. Es el momento de hacer el release a `main`.

### Crear el PR

1. GitHub → **Pull requests** → **New pull request**.
2. **base:** `main` ← **compare:** `dev`.
3. Título: `release: Opción 4 + mejoras Opción 2`.
4. Antes de mergear, revisa la pestaña **Files changed**. Verás todos los cambios que van a entrar en `main` de golpe: la Opción 4, la descripción y mensaje mejorados de la Opción 2, y la resolución del conflicto.
5. **Merge pull request** → **Confirm merge**.

### Actualizar `main` en local

```bash
git switch main
git pull origin main
```

`main` tiene ahora exactamente el mismo estado que `dev`. En un proyecto real, este merge podría disparar un pipeline de CI/CD que construye y despliega la aplicación automáticamente.

---

## 12. Limpiar ramas — buenas prácticas

Cuando una rama se ha mergeado, ya no hace falta mantenerla. Acumular ramas viejas hace que el repositorio sea más difícil de navegar.

GitHub te pregunta automáticamente si quieres borrar la rama después de hacer merge. Haz clic en **Delete branch** para ambas feature branches.

También puedes borrarlas en local:

```bash
git branch -d feature/opcion-4
git branch -d feature/mejorar-opcion2
```

El flag `-d` (delete) solo borra si la rama ya está mergeada. Si intentas borrar algo que no está mergeado, Git te avisa y no lo hace.

Para ver todas las ramas que tienes en local:

```bash
git branch
```

Para ver también las ramas remotas:

```bash
git branch -a
```

---

## 13. Despliegue en GitHub Pages

El merge a `main` ha cerrado el ciclo de desarrollo. Ahora vamos a hacer que la aplicación sea pública en internet, de forma gratuita, usando **GitHub Pages**.

### ¿Qué es GitHub Pages?

GitHub Pages es un servicio de hosting gratuito que ofrece GitHub. Toma los ficheros estáticos de tu repo (HTML, CSS, JS) y los sirve desde una URL pública del tipo:

```
https://<tu-usuario>.github.io/<nombre-del-repo>/
```

No necesitas ningún servidor propio, ni pagar nada.

### ¿Qué es GitHub Actions?

GitHub Actions es el sistema de automatización de GitHub. Permite definir flujos de trabajo (llamados _workflows_) que se ejecutan automáticamente cuando ocurre algo en el repo: un push, un PR, una etiqueta…

Cada workflow es un fichero YAML que vive dentro de la carpeta `.github/workflows/` del proyecto. GitHub lo detecta y lo ejecuta solo.

En nuestro caso vamos a crear un workflow que, cada vez que hagamos push a `main`, construya la app y la publique en GitHub Pages automáticamente.

### Paso 0 — Configurar la ruta base en Vite

Antes de desplegar hay que decirle a Vite dónde va a vivir la app. GitHub Pages la sirve en:

```
https://<tu-usuario>.github.io/<nombre-del-repo>/
```

Vite necesita conocer ese prefijo (`/<nombre-del-repo>/`) para construir correctamente las rutas de todos los assets (JS, CSS, imágenes). Si no se configura, o si el valor no coincide exactamente con el nombre del repo, la app cargará la página HTML pero los assets darán error 404 y la app aparecerá en blanco.

Abre `vite.config.ts` y añade el campo `base`:

```ts
export default defineConfig({
  plugins: [react()],
  base: "/<nombre-de-tu-repo>/",
});
```

Por ejemplo, si tu repo se llama `punto-partida-practica-modulo-git`:

```ts
base: '/punto-partida-practica-modulo-git/',
```

> El valor debe coincidir **exactamente** con el nombre del repo en GitHub, incluyendo las barras al inicio y al final.

### Paso 1 — Activar GitHub Pages en el repo

Antes de crear ningún fichero, hay que decirle a GitHub que este repo va a usar Pages. Si no lo hacemos primero, el workflow fallará porque el entorno de despliegue no existirá todavía.

1. Ve a la pestaña **Settings** de tu repo en GitHub
2. En el menú lateral, haz clic en **Pages**
3. En la sección **"Build and deployment"**, abre el desplegable **Source** y elige **GitHub Actions**

Con esto GitHub sabe que la publicación la va a gestionar un workflow nuestro, no una rama estática.

### Paso 2 — Añadir la variable de entorno en GitHub

Recuerda que el fichero `.env` está en `.gitignore` y nunca llega al servidor. En producción, las variables de entorno se configuran directamente en la plataforma.

1. Ve a **Settings → Secrets and variables → Actions**
2. Haz clic en la pestaña **Variables** (no Secrets, porque esto no es un dato sensible)
3. Crea una nueva variable:

```
Nombre:  VITE_FEATURE_OPCION_3
Valor:   true
```

Cuando el workflow construya la app, leerá esta variable de aquí en lugar de tu `.env` local.

### Paso 3 — Crear el workflow

Ahora sí creamos el fichero que define la automatización. La ruta y el nombre son importantes: GitHub solo detecta workflows dentro de `.github/workflows/`.

Crea el fichero `.github/workflows/deploy.yml` con este contenido:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    env:
      FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version: 24
          cache: "npm"
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
        env:
          VITE_FEATURE_OPCION_3: ${{ vars.VITE_FEATURE_OPCION_3 }}
      - uses: actions/upload-pages-artifact@v4
        with:
          path: dist
      - uses: actions/deploy-pages@v4
        id: deployment
```

> **Advertencias del linter en VS Code:** Al pegar este YAML puede que el IDE muestre dos avisos en amarillo. Son falsos positivos y no afectan al funcionamiento:
>
> - `Value 'github-pages' is not valid` — el nombre es correcto; el linter local no tiene contexto de GitHub y no puede validarlo.
> - `Context access might be invalid: VITE_FEATURE_OPCION_3` — la variable existe en el repo pero el linter no puede verificarla desde tu máquina.

Vamos línea a línea:

- **`name`** — el nombre que aparecerá en la pestaña Actions de GitHub
- **`on: push: branches: [main]`** — se dispara automáticamente al hacer push a `main`
- **`on: workflow_dispatch`** — también se puede lanzar a mano desde la interfaz de GitHub
- **`permissions`** — el token que usa Actions tiene permisos mínimos por defecto; hay que elevarlos explícitamente para poder publicar en Pages
- **`runs-on: ubuntu-latest`** — el workflow corre en un servidor Linux limpio que GitHub monta para cada ejecución
- **`actions/checkout@v6`** — descarga el código del repo en ese servidor
- **`actions/setup-node@v6`** — instala Node.js
- **`npm ci`** — instala las dependencias exactas del `package-lock.json`
- **`npm run build`** con `VITE_FEATURE_OPCION_3: ${{ vars.VITE_FEATURE_OPCION_3 }}`— construye la app inyectando la variable que configuraste en el paso anterior
- **`upload-pages-artifact`** — empaqueta la carpeta `dist/` generada por Vite
- **`deploy-pages`** — publica ese paquete en GitHub Pages

### Paso 4 — Hacer push y ver el despliegue

Añade y sube el fichero:

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add GitHub Pages deploy workflow"
git push origin main
```

Ve a la pestaña **Actions** de tu repo en GitHub. Verás el workflow ejecutándose en tiempo real, paso a paso. Cuando termine, aparecerá la URL pública de la app.

### Paso 5 — Jugar con la feature flag en producción

Ahora viene la parte interesante. Sin tocar el código:

1. Ve a **Settings → Secrets and variables → Actions → Variables**
2. Cambia `VITE_FEATURE_OPCION_3` a `false`
3. Ve a **Actions** → selecciona el último workflow → **Re-run all jobs**

Cuando termine, recarga la URL pública. La Opción 3 habrá desaparecido.

Vuelve a ponerlo a `true` y repite. Aparece de nuevo.

> Esto es exactamente cómo funciona en proyectos reales: el mismo código corre en todos los entornos (desarrollo, staging, producción), pero cada entorno tiene sus propias variables. Activar o desactivar una feature en producción es solo cambiar un valor en el panel de la plataforma, sin tocar el código ni hacer un nuevo despliegue manual.

---
