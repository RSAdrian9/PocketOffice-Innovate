import { Component, OnInit } from '@angular/core';
import { PopoverController, ModalController, IonButton, IonCheckbox, IonItem, IonItemDivider, IonList, NavParams, IonSelect, IonSelectOption, IonIcon, IonBadge } from '@ionic/angular/standalone';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { calendarOutline, trashBin } from 'ionicons/icons';
import { DatePickerComponent } from '../date-picker/date-picker.component';

@Component({
  selector: 'app-filtro-albaranes',
  templateUrl: './filtro-albaranes.component.html',
  styleUrls: ['./filtro-albaranes.component.scss'],
  standalone: true,
  providers: [DatePipe],
  imports: [FormsModule, CommonModule, IonItem, IonList, IonItemDivider, IonCheckbox, IonButton, IonSelect, IonSelectOption, IonIcon, IonBadge]
})
export class FiltroAlbaranesComponent implements OnInit {
  filtros: any = { texto: '', facturado: '0', serie: 'Todos', estCobro: '0', fechaDesde: '', fechaHasta: '', orden: '1', nFiltrosAplicados: 0 };
  nFiltrosAplicados: number = 0;
  public series: Array<any> = [];

 /**
 * Constructor para la clase FiltroAlbaranesComponent.
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

 /**
 * Inicializa el componente y carga los datos iniciales.
 *
 * @return {void} Esta función no devuelve ningún valor.
 */
  ngOnInit() { 

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
 * Actualiza la propiedad 'facturado' del objeto 'filtros' con el valor del detalle del evento.
 *
 * @param {any} ev - El objeto de evento que contiene el valor del detalle.
 */
  controladorSelectFacturado(ev: any) {
    this.filtros.facturado = ev.detail.value;
  }

 /**
 * Actualiza la propiedad 'estCobro' del objeto 'filtros' con el valor del detalle del evento.
 *
 * @param {any} ev - El objeto de evento que contiene el valor del detalle.
 */
  controladorSelectEstado(ev: any) {
    this.filtros.estCobro = ev.detail.value;
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
 * Se ejecuta cuando la vista ha sido completamente ingresada y ahora es la vista activa.
 * Recupera los datos de los parámetros de navegación y los asigna a las variables correspondientes.
 *
 * @return {void} Esta función no devuelve nada.
 */
  ionViewDidEnter() {
    let data: any = this.navParams.data;
    this.series = data.series;
    this.filtros.texto = data.filtros.texto;
    this.filtros.facturado = data.filtros.facturado;
    this.filtros.serie = data.filtros.serie;
    this.filtros.estCobro = data.filtros.estCobro;
    this.filtros.fechaDesde = data.filtros.fechaDesde;
    this.filtros.fechaHasta = data.filtros.fechaHasta;
    this.filtros.orden = data.filtros.orden;
    this.filtros.nFiltrosAplicados = data.filtros.nFiltrosAplicados;
  }

 /**
 * Abre un modal para seleccionar una fecha.
 *
 * @param {string} tipo - El tipo de fecha a seleccionar.
 * @return {Promise<void>} Una promesa que se resuelve cuando se cierra el modal.
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
 * Aplica los filtros y desecha el popover con los filtros actualizados.
 *
 * @return {void}
 */
  aplicarFiltros() {
    this.nFiltrosAplicados = 0;

    if (this.filtros.facturado != '0') {
      this.nFiltrosAplicados++;
    }

    if (this.filtros.serie != 'Todos') {
      this.nFiltrosAplicados++;
    }

    if (this.filtros.estCobro != '0') {
      this.nFiltrosAplicados++;
    }

    if (this.filtros.fechaDesde != '') {
      this.nFiltrosAplicados++;
    }

    if (this.filtros.fechaHasta != '') {
      this.nFiltrosAplicados++;
    }

    let texto = this.filtros.texto;

    this.filtros = { texto: texto, facturado: this.filtros.facturado, serie: this.filtros.serie, estCobro: this.filtros.estCobro, fechaDesde: this.filtros.fechaDesde, fechaHasta: this.filtros.fechaHasta, orden: this.filtros.orden, nFiltrosAplicados: this.nFiltrosAplicados }

    this.popoverController.dismiss(this.filtros);
  }

 /**
 * Borra el filtro de fecha seleccionado según el tipo proporcionado.
 *
 * @param {string} tipo - El tipo de filtro de fecha a borrar ('desde' o 'hasta').
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