import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, heartOutline, heartSharp, archiveOutline, archiveSharp, trashOutline, trashSharp, warningOutline, warningSharp, bookmarkOutline, bookmarkSharp } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet],
})
export class AppComponent {
  public appPages = [
    { title: 'Clientes', url: '/folder/clientes', icon: 'mail' },
    { title: 'Contactos', url: '/folder/contactos', icon: 'paper-plane' },
    { title: 'Datos Bancarios', url: '/folder/datos-bancarios', icon: 'heart' },
    { title: 'Direcciones', url: '/folder/direcciones', icon: 'archive' },
    { title: 'Historial', url: '/folder/historial', icon: 'trash' },
    { title: 'Listado Facturas', url: '/folder/listado-facturas', icon: 'warning' },
    { title: 'Listado Albaranes', url: '/folder/listado-albaranes', icon: 'mail' },
    { title: 'Listado Presupuestos', url: '/folder/listado-presupuestos', icon: 'paper-plane' },
    { title: 'Listado Pedidos', url: '/folder/listado-pedidos', icon: 'heart' },
    { title: 'Efectos', url: '/folder/efectos', icon: 'archive' },
    { title: 'Mayor De Cuentas', url: '/folder/mayor-cuentas', icon: 'trash' },
    { title: 'Situación de Riesgo', url: '/folder/situacion-riesgo', icon: 'warning' },
    { title: 'Rentabilidad', url: '/folder/rentabilidad', icon: 'trash' },
    { title: 'Resumen Mensual de Ventas', url: '/folder/resumen-mensual', icon: 'warning' },
  ];
  constructor() {
    addIcons({ mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, heartOutline, heartSharp, archiveOutline, archiveSharp, trashOutline, trashSharp, warningOutline, warningSharp, bookmarkOutline, bookmarkSharp });
  }
}
