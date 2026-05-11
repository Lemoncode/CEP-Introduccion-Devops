# Agenda

## Intro

En la sesión de hoy vamos a emular con Docker el desarrollo de una aplicación sencilla. Para ello, primero debemos de tener en cuenta un set de comandos de Docker que nos ayude con esta tarea.

## Command Glossary

### Docker

Imágenes

```bash
docker image ls
```

Corriendo contenedores

```bash
# Run isolated container
docker run -d nginx

# Run isolated container interactive way
docker run -it nginx sh

# Run isolated container forwarding port
docker run -d -p 8080:80 nginx
```

Inspeccionando contenedores

```bash
# Running containers
docker ps

# Stppoed/Running containers
docker ps -aq

# Debbuging containers
docker exec -it <container identifier> sh
```

Limpiando nuestro entorno

```bash
# Removing stopped containers
docker rm $(docker ps -aq)
```

Accediendo servicios en el host desde el container:

- `host.docker.internal`
- net host

### Compose

```bash
# Start up services
docker compose up

# Start up services by profile
docker compose --profile <profile name> up
```

```bash
# Stop services
docker compose down

# Start up services by profile
docker compose --profile <profile name> down
```

## Construyendo imágenes

```bash
docker build -t myimage:tag .
```