import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { ActivatedRoute } from '@angular/router';
import { pedidosCliente } from 'src/app/models/pedidos-cliente.model';
import { pedidosProveedor } from 'src/app/models/pedidos-proveedor.model';
import { Platform, NavController, InfiniteScrollCustomEvent, IonInfiniteScroll, IonInfiniteScrollContent, PopoverController, IonBadge, IonButton, IonItem, IonItemDivider, IonGrid, IonRow, IonCol, IonIcon } from '@ionic/angular/standalone';
import { DbService } from 'src/app/services/db.service';
import { FiltroPedidosComponent } from 'src/app/components/filtro-pedidos/filtro-pedidos.component';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
  standalone: true,
  providers: [DatePipe],
  imports: [IonicModule, CommonModule, FormsModule, IonInfiniteScroll, IonInfiniteScrollContent, IonBadge, IonButton, IonItem, IonItemDivider, IonGrid, IonRow, IonCol, IonIcon]
})
export class PedidosPage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  codigo: string = '';
  tipo: string = '';
  nombre: string = ''
  private series: Array<any> = [];
  private estados: Array<any> = [];
  public pedidosCliente: Array<pedidosCliente> = [];
  private pedidosAUXCliente: Array<pedidosCliente> = [];
  public pedidosProveedor: Array<pedidosProveedor> = [];
  private pedidosAUXProveedor: Array<pedidosProveedor> = [];
  private filtroBusqueda: string = '';
  private pedidosPorPagina: number = 25;
  private registros: number = 0;
  public hayMasPedidos: boolean = true;
  public consultaRealizada: boolean = false;
  public mostrarBusqueda: boolean = false;
  public importePedidos: number = 0;
  public filtros: any = { texto: '', servido: 'Todos', estado: 'Todos', serie: 'Todos', fechaDesde: '', fechaHasta: '', orden: '1', nFiltrosAplicados: 0 };


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
    private dbService: DbService,
    private datepipe: DatePipe,
    private popoverController: PopoverController,
    private transferirService: TransferirDatosService,
    private navC: NavController
  ) { }

 /**
 * Inicializa el componente y establece las propiedades 'tipo' y 'codigo' basadas en los parámetros de la ruta activada.
 * Luego llama al método 'pageController'.
 *
 * @return {void} Esta función no devuelve nada.
 */
  ngOnInit() {
    this.tipo = this.activatedRoute.snapshot.paramMap.get('tipo') as string;
    this.codigo = this.activatedRoute.snapshot.paramMap.get('codigo') as string;

    this.pageController();
  }

 /**
 * Se ejecuta cuando la vista ha entrado completamente y ahora es la vista activa.
 * Establece las propiedades 'tipo' y 'codigo' basadas en los parámetros de la ruta activada.
 * Llama al método 'pageController'.
 *
 * @return {void} Esta función no devuelve nada.
 */
  ionViewDidEnter() {
    this.tipo = this.activatedRoute.snapshot.paramMap.get('tipo') as string;
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
    this.cargarPedidos(this.filtroBusqueda);

    this.transferirService.sendObjectSource({ codigo: this.codigo })
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.goBack();
    });
  }

  /**
 * Navega hacia atrás a la vista adecuada según el valor de 'this.tipo' y envía el objeto fuente al servicio 'this.transferirService'.
 * Si 'this.tipo' es 'cliente', navega hacia atrás a '/vista-cliente/{this.codigo}'.
 * Si 'this.tipo' es 'proveedor', navega hacia atrás a '/vista-proveedor/{this.codigo}'.
 *
 * @return {void} Esta función no devuelve nada.
 */
  goBack() {
    switch (this.tipo) {
      case 'cliente':
        this.navC.navigateBack('/vista-cliente/' + this.codigo);
        this.transferirService.sendObjectSource({ ruta: '/vista-cliente' });
        break;
      case 'proveedor':
        this.navC.navigateBack('/vista-proveedor/' + this.codigo);
        this.transferirService.sendObjectSource({ ruta: '/vista-proveedor' });
        break;
    }
  }

  /**
 * Filtra los pedidos basados en el valor de entrada.
 *
 * @param {$event} $event - El evento que contiene el valor para filtrar los pedidos.
 * @return {Promise<void>} Una promesa que se resuelve cuando los pedidos han sido filtrados.
 */
  public async filtrarPedidos($event: any) {

    this.filtros.texto = $event.detail.value;
    this.filtroBusqueda = this.devuelveFiltroSentencia(this.filtros);
    this.pedidosCliente = [];
    this.pedidosProveedor = [];

    this.cargarPedidos(this.filtroBusqueda);
  }

  /**
   * Genera una sentencia de filtro basada en los filtros proporcionados.
   *
   * @param {any} filtros - Los filtros a aplicar.
   * @return {string} La sentencia de filtro generada.
   */
  private devuelveFiltroSentencia(filtros: any): string {
    let filtro = '';
    let nFiltrosAnadidos = 0;

    if (filtros.texto != '' || filtros.fechaDesde != '' || filtros.fechaHasta != '' || filtros.servido != 'Todos' || filtros.estado != 'Todos' || filtros.serie != 'Todos') {
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

    if (filtros.servido != 'Todos') {
      if (nFiltrosAnadidos > 0) {
        filtro = filtro + " AND ser = '" + filtros.servido + "' ";
        nFiltrosAnadidos++;
      } else {
        filtro = filtro + " ser = '" + filtros.servido + "' ";
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
 * Presenta un popover con el componente FiltroPedidosComponent y maneja el evento de cierre.
 *
 * @param {any} ev - El evento que desencadenó la aparición del popover.
 * @return {Promise<void>} Una promesa que se resuelve cuando el popover se cierra.
 */
  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: FiltroPedidosComponent,
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
        this.pedidosCliente = [];
        this.pedidosProveedor = [];

        this.cargarPedidos(this.filtroBusqueda);
      } else {
        this.filtros = { texto: '', servido: 'Todos', estado: 'Todos', serie: 'Todos', fechaDesde: '', fechaHasta: '', orden: '1', nFiltrosAplicados: 0 };
      }
    }).catch((err) => {
      this.filtros = { texto: '', servido: 'Todos', estado: 'Todos', serie: 'Todos', fechaDesde: '', fechaHasta: '', orden: '1', nFiltrosAplicados: 0 };
    })
  }

  /**
 * Carga la lista de pedidos basada en el filtro dado.
 *
 * @param {string} filtro - El filtro a aplicar a la lista de pedidos.
 * @return {void} Esta función no devuelve nada.
 */
  private cargarPedidos(filtro: string) {
    switch (this.tipo) {
      case 'cliente':
        this.consultaRealizada = false;
        this.dbService.getListadoPedidos('CL', this.codigo, filtro).then((pedidos) => {
          this.pedidosAUXCliente = pedidos;
          this.calcularImportePedidos();
          this.consultaRealizada = true;
          this.registros = this.pedidosCliente.length;

          for (let i = 0; i < this.pedidosPorPagina; i++) {
            if (this.pedidosCliente.length < this.pedidosAUXCliente.length) {
              this.pedidosCliente.push(this.pedidosAUXCliente[this.registros + i]);
              this.hayMasPedidos = true;
            } else {
              this.hayMasPedidos = false;
            }
          }
        });
        this.dbService.getNombreCliente(this.codigo).then((nombre) => {
          this.nombre = nombre;
        });
        this.dbService.getSeriesDocumento('CL', 'pedido', this.codigo).then((series) => {
          this.series = series;
        });
        this.dbService.getEstadosPedidos('CL', this.codigo).then((estados) => {
          this.estados = estados;
        });
        break;
      case 'proveedor':
        this.consultaRealizada = false;
        this.dbService.getListadoPedidos('PR', this.codigo, filtro).then((pedidos) => {
          this.pedidosAUXProveedor = pedidos;
          this.calcularImportePedidos();
          this.consultaRealizada = true;
          this.registros = this.pedidosProveedor.length;

          for (let i = 0; i < this.pedidosPorPagina; i++) {
            if (this.pedidosProveedor.length < this.pedidosAUXProveedor.length) {
              this.pedidosProveedor.push(this.pedidosAUXProveedor[this.registros + i]);
              this.hayMasPedidos = true;
            } else {
              this.hayMasPedidos = false;
            }
          }
        });
        this.dbService.getNombreProveedor(this.codigo).then((nombre) => {
          this.nombre = nombre;
        });
        this.dbService.getSeriesDocumento('PR', 'pedido', this.codigo).then((series) => {
          this.series = series;
        });
        this.dbService.getEstadosPedidos('PR', this.codigo).then((estados) => {
          this.estados = estados;
        });
        break;
    }
  }

    /**
   * Calcula el importe total de los pedidos según el tipo de pedido.
   *
   * Esta función itera sobre la lista de pedidos (cliente o proveedor)
   * y calcula el importe total de cada pedido. El importe total se almacena
   * en la propiedad `importePedidos`. La función verifica si el tipo de pedido
   * es 'cliente' o 'proveedor' y realiza el cálculo correspondiente. La
   * función también redondea el importe total a 2 decimales.
   *
   * @return {void} Esta función no devuelve nada.
   */
  calcularImportePedidos() {
    this.importePedidos = 0;
    if (this.tipo == 'cliente'){
      for (let index = 0; index < this.pedidosAUXCliente.length; index++) {
        let importe = this.pedidosAUXCliente[index].toteu;
        if (importe != null || importe != undefined) {
          this.importePedidos = this.importePedidos + parseFloat(importe);
        }
      }
    } else if (this.tipo == 'proveedor'){
      for (let index = 0; index < this.pedidosAUXProveedor.length; index++) {
        let importe = this.pedidosAUXProveedor[index].toteu;
        if (importe != null || importe != undefined) {
          this.importePedidos = this.importePedidos + parseFloat(importe);
        }
      }
    }
    this.importePedidos = parseFloat(this.importePedidos.toFixed(2));
  }

  /**
 * Maneja el evento de scroll infinito.
 *
 * @param {InfiniteScrollCustomEvent} ev - El objeto de evento para el scroll infinito.
 * @return {void} Esta función no devuelve nada.
 */
  onIonInfinite(ev: InfiniteScrollCustomEvent) {
    if (this.tipo == 'cliente') {
      if (this.registros != this.pedidosAUXCliente.length) {
        this.cargarPedidos(this.filtroBusqueda);
        setTimeout(() => {
          (ev as InfiniteScrollCustomEvent).target.complete();
        }, 500);
      }
    } else if (this.tipo == 'proveedor') {
      if (this.registros != this.pedidosAUXProveedor.length) {
        this.cargarPedidos(this.filtroBusqueda);
        setTimeout(() => {
          (ev as InfiniteScrollCustomEvent).target.complete();
        }, 500);
      }
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
   * Determina la clase de color de fondo basada en el estado de servicio del pedido dado.
   *
   * @param {any} pedido - El objeto de pedido para verificar el estado de servicio.
   * @return {string} La clase de color de fondo correspondiente al estado de servicio del pedido.
   */
  comprobarServido(pedido: any): string {
    if (pedido.ser == "") {
      return "rowBackgroundRed";
    } else if (pedido.ser == "1") {
      return "rowBackgroundCian";
    } else if (pedido.ser == "2") {
      return "rowBackgroundGreen";
    } else {
      return "rowBackgroundGray";
    }
  }

  /**
 * Formatea un número limitando sus decimales a 2, reemplazando el punto decimal con una coma y agregando separadores de miles.
 *
 * @param {any} numero - El número a formatear.
 * @return {string} El número formateado como una cadena.
 */
  formatearNumero(numero: any) {
    let numeroFormateado = parseFloat(numero).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    return numeroFormateado;
  }

}