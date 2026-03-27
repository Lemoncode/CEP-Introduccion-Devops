# Ejercicios

## 1. Naked Pod

- Levanta un Pod desde consola, su imagen debe ser `nginx:alpine`.
- Verifica que el Pod se está ejecutando
- Borra el Pod.

## 2. Self-Healing Deployment

- Crea un Deployment con 3 replicas desde consola cuya imagen sea `httpd:alpine`.
- Verifica que las 3 replicas están corriendo.
- Elimina una de la réplicas. ¿Qué ocurre pasado un tiempo?
- ¿Qué comando deberías usar para ver cómo aparecen las replicas en tiempo real?

## 3. Zero-downtime Rollouts

- Crea un Deployment usando la imagen `nginx:1.19`.
- Actualiza la imagen a `nginx:1.21` ¿Qué opciones tienes para actualizar la imagen sin eliminar el Deployment?
- ¿Qué comando puedes usar para verificar el estado del *rollout*?

## 4. PVC

- Crea un `PersistentVolumeClaim` solicitando 1Gi de almacenamiento.
- Monta el PVC en un Pod y crea un fichero en el path `/temp`.
- Elimina el Pod, crea un nuevo que monte el PVC anterior, verifica que el fichero sigue existiendo.

## 5. StorageClass

- Verifica si en tu cluster existe una `StorageClass default`.
- Crea un volumen a través de la `StorageClass default`.
- Verifica que el volumen se ha creado.

## 6. Networking - ClusterIP

- Crea un Deployment con la imagen `nginx`, expón el Deployment a través de un servicio ClusterIP.
- Verifica que eres capaz de interactuar con `nginx` a través del servicio que has creado. Para ello usa una imagen `busybox`.
- Si el Pod de `busybox` se hallara en otro `namespace` que FQN deberíamos usar.
- ¿Cómo podemos aislar `namespaces` completamente en K8s?

## 7. Networking - NodePort

- Convierte el servicio anterior a NodePort.
- Verifica `nginx` sigue siendo accesible.

## 8. Networking - Ingress Controller

Crea dos Deployments en `yaml` y exponlo a través de un servicio, también en `yaml`. Usa la imagen `hashicorp/http-echo`. Esta imagen permite pasar como argumento un 'echo'. Aquí tienes un ejemplo, usando un Pod:

```yml
kind: Pod
apiVersion: v1
metadata:
  name: apple-app
  labels:
    app: apple
spec:
  containers:
    - name: apple-app
      image: hashicorp/http-echo
      args:
        - "-text=apple"
```

- El primer Deployment dará como echo la palabra *red*
- El segundo Deployment dará como echo la palabra *yellow*
- Crea un Ingress que exponga el primer Deployment en `example.com/red`, y el segundo en `example.com/yellow`.
- Comprueba que funciona usando `curl -H "Host: example.com" ...`
- Refactoriza el Ingress para que existan un Virtual Host por cada uno de los Deployments.

## 9. Networking - Gateway API

Si quisieramos utilizar la [Gateway API](https://gateway-api.sigs.k8s.io/) en vez del Ingress del ejercicio anterior, ¿qué consideraciones deberíamos tomar?

## 10. Canary Deployment

- Explica que es un Canary Deployment y los pasos para ejecutarlo en K8s.