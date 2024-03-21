import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'folder/:id',
    loadComponent: () =>
      import('./folder/folder.page').then((m) => m.FolderPage),
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage)
  },
  {
    path: 'cliente',
    loadComponent: () => import('./pages/cliente/cliente.page').then( m => m.ClientePage)
  },
  {
    path: 'lista-contactos',
    loadComponent: () => import('./pages/lista-contactos/lista-contactos.page').then( m => m.ListaContactosPage)
  },
  {
    path: 'lista-bancos',
    loadComponent: () => import('./pages/lista-bancos/lista-bancos.page').then( m => m.ListaBancosPage)
  },
  {
    path: 'lista-direcciones',
    loadComponent: () => import('./pages/lista-direcciones/lista-direcciones.page').then( m => m.ListaDireccionesPage)
  },
  {
    path: 'historial',
    loadComponent: () => import('./pages/historial/historial.page').then( m => m.HistorialPage)
  },
  {
    path: 'lista-facturas',
    loadComponent: () => import('./pages/lista-facturas/lista-facturas.page').then( m => m.ListaFacturasPage)
  },
  {
    path: 'lista-albaranes',
    loadComponent: () => import('./pages/lista-albaranes/lista-albaranes.page').then( m => m.ListaAlbaranesPage)
  },
  {
    path: 'lista-presupuestos',
    loadComponent: () => import('./pages/lista-presupuestos/lista-presupuestos.page').then( m => m.ListaPresupuestosPage)
  },
  {
    path: 'lista-pedidos',
    loadComponent: () => import('./pages/lista-pedidos/lista-pedidos.page').then( m => m.ListaPedidosPage)
  },
  {
    path: 'efectos',
    loadComponent: () => import('./pages/efectos/efectos.page').then( m => m.EfectosPage)
  },
  {
    path: 'mayor',
    loadComponent: () => import('./pages/mayor/mayor.page').then( m => m.MayorPage)
  },
  {
    path: 'situacion-riesgos',
    loadComponent: () => import('./pages/situacion-riesgos/situacion-riesgos.page').then( m => m.SituacionRiesgosPage)
  },
  {
    path: 'rentabilidad',
    loadComponent: () => import('./pages/rentabilidad/rentabilidad.page').then( m => m.RentabilidadPage)
  },
  {
    path: 'resumen-mensual-ventas',
    loadComponent: () => import('./pages/resumen-mensual-ventas/resumen-mensual-ventas.page').then( m => m.ResumenMensualVentasPage)
  },  {
    path: 'cliente',
    loadComponent: () => import('./pages/cliente/cliente.page').then( m => m.ClientePage)
  },
  {
    path: 'datos-albaranes',
    loadComponent: () => import('./pages/datos-albaranes/datos-albaranes.page').then( m => m.DatosAlbaranesPage)
  },
  {
    path: 'datos-bancarios',
    loadComponent: () => import('./pages/datos-bancarios/datos-bancarios.page').then( m => m.DatosBancariosPage)
  },
  {
    path: 'datos-contactos',
    loadComponent: () => import('./pages/datos-contactos/datos-contactos.page').then( m => m.DatosContactosPage)
  },
  {
    path: 'datos-direcciones',
    loadComponent: () => import('./pages/datos-direcciones/datos-direcciones.page').then( m => m.DatosDireccionesPage)
  },
  {
    path: 'datos-facturas',
    loadComponent: () => import('./pages/datos-facturas/datos-facturas.page').then( m => m.DatosFacturasPage)
  },
  {
    path: 'datos-pedidos',
    loadComponent: () => import('./pages/datos-pedidos/datos-pedidos.page').then( m => m.DatosPedidosPage)
  },
  {
    path: 'datos-presupuestos',
    loadComponent: () => import('./pages/datos-presupuestos/datos-presupuestos.page').then( m => m.DatosPresupuestosPage)
  },
  {
    path: 'efectos',
    loadComponent: () => import('./pages/efectos/efectos.page').then( m => m.EfectosPage)
  },
  {
    path: 'efectos-datos',
    loadComponent: () => import('./pages/efectos-datos/efectos-datos.page').then( m => m.EfectosDatosPage)
  },
  {
    path: 'historial',
    loadComponent: () => import('./pages/historial/historial.page').then( m => m.HistorialPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage)
  },
  {
    path: 'lista-albaranes',
    loadComponent: () => import('./pages/lista-albaranes/lista-albaranes.page').then( m => m.ListaAlbaranesPage)
  },
  {
    path: 'lista-bancos',
    loadComponent: () => import('./pages/lista-bancos/lista-bancos.page').then( m => m.ListaBancosPage)
  },
  {
    path: 'lista-contactos',
    loadComponent: () => import('./pages/lista-contactos/lista-contactos.page').then( m => m.ListaContactosPage)
  },
  {
    path: 'lista-direcciones',
    loadComponent: () => import('./pages/lista-direcciones/lista-direcciones.page').then( m => m.ListaDireccionesPage)
  },
  {
    path: 'lista-facturas',
    loadComponent: () => import('./pages/lista-facturas/lista-facturas.page').then( m => m.ListaFacturasPage)
  },
  {
    path: 'lista-pedidos',
    loadComponent: () => import('./pages/lista-pedidos/lista-pedidos.page').then( m => m.ListaPedidosPage)
  },
  {
    path: 'lista-presupuestos',
    loadComponent: () => import('./pages/lista-presupuestos/lista-presupuestos.page').then( m => m.ListaPresupuestosPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'mayor',
    loadComponent: () => import('./pages/mayor/mayor.page').then( m => m.MayorPage)
  },
  {
    path: 'mayor-datos',
    loadComponent: () => import('./pages/mayor-datos/mayor-datos.page').then( m => m.MayorDatosPage)
  },
  {
    path: 'pdf',
    loadComponent: () => import('./pages/pdf/pdf.page').then( m => m.PdfPage)
  },
  {
    path: 'rentabilidad',
    loadComponent: () => import('./pages/rentabilidad/rentabilidad.page').then( m => m.RentabilidadPage)
  },
  {
    path: 'resumen-mensual-ventas',
    loadComponent: () => import('./pages/resumen-mensual-ventas/resumen-mensual-ventas.page').then( m => m.ResumenMensualVentasPage)
  },
  {
    path: 'situacion-riesgos',
    loadComponent: () => import('./pages/situacion-riesgos/situacion-riesgos.page').then( m => m.SituacionRiesgosPage)
  },
  {
    path: 'vista-cliente',
    loadComponent: () => import('./pages/vista-cliente/vista-cliente.page').then( m => m.VistaClientePage)
  },

];
