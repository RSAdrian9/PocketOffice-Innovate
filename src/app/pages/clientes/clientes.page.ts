import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonItem, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonImg, InfiniteScrollCustomEvent, Platform, NavController, IonList, IonInfiniteScroll, IonInfiniteScrollContent, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonButton, IonSearchbar, PopoverController, IonProgressBar, IonCheckbox, IonBadge } from '@ionic/angular/standalone';
import { clienteTmp } from 'src/app/models/clienteTmp.model';
import { DbService } from 'src/app/services/db.service';
import { addIcons } from 'ionicons';
import { alertCircle, eyeOutline, funnel, search } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { FiltroClientesComponent } from 'src/app/components/filtro-clientes/filtro-clientes.component';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonImg, IonList, IonInfiniteScroll, IonInfiniteScrollContent, IonIcon, IonItem, RouterLink, RouterLinkActive, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonButton, IonSearchbar, IonProgressBar, IonCheckbox, IonBadge]
})

export class ClientesPage implements OnInit {
  public clientes: Array<clienteTmp> = [];
  private clientesAUX: Array<clienteTmp> = [];
  private filtroBusqueda: string = '';
  private clientesPorPagina: number = 25;
  private registros: number = 0;
  public hayMasClientes: boolean = true;
  public consultaRealizada: boolean = false;
  public mostrarBusqueda: boolean = false;
  public filtros: any = { texto: '', actividad: '0', riesgo: '0', nFiltrosAplicados: 0 };

    /**
   * Construye una nueva instancia de la clase.
   *
   * @param {Platform} platform - El servicio de la plataforma.
   * @param {DbService} dbService - El servicio de la base de datos.
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
   * Inicializa el componente y llama a los métodos pageController y cargarClientes.
   *
   * @return {void} No se devuelve nada por esta función.
   */
  ngOnInit() {
    this.pageController('/clientes');
    this.cargarClientes('');
  }

    /**
   * Se ejecuta cuando la vista ha sido completamente ingresada y ahora es la vista activa.
   * Llama al método pageController con la ruta '/clientes'.
   *
   * @return {void} Esta función no devuelve nada.
   */
  ionViewDidEnter() {
    this.pageController('/clientes');
  }

  /**
   * Filtra los clientes basados en el evento dado.
   * @param {any} $event - El evento que contiene el valor del filtro.
   * @return {Promise} - Una promesa que se resuelve cuando se completa el filtrado. 
   */
  public async filtrarClientes($event: any) {

    this.filtros.texto = $event.detail.value;
    this.filtroBusqueda = this.devuelveFiltroSentencia(this.filtros);
    this.clientes = [];

    this.cargarClientes(this.filtroBusqueda);
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

    if (filtros.texto != '' || filtros.actividad != '0' || filtros.riesgo != '0') {

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

    if (filtros.riesgo == '1') {
      if (nFiltrosAnadidos > 0) {
        filtro = filtro + ' AND riesgo > 0 AND totalimp > riesgo ';
        nFiltrosAnadidos++;
      } else {
        filtro = filtro + ' riesgo > 0 AND totalimp > riesgo ';
        nFiltrosAnadidos++;
      }
    } else {
      filtro = filtro + '';
    }

    console.log(filtro);
    return filtro;
  }

  /**
   * Presenta un popover con el filtro de clientes.
   * @param {any} ev - El evento que activó el popover.
   * @return {Promise<void>} Una promesa que se resuelve cuando el popover se cierra.
   * 
   */
  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: FiltroClientesComponent,
      componentProps: this.filtros,
      event: ev,
      translucent: true
    });
    await popover.present();

    popover.onDidDismiss().then((data) => {
      if (data.data != undefined) {
        this.filtros = data.data;
        this.filtroBusqueda = this.devuelveFiltroSentencia(this.filtros);
        this.clientes = [];

        this.cargarClientes(this.filtroBusqueda);
      } else {
        this.filtros = { texto: '', actividad: '0', riesgo: '0', nFiltrosAplicados: 0 };
      }
    }).catch((err) => {
      this.filtros = { texto: '', actividad: '0', riesgo: '0', nFiltrosAplicados: 0 };
    })
  }

  /**
   * Carga los clientes correspondientes al filtro proporcionado.
   * @param {string} filtro - El filtro de clientes a cargar.
   * @return {void} No se devuelve nada.
   * 
   */
  private cargarClientes(filtro: string) {
    this.consultaRealizada = false;
    this.dbService.getClientesParaLista(filtro).then((clientes) => {
      this.clientesAUX = clientes;
      this.consultaRealizada = true;
      this.registros = this.clientes.length;

      for (let i = 0; i < this.clientesPorPagina; i++) {
        if (this.clientes.length < this.clientesAUX.length) {
          this.clientes.push(this.clientesAUX[this.registros + i]);
          this.hayMasClientes = true;
        } else {
          this.hayMasClientes = false;
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

    if (this.registros != this.clientesAUX.length) {
      this.cargarClientes(this.filtroBusqueda);
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

  /**
   * Carga los clientes correspondientes al filtro proporcionado.
   * @param {string} filtro - El filtro de clientes a cargar.
   * @return {void} No se devuelve nada.
   */
  comprobarDiferencia(s: clienteTmp) {
    if (s.riesgo > 0.00) {
      if (s.totalimp > s.riesgo) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }

}
