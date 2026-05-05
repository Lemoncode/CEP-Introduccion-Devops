# Agenda

## Set up

```bash
minikube start
```

```bash
kubectl get pods
```

```bash
kubectl run --help | less
```

## Pushing Local Image into Minikube 


```bash
eval $(minikube docker-env)
```

## References

- https://minikube.sigs.k8s.io/docs/handbook/pushing/#1-pushing-directly-to-the-in-cluster-docker-daemon-docker-env

