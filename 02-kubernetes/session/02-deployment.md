# Deployment

## Creating the Deployment

Creamos la imagen dentro de `minikube`

```bash
eval $(minikube docker-env)

```

```bash
docker image ls
```

```
                                                                                                                                                                                                        i Info →   U  In Use
IMAGE                                             ID             DISK USAGE   CONTENT SIZE   EXTRA
gcr.io/k8s-minikube/storage-provisioner:v5        ba04bb24b957         29MB             0B    U   
registry.k8s.io/coredns/coredns:v1.13.1           e08f4d9d2e6e       73.4MB             0B    U   
registry.k8s.io/etcd:3.6.6-0                      271e49a0ebc5       59.8MB             0B    U   
registry.k8s.io/kube-apiserver:v1.35.1            7459ea001763       83.9MB             0B    U   
registry.k8s.io/kube-controller-manager:v1.35.1   464c974e702e       71.1MB             0B    U   
registry.k8s.io/kube-proxy:v1.35.1                2d611d040292       72.5MB             0B    U   
registry.k8s.io/kube-scheduler:v1.35.1            4cad4f996631       48.7MB             0B    U   
registry.k8s.io/pause:3.10.1                      d7b100cd9a77        514kB             0B    U   
```
 

Creamos la imagen que vamos a consumir:

```bash
docker build -f build/Dockerfile.app_map_stats -t local-k8s-map-stats:v1 .

```

Ahora podemos crear el `Deployment` de distintas formas, completamente desde la CLI con:

```bash
# Create Deployment from CLI
kubectl create deployment ....

# Expose Deployment from CLI
kubectl expose deployment ....
```

Nosotros vamos a tomar una aproximación diferente:

```bash
kubectl create deployment app-map-dep --image=local-k8s-map-stats:v1 --dry-run=client -o yaml > k8s/app-map.deployment.yaml
```

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: app-map-dep
  name: app-map-dep
spec:
  replicas: 1
  selector:
    matchLabels:
      app: app-map-dep
  strategy: {}
  template:
    metadata:
      labels:
        app: app-map-dep
    spec:
      containers:
      - image: local-k8s-map-stats:v1
        name: local-k8s-map-stats
        resources: {}
status: {}
```

Vamos a introducir unos cuantos cambios:

```diff
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: app-map-dep
  name: app-map-dep
spec:
- replicas: 1
+ replicas: 2
  selector:
    matchLabels:
      app: app-map-dep
- strategy: {}
  template:
    metadata:
      labels:
        app: app-map-dep
    spec:
      containers:
      - image: local-k8s-map-stats:v1
        name: local-k8s-map-stats
+       imagePullPolicy: Never
-        resources: {}
-  status: {}

```

Ahora podemos aplicar el deployment utilizando:

```bash
kubectl apply -f ./k8s/app-map.deployment.yaml
```

Para comprobar si nuestro Deployment ha desplegado con exito podemos ejecutar:

```bash
kubectl get deployment

kubectl get deployment app-map-dep -o wide

kubectl describe deployment app-map-dep

kubectl get pods -l app=app-map-dep -o wide
```

De aquí podemos extraer las IPs que han sido asigandas a nuestros PODs. Para comprobar que la aplicación funciona como espera, podemos ejecutar un 'naked' pod para tal fin.

> COPIAMOS LA IP DE CUALQUIERA DE LOS DOS PODS ANTERIORES

```bash
kubectl run -i -t busybox --image=busybox --restart=Never
```

```bash
wget -qO- 10.244.0.4:4000/api/items/
```

```bash
kubectl get pods
```

```
busybox                        0/1     Completed   0 
```

Como hemos utilizado `--restart=Never` y el contenedor interno se ha cerrado el Pod, se queda pero con ese contenedor finalizado.

Vamos a limpiar este 'naked' Pod.

```bash
kubectl delete pod busybox
```