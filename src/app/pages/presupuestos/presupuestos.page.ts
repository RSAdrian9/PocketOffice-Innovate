import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { ActivatedRoute } from '@angular/router';
import { Platform, NavController, InfiniteScrollCustomEvent, IonInfiniteScroll, IonInfiniteScrollContent, PopoverController, IonBadge, IonButton, IonItem, IonItemDivider, IonGrid, IonRow, IonCol, IonIcon } from '@ionic/angular/standalone';
import { DbService } from 'src/app/services/db.service';
import { presupuestos } from 'src/app/models/presupuestos.model';
import { FiltroPresupuestosComponent } from 'src/app/components/filtro-presupuestos/filtro-presupuestos.component';

@Component({
  selector: 'app-presupuestos',
  templateUrl: './presupuestos.page.html',
  styleUrls: ['./presupuestos.page.scss'],
  standalone: true,
  providers: [DatePipe],
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PresupuestosPage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  codigo: string = '';
  nombre: string = '';
  private series: Array<any> = [];
  private estados: Array<any> = [];
  public presupuestos: Array<presupuestos> = [];
  private presupuestosAUX: Array<presupuestos> = [];
  private filtroBusqueda: string = '';
  private presupuestosPorPagina: number = 25;
  private registros: number = 0;
  public hayMasPresupuestos: boolean = true;
  public consultaRealizada: boolean = false;
  public mostrarBusqueda: boolean = false;
  public importePresupuestos: number = 0;
  public filtros: any = { texto: '', estado: 'Todos', serie: 'Todos', fechaDesde: '', fechaHasta: '', orden: '1', nFiltrosAplicados: 0 };

/**
 * Constructor de la clase PedidosPage.
 *
 * @param {Platform} platform - El servicio de la plataforma.
 * @param {DbService} dbService - El servicio de base de datos.
 * @param {DatePipe} datepipe - El servicio de formateo de fecha.
 * @param {PopoverController} popoverController - El controlador de popover.
 * @param {TransferirDatosService} transferirService - El servicio de transferencia de datos.
 * @param {NavController} navC - El controlador de navegación.
 */
  constructor(
    private platform: Platform,
    private transferirService: TransferirDatosService,
    private navC: NavController,
    private popoverController: PopoverController,
    private datepipe: DatePipe,
    private dbService: DbService
  ) { }

 /**
 * Inicializa el componente y recupera el parámetro 'codigo' de la instantánea de la ruta activada.
 * Llama al método 'pageController'.
 *
 * @return {void} Esta función no devuelve nada.
 */
  ngOnInit() {
    this.codigo = this.activatedRoute.snapshot.paramMap.get('codigo') as string;
    this.pageController();
  }

 /**
 * Se ejecuta cuando la vista ha completado la entrada y ahora es la vista activa.
 * Recupera el parámetro 'codigo' de la instantánea de la ruta activada y lo asigna a la propiedad 'codigo'.
 * Llama al método 'pageController'.
 *
 * @return {void} Esta función no devuelve nada.
 */
  ionViewDidEnter() {
    this.codigo = this.activatedRoute.snapshot.paramMap.get('codigo') as string;
    this.pageController();
  }

   /**
   * Ejecuta la lógica del controlador de página.
   *
   * Establece la propiedad `filtroBusqueda` llamando al método `devuelveFiltroSentencia` con la propiedad `filtros`.
   * Llama al método `cargarPedidos` con la propiedad `filtroBusqueda`.
   *
   * Envía un objeto con la propiedad `codigo` al servicio `transferirService` utilizando el método `sendObjectSource`.
   * Se suscribe al evento de botón de retroceso con una prioridad de 10 y llama al método `goBack` cuando se activa el evento.
   */
  pageController() {
    this.filtroBusqueda = this.devuelveFiltroSentencia(this.filtros);
    this.cargarPresupuestos(this.filtroBusqueda);

    this.transferirService.sendObjectSource({ codigo: this.codigo })
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.goBack();
    });
  }

 /**
 * Navega hacia atrás a la vista adecuada según el valor de 'this.tipo' y envía el objeto fuente al servicio 'this.transferirService'.
 * Si 'this.tipo' es 'cliente', navega hacia atrás a '/vista-cliente/{this.codigo}'.
 *
 * @return {void} Esta función no devuelve nada.
 */
  goBack() {
    this.navC.navigateBack('/vista-cliente/' + this.codigo);
    this.transferirService.sendObjectSource({ ruta: '/vista-cliente' });
  }

    /**
   * Filtra los presupuestos basados en el valor del evento proporcionado.
   *
   * @param {any} $event - El objeto de evento que contiene el valor por el cual filtrar.
   * @return {Promise<void>} - Una promesa que se resuelve cuando el filtrado está completo.
   */
  public async filtrarPresupuestos($event: any) {

    this.filtros.texto = $event.detail.value;
    this.filtroBusqueda = this.devuelveFiltroSentencia(this.filtros);
    this.presupuestos = [];

    this.cargarPresupuestos(this.filtroBusqueda);
  }
  
  /**
  * Genera una oración de filtro basada en los filtros proporcionados.
  *
  * @param {any} filtros - El objeto de filtros que contiene los valores de filtro.
  * @return {string} - La oración de filtro generada.
  */
  private devuelveFiltroSentencia(filtros: any): string {
    let filtro = '';
    let nFiltrosAnadidos = 0;

    if (filtros.texto != '' || filtros.fechaDesde != '' || filtros.fechaHasta != '' || filtros.estado != 'Todos' || filtros.serie != 'Todos') {
      filtro = filtro + 'AND ';
    }

    if (filtros.texto != '') {
      if (nFiltrosAnadidos > 0) {
        filtro = filtro + " AND num LIKE '%" + filtros.texto + "%' ";
        nFiltrosAnadidos++;
      } else {
        filtro = filtro + " num LIKE '%" + filtros.texto + "%' ";
        nFiltrosAnadidos++;
      }
    }

    if (filtros.serie != 'Todos') {
      if (nFiltrosAnadidos > 0) {
        filtro = filtro + " AND substr(num,1,2) = '" + filtros.serie + "' ";
        nFiltrosAnadidos++;
      } else {
        filtro = filtro + " substr(num,1,2) = '" + filtros.serie + "' ";
        nFiltrosAnadidos++;
      }
    }

    if (filtros.estado != 'Todos') {
      if (nFiltrosAnadidos > 0) {
        filtro = filtro + " AND est = '" + filtros.estado + "' ";
        nFiltrosAnadidos++;
      } else {
        filtro = filtro + " est = '" + filtros.estado + "' ";
        nFiltrosAnadidos++;
      }
    }

    if (filtros.fechaDesde != '') {
      if (nFiltrosAnadidos > 0) {
        filtro = filtro + " AND fec >= '" + this.formatearFecha(filtros.fechaDesde) + "' ";
        nFiltrosAnadidos++;
      } else {
        filtro = filtro + " fec >= '" + this.formatearFecha(filtros.fechaDesde) + "' ";
        nFiltrosAnadidos++;
      }
    } else {
      filtro = filtro + '';
    }

    if (filtros.fechaHasta != '') {
      if (nFiltrosAnadidos > 0) {
        filtro = filtro + " AND fec <= '" + this.formatearFecha(filtros.fechaHasta) + "' ";
        nFiltrosAnadidos++;
      } else {
        filtro = filtro + " fec <= '" + this.formatearFecha(filtros.fechaHasta) + "' ";
        nFiltrosAnadidos++;
      }
    } else {
      filtro = filtro + '';
    }

    switch (filtros.orden) {
      case '1':
        filtro = filtro + " ORDER BY fec DESC";
        break;
      case '2':
        filtro = filtro + " ORDER BY fec ASC";
        break;
      case '3':
        filtro = filtro + " ORDER BY num DESC";
        break;
      case '3':
        filtro = filtro + " ORDER BY num ASC";
        break;
    }

    return filtro;
  }

    /**
   * Muestra un popover con el componente FiltroPresupuestosComponent y maneja el evento de desaparición.
   *
   * @param {any} ev - El evento que desencadenó la aparición del popover.
   * @return {Promise<void>} Una promesa que se resuelve cuando el popover se desaparece.
   */
  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: FiltroPresupuestosComponent,
      componentProps: { filtros: this.filtros, series: this.series, estados: this.estados },
      event: ev,
      translucent: true
    });
    await popover.present();

    popover.onDidDismiss().then((data) => {
      if (data.data != undefined) {
        console.log(data);
        this.filtros = data.data;
        this.filtroBusqueda = this.devuelveFiltroSentencia(this.filtros);
        this.presupuestos = [];

        this.cargarPresupuestos(this.filtroBusqueda);
      } else {
        this.filtros = { texto: '', estado: 'Todos', serie: 'Todos', fechaDesde: '', fechaHasta: '', orden: '1', nFiltrosAplicados: 0 };
      }
    }).catch((err) => {
      this.filtros = { texto: '', estado: 'Todos', serie: 'Todos', fechaDesde: '', fechaHasta: '', orden: '1', nFiltrosAplicados: 0 };
    })
  }

    /**
   * Carga la lista de presupuestos basada en el filtro proporcionado.
   *
   * @param {string} filtro - El filtro a aplicar a la lista de presupuestos.
   * @return {void} Esta función no devuelve nada.
   */
  cargarPresupuestos(filtro: string) {
    this.consultaRealizada = false;
    this.dbService.getListadoPresupuestos(this.codigo, filtro).then((presupuestos) => {
      this.presupuestosAUX = presupuestos;
      this.calcularImportePresupuestos();
      this.consultaRealizada = true;
      this.registros = this.presupuestos.length;

      for (let i = 0; i < this.presupuestosPorPagina; i++) {
        if (this.presupuestos.length < this.presupuestosAUX.length) {
          this.presupuestos.push(this.presupuestosAUX[this.registros + i]);
          this.hayMasPresupuestos = true;
        } else {
          this.hayMasPresupuestos = false;
        }
      }
    });
    this.dbService.getNombreCliente(this.codigo).then((nombre) => {
      this.nombre = nombre;
    });
    this.dbService.getSeriesDocumento('', 'presupuesto', this.codigo).then((series) => {
      this.series = series;
    });
    this.dbService.getEstadosPresupuestos( this.codigo ).then((estados) => {
      this.estados = estados;
    });
  }

    /**
   * Calcula el importe total de los presupuestos.
   *
   * Esta función itera sobre el array presupuestosAUX y calcula el importe total sumando los valores de la propiedad 'toteu' de cada elemento. El resultado se almacena en la variable importePresupuestos, que luego se redondea a 2 decimales.
   *
   * @return {void} Esta función no devuelve ningún valor.
   */
  calcularImportePresupuestos() {
    this.importePresupuestos = 0;
    for (let index = 0; index < this.presupuestosAUX.length; index++) {
      let importe = this.presupuestosAUX[index].toteu;
      if (importe != null || importe != undefined) {
        this.importePresupuestos = this.importePresupuestos + parseFloat(importe);
      }
    }
    this.importePresupuestos = parseFloat(this.importePresupuestos.toFixed(2));
  }

    /**
   * Maneja el evento de desplazamiento infinito.
   *
   * @param {InfiniteScrollCustomEvent} ev - El objeto de evento de desplazamiento infinito.
   * @return {void} Esta función no devuelve nada.
   */
  onIonInfinite(ev: InfiniteScrollCustomEvent) {

    if (this.registros != this.presupuestosAUX.length) {
      this.cargarPresupuestos(this.filtroBusqueda);
      setTimeout(() => {
        (ev as InfiniteScrollCustomEvent).target.complete();
      }, 500);
    } else {

    }
  }

    /**
 * Formatea una cadena de fecha dada en el formato 'yyyy-MM-dd'.
 *
 * @param {string} fecha - La cadena de fecha a formatear.
 * @return {string} La cadena de fecha formateada, o una cadena vacía si la entrada es nula.
 */
  public formatearFecha(fecha: string) {
    let fechaFormateada;
    if (fecha != null) {
      fechaFormateada = this.datepipe.transform(fecha, 'yyyy-MM-dd');
    } else {
      fechaFormateada = '';
    }

    return fechaFormateada;
  }

 /**
 * Formatea un número limitando sus decimales a 2, reemplazando el punto decimal con una coma y agregando separadores de miles.
 *
 * @param {any} numero - El número a formatear.
 * @return {string} El número formateado como una cadena.
 */
  formatearNumero(numero: any){
    let numeroFormateado = parseFloat(numero).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    return numeroFormateado;
  }

}