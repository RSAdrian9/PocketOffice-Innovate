
![Logo](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5VuDXf3FTUy-rFF78_d43WPFULqOxeo08bOi_7Pns&s)

# Pocket Office Bussines 

App móvil para la gestión de clientes y proveedores.


## Tecnologías

**Client:** Angular, Ionic, TailwindCSS

**Server:** Java, Springboot


## Características

#### Inicio:

- Permite visualizar las estadísticas del cliente (ventas, compras...)

#### Clientes y proveedores:

- Permiten las visualizaciones de los clientes y proveedores, mostrando los datos de cada uno de ellos.
- Búsqueda avanzada, con posibilidad de buscar por nombre, código...
- Filtrado, en cada página un filtrado más personalizado.

#### Otras características:
- Navegación intuitiva.
- Mensajes y avisos de confirmación o error.


## Instalación y uso

### Requisitos Previos

| Herramienta    | Mi versión  | Recomendación         | Descarga                          |
|----------------|-------------|-----------------------|-----------------------------------|
| Node.js        | 20.11.0     | 20.x o superior       | [Node.js](https://nodejs.org/)    |
| npm            | 10.2.4         | 10.x o superior        | Incluido con Node.js              |
| Ionic CLI      | 7.2.0         | 7.x o superior        | [Ionic CLI](https://ionicframework.com/docs/cli) |
| Angular CLI    | 17.3.3        | 17.x o superior       | [Angular CLI](https://angular.io/cli) |
| Git            | 2.45.1      | 2.x o superior                | [Git](https://git-scm.com/)  


### Primeros pasos

Clonar el proyecto
```bash
git clone https://github.com/RSAdrian9/PocketOffice-Innovate.git
```

Ir al directorio del proyecto

```bash
  cd PocketOffice-Innovate
```

Instalar dependencias

```bash
  npm install
```

Configurar Capacitor

```bash
npx cap add android
npx cap sync
```

Instalar plugins necesarios

```bash
npm install @capacitor/filesystem
npm install cordova-plugin-android-permissions
npm install @capacitor-community/sqlite
npm install apexcharts ng-apexcharts --save
```

Construir y Desplegar en un dispositivo Android

```bash
ionic cap run android
```
## Autores

- [@Adrián Ruiz](https://www.github.com/RSAdrian9)

[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/adrián-ruiz-sánchez-b89756222)