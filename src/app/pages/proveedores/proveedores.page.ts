import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonItem, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonImg, InfiniteScrollCustomEvent, Platform, NavController, IonList, IonInfiniteScroll, IonInfiniteScrollContent, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonButton, IonSearchbar, PopoverController, IonProgressBar, IonCheckbox, IonBadge } from '@ionic/angular/standalone';
import { proveedorTmp } from 'src/app/models/proveedorTmp.model';
import { DbService } from 'src/app/services/db.service';
import { addIcons } from 'ionicons';
import { alertCircle, eyeOutline, funnel, search } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { FiltroProveedoresComponent } from 'src/app/components/filtro-proveedores/filtro-proveedores.component';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.page.html',
  styleUrls: ['./proveedores.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonImg, IonList, IonInfiniteScroll, IonInfiniteScrollContent, IonIcon, IonItem, RouterLink, RouterLinkActive, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonButton, IonSearchbar, IonProgressBar, IonCheckbox, IonBadge]
})
export class ProveedoresPage implements OnInit {
  public proveedores: Array<proveedorTmp> = [];
  private proveedoresAUX: Array<proveedorTmp> = [];
  private filtroBusqueda: string = '';
  private proveedoresPorPagina: number = 25;
  private registros: number = 0;
  public hayMasProveedores: boolean = true;
  public consultaRealizada: boolean = false;
  public mostrarBusqueda: boolean = false;
  public filtros: any = { texto: '', actividad: '0', nFiltrosAplicados: 0 };

  /**
 * Constructor de la clase PedidosPage.
 *
 * @param {Platform} platform - El servicio de la plataforma.
 * @param {DbService} dbService - El servicio de base de datos.
 * @param {NavController} navC - El controlador de navegación.
 * @param {TransferirDatosService} transferirService - El servicio de transferencia de datos.
 * @param {PopoverController} popoverController - El controlador de popover.
 */
  constructor(
    private platform: Platform,
    private dbService: DbService,
    private navC: NavController,
    private transferirService: TransferirDatosService,
    private popoverController: PopoverController

  ) {
    addIcons({ eyeOutline, alertCircle, search, funnel });
    this.mostrarBusqueda = true;
  }

  /**
   * Inicializa el componente y llama a los métodos pageController y cargarProveedores.
   *
   * @return {void} No se devuelve nada por esta función.
   */
  ngOnInit() {
    this.pageController('/proveedor');
    this.cargarProveedores('');
  }

  /**
   * Se ejecuta cuando la vista ha sido completamente ingresada y ahora es la vista activa.
   * Llama al método pageController con la ruta '/proveedor'.
   *
   * @return {void} Esta función no devuelve nada.
   */
  ionViewDidEnter() {
    this.pageController('/proveedor');
  }

  /**
   * Filtra los proveedores basados en el evento dado.
   * @param {any} $event - El evento que contiene el valor del filtro.
   * @return {Promise} - Una promesa que se resuelve cuando se completa el filtrado. 
   */
  public async filtrarProveedores($event: any) {

    this.filtros.texto = $event.detail.value;
    this.filtroBusqueda = this.devuelveFiltroSentencia(this.filtros);
    this.proveedores = [];

    this.cargarProveedores(this.filtroBusqueda);
  }

  /**
   * Devuelve una función de filtro SQL basada en los filtros proporcionados.
   * @param {any} filtros - Los filtros a aplicar. Debe tener las siguientes propiedades:
   * texto: El texto a buscar.
   * actividad: El filtro de actividad ('0', '1' o '2').
   * riesgo: El filtro de riesgo ('0' o '1').
   * @return {string} La función de filtro SQL.
  */
  private devuelveFiltroSentencia(filtros: any): string {
    let filtro = '';
    let nFiltrosAnadidos = 0;

    if (filtros.texto != '' || filtros.actividad != '0') {

      filtro = filtro + 'WHERE ';
    }

    if (filtros.texto != '') {
      if (nFiltrosAnadidos > 0) {
        filtro = filtro + " AND (t1.cod LIKE '%" + filtros.texto + "%' OR t1.nom LIKE '%" + filtros.texto + "%') ";
        nFiltrosAnadidos++;
      } else {
        filtro = filtro + " (t1.cod LIKE '%" + filtros.texto + "%' OR t1.nom LIKE '%" + filtros.texto + "%') ";
        nFiltrosAnadidos++;
      }
    }

    switch (filtros.actividad) {
      case '0':
        filtro = filtro + '';
        break;
      case '1':
        if (nFiltrosAnadidos > 0) {
          filtro = filtro + ' AND activo = 1 ';
          nFiltrosAnadidos++;
        } else {
          filtro = filtro + ' activo = 1 ';
          nFiltrosAnadidos++;
        }
        break;
      case '2':
        if (nFiltrosAnadidos > 0) {
          filtro = filtro + ' AND activo = 0';
          nFiltrosAnadidos++;
        } else {
          filtro = filtro + ' activo = 0';
          nFiltrosAnadidos++;
        }
        break;
    }

    console.log(filtro);
    return filtro;
  }

  /**
   * Presenta un popover con el filtro de proveedores.
   * @param {any} ev - El evento que activó el popover.
   * @return {Promise<void>} Una promesa que se resuelve cuando el popover se cierra.
   * 
   */
  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: FiltroProveedoresComponent,
      componentProps: this.filtros,
      event: ev,
      translucent: true
    });
    await popover.present();

    popover.onDidDismiss().then((data) => {
      if (data.data != undefined) {
        this.filtros = data.data;
        this.filtroBusqueda = this.devuelveFiltroSentencia(this.filtros);
        this.proveedores = [];

        this.cargarProveedores(this.filtroBusqueda);
      } else {
        this.filtros = { texto: '', actividad: '0', nFiltrosAplicados: 0 };
      }
    }).catch((err) => {
      this.filtros = { texto: '', actividad: '0', nFiltrosAplicados: 0 };
    })
  }

  /**
   * Carga los proveedores correspondientes al filtro proporcionado.
   * @param {string} filtro - El filtro de proveedores a cargar.
   * @return {void} No se devuelve nada.
   * 
   */
  private cargarProveedores(filtro: string) {
    this.consultaRealizada = false;
    this.dbService.getProveedoresParaLista(filtro).then((proveedores) => {
      this.proveedoresAUX = proveedores;
      this.consultaRealizada = true;
      this.registros = this.proveedores.length;

      for (let i = 0; i < this.proveedoresPorPagina; i++) {
        if (this.proveedores.length < this.proveedoresAUX.length) {
          this.proveedores.push(this.proveedoresAUX[this.registros + i]);
          this.hayMasProveedores = true;
        } else {
          this.hayMasProveedores = false;
        }
      }
    });
  }


  /**
   * Carga los clientes correspondientes al filtro proporcionado.
   * @param {string} filtro - El filtro de clientes a cargar.
   * @return {void} No se devuelve nada.
   * 
   */
  onIonInfinite(ev: InfiniteScrollCustomEvent) {

    if (this.registros != this.proveedoresAUX.length) {
      this.cargarProveedores(this.filtroBusqueda);
      setTimeout(() => {
        (ev as InfiniteScrollCustomEvent).target.complete();
      }, 500);
    } else {

    }
  }

  /**
   * Carga los clientes correspondientes al filtro proporcionado.
   * @param {string} filtro - El filtro de clientes a cargar.
   * @return {void} No se devuelve nada.
   */
  pageController(route: string) {
    this.transferirService.sendObjectSource({ ruta: route });
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navC.navigateBack('/home');
      this.transferirService.sendObjectSource({ ruta: '/home' });
    });
  }

}

