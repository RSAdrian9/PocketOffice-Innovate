import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { App } from '@capacitor/app';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonImg, IonButton, IonBadge, IonIcon, Platform, AlertController, IonRouterOutlet, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, ModalController } from '@ionic/angular/standalone';


import { addIcons } from 'ionicons';
import { funnel } from 'ionicons/icons';
import { ModalGraficaComponent } from '../../components/modal-grafica/modal-grafica.component';
import { DownloadService } from '../../services/download.service';
import { TransferirDatosService } from '../../services/transferir-datos.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonImg, IonButton, IonButton, IonBadge, IonIcon, IonList, IonCard, IonCardHeader, IonCardTitle, IonCardContent]
})
export class HomePage implements OnInit {
  public opcionesVentanaPrincipal: any = [
    { id: 0, nombre: '', icono: '', datos: '', clase: '', tipo: '', posicionTexto: '', mostrar: false, tipoGrafica: '' }
  ];
  constructor(
    private platform: Platform,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private transferirService: TransferirDatosService,
    private routerOutlet: IonRouterOutlet,
    private downloadService: DownloadService
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
      { id: 1, nombre: 'Ventas últimos 12 meses', icono: 'assets/imgs/sales.svg', datos: '17800', tipo: 'moneda', posicionTexto: 'ion-text-end', clase: 'green', mostrar: true, tipoGrafica: 'barras' },
      { id: 2, nombre: 'Compras últimos 12 meses', icono: 'assets/imgs/delivery-note.svg', datos: '11600', tipo: 'moneda', posicionTexto: 'ion-text-end', clase: 'orange', mostrar: true, tipoGrafica: 'barras' },
      { id: 3, nombre: 'Efectos pendientes de cobro', icono: 'assets/imgs/flujo-de-efectivo.svg', datos: '25', tipo: 'texto', posicionTexto: 'ion-text-center', clase: 'blue', mostrar: true, tipoGrafica: 'sectores' },
      { id: 4, nombre: 'Ratio de cobro', icono: 'assets/imgs/bill.svg', datos: '', tipo: 'texto', posicionTexto: 'ion-text-center', clase: 'purple', mostrar: false, tipoGrafica: '' }
    ]
  }

  pruebas() {
    this.downloadService.descargarPaqueteDatos();
  }

  async abrirModal(id: number, titulo:string, tipoGrafica: string) {
    console.log('desde home: ' + tipoGrafica);
    const modal = await this.modalCtrl.create({
      component: ModalGraficaComponent,
      componentProps: { id: id, titulo: titulo, tipoGrafica: tipoGrafica }

    });
    modal.onDidDismiss()
      .then((data) => {

      });
    return await modal.present();
  }




}
