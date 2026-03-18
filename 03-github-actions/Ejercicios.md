# Laboratorio GitHub Actions

En este laboratorio practicarás conceptos básicos de **CI/CD con GitHub Actions**.

Trabajarás sobre el proyecto **Hangman** utilizado en clase.

En los ejercicios propuestos tendrás que crear workflows para:

- Hacer la build de un proyecto
- Ejecutar tests unitarios
- Construir imágenes Docker
- Publicar imágenes Docker en un registry
- Ejecutar tests end‑to‑end

## Entrega del laboratorio

Este laboratorio debe entregarse mediante un **repositorio público en GitHub**.

El repositorio debe contener:

```
.github/workflows/
<el código fuente proporcionado>
README.md
```

En el `README.md` deberás documentar los workflows entregados:

- Qué eventos disparan cada workflow.
- Los pasos que lo componen.
- Las actions usadas.
- Cualquier comentario adicional que consideres oportuno.

El objetivo es que cualquier persona pueda **entender los workflows**.

Ejemplo de entrega:

```
https://github.com/usuario/github-actions-lab
```

## Criterios de evaluación

El laboratorio se divide en:

- **Parte obligatoria (necesaria para aprobar)**
- **Parte opcional (para subir nota)**

### Parte obligatoria (mínimo para aprobar)

Debes completar correctamente los siguientes ejercicios:

- Ejercicio 1 --- Workflow CI
- Ejercicio 2 --- Workflow CD

Si los workflows **no funcionan**, el laboratorio **no se considerará aprobado**.

### Parte opcional (para subir nota)

Puedes realizar el ejercicio adicional:

- Ejercicio 3 --- Workflow de tests end‑to‑end

## 1. Workflow CI para el proyecto de frontend

En la clase hemos estado trabajando con el proyecto de la [API](./code/hangman-api/), pero en este ejercicio trabajarás sobre el proyecto de [frontend](./code/hangman-front/).

Debes crear un nuevo workflow que se dispare cuando haya cambios en el proyecto `hangman-front` y exista una nueva pull request (deben darse las dos condiciones a la vez). El workflow ejecutará las siguientes operaciones:

- Build del proyecto
- Ejecución de los test unitarios

> Nota: muy parecido a la primera demo, pero en este caso sobre el proyecto del frontend

## 2. Workflow CD para el proyecto de frontend

Crea un nuevo workflow que se dispare manualmente y haga lo siguiente:

- Crear una nueva imagen de Docker
- Publicar dicha imagen en el [container registry de GitHub](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)

> Nota: intenta usar las actions de Docker vistas en clase

## 3. Workflow para ejecutar tests E2E (opcional)

Crea un workflow que se lance de la manera que elijas y ejecute los tests e2e que encontrarás en [este enlace](https://github.com/Lemoncode/bootcamp-devops-lemoncode/tree/master/03-cd/03-github-actions/.start-code/hangman-e2e/e2e). Puedes usar [Docker Compose](https://docs.docker.com/compose/gettingstarted/) o [Cypress action](https://github.com/cypress-io/github-action) para ejecutar los tests.

## Resumen de evaluación

| Nivel         | Requisitos                                                                                 |
|---------------|--------------------------------------------------------------------------------------------|
| Aprobado      | Workflows CI y CD funcionando                                                              |
| Notable       | Todos los workflows funcionando o los workflows de CI y CD funcionando y bien documentados |
| Sobresaliente | Todos los workflows funcionando y bien documentados                                        |
