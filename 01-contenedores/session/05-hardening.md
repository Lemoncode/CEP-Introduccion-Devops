Inspeccionamos el sistema

```bash
docker system df
```

```bash
# Check available options
docker system --help

docker system prune --help
```

```bash
# Removing dangling images
docker image prune
```

```bash
docker buildx prune -f
```

## Referencias

- https://depot.dev/blog/docker-clear-cache
