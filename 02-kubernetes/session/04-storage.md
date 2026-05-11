## Manual Path

El flujo sería el siguiente:

1. El administrador crea un PV
2. El desarrollador crea un PVC
3. El desarrollador enlaza el PVC con el POD/Deployment


### Creando el PV

> NOTA: NO podemos crear un `persistent volume` con `kubectl create`

```bash
kubectl create pv
```

Creamos `k8s/manual-pv.yaml`

```yaml
apiVersion: v1
kind: PersistentVolume
metadata: 
  name: task-pv-volume 
  labels: 
    type: local
spec:
  capacity:
    storage: 1Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: "/mnt/data"
```

```bash
kubectl apply -f k8s/manual-pv.yaml
```

```bash
kubectl get pv 
```

```
NAME             CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS      CLAIM   STORAGECLASS   VOLUMEATTRIBUTESCLASS   REASON   AGE
task-pv-volume   1Gi        RWO            Retain           Available                          <unset>                          3m48s
```

Para poder consumir el `PersistentVolume`, necesitamos crear un `PersistentVolumeClaim`

Creamos `k8s/manual-pvc.yaml`

```yaml
apiVersion: v1 
kind: PersistentVolumeClaim
metadata:
  name: task-pvc 
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
```

```bash
kubectl apply -f k8s/manual-pvc.yaml
```

```bash
kubectl get pvc
```

```bash
kubectl get pv
```

```
AME                                       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS      CLAIM              STORAGECLASS   VOLUMEATTRIBUTESCLASS   REASON   AGE
pvc-683af087-093b-4365-b890-c0c399cef467   1Gi        RWO            Delete           Bound       default/task-pvc   standard       <unset>                          11s
task-pv-volume                             1Gi        RWO            Retain           Available                                     <unset>                          12m
```

Ahora que nuetro storage está 'pedido' (PVC) y 'entregado' (PV), lo podemos consumir.

Creamos `k8s/task-pod.yaml`

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: task-pod
spec:
  volumes:
    - name: task-pv
      persistentVolumeClaim:
        claimName: task-pvc # Matches your PVC name
  containers:
    - name: task-container
      image: public.ecr.aws/nginx/nginx:1.25.2-alpine-slim
      ports:
        - containerPort: 80
      volumeMounts:
        - mountPath: "/usr/share/nginx/html" # Where the data appears inside the pod
          name: task-pv
```

```bash
kubectl apply -f k8s/task-pod.yaml
```

```bash
kubectl describe pod task-pod
```

El 'mount path' que estamos usando, es de dónde se sirve la página por defecto de Nginx, si tomamos la IP del pod recien creado podemos comprobar la página usando `busybox`

```bash
kubectl run -i -t busybox --image=busybox --restart=Never
```

```bash
# 10.244.0.13
wget -qO- <task POD IP>
# Returns 403
```

Vamos a incluir nuestro propio contenido:

```bash
kubectl exec -it task-pod -- sh 
```

```bash
echo "Hello World!!" > /usr/share/nginx/html/index.html
```

Si eliminamos ahora el pod y lo recreamos:

```bash
kubectl delete pod task-pod
```

```bash
kubectl apply -f k8s/task-pod.yaml
```

Podemos comprobar ahora la página que sirve nuestro Pod

```bash
kubectl run -i -t busybox --image=busybox --restart=Never
```

```bash
# 10.244.0.15
wget -qO- <task POD IP>
# Returns Hello World!
```

## Dynamic Path

1. Creamos el PVC directamente, pero usando `storageClassName: standard`
2. El 'built-in' provisioner verá la petición y generará de forma automática el PV

## Clean Up

```bash
kubectl delete pod busybox
kubectl delete pod task-pod
kubectl delete -f k8s/manual-pvc.yaml
kubectl delete -f k8s/manual-pv.yaml
```

## References

https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes