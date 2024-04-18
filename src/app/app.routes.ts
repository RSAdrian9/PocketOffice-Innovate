import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'clientes',
    loadComponent: () => import('./pages/clientes/clientes.page').then( m => m.ClientesPage)
  },
  {
    path: 'proveedores',
    loadComponent: () => import('./pages/proveedores/proveedores.page').then( m => m.ProveedoresPage)
  },
  {
    path: 'vista-cliente/:codigo',
    loadComponent: () => import('./pages/vista-cliente/vista-cliente.page').then( m => m.VistaClientePage)
  },
  {
    path: 'vista-proveedor/:codigo',
    loadComponent: () => import('./pages/vista-proveedor/vista-proveedor.page').then( m => m.VistaProveedorPage)
  },
  {
    path: 'contactos/:tipo/:codigo',
    loadComponent: () => import('./pages/contactos/contactos.page').then( m => m.ContactosPage)
  },
  {
    path: 'albaranes/:tipo/:codigo',
    loadComponent: () => import('./pages/albaranes/albaranes.page').then( m => m.AlbaranesPage)
  },
  {
    path: 'bancos/:tipo/:codigo',
    loadComponent: () => import('./pages/bancos/bancos.page').then( m => m.BancosPage)
  },
  {
    path: 'direcciones/:tipo/:codigo',
    loadComponent: () => import('./pages/direcciones/direcciones.page').then( m => m.DireccionesPage)
  },
  {
    path: 'facturas/:tipo/:codigo',
    loadComponent: () => import('./pages/facturas/facturas.page').then( m => m.FacturasPage)
  },
  {
    path: 'pedidos/:tipo/:codigo',
    loadComponent: () => import('./pages/pedidos/pedidos.page').then( m => m.PedidosPage)
  },
  {
    path: 'presupuestos/:tipo/:codigo',
    loadComponent: () => import('./pages/presupuestos/presupuestos.page').then( m => m.PresupuestosPage)
  },
  {
    path: 'mayor/:tipo/:codigo',
    loadComponent: () => import('./pages/mayor/mayor.page').then( m => m.MayorPage)
  },
  {
    path: 'rentabilidad/:codigo',
    loadComponent: () => import('./pages/rentabilidad/rentabilidad.page').then( m => m.RentabilidadPage)
  },
  {
    path: 'resumen-mensual-ventas/:tipo/:codigo',
    loadComponent: () => import('./pages/resumen-mensual-ventas/resumen-mensual-ventas.page').then( m => m.ResumenMensualVentasPage)
  },
  {
    path: 'situacion-riesgo/:codigo',
    loadComponent: () => import('./pages/situacion-riesgo/situacion-riesgo.page').then( m => m.SituacionRiesgoPage)
  },
  {
    path: 'historial/:tipo/:codigo',
    loadComponent: () => import('./pages/historial/historial.page').then( m => m.HistorialPage)
  },
  {
    path: 'efectos/:tipo/:codigo',
    loadComponent: () => import('./pages/efectos/efectos.page').then( m => m.EfectosPage)
  },
  {
    path: 'ajustes',
    loadComponent: () => import('./pages/ajustes/ajustes.page').then( m => m.AjustesPage)
  },
  {
    path: 'vista-efecto/:tipo/:codigo/:numero',
    loadComponent: () => import('./pages/vista-efecto/vista-efecto.page').then( m => m.VistaEfectoPage)
  },
];