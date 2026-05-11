# Services

Los Pods son efímeros en un cluster de K8s, y sus IPs/NICs son dinámicas. Eso significa que si realizamos varios Deployments, con distaintas versiones de 
imágenes las IPs se irán cambiando a medida que realizamos estos deployments.

Para solucionar esto K8s ofrece los servicios (en concreto los ClusterIP), los cuales no modifican su IP después de cada Deployment y 'mapean' a las IPs
de los Pods de los distintos deployments

## Cluster IP

```bash
kubectl create service --help
```

```bash
kubectl create service clusterip --help
```

Vamos a utilizar la misma técnica anterior, para generar los manifiestos asociados:

```bash
kubectl create service clusterip app-map --tcp=4000:4000 --dry-run=client -o yaml > ./k8s/app-map.service.yaml
```

Actualizamos `k8s/app-map.service.yaml`

```diff
apiVersion: v1
kind: Service
metadata:
  labels:
    app: app-map
  name: app-map
spec:
  ports:
- - name: 4000-4000
+ - name: http
    port: 4000
    protocol: TCP
    targetPort: 4000
  selector:
    app: app-map
  type: ClusterIP
- status:
-   loadBalancer: {}
```

> NOTA: Las etiquetas de este servicio hacen referencia a los pods del delpoyment que hemos utilizado anetriormente.

```bash
kubectl apply -f k8s/app-map.service.yaml
```

¿Cómo podemos saber si nuestro servicio alcanza nuestros Pods?

```bash
kubectl get pods -o wide
```

```bash
kubectl get endpointslice
```

```
NAME            ADDRESSTYPE   PORTS     ENDPOINTS      AGE
app-map-jqxd5   IPv4          <unset>   <unset>        39m
```

Cómo podemos ver tanto el PORT como el ENDPOINT están `unset`, esto significa que nuestro servicio, no ha enlazado con ningún Pod. El error está en que el `Deployment` aplica la etiqueta `app=app-map-dep` en vez de `app=app-map` cómo espcifica el servicio.

Actualizamos `k8s/app-map.service.yaml`

```diff
spec:
  ports:
  - name: http
    port: 4000
    protocol: TCP
    targetPort: 4000
  selector:
-   app: app-map
+   app: app-map-dep
  type: ClusterIP
```

```bash
kubectl apply -f k8s/app-map.service.yaml
```

Volvemos a hacer debugging:

```bash
kubectl get pods -o wide
```

```bash
kubectl get endpointslice
```

```
app-map-jqxd5   IPv4          4000    10.244.0.9,10.244.0.8   64m
```

Ahora por último, vamos a usar el servicio, para llegar a nuestra app

```bash
kubectl run -i -t busybox --image=busybox --restart=Never
```

```bash
wget -qO- app-map:4000/api/items/
```

## Node Port

El problema que tenemos es que si queremos acceder a esta aplicación desde fuera del cluster, no vamos a poder hacerlo. Lo que podemos hacer, es cambiar el servicio a `NodePort`

Actualizamos `k8s/app-map.service.yaml`

```diff
spec:
  ports:
  - name: http
    port: 4000
    protocol: TCP
    targetPort: 4000
  selector:
    app: app-map-dep
- type: ClusterIP
+ type: NodePort
```

```bash
kubectl apply -f k8s/app-map.deployment.yaml
kubectl apply -f k8s/app-map.service.yaml
```

```bash
kubectl get svc
```

```bash
IP=$(minikube ip)
```

```bash
curl http://$IP:PORT/api/items/
```

## Load Balancer

El problema es que siempre tenemos que atacar al mismo nodo. Esto no balancea la carga...

Actualizamos `k8s/app-map.service.yaml`

```diff
spec:
  ports:
  - name: http
    port: 4000
    protocol: TCP
    targetPort: 4000
  selector:
    app: app-map-dep
- type: NodePort
+ type: LoadBalancer
```

```bash
kubectl apply -f k8s/app-map.service.yaml
```

```bash
kubectl get svc
```

En otra terminal ejecutamos

```bash
minikube tunnel
```

```
Status:
        machine: minikube
        pid: 16971
        route: 10.96.0.0/12 -> 192.168.49.2
        minikube: Running
        services: [app-map]
    errors: 
                minikube: no errors
                router: no errors
                loadbalancer emulator: no errors

```

```bash
kubectl get svc
```

```
NAME         TYPE           CLUSTER-IP     EXTERNAL-IP    PORT(S)          AGE
app-map      LoadBalancer   10.110.11.19   10.110.11.19   4000:30328/TCP   12m
```

```bash
curl http://REPLACE_WITH_EXTERNAL_IP:4000/api/items/
```

## Ingress


```bash
minikube addons list
```

```bash
minikube addons enable ingress
```

```bash
kubectl get pods -n ingress-nginx
```

```
NAME                                        READY   STATUS      RESTARTS   AGE
ingress-nginx-admission-create-gglqs        0/1     Completed   0          44s
ingress-nginx-admission-patch-727v7         0/1     Completed   0          44s
ingress-nginx-controller-596f8778bc-g99wh   1/1     Running     0          44s
```

Actualizamos `k8s/app-map.service.yaml`

```diff
spec:
  ports:
  - name: http
    port: 4000
    protocol: TCP
    targetPort: 4000
  selector:
    app: app-map-dep
- type: LoadBalancer
+ type: ClusterIP
```

```bash
kubectl apply -f k8s/app-map.service.yaml
```

Creamos `k8s/ingress.yaml`

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-map-ingress
spec:
  ingressClassName: nginx
  rules:
    - host: app-map.example
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: app-map
                port:
                  number: 4000
```

```bash
kubectl apply -f k8s/ingress.yaml
```

```bash
kubectl get ingress
```

```bash
curl --resolve "app-map.example:80:$( minikube ip )" -i http://app-map.example
```

```bash
curl --resolve "app-map.example:80:$( minikube ip )" -i http://app-map.example/api/items/
```

## References

- https://minikube.sigs.k8s.io/docs/handbook/accessing/
- https://v1-32.docs.kubernetes.io/docs/tasks/access-application-cluster/ingress-minikube/