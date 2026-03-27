# Enunciado: Automatización CI/CD con Jenkinsfile sobre el proyecto backend

El objetivo de este ejercicio es definir un flujo CI/CD para una aplicación Node.js aplicando buenas prácticas. Para ello:

- Se utilizará el código fuente ubicado en el directorio backend. Este contenido deberá subirse a un repositorio público de GitHub, de modo que Jenkins pueda acceder a él mediante su URL HTTP.
- Se creará un fichero Jenkinsfile en el repositorio, donde se definirá el flujo de CI/CD.
- El objetivo final es crear en Jenkins un proyecto MultiBranch que utilice como origen el repositorio de GitHub creado.

El Jenkinsfile debe cubrir los siguientes requisitos:

## Parte obligatoria

1. **Opciones del Job**
   - El job debe estar configurado mediante la directiva `options` con los siguientes elementos:
     - Deshabilitar builds concurrentes.
     - Mostrar marcas de tiempo.
     - Timeout de 5 minutos.

2. **Variables de entorno**
   - El job debe definir las siguientes variables de entorno que heredarán todas las etapas:
     - `FORCE_COLOR`: Tendrá el valor numérico `0`.
     - `NO_COLOR`: Tendrá el valor booleano `true`.

3. **Auditoría de herramientas**
   - Incluye una etapa "Audit tools" que imprima por pantalla la versión de node con `node --version`.

4. **Instalación de dependencias**
   - Incluye una etapa "Install dependencies" que instale las dependencias del proyecto con `npm install`.

5. **Chequeo de formato de código**
   - Incluye una etapa "Format check" que verifique el formato del código usando `npm run format:check`.

6. **Chequeo de calidad de código**
   - Incluye una etapa "Code quality" que verifique la calidad del código usando `npm run lint`.

7. **Chequeo de tipos**
   - Implementa una etapa "Type check" que ejecute la comprobación de tipos con `npm run type-check`.

8. **Ejecución de tests**
   - Implementa una etapa "Tests" que ejecute los tests usando `npm run test`.

9. **Construcción y archivado**
   - Implementa una etapa "Build" que construya la solución usando `npm run build`.
   - Esta etapa deberá de archivar los artefactos del directorio `dist/`. El _fingerprint_ deberá estar activo.
   - Verifica que los artefactos son visibles. Deberás de ver dentro del job el archivo `server.mjs`.

10. **Etapas finales**
    - Configura que cuando el job finalice exitosamente muestre por pantalla: `'Pipeline completed successfully!'`.
    - Configura que cuando el job finalice con errores muestre por pantalla: `'Pipeline failed. Review logs.'`.
    - Configura que cuando el job finalice, sin importar cómo, siempre limpie el workspace.

## Parte opcional

1. **Ejecución de tests con cobertura**
   - En este paso tendrás que tener instalado el plugin `HTML Publisher Plugin` previamente.
   - Modifica la etapa de "Tests" para ejecutar los tests de cobertura. Reemplaza el comando usado para ejecutar los tests por `npm run test:coverage`.
   - Publica los resultados usando la directiva `publishHTML()`. Revisa la configuración para añadir las siguientes opciones:
     - El directorio de los resultados es `'coverage'`.
     - El fichero de reporte es `'index.html'`.
     - El nombre de los reportes será `"Coverage Report"`.
     - Archiva los reportes de todas las ejecuciones exitosas, no sólo la última (Keep all).
     - Activa el reporte de la última ejecución en la raíz de la rama (Link to last build).
     - Permite que no falle en caso de que no se encuentren los ficheros (Allow missing).
   - Ejecuta el job y comprueba dentro de su ejecución al terminar que puedes acceder a una opción a la izquierda llamada `Coverage Report` y ver el reporte de cobertura.

2. **Opciones del Job extra**
   - Añade una opción para que sólo mantenga el historial de las últimas 10 ejecuciones.

3. **Linting paralelo**
   - Ejecuta las etapas de "Format check" y "Code quality" en paralelo. Para ello crea una etapa que las contenga llamada "Linting". De esta manera tendremos:
     ```
            Install
         dependencies           Linting          Type check
      ─────────◯───────────┬────────◯───────┬─────────◯────── ...
                           │                │
                           │  Format Check  │
                           ├────────◯───────┤
                           │                │
                           ╰────────◯───────╯
     ```

4. **Code quality permisivo**
   - Modifica la etapa "Code Quality" para que marque la build como `'UNSTABLE'` en caso de fallar el comando y no termine la ejecución del job. Para ello:
     - Usa la directiva `warnError()` con el mensaje `'No se superaron los chequeos de calidad de código.'`.
     - A continuación mediante un bloque `script`:
       - Asigna al resultado de la build `currentBuild.result` el valor `'UNSTABLE'`.
       - Asigna a la descripción de la build `currentBuild.description` el valor `'UNSTABLE: Code quality'`.
   - Para probar que funciona puedes cambiar dentro del proyecto, en el fichero `src/server.ts`, el texto `const app` por `let app`. Recuerda hacer commit y push antes de volver a lanzar un job.
   - Si todo ha ido bien:
     - Al lanzar una build terminará como UNSTABLE y permitirá ejecutar los pasos de "Type check", "Tests" y "Build".
     - En el listado de jobs ejecutados de la rama aparecerá de color amarillo y debajo el texto `UNSTABLE: Code quality`.

5. **Pruebas end-to-end (E2E) con Docker Compose**
   - Esta etapa definirá también una variable de entorno `TEST_MODE` con el valor `"e2e"`.
   - Implementa una etapa "E2E Tests" que ejecute los tests end-to-end usando el comando `'docker compose -f compose.e2e.yml run tests'`.
   - Configura esta etapa para que cuando finalice, sin importar cómo, limpie los servicios levantados con `'docker compose -f compose.e2e.yml down -v --remove-orphans || true'`.

6. **Construcción y publicación de imagen Docker (avanzado)**
   - En este paso tendrás que tener instalado el plugin `Docker Pipeline` previamente.
   - Crea una credencial dentro del proyecto (Folder) de tipo usuario/contraseña con tus credenciales de DockerHub.
   - Crea en DockerHub con tu usuario un repositorio público llamado `cep-devops-backend`.
   - Crea una etapa "Publish" que sólo se ejecutará cuando el nombre de la rama (branch) sea `"main"` y cuando el resultado de la expresión `currentBuild.result` sea `null` o sea `'SUCCESS'`.
   - Define las siguientes variables de entorno dentro de esta etapa:
     - `APP_VERSION`: Obtenido de ejecutar el script `"npm pkg get version | tr -d '\"'"`. Recuerda usar `returnToStdout: true`. Aplica la función `.trim()` tras ejecutar el script en la directiva `sh()`. Ejemplo: `sh(...).trim()`.
     - `APP_BUILD_VERSION`: Tendrá el valor concatenar la variable de entorno `APP_VERSION` y la variable de entorno `BUILD_NUMBER` con el carácter `-`. Ejemplo de resultado: `1.0.0-13`.
     - `DOCKER_HUB_REPO`: Tendrá el valor de tu `<usuario>/<repositorio>` de DockerHub. Ejemplo: `crsanti/cep-devops-backend`.
   - Utiliza dentro de un bloque `script` la directiva `withDockerRegistry()` con los parámetros `url: ''` y el id de tus credencial de DockerHub creado anteriormente. Este script hará lo siguiente:
     - Define una variable `image` con el valor resultante de ejecutar `docker.build("${DOCKER_HUB_REPO}")`.
     - Haz un push de la imagen con el tag `"latest"` ejecutando `image.push("nombre-del-tag")`.
     - Haz un push de la imagen con el tag obtenido de la variable `APP_BUILD_VERSION` ejecutando `image.push("usa-la-variable")`.
     - Comprueba en tu repositorio de DockerHub que ahora tienes dos imágenes de docker.
