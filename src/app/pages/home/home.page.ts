import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { App } from '@capacitor/app';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonImg, IonButton, PopoverController, IonBadge, IonIcon, Platform, NavController, AlertController, IonRouterOutlet, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList } from '@ionic/angular/standalone';


import { addIcons } from 'ionicons';
import { funnel } from 'ionicons/icons';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonImg, IonButton, IonButton, IonBadge, IonIcon, IonList, IonCard, IonCardHeader, IonCardTitle, IonCardContent]
})
export class HomePage implements OnInit {
  public opcionesVentanaPrincipal: any = [
    { id: 0, nombre: '', icono: '', datos: '', clase: '', tipo: '', posicionTexto: '', mostrar: false }
  ];
  constructor(
    private platform: Platform,
    private alertCtrl: AlertController,
    private transferirService: TransferirDatosService,
    private routerOutlet: IonRouterOutlet
  ) {
    addIcons({ funnel });
  }

  ngOnInit() {
    this.pageController('/home');
    this.cargarTarjetasInicio();
  }

  ionViewDidEnter() {
    this.pageController('/home');
  }

  pageController(route: string) {
    this.transferirService.sendObjectSource({ ruta: route });
    this.platform.backButton.subscribeWithPriority(10, () => {
      if (!this.routerOutlet?.canGoBack()) {
        this.alertSalirApp();
      }
    });
  }

  async alertSalirApp() {
    const alert = await this.alertCtrl.create({
      header: 'Salir de la aplicación',
      message: '¿Seguro que quieres salir de la aplicación?',
      buttons: [
        {
          text: 'NO',
          role: 'Cancelar'
        },
        {
          text: 'SI',
          role: 'confirm',
          handler: () => { App.exitApp(); }
        }
      ],
    });
    alert.present();
  }

  testFtp() {
    //this.ftpService.conectarFtp();
  }

  cargarTarjetasInicio() {
    this.opcionesVentanaPrincipal = [
      { id: 1, nombre: 'Ventas últimos 12 meses', icono: 'assets/imgs/sales.svg', datos: '17800', tipo: 'moneda', posicionTexto: 'ion-text-end', clase: 'green', mostrar: true },
      { id: 2, nombre: 'Compras últimos 12 meses', icono: 'assets/imgs/delivery-note.svg', datos: '11600', tipo: 'moneda', posicionTexto: 'ion-text-end', clase: 'orange', mostrar: true },
      { id: 3, nombre: 'Efectos pendientes de cobro', icono: 'assets/imgs/flujo-de-efectivo.svg', datos: '25', tipo: 'texto', posicionTexto: 'ion-text-center', clase: 'blue', mostrar: true },
      { id: 4, nombre: 'Ratio de cobro', icono: 'assets/imgs/bill.svg', datos: '', tipo: 'texto', posicionTexto: 'ion-text-center', clase: 'purple', mostrar: false }
    ]
  }



}
