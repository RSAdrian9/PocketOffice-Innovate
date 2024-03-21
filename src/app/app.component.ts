import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { barChartOutline, cardSharp, clipboardOutline, compassOutline, peopleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet],
})
export class AppComponent {

  constructor() {
    addIcons({
      peopleOutline,
      cardSharp,
      compassOutline,
      clipboardOutline,
      barChartOutline
    });
  }


  public appPages = [
    { title: 'Clientes', url: '/cliente', icon: 'people-outline' },
    { title: 'Contactos', url: '/lista-contactos', icon: 'assets/icons/cuaderno.svg' },
    { title: 'Datos Bancarios', url: '/lista-bancos', icon: 'card-sharp' },
    { title: 'Direcciones', url: '/lista-direcciones', icon: 'compass-outline' },
    { title: 'Historial', url: '/historial', icon: 'clipboard-outline' },
    { title: 'Listado Facturas', url: '/datos-facturas', icon: 'assets/icons/bill.svg' },
    { title: 'Listado Albaranes', url: '/lista-albaranes', icon: 'assets/icons/delivery-note.svg' },
    { title: 'Listado Presupuestos', url: '/lista-presupuestos', icon: 'assets/icons/finanzas.svg' },
    { title: 'Listado Pedidos', url: '/lista-pedidos', icon: 'assets/icons/caja.svg' },
    { title: 'Efectos', url: '/efectos', icon: 'assets/icons/flujo-de-efectivo.svg' },
    { title: 'Mayor De Cuentas', url: '/mayor-datos', icon: 'assets/icons/mayor.svg' },
    { title: 'Situación de Riesgo', url: '/situacion-riesgos', icon: 'assets/icons/caution-sign.svg' },
    { title: 'Rentabilidad', url: '/rentabilidad', icon: 'assets/icons/money-bag.svg' },
    { title: 'Resumen Mensual de Ventas', url: '/resumen-mensual-ventas', icon: 'assets/icons/sales.svg' },
  ];

  /*

  public pagesProveedor = [
    { title: 'Proveedores', url: '/proveedor', icon: 'people-sharp'},
    { title: 'Contactos', url: '/lista-contactos', icon: './assets/imgs/cuaderno.svg' },
    { title: 'Datos Bancarios', url: '/lista-bancos', icon: 'card-sharp' },
    { title: 'Direcciones', url: '/lista-direcciones', icon: 'compass-outline' },
    { title: 'Historial', url: '/historial', icon: 'clipboard-outline' },
    { title: 'Listado Facturas', url: '/lista-facturas', icon: './assets/imgs/bill.svg' },
    { title: 'Listado Albaranes', url: '/lista-albaranes', icon: './assets/imgs/delivery-note.svg' },
    { title: 'Listado Pedidos', url: '/lista-pedidos', icon: './assets/imgs/caja.svg' },
    { title: 'Efectos', url: '/efectos', icon: './assets/imgs/flujo-de-efectivo.svg' },
    { title: 'Mayor De Cuentas', url: '/mayor', icon: './assets/imgs/mayor.svg' },
    { title: 'Resumen mensual de ventas', url: '/resumen-mesual-ventas', icon: './assets/imgs/sales.svg' }
  ];
  */
  
}