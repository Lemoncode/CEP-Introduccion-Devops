# Building Images

## Simple Builds

1. Copiar y pegar el código de `app_map`
2. Crear `build/Dockerfile.app_map`

```Dockerfile
FROM python:3.14

WORKDIR /app

COPY ./app_map/requirements.txt ./requirements.txt

RUN pip install --no-cache-dir --upgrade -r requirements.txt

COPY ./app_map/main.py .
COPY ./app_map/__init__.py .
COPY ./app_map/api ./api
COPY ./app_map/schemas ./schemas
COPY ./app_map/statics ./statics

CMD ["fastapi", "run", "main.py", "--port", "4000"]
```

3. Construimos la imagen, desde el raíz ejecutamos:

```bash
docker build -f build/Dockerfile.app_map -t app-map-local .
```

4. Comprobamos que la imagen construida, se ejecuta como esperamos

```bash
docker run -d -p 4000:4000 app-map-local
```

```bash
docker ps
```

```bash
curl http://localhost:4000/api/items/
```

5. Mejorar el peso de la imagen

Update `build/Dockerfile.app_map`

```Dockerfile
# 1. Use the 'slim' variant for a significantly smaller base (~120MB vs ~900MB)
FROM python:3.14-slim

WORKDIR /app

# 2. Combine COPY and RUN to reduce layers
# Only copy requirements first to leverage Docker cache
COPY ./app_map/requirements.txt .

# 3. Optimize PIP: --no-cache-dir is great, adding --user or installing to a specific path 
# can help, but 'slim' + 'no-cache' is the primary weight saver.
RUN pip install --no-cache-dir -r requirements.txt

# 4. Copy all files in one command if possible, or group them 
# to reduce the number of layers in the image filesystem.
COPY ./app_map/main.py ./app_map/__init__.py ./
COPY ./app_map/api ./api
COPY ./app_map/schemas ./schemas
COPY ./app_map/statics ./statics

# 5. Optional: Remove unnecessary files (like __pycache__) if they exist
RUN find . -type d -name "__pycache__" -exec rm -rf {} +

CMD ["fastapi", "run", "main.py", "--port", "4000"]
```

6. Comprobamos que nuestro funciona después del refactor

```bash
docker build -f build/Dockerfile.app_map -t app-map-local:v1.0.0 .
```

```bash
# Quitamos el contenedor anterior
docker ps

docker kill <container ID>

docker rm <container ID>
```


```bash
docker run -d -p 4000:4000 app-map-local:v1.0.0
```

```bash
docker ps
```

```bash
curl http://localhost:4000/api/items/
```

## Multistage Builds

Copiar `app_frontend`

`app_map` está preparada para servir ficheros estáticos, para ello debemos volcar en la carpeta de `statics` la 'build' del front.

> Issue: https://github.com/moby/moby/issues/33923

```Dockerfile
FROM node:24-slim AS app_frontend

WORKDIR /opt

COPY ./app_frontend .

RUN npm ci 

RUN  npm run build

FROM python:3.14 AS app

WORKDIR /app

COPY ./app_map/requirements.txt ./requirements.txt

RUN pip install --no-cache-dir --upgrade -r requirements.txt

COPY ./app_map/main.py .
COPY ./app_map/__init__.py .
COPY ./app_map/api ./api
COPY ./app_map/schemas ./schemas
COPY --from=app_frontend ./opt/dist ./statics

RUN find . -type d -name "__pycache__" -exec rm -rf {} +

CMD ["fastapi", "run", "main.py", "--port", "4000"]

```

```bash
docker build -f build/Dockerfile.app_map_stats -t app-map-stats-local:v1.0.0 .
```

```bash
docker run -d -p 4000:4000 app-map-stats-local:v1.0.0
```

## References

- https://github.com/JaimeSalas/non-political-map
- https://docs.docker.com/build/building/multi-stage/