# Setup

## IDE

El IDE que vamos a usar para este curso será [VSCode](https://code.visualstudio.com/). Para istalarlo, navegar a la siguiente [página de descarga](https://code.visualstudio.com/). En esta página encontraréis los instalables para los principales sistema operativos. Una vez descargada, la versión deseada ejecutar. 

## Git

Para comprobar si Git está actualmente en nuestro sistema instalado, deberemos abrir una terminal y ejecutar el siguiente comando:

```bash
git version
```

En caso de que el resultado de ejecutar el comando anterior no devuelva algo simmilar a esto:

```
git version <installed version> <version type by OS>
```

Deberemos instalar Git, para ello podemos ir a la siguiente [página](https://git-scm.com/install) y seguir las instrucciones para nuestro sistema operativo.

## NodeJS

Para comprobar si Node está insatlado en nuestro sistema, abrir una terminal y ejecutar el siguiente comando:

```bash
node -v
```

En caso de que el resultado de ejecutar el comando anterior no devuelva algo simmilar a esto:

```
v24.x.x
```

Deberemos instalar NodeJS, para ello podemos ir a la siguiente [página](https://nodejs.org/en/download) y descargar el instalador para nuestro sistema operativo.

## Guía de Instalación Docker Desktop

Una de las formas más sencillas de poder ejecutar contenedores es a través de Docker Desktop. Si no tenemos Docker Desktop instalado, para instalarlo navegar a la siguiente [página](https://docs.docker.com/get-started/get-docker/). Seleccionamos el sistema operativo deseado, para realizar la instalación. A continuación algunos apuntes sobre los distintos sistemas operativos que deberías tener en cuenta antes de insatlar. 

### Windows

Para poder ejecutar Docker en Windows, debemos tener un sistema de virtualización habilitado, Hyper-V o WSL 2. Comprueba antes de realizar la instalación que tu entorno soporta las herramientas necesarias. En la guía de instalación de Windows, viene en detalle los pormenores a tener en cuenta.

### Mac OS

En el case de Mac OS, si tu entorno utiliza el Apple Silicon chip, para una experiencia satisfactoria deberas instalar Rosetta. En la guía de instalación para Mac OS vienen los detalles de como instalar Rosetta.

### Linux

En Linux si lo deseamos podemos instalar simplemente el 'engine' de Docker y ejecutarlo como un servicio. En esta [página](https://docs.docker.com/engine/install/) podeis encntrar los detalles para este tipo de instalación. 

## Guía de Instalación K8s

### DevContainers

Si tenemos instalado el [plugin Devcontainers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) en VSCode y podemos ejecutar Docker en nuestra máquina es posible levantar un cluster de K8s directamente desde VSCode. Para ello, en el raíz de nuestro proyecto crea una carpeta `.devcontainer` y crear el fichero `.devcontainer/devcontainer.json` con el siguiente conetnido:

```json
// For format details, see https://aka.ms/devcontainer.json. For config options, see the
// README at: https://github.com/devcontainers/templates/tree/main/src/ubuntu
{
	"name": "Ubuntu",
	// Or use a Dockerfile or Docker Compose file. More info: https://containers.dev/guide/dockerfile
	"image": "mcr.microsoft.com/devcontainers/base:noble",
	"features": {
		"ghcr.io/devcontainers/features/docker-in-docker:2": {},
		"ghcr.io/devcontainers/features/kubectl-helm-minikube:1": {}
	}

	// Features to add to the dev container. More info: https://containers.dev/features.
	// "features": {},

	// Use 'forwardPorts' to make a list of ports inside the container available locally.
	// "forwardPorts": [],

	// Use 'postCreateCommand' to run commands after the container is created.
	// "postCreateCommand": "uname -a",

	// Configure tool-specific properties.
	// "customizations": {},

	// Uncomment to connect as root instead. More info: https://aka.ms/dev-containers-non-root.
	// "remoteUser": "root"
}

```

Arranca Docker, si no está en ejecucion. Con Docker corriendo en nuestro sistema, abrimos la 'command pallete' de VSCode y veremos la siguiente opción:

![Reopen in container](.resources/01-reopen-in-container.png)

Hacer click sobre la misma. Si es la primera vez que lo ejecutamos, tardará unos minutos. Una vez ha terminado, podemos comprobar el estado de `minikube` ejecutando:

```bash
minikube status
```

![Minikube status](.resources/02-minikube-status.png)

Ahora podemos arrancar un cluster usando:

```bash
minikube start
```

Pasados unos minutos veremos un mensaje como este:

![Minikube Running](.resources/03-minikube-running.png)

### Minikube

También podemos instalar Minikube en 'bear metal', lo que nos da más opciones de virtualización, está puede ser una buena opción en el caso de que no podamos instalar Docker directamente en nuestra máquina. En la siguiente [página](https://minikube.sigs.k8s.io/docs/start/?arch=%2Fmacos%2Fx86-64%2Fstable%2Fbinary+download) podemos encontrar las instrucciones para arrancar con los principales sistemas operativos.

### Kind

Para poder ejecutar Kind, cómo pre requisito, Docker debe poderse ejecutar. Kind ofrece clusters de Kubernetes a través de contenedores de Docker, lo que lo convierte en una opción muy ligera. Para instalarlo podemos seguir los pasos en la siguiente [página](https://kind.sigs.k8s.io/docs/user/quick-start)