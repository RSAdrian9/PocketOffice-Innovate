import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { barChartOutline, bookmarkOutline, clipboardOutline, compassOutline, peopleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet],
})
export class AppComponent {
  public appPages = [
    { title: 'Clientes', url: '/folder/clientes', icon: 'people' },
    { title: 'Contactos', url: '/folder/contactos', icon: 'assets/icons/cuaderno.svg' },
    { title: 'Datos Bancarios', url: '/folder/datos-bancarios', icon: 'card' },
    { title: 'Direcciones', url: '/folder/direcciones', icon: 'compass' },
    { title: 'Historial', url: '/folder/historial', icon: 'clipboard' },
    { title: 'Listado Facturas', url: '/folder/listado-facturas', icon: 'assets/icons/bill.svg' },
    { title: 'Listado Albaranes', url: '/folder/listado-albaranes', icon: 'assets/icons/delivery-note.svg' },
    { title: 'Listado Presupuestos', url: '/folder/listado-presupuestos', icon: 'assets/icons/finanzas.svg' },
    { title: 'Listado Pedidos', url: '/folder/listado-pedidos', icon: 'assets/icons/caja.svg' },
    { title: 'Efectos', url: '/folder/efectos', icon: 'assets/icons/flujo-de-efectivo.svg' },
    { title: 'Mayor De Cuentas', url: '/folder/mayor-cuentas', icon: 'assets/icons/mayor.svg' },
    { title: 'Situación de Riesgo', url: '/folder/situacion-riesgo', icon: 'assets/icons/caution-sign.svg' },
    { title: 'Rentabilidad', url: '/folder/rentabilidad', icon: 'assets/icons/money-bag.svg' },
    { title: 'Resumen Mensual de Ventas', url: '/folder/resumen-mensual', icon: 'bar-chart' },
  ];
  constructor() {
    addIcons({ peopleOutline, compassOutline, clipboardOutline, bookmarkOutline, barChartOutline });
  }
}
