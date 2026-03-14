# Ejercicios GitHub Actions

## Obligatorios

### 1. Crea un workflow CI para el proyecto de frontend

En la clase hemos estado trabajando con el proyecto de la [API](./code/hangman-api/), pero en este ejercicio trabajarás sobre el proyecto de [frontend](./code/hangman-front/).

Debes crear un nuevo workflow que se dispare cuando haya cambios en el proyecto `hangman-front` y exista una nueva pull request (deben darse las dos condiciones a la vez). El workflow ejecutará las siguientes operaciones:

- Build del proyecto
- Ejecución de los test unitarios

> Nota: muy parecido a la primera demo, pero en este caso sobre el proyecto del frontend

### 2. Crea un workflow CD para el proyecto de frontend

Crea un nuevo workflow que se dispare manualmente y haga lo siguiente:

- Crear una nueva imagen de Docker
- Publicar dicha imagen en el [container registry de GitHub](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)

> Nota: intenta usar las actions de Docker vistas en clase

## Opcional

### 3. Crea un workflow que ejecute tests e2e

Crea un workflow que se lance de la manera que elijas y ejecute los tests e2e que encontrarás en [este enlace](https://github.com/Lemoncode/bootcamp-devops-lemoncode/tree/master/03-cd/03-github-actions/.start-code/hangman-e2e/e2e). Puedes usar [Docker Compose](https://docs.docker.com/compose/gettingstarted/) o [Cypress action](https://github.com/cypress-io/github-action) para ejecutar los tests.
