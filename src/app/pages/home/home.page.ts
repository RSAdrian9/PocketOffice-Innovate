import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { App } from '@capacitor/app';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonImg, IonButton, IonBadge, IonIcon, Platform, AlertController, IonRouterOutlet, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, ModalController, IonFab, IonFabButton, IonFabList } from '@ionic/angular/standalone';


import { addIcons } from 'ionicons';
import { funnel, chevronUpCircle, downloadOutline, settingsOutline } from 'ionicons/icons';
import { ModalGraficaComponent } from 'src/app/components/modal-grafica/modal-grafica.component';
import { DbService } from 'src/app/services/db.service';
import { DownloadService } from 'src/app/services/download.service';
import { FilesystemService } from 'src/app/services/filesystem.service';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonImg, IonButton, IonButton, IonBadge, IonIcon, IonList, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonFab, IonFabButton, IonFabList]
})
export class HomePage implements OnInit {
  public opcionesVentanaPrincipal: any = [
    { id: 0, nombre: '', icono: '', datos: '', clase: '', tipo: '', posicionTexto: '', mostrar: false, tipoGrafica: '' }
  ];

    /**
   * Crea una nueva instancia de la clase HomePage.
   *
   * @param {Platform} platform - El objeto de la plataforma.
   * @param {ModalController} modalCtrl - El objeto del controlador modal.
   * @param {AlertController} alertCtrl - El objeto del controlador de alertas.
   * @param {TransferirDatosService} transferirService - El objeto del servicio de transferencia de datos.
   * @param {IonRouterOutlet} routerOutlet - El objeto del enrutador de salida.
   * @param {DownloadService} downloadService - El objeto del servicio de descarga.
   * @param {FilesystemService} filesystemService - El objeto del servicio del sistema de archivos.
   * @param {DbService} dbService - El objeto del servicio de base de datos.
   */
  constructor(
    private platform: Platform,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private transferirService: TransferirDatosService,
    private routerOutlet: IonRouterOutlet,
    private downloadService: DownloadService,
    private filesystemService: FilesystemService,
    private dbService: DbService
  ) {
    addIcons({ funnel, chevronUpCircle, downloadOutline, settingsOutline });
  }

  /**
  * Inicializa el componente y llama a los métodos pageController y cargarTarjetasInicio.
  *
  * @return {void} Esta función no devuelve nada.
  */
  ngOnInit() {
    this.pageController('/home');
    this.cargarTarjetasInicio();
  }

  /**
  * Se ejecuta cuando la vista ha sido completamente ingresada y ahora es la vista activa.
  * Llama al método pageController con la ruta '/home'.
  *
  * @return {void} Esta función no devuelve nada.
  */
  ionViewDidEnter() {
    this.pageController('/home');
  }
  

    /**
   * Ejecuta la lógica del controlador de página para la ruta dada.
   *
   * @param {string} route - La ruta para la cual se ejecuta la lógica del controlador de página.
   * @return {void} Esta función no devuelve nada.
   */
  pageController(route: string) {
    this.transferirService.sendObjectSource({ ruta: route });
    this.platform.backButton.subscribeWithPriority(10, () => {
      if (!this.routerOutlet?.canGoBack()) {
        this.alertSalirApp();
      }
    });
  }

    /**
   * Muestra una alerta para confirmar si el usuario desea salir de la aplicación.
   *
   * @return {Promise<void>} Una promesa que se resuelve cuando se presenta la alerta.
   */
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

    /**
   * Carga las tarjetas de inicio de la pantalla principal con opciones para la ventana principal.
   *
   * @return {void} Esta función no devuelve nada.
   */
  cargarTarjetasInicio() {
    this.opcionesVentanaPrincipal = [
      { id: 1, nombre: 'Ventas últimos 12 meses', icono: 'assets/imgs/sales.svg', datos: '17800', tipo: 'moneda', posicionTexto: 'ion-text-end', clase: 'green', mostrar: true, tipoGrafica: 'barras' },
      { id: 2, nombre: 'Compras últimos 12 meses', icono: 'assets/imgs/delivery-note.svg', datos: '11600', tipo: 'moneda', posicionTexto: 'ion-text-end', clase: 'orange', mostrar: true, tipoGrafica: 'barras' },
      { id: 3, nombre: 'Efectos pendientes de cobro', icono: 'assets/imgs/flujo-de-efectivo.svg', datos: '25', tipo: 'texto', posicionTexto: 'ion-text-center', clase: 'blue', mostrar: true, tipoGrafica: 'sectores' },
      { id: 4, nombre: 'Ratio de cobro', icono: 'assets/imgs/bill.svg', datos: '', tipo: 'texto', posicionTexto: 'ion-text-center', clase: 'purple', mostrar: false, tipoGrafica: '' }
    ]
  }

 /**
 * Descarga e inicia el descompresión de un paquete de datos utilizando el servicio de descarga.
 *
 * @return {Promise<void>} Una promesa que se resuelve cuando la descarga y descompresión están completas.
 */
  async descargarPaqueteDeDatos() {
    const resultadoDescarga = await this.downloadService.descargarYDescomprimirPaqueteDatos2();

    if(resultadoDescarga){
      this.alertImportacionFinalizada();      
    }   
  }

 /**
 * Muestra una alerta indicando que la importación ha finalizado correctamente.
 * Cuando el usuario hace clic en el botón 'Aceptar', se llama a la función 'cargaInfoTarjetas'.
 *
 * @return {Promise<void>} Una promesa que se resuelve cuando se presenta la alerta.
 */
  async alertImportacionFinalizada() {
    const alert = await this.alertCtrl.create({
      header: 'Importación',
      message: 'La importacion ha finalizado correctamente.',
      buttons: [        
        {
          text: 'Aceptar',
          role: 'confirm',
          handler: () => { this.cargaInfoTarjetas(); }
        }
      ],
    });
    alert.present();
  }

  /**
 * Abre un modal con el ID especificado, el título y el tipo de gráfica.
 *
 * @param {number} id - El ID del modal.
 * @param {string} titulo - El título del modal.
 * @param {string} tipoGrafica - El tipo de gráfica que se mostrará en el modal.
 * @return {Promise<void>} Una promesa que se resuelve cuando se presenta el modal.
 */
  async abrirModal(id: number, titulo: string, tipoGrafica: string) {
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