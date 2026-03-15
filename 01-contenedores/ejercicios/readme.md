# Ejercicios

## 1. Creando imágenes

- Ejecuta un contenedor de `ubuntu`, instala `curl` dentro del mismo.
- ¿Con qué comando podrías preservar el cambio?
- Crea un `Dockerfile` que haga lo mismo. Ejecuta la nueva imagen y verifica que puedes usar `curl`
- ¿Cómo podrías ver las distaintas capas del contenedor?

Para instalar `curl` en `ubuntu` puedes usar:

```bash
apt-get install curl
```

## 2. Limpiando imágenes

Construye tres imágenes distintas:

1. Parte de la imagen base de `alpine` o `ubuntu`. Crea un `Dockerfile` y construye la imagen.
2. En una nueva iteración, instala `curl` y construye la imagen.
3. En la siguiente iteración, instala `wget` y construye la imagen.

- Inspecciona tus imágenes locales ¿Qué ocurre?
- ¿Cómo podemos limpiar el sistema?

## 3. Volumenes persistentes

Ejecuta un contenedor de `postgres` con un volumen manejado por Docker y que monte en `/var/lib/postgresql/data`. Conectate a la base de datos y crea una tabla `items`, que tenga doos campos `id` y `name`, siendo `id` primary key. Inserta un registro en la tabla items.

- Para y elimina el contenedor que has creado.
- Vuelve a ejecutar un nuevo contenedor de `postgres` montando el volumen anterior, en el mismo *path*. Verifica que los datos persisten.

## 4. Bind mounts

Crea un fichero `index.html` en tu máquina local. Ejecuta un contenedor de `nginx` mapeando el puerto 80 a un puerto en tu local, y enlace tu fichero `index.html` local con `/usr/share/nginx/html/index.html`.

- ¿Qué ocurre si editas el fichero local `index.html`?

## 5. Auditando volumenes

- ¿Qué comando deberías usar para averiguar dónde alamacena Docker los datos de un volumen dado?
- Si estás usando Docker Desktop en Windows o macOS que diferencia habría con un Linux en el contexto de dónde están alamacenados los datos.

## 6. Creando redes privadas

- Crea una red tipo `bridge` llamada `my-net`. Eejcuta dos conetenedores de tipo `ubuntu`, asegura que `ping` está disponible, ambos deben correr en la red `my-net`.
- Comprueba que puedes usar `ping` en ambos y se alcazan entre si.

## 7. Red `none`

- ¿Cuáles serían los casos de uso de la red `none`?

## 8. Multi-network

Crea dos redes de tipo bridge `secure-zone` y `public-zone`. Arranca un contenedor en `public-zone`.

- ¿Puedes añadir tu contenedor a `secure-zone`? ¿Qué comado deberías utilizar?
- ¿Cómo puedes verificar en que red se encuentra un contenedor?

## 9. Docker Compose - Compartiendo Volumenes

- Crea un manifiesto para Docker Compose con dos servicios que comparten un mismo volumen.
- Nombra al primer servicio como `writer`, este debe montar el volumen en `/app/logs` y añadir un `timestamp` a un fichero cada 30 segundos.
- Nombra al sergundo servicion como `reader`, debe montar el volumen como solo para lectura, y redireccionar su conetnido a `stdout`.

## 10. Docker Compose - Profiles

- Crea un manifiesto para docker compose con `postgres` y `pgadmin`
- `Pgadmin` debe conectar con `Postgres`. Crea los mecanismo adecuados para aegurar que la comunicación entre ambos servicios es posible.
- Crea dos perfiles, uno para levantar ambos servicios y otro para levanatr sólo `Postgres` 