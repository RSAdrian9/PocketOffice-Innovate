import { Component, OnInit } from '@angular/core';
import { PopoverController, ModalController, IonButton, IonCheckbox, IonItem, IonItemDivider, IonList, NavParams, IonSelect, IonSelectOption, IonIcon, IonBadge } from '@ionic/angular/standalone';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { calendarOutline, trashBin } from 'ionicons/icons';
import { DatePickerComponent } from '../date-picker/date-picker.component';

@Component({
  selector: 'app-filtro-pedidos',
  templateUrl: './filtro-pedidos.component.html',
  styleUrls: ['./filtro-pedidos.component.scss'],
  standalone: true,
  providers: [DatePipe],
  imports: [FormsModule, CommonModule, IonItem, IonList, IonItemDivider, IonCheckbox, IonButton, IonSelect, IonSelectOption, IonIcon, IonBadge]
})
export class FiltroPedidosComponent implements OnInit {
  filtros: any = { texto: '', servido:'Todos', estado: 'Todos', serie: 'Todos', fechaDesde: '', fechaHasta: '', orden: '1', nFiltrosAplicados: 0 };
  nFiltrosAplicados: number = 0;
  public series: Array<any> = [];
  public estados: Array<any> = [];
  public tipo: string = "";

 /**
 * Constructor para la clase FiltroPedidosComponent.
 *
 * @param {PopoverController} popoverController - La instancia de PopoverController.
 * @param {DatePipe} datepipe - La instancia de DatePipe.
 * @param {NavParams} navParams - La instancia de NavParams.
 * @param {ModalController} modalController - La instancia de ModalController.
 */
  constructor(
    private popoverController: PopoverController,
    private datepipe: DatePipe,
    private navParams: NavParams,
    private modalController: ModalController
  ) {
    addIcons({ calendarOutline, trashBin });
  }

  ngOnInit() { }

 /**
 * Actualiza el valor de la propiedad 'servido' en el objeto 'filtros' basado en el valor del evento.
 *
 * @param {any} ev - El objeto de evento que contiene el nuevo valor.
 * @return {void} Esta función no devuelve ningún valor.
 */
  controladorSelectServido(ev: any) {
    this.filtros.servido = ev.detail.value;
  }

 /**
 * Actualiza la propiedad estado del objeto filtros con el valor del detalle del evento.
 *
 * @param {any} ev - El objeto de evento que contiene el valor del detalle.
 */
  controladorSelectEstado(ev: any) {
    this.filtros.estado = ev.detail.value;
  }

 /**
 * Actualiza la propiedad 'serie' del objeto 'filtros' con el valor del detalle del evento.
 *
 * @param {any} ev - El objeto de evento que contiene el valor del detalle.
 */
  controladorSelectSerie(ev: any) {
    this.filtros.serie = ev.detail.value;
  }

 /**
 * Actualiza la propiedad 'orden' del objeto 'filtros' con el valor del detalle del evento.
 *
 * @param {any} ev - El objeto de evento que contiene el valor del detalle.
 */
  controladorSelectOrden(ev: any) {
    this.filtros.orden = ev.detail.value;
  }

 /**
 * Inicializa el componente y carga los datos iniciales.
 *
 * @return {void} Esta función no devuelve ningún valor.
 */
  ionViewDidEnter() {
    let data: any = this.navParams.data;
    this.tipo = data.tipo;
    this.series = data.series;
    this.estados = data.estados;
    this.filtros.texto = data.filtros.texto;
    this.filtros.servido = data.filtros.servido;
    this.filtros.estado = data.filtros.estado;
    this.filtros.serie = data.filtros.serie;
    this.filtros.fechaDesde = data.filtros.fechaDesde;
    this.filtros.fechaHasta = data.filtros.fechaHasta;
    this.filtros.orden = data.filtros.orden;
    this.filtros.nFiltrosAplicados = data.filtros.nFiltrosAplicados;
  }

 /**
 * Abre un modal para seleccionar una fecha.
 *
 * @param {string} tipo - El tipo de fecha a seleccionar.
 * @return {Promise<void>} Una promesa que se resuelve cuando el modal se cierra.
 */
  async abrirModalFecha(tipo: string) {
    const modal = await this.modalController.create({
      component: DatePickerComponent,
      cssClass: 'noBackground',
      componentProps: {
        tipo: tipo,
        filtros: this.filtros
      }
    });
    modal.present();

    modal.onDidDismiss().then((result) => {
      if (result.data.cancelar == false) {
        this.filtros = result.data.filtros;
      }
    });
  }

 /**
 * Formatea una cadena de fecha dada en el formato 'dd/MM/yyyy'.
 *
 * @param {string} fecha - La cadena de fecha a formatear.
 * @return {string} La cadena de fecha formateada, o una cadena vacía si la entrada es nula.
 */
  public formatearFecha(fecha: string) {
    let fechaFormateada;
    if (fecha != null) {
      fechaFormateada = this.datepipe.transform(fecha, 'dd/MM/yyyy');
    } else {
      fechaFormateada = '';
    }

    return fechaFormateada;
  }

 /**
 * Aplica los filtros seleccionados y cierra el popover.
 *
 * Esta función incrementa la variable `nFiltrosAplicados` en base a los filtros seleccionados.
 * Luego crea un nuevo objeto `filtros` extendiendo las propiedades de `this.filtros` y agregando la propiedad `nFiltrosAplicados`.
 * Finalmente, cierra el popover y pasa el objeto `filtros` como resultado.
 *
 * @return {void} Esta función no devuelve nada.
 */
  aplicarFiltros() {
    this.nFiltrosAplicados = 0;
    
    if (this.filtros.servido != 'Todos') {
      this.nFiltrosAplicados++;
    }

    if (this.filtros.estado != 'Todos') {
      this.nFiltrosAplicados++;
    }

    if (this.filtros.serie != 'Todos') {
      this.nFiltrosAplicados++;
    }

    if (this.filtros.fechaDesde != '') {
      this.nFiltrosAplicados++;
    }

    if (this.filtros.fechaHasta != '') {
      this.nFiltrosAplicados++;
    }

    let texto = this.filtros.texto;

    this.filtros = { texto: texto, servido: this.filtros.servido, estado: this.filtros.estado, serie: this.filtros.serie, fechaDesde: this.filtros.fechaDesde, fechaHasta: this.filtros.fechaHasta, orden: this.filtros.orden, nFiltrosAplicados: this.nFiltrosAplicados }

    this.popoverController.dismiss(this.filtros);
  }

 /**
 * Borra el filtro de fecha seleccionado basado en el tipo proporcionado.
 *
 * @param {string} tipo - El tipo de filtro de fecha a borrar. Los valores posibles son 'desde' y 'hasta'.
 */
  borrarFiltroFecha(tipo: string) {
    switch (tipo) {
      case 'desde':
        this.filtros.fechaDesde = '';
        break;
      case 'hasta':
        this.filtros.fechaHasta = '';
        break;
    }
  }
}