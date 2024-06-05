import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, Platform } from '@ionic/angular';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { InfiniteScrollCustomEvent, IonInfiniteScroll, IonInfiniteScrollContent, PopoverController, IonBadge, IonButton, IonItem, IonItemDivider, IonGrid, IonRow, IonCol, IonIcon } from '@ionic/angular/standalone';
import { DbService } from 'src/app/services/db.service';
import { addIcons } from 'ionicons';
import { openOutline } from 'ionicons/icons';
import { mayor } from 'src/app/models/mayor.model';
import { anio } from 'src/app/models/anio.model';
import { FiltroMayorComponent } from 'src/app/components/filtro-mayor/filtro-mayor.component';

@Component({
  selector: 'app-mayor',
  templateUrl: './mayor.page.html',
  styleUrls: ['./mayor.page.scss'],
  standalone: true,
  providers: [DatePipe],
  imports: [IonicModule, RouterModule, CommonModule, FormsModule, IonInfiniteScroll, IonInfiniteScrollContent, IonBadge, IonButton, IonItem, IonItemDivider, IonGrid, IonRow, IonCol, IonIcon]
})
export class MayorPage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  codigo: string = '';
  tipo: string = '';
  nombre: string = '';
  public anios: Array<anio> = [];
  public mayor: Array<mayor> = [];
  private mayorAUX: Array<mayor> = [];
  private filtroBusqueda: string = '';
  private mayorPorPagina: number = 10;
  private registros: number = 0;
  public hayMasMayor: boolean = true;
  public consultaRealizada: boolean = false;
  public mostrarBusqueda: boolean = false;
  public totalDebe: number = 0;
  public totalHaber: number = 0;
  public totalSaldo: number = 0;
  public filtros: any = { texto: '', anio: this.devuelveAnioDefecto(), fechaDesde: '', fechaHasta: '', nFiltrosAplicados: 1 };

    /**
   * Crea una nueva instancia de la clase.
   *
   * @param {Platform} platform - El servicio de la plataforma.
   * @param {TransferirDatosService} transferirService - El servicio de transferencia de datos.
   * @param {NavController} navC - El controlador de navegación.
   * @param {DbService} dbService - El servicio de base de datos.
   * @param {DatePipe} datepipe - El servicio de formateo de fecha.
   * @param {PopoverController} popoverController - El controlador de popover.
   */
  constructor(
    private platform: Platform,
    private transferirService: TransferirDatosService,
    private navC: NavController,
    private dbService: DbService,
    private datepipe: DatePipe,
    private popoverController: PopoverController
  ) {
    addIcons({
      openOutline
    });
  }

  /**
 * Inicializa el componente y recupera los parámetros 'tipo' y 'codigo' de la instantánea de la ruta activada.
 * Registra los parámetros de la ruta activada en la consola.
 * Llama al método 'pageController'.
 */
  ngOnInit() {
    this.tipo = this.activatedRoute.snapshot.paramMap.get('tipo') as string;
    this.codigo = this.activatedRoute.snapshot.paramMap.get('codigo') as string;
    console.log(this.activatedRoute.snapshot.params);

    this.pageController();
  }

  /**
 * Se ejecuta cuando la vista ha completado la entrada y ahora es la vista activa.
 * Recupera los parámetros 'tipo' y 'codigo' de la instantánea de la ruta activada.
 * Registra los parámetros de la ruta activada en la consola.
 * Llama al método 'pageController'.
 */
  ionViewDidEnter() {
    this.tipo = this.activatedRoute.snapshot.paramMap.get('tipo') as string;
    this.codigo = this.activatedRoute.snapshot.paramMap.get('codigo') as string;
    console.log(this.activatedRoute.snapshot.params);

    this.pageController();
  }

    /**
   * Asincrónicamente carga la lista de mayor para un filtro dado, basándose en el tipo de entidad.
   *
   * @param {string} filtro - El filtro a aplicar a la lista de mayor.
   * @return {Promise<void>} Una promesa que se resuelve cuando se haya cargado la lista de mayor.
   */
  async cargarMayor(filtro: string) {
    switch (this.tipo) {
      case 'cliente':
        this.consultaRealizada = false;
        this.dbService.getListadoMayorDeCuentas('CL', this.codigo, filtro).then((mayor) => {
          this.mayorAUX = mayor;
          this.calcularImporteMayor();
          this.consultaRealizada = true;
          this.registros = this.mayor.length;

          for (let i = 0; i < this.mayorPorPagina; i++) {
            if (this.mayor.length < this.mayorAUX.length) {
              this.mayor.push(this.mayorAUX[this.registros + i]);
              this.hayMasMayor = true;
            } else {
              this.hayMasMayor = false;
            }
          }

        });
        this.dbService.getNombreCliente(this.codigo).then((nombre) => {
          this.nombre = nombre;
        });
        this.dbService.getAniosApuntes('CL', this.codigo).then((anios) => {
          this.anios = anios;
        });
        break;
      case 'proveedor':
        this.consultaRealizada = false;
        this.dbService.getListadoMayorDeCuentas('PR', this.codigo, filtro).then((mayor) => {
          this.mayorAUX = mayor;
          this.consultaRealizada = true;
          this.registros = this.mayor.length;

          for (let i = 0; i < this.mayorPorPagina; i++) {
            if (this.mayor.length < this.mayorAUX.length) {
              this.mayor.push(this.mayorAUX[this.registros + i]);
              this.hayMasMayor = true;
            } else {
              this.hayMasMayor = false;
            }
          }

        });
        this.dbService.getNombreCliente(this.codigo).then((nombre) => {
          this.nombre = nombre;
        });
        this.dbService.getAniosApuntes('PR', this.codigo).then((anios) => {
          this.anios = anios;
        });
        break;
    }

  }

    /**
   * Navega hacia atrás a la vista adecuada basándose en el valor de 'this.tipo' y envía el origen del objeto a 'this.transferirService'.
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
   * Ejecuta la lógica del controlador de página.
   *
   * Esta función establece la propiedad `filtroBusqueda` llamando al método `devuelveFiltroSentencia` con la propiedad `filtros`.
   * Luego llama al método `cargarMayor` con la propiedad `filtroBusqueda`.
   *
   * Después de eso, envía un objeto con la propiedad `codigo` al servicio `transferirService` utilizando el método `sendObjectSource`.
   *
   * Finalmente, se suscribe al evento del botón Atrás con una prioridad de 10 y llama al método `goBack` cuando se activa el evento.
   */
  pageController() {
    this.filtroBusqueda = this.devuelveFiltroSentencia(this.filtros);
    this.cargarMayor(this.filtroBusqueda);

    this.transferirService.sendObjectSource({ codigo: this.codigo })
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.goBack();
    });
  }

  /**
 * Filtra los efectos en función del valor proporcionado en el evento y actualiza la búsqueda del filtro y los datos.
 *
 * @param {$event} $event - El objeto de evento que contiene el valor de detalle.
 * @return {Promise<void>} Una promesa que se resuelve cuando se aplica el filtro y se cargan los datos.
 */
  public async filtrarEfectos($event: any) {

    this.filtros.texto = $event.detail.value;
    this.filtroBusqueda = this.devuelveFiltroSentencia(this.filtros);
    this.mayor = [];

    this.cargarMayor(this.filtroBusqueda);
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

    if (filtros.texto != '' || filtros.anio != '' || filtros.fechaDesde != '' || filtros.fechaHasta != '') {
      filtro = filtro + 'AND ';
    }

    if (filtros.texto != '') {
      if (nFiltrosAnadidos > 0) {
        filtro = filtro + " AND con LIKE '%" + filtros.texto + "%' ";
        nFiltrosAnadidos++;
      } else {
        filtro = filtro + " con LIKE '%" + filtros.texto + "%' ";
        nFiltrosAnadidos++;
      }
    }

    if (filtros.anio != '') {
      if (nFiltrosAnadidos > 0) {
        filtro = filtro + " AND anio='" + filtros.anio + "' ";
        nFiltrosAnadidos++;
      } else {
        filtro = filtro + " anio='" + filtros.anio + "' ";
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

    return filtro;
  }

    /**
   * Presenta un popover con el componente FiltroMayorComponent y maneja el evento de cierre.
   *
   * @param {any} ev - El evento que desencadenó la presentación del popover.
   * @return {Promise<void>} Una promesa que se resuelve cuando el popover se cierra.
   */
  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: FiltroMayorComponent,
      componentProps: { filtros: this.filtros, anios: this.anios },
      event: ev,
      translucent: true
    });
    await popover.present();

    popover.onDidDismiss().then((data) => {
      if (data.data != undefined) {
        console.log(data);
        this.filtros = data.data;
        this.filtroBusqueda = this.devuelveFiltroSentencia(this.filtros);
        this.mayor = [];

        console.log(this.filtroBusqueda);
        this.cargarMayor(this.filtroBusqueda);
      } else {
        this.filtros = { texto: '', anio: this.devuelveAnioDefecto(), fechaDesde: '', fechaHasta: '', nFiltrosAplicados: 1 };
      }
    }).catch((err) => {
      this.filtros = { texto: '', anio: this.devuelveAnioDefecto(), fechaDesde: '', fechaHasta: '', nFiltrosAplicados: 1 };
    })
  }

    /**
   * Calcula los importes totales de débito, crédito y saldo desde el array 'mayorAUX'.
   *
   * Esta función itera sobre cada elemento en el array 'mayorAUX' y calcula los importes totales de débito y crédito basados en la propiedad 'sig'.
   * El importe total de débito se calcula si la propiedad 'sig' es 'D', y el importe total de crédito se calcula si la propiedad 'sig' es 'H'.
   * Los importes calculados se almacenan en las propiedades 'totalDebe', 'totalHaber' y 'totalSaldo'.
   *
   * @return {void} Esta función no devuelve ningún valor.
   */
  calcularImporteMayor() {
    this.totalDebe = 0;
    this.totalHaber = 0;
    this.totalSaldo = 0;

    for (let index = 0; index < this.mayorAUX.length; index++) {
      let importeDebe = this.mayorAUX[index].impeu;
      if (importeDebe != null || importeDebe != undefined) {
        if (this.mayorAUX[index].sig == 'D') {
          this.totalDebe = this.totalDebe + parseFloat(importeDebe);
        }
      }

      let importeHaber = this.mayorAUX[index].impeu;
      if (importeHaber != null || importeHaber != undefined) {
        if (this.mayorAUX[index].sig == 'H') {
          this.totalHaber = this.totalHaber + parseFloat(importeHaber);
        }
      }

    }

    this.totalDebe = parseFloat(this.totalDebe.toFixed(2));
    this.totalHaber = parseFloat(this.totalHaber.toFixed(2));
    this.totalSaldo = this.totalDebe - this.totalHaber;
  }

  /**
   * Maneja el evento de desplazamiento infinito.
   * @param {InfiniteScrollCustomEvent} ev - El objeto de evento que representa el evento de desplazamiento infinito.
   * @return {void} Esta función no devuelve nada. 
   */
  onIonInfinite(ev: InfiniteScrollCustomEvent) {

    if (this.registros != this.mayorAUX.length) {
      this.cargarMayor(this.filtroBusqueda);
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
   * Formatea un número limite sus decimales a 2, reemplazando el punto decimal por una coma y agregando separadores de miles.
   *
   * @param {any} numero - El número a formatear.
   * @return {string} El número formateado como una cadena de texto.
   */
  formatearNumero(numero: any) {
    let numeroFormateado = parseFloat(numero).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    return numeroFormateado;
  }

  /**
   * Devuelve el año actual como una cadena de texto.
   *
   * @return {string} El año actual.
   */
  devuelveAnioDefecto(): string {
    return (new Date()).getFullYear().toString();
  }


}