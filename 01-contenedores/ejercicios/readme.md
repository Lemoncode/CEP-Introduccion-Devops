# Laboratorio Docker

Este laboratorio tiene como objetivo practicar los conceptos básicos de
Docker:

- Imágenes
- Contenedores
- Capas
- Volúmenes
- Redes
- Docker Compose

---

# Entrega del laboratorio

Este laboratorio debe entregarse mediante un **repositorio público en
GitHub**.

El repositorio debe contener un fichero:

    README.md

En este fichero deberás documentar:

- Los pasos que has realizado
- Los comandos utilizados
- Una breve explicación de cada paso
- Las respuestas a las preguntas del laboratorio

El objetivo es que cualquier persona pueda **seguir tu documentación y
reproducir el laboratorio**.

Ejemplo de entrega:

    https://github.com/usuario/docker-lab

---

# Criterios de evaluación

El laboratorio se divide en:

- **Parte obligatoria (necesaria para aprobar)**
- **Parte opcional (para subir nota)**

---

## Parte obligatoria (mínimo para aprobar)

Debes completar correctamente los siguientes ejercicios:

- Ejercicio 1 --- Creando imágenes
- Ejercicio 3 --- Volúmenes persistentes
- Ejercicio 4 --- Bind mounts
- Ejercicio 6 --- Redes privadas
- Ejercicio 9 --- Docker Compose

Si estos ejercicios **no funcionan o no están documentados**, el
laboratorio **no se considerará aprobado**.

---

## Parte opcional (para subir nota)

Estos ejercicios son **muy sencillos** y sirven para mejorar la nota.

Puedes hacer uno o varios.

- Ejercicio 2 --- Limpieza de imágenes
- Ejercicio 5 --- Ver información de un volumen
- Ejercicio 7 --- Investigar la red `none`
- Ejercicio 8 --- Conectar un contenedor a dos redes

También puedes hacer una pequeña mejora en Docker Compose.

### Bonus sencillo

Añade un servicio `nginx` a tu `docker-compose.yml`.

Debe:

- usar la imagen `nginx`
- exponer el puerto `8080`
- mostrar una página simple

Ejemplo `index.html`:

```html
<h1>Laboratorio Docker funcionando</h1>
```

Si al abrir:

    http://localhost:8080

aparece la página, el bonus estará completado.

---

# 1. Creando imágenes

## Paso 1

Ejecuta un contenedor basado en la imagen:

    ubuntu

Accede a la terminal del contenedor.

Instala `curl`:

```bash
apt-get update
apt-get install curl
```

Comprueba que funciona:

```bash
curl --version
```

---

## Pregunta

¿Con qué comando podrías **guardar los cambios del contenedor como una
nueva imagen**?

---

## Paso 2 --- Dockerfile

Crea un `Dockerfile` que haga lo mismo automáticamente.

Ejemplo:

```dockerfile
FROM ubuntu

RUN apt-get update && apt-get install -y curl
```

Construye la imagen y ejecuta un contenedor.

Comprueba que `curl` está instalado.

---

## Pregunta

¿Qué comando permite ver las **capas de una imagen Docker**?

---

# 2. Limpiando imágenes (opcional)

Crea un `Dockerfile` basado en:

    ubuntu

Construye la imagen.

Después modifica el Dockerfile para instalar:

- `curl`
- después `wget`

Construye la imagen en cada cambio.

Lista las imágenes:

```bash
docker images
```

Pregunta:

¿Qué ocurre con las imágenes anteriores?

---

# 3. Volúmenes persistentes

Ejecuta un contenedor de:

    postgres:17

Usa un volumen Docker montado en:

    /var/lib/postgresql/data

Si ejecutas una opción de postgres a partir de la 18, usa un volumen Docker montado en:

    /var/lib/postgresql
---

## Crear tabla

Conéctate a la base de datos.

Crea la tabla:

```sql
CREATE TABLE items (
 id SERIAL PRIMARY KEY,
 name TEXT
);
```

Inserta un registro:

```sql
INSERT INTO items(name) VALUES ('item1');
```

---

## Comprobación

1.  Para el contenedor
2.  Elimina el contenedor
3.  Crea un nuevo contenedor usando **el mismo volumen**

Comprueba que los datos siguen existiendo.

---

# 4. Bind mounts

Crea un archivo en tu máquina:

    index.html

Ejemplo:

```html
<h1>Hola Docker</h1>
```

---

Ejecuta un contenedor `nginx`:

- mapea el puerto `80`
- monta el archivo en:

```{=html}
<!-- -->
```

    /usr/share/nginx/html/index.html

Abre el navegador.

---

Pregunta:

¿Qué ocurre si modificas el archivo `index.html` en tu máquina?

---

# 5. Auditando volúmenes (opcional)

Investiga:

¿Qué comando permite ver **dónde guarda Docker los datos de un
volumen**?

---

# 6. Creando redes privadas

Crea una red llamada:

    my-net

---

Arranca dos contenedores `ubuntu` en esa red.

Instala `ping` si es necesario.

Desde un contenedor intenta hacer:

```bash
ping otro_contenedor
```

---

Pregunta

¿Los contenedores pueden comunicarse entre sí?

---

# 7. Red none (opcional)

Investiga:

¿Para qué serviría ejecutar un contenedor con red:

    none

---

# 8. Multi-network (opcional)

Crea dos redes:

    secure-zone
    public-zone

Arranca un contenedor en `public-zone`.

Pregunta:

¿Puedes conectarlo también a `secure-zone`?

¿Qué comando usarías?

---

# 9. Docker Compose --- Compartiendo volúmenes

Crea un fichero:

    docker-compose.yml

Con dos servicios.

---

## writer

Debe:

- montar un volumen en `/app/logs`
- escribir un timestamp cada 30 segundos

---

## reader

Debe:

- montar el volumen en modo solo lectura
- mostrar el contenido en consola

---

# 10. Docker Compose Profiles (opcional)

Crea un `docker-compose.yml` con:

- `postgres`
- `pgadmin`

Haz que `pgadmin` pueda conectarse a `postgres`.

---

Crea dos perfiles:

### Perfil completo

Levanta:

- postgres
- pgadmin

### Perfil base

Levanta solo:

- postgres

---

# Resumen evaluación

Nivel Requisitos

---

Aprobado Parte obligatoria completa
Notable Parte obligatoria + ejercicios opcionales
Sobresaliente Parte obligatoria + opcionales + bonus
