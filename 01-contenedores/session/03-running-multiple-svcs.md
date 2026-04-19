# Running Multiple Services

Vamos a construir sistemas que dependan de una infraestructura externa. Para ello vamos a comenza por crear una nueva imagen:

Copiar `app_kpi_api`

```Dockerfile
FROM python:3.12-slim

WORKDIR /opt

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

COPY ./app_kpi_api/app/__init__.py ./app_kpi_api/app/config.py ./app_kpi_api/app/database.py ./app_kpi_api/app/main.py ./app/
COPY ./app_kpi_api/app/adapters ./app/adapters
COPY ./app_kpi_api/app/domain ./app/domain
COPY ./app_kpi_api/app/ports ./app/ports
COPY ./app_kpi_api/app/routers ./app/routers
COPY ./app_kpi_api/pyproject.toml ./app_kpi_api/uv.lock ./ 

RUN uv sync --frozen --no-cache --no-dev

CMD ["/opt/app/.venv/bin/fastapi", "run", "app/main.py", "--port", "8081", "--host", "0.0.0.0"]

```

```bash
docker build -f build/Dockerfile.app_kpi -t app-kpi:v1.0.0 .
```

Nuestra aplicación depende de un S3 remoto, para poderla ejecutar debemos alimentar una serie de variables de entorno:

```bash
docker run -d -p 8081:8081 \
  -e AWS_ACCESS_KEY_ID="<YOUR_AWS_ACCES_KEY_ID>" \
  -e AWS_SECRET_ACCESS_KEY="<YOUR_AWS_SECRET_ACCESS_KEY>" \
  -e AWS_REGION="eu-west-3" \
  -e S3_DATA_PATH="s3://lemoncode-non-political-map-1/kpi.parquet" \
  app-kpi:v1.0.0
```

Podemos visitar ahora `http://localhost:8081/docs` y ejecutar para comprobar que funciona como esperamos. El problema de esta aproximación es que debemos utilizar un sistema externa. Estaría bien tener un entorno de desarrollo en local, para ello podemos emular los servicios de S3 de distintas formas, en este caso vamos a usar MinIO:

Crear `build/minio.env`

```ini
MINIO_ROOT_USER=lemonuser
MINIO_ROOT_PASSWORD=lemoncode
BUCKET_NAME=kpis-bucket
ACCESS_KEY=MOCK_ACCESS_KEY
SECRET_KEY=mock+secretkey

```

Crear `build/data` 
Crear `build/kpis` -> Copiar `s3_crud/kpi.parquet`

Crear `build/docker-compose.yaml`

```yaml
services:

  s3service:
    image: quay.io/minio/minio:latest
    command: server --console-address ":9001" /data
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
    - ./data:/data
    networks:
    - s3net
    env_file: minio.env
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:9000/minio/health/ready || exit"]
      interval: 5s
      retries: 5
      start_period: 10s
      timeout: 5s

  initialize-s3service:
    image: quay.io/minio/mc
    depends_on:
      s3service:
        condition: service_healthy
    entrypoint: >
      /bin/sh -c '
      mc alias set s3service http://s3service:9000 "$${MINIO_ROOT_USER}" "$${MINIO_ROOT_PASSWORD}";
      mc mb s3service/"$${BUCKET_NAME}";
      mc cp --recursive /documents/ s3service/"$${BUCKET_NAME}"/;
      mc admin user add s3service "$${ACCESS_KEY}" "$${SECRET_KEY}";
      mc admin policy attach s3service readwrite --user "$${ACCESS_KEY}";
      exit 0;
      '
    volumes:
    - ./kpis:/documents
    networks:
    - s3net
    env_file: minio.env

networks:
  s3net:
```

Para levantar los servicios anteriores ejecutamos:

```bash
docker compose up
```

> NOTA: Si no queremos la salida del output del log, podemos ejecutar con `-d`

Ahora podedmos visitar `http:localhost:9001` (lemonuser/lemoncode) e inspeccionar el 'bucket' creado.

Ejecutamos nuestra aplicación:

```bash
uv run fastapi dev
```

Visitamos `http://localhost:8081/docs` y comprobamos que todo funciona.

Notar que para local, tenemos el siguiente `.env`

```ini
AWS_ACCESS_KEY_ID=MOCK_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=mock+secretkey
AWS_REGION=eu-west-3
SECRET_ENDPOINT=host.docker.internal:9000
S3_DATA_PATH=s3://kpis-bucket/kpi.parquet
USE_LOCAL_S3=True
```

> Explicar como funciona

Esto esta bien pero puede que quiera integrar `app_kpi_api` como endpoint para otros desarrollos ¿podemos hacerlo? Si vamos a crear un nuevo docker compose para ello:

Crear `docker-compose.kpis.yaml`

```yaml
services:
# diff #
  appKPI:
    image: local/app-kpi
    depends_on:
      s3service:
        condition: service_healthy
    build:
      context: ../
      dockerfile: ./build/Dockerfile.app_kpi
    environment:
      - AWS_ACCESS_KEY_ID=MOCK_ACCESS_KEY
      - AWS_SECRET_ACCESS_KEY=mock+secretkey
      - AWS_REGION=eu-west-3
      - SECRET_ENDPOINT=s3service:9000
      - S3_DATA_PATH=s3://kpis-bucket/kpi.parquet
      - USE_LOCAL_S3=True
    ports:
      - "8081:8081"
    networks:
    - s3net
# diff #    
  s3service:
    image: quay.io/minio/minio:latest
    command: server --console-address ":9001" /data
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
    - ./data:/data
    networks:
    - s3net
    env_file: minio.env
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:9000/minio/health/ready || exit"]
      interval: 5s
      retries: 5
      start_period: 10s
      timeout: 5s

  initialize-s3service:
    image: quay.io/minio/mc
    depends_on:
      s3service:
        condition: service_healthy
    entrypoint: >
      /bin/sh -c '
      mc alias set s3service http://s3service:9000 "$${MINIO_ROOT_USER}" "$${MINIO_ROOT_PASSWORD}";
      mc mb s3service/"$${BUCKET_NAME}";
      mc cp --recursive /documents/ s3service/"$${BUCKET_NAME}"/;
      mc admin user add s3service "$${ACCESS_KEY}" "$${SECRET_KEY}";
      mc admin policy attach s3service readwrite --user "$${ACCESS_KEY}";
      exit 0;
      '
    volumes:
    - ./kpis:/documents
    networks:
    - s3net
    env_file: minio.env

networks:
  s3net:

```

```bash
docker compose -f docker-compose.kpis.yaml up
```

Notar que ahora podemos quitar el mapeo del puerto `9000`, en el servicio `s3service`. 

Para seguir avanzando en nuetsras posibilidades de nuestra forma de trabajo, podemos usar `profiles`. Los profiles, permiten arrancar servicios dentro del docker compose de forma selectiva. Esto nos permite tener entornos flexibles.

```bash
docker compose -f docker-compose.kpis.yaml down
```

Actualizar `docker-compose.kpis.yaml`

```diff
services:

  appKPI:
    image: local/app-kpi
+   profiles: [private]
    depends_on:
....
```

Si volvemos a ejecutar, podemos constatar que `appKpi` no se levanta ahora

```bash
docker compose -f docker-compose.kpis.yaml up
```

Paremos el servicio;

```bash
docker compose -f docker-compose.kpis.yaml down
```

Y arranquemos de nuevo pero esta vez utilizando `profiles`:

```bash
docker compose -f docker-compose.kpis.yaml --profile private up
```

Por último limpiamos nuestro entorno:

```bash
docker compose -f docker-compose.kpis.yaml --profile private down
```

## References

- https://github.com/JaimeSalas/non-political-map
