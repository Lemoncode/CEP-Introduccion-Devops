# Volumes

Los contenedores son efímeros, los volumes no

- Bind mount - Enlazamos una carpeta del host dentro del contenedor
- Volume - Directorio gestionado por docker que podemos montar dentro de un contenedor

Vamos a crear un ejemplo con una base de datos e inicializarla. Para ello creamos 

`init-db/setup.sql`

```sql
-- Create the table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed the database
INSERT INTO users (name, email) VALUES 
('Alice Smith', 'alice@example.com'),
('Bob Jones', 'bob@example.com'),
('Charlie Brown', 'charlie@example.com');
```

Para almacenar los datos entre pausas y arranques de nuestra base de datos contenedor, vamos a crear un volumne:

```bash
docker volume create pg_volume
```

Ahora podemos crear un contenedor:

```bash
docker run -d \
  --name postgres_db \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=secretpassword \
  -e POSTGRES_DB=myapp_db \
  -p 5432:5432 \
  -v pg_volume:/var/lib/postgresql/data \
  -v $(pwd)/init-db:/docker-entrypoint-initdb.d \
  --restart always \
  postgres:16
```

Inspeccionemos el contenedor para ver si hemos tenido exito:

```bash
docker exec -it postgres_db psql -U admin -d myapp_db
```

```psql
SELECT * FROM users;
INSERT INTO users (name, email) VALUES ('Lau Sal', 'lau@example.com');
\q
```

Ahora si 'eliminamos' el contenedor 

```bash
docker kill postgres_db && docker rm postgres_db
```

Y volvemos a recrearlo

```bash
docker run -d \
  --name postgres_db \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=secretpassword \
  -e POSTGRES_DB=myapp_db \
  -p 5432:5432 \
  -v pg_volume:/var/lib/postgresql/data \
  -v $(pwd)/init-db:/docker-entrypoint-initdb.d \
  --restart always \
  postgres:16
```

Y nos volvemos a conectar:

```bash
docker exec -it postgres_db psql -U admin -d myapp_db
```

Notar que la base de datos no se ha vuleto inicializar, ya que ya estaba inicializad, en el 'volume' que hemos montado en el contenedor.

Para limpiar todo:

```bash
docker rm -f postgres_db
```

```bash
docker volume rm pg_volume
```