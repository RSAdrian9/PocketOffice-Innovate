import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PopoverController, ModalController, IonButton, IonCheckbox, IonItem, IonItemDivider, IonList, NavParams, IonSelect, IonSelectOption, IonIcon, IonBadge } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calendarOutline, trashBin } from 'ionicons/icons';
import { DatePickerMayorComponent } from '../date-picker-mayor/date-picker-mayor.component';
import { anio } from 'src/app/models/anio.model';

@Component({
  selector: 'app-filtro-mayor',
  templateUrl: './filtro-mayor.component.html',
  styleUrls: ['./filtro-mayor.component.scss'],
  standalone: true,
  providers: [DatePipe],
  imports: [FormsModule, CommonModule, IonItem, IonList, IonItemDivider, IonCheckbox, IonButton, IonSelect, IonSelectOption, IonIcon, IonBadge]
})
export class FiltroMayorComponent implements OnInit {

  filtros: any = { texto: '', anio: '', fechaDesde: '', fechaHasta: '', nFiltrosAplicados: 0 };
  nFiltrosAplicados: number = 0;
  public anios: Array<anio> = [];

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
 * Actualiza la propiedad 'anio' del objeto 'filtros' con el valor seleccionado del evento 'ev'.
 *
 * @param {any} ev - El objeto de evento que contiene el valor seleccionado.
 */
  controladorSelectAnio(ev: any) {
    this.filtros.anio = ev.detail.value;
  }  

 /**
 * Se ejecuta cuando la vista ha sido completamente ingresada y ahora es la vista activa.
 * Recupera los datos de los parámetros de navegación y los asigna a las variables correspondientes.
 *
 * @return {void} Esta función no devuelve nada.
 */
  ionViewDidEnter() {
    let data: any = this.navParams.data;
    console.log(data);

    this.anios = data.anios;
    this.filtros.texto = data.filtros.texto;
    this.filtros.anio = data.filtros.anio;
    this.filtros.fechaDesde = data.filtros.fechaDesde;
    this.filtros.fechaHasta = data.filtros.fechaHasta;
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
      component: DatePickerMayorComponent,
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
 * Formatea una cadena de fecha dada en el formato 'dd/MM/yyyy' utilizando la DatePipe.
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
 * Esta función incrementa la variable `nFiltrosAplicados` basándosese en los filtros seleccionados.
 * Si el filtro `anio` no es igual a '0', `nFiltrosAplicados` se incrementa.
 * Si el filtro `fechaDesde` no es una cadena vacía, `nFiltrosAplicados` se incrementa.
 * Si el filtro `fechaHasta` no es una cadena vacía, `nFiltrosAplicados` se incrementa.
 * Los valores `texto`, `anio`, `fechaDesde`, `fechaHasta` y `nFiltrosAplicados` se asignan al objeto `filtros`.
 * El objeto `filtros` se pasa al método `popoverController.dismiss()`.
 *
 * @return {void} Esta función no devuelve ningún valor.
 */
  aplicarFiltros() {
    this.nFiltrosAplicados = 0;

    if (this.filtros.anio != '0') {
      this.nFiltrosAplicados++;
    }

    if (this.filtros.fechaDesde != '') {
      this.nFiltrosAplicados++;
    }

    if (this.filtros.fechaHasta != '') {
      this.nFiltrosAplicados++;
    }

    let texto = this.filtros.texto;

    this.filtros = { texto: texto, anio: this.filtros.anio, fechaDesde: this.filtros.fechaDesde, fechaHasta: this.filtros.fechaHasta, nFiltrosAplicados: this.nFiltrosAplicados }

    this.popoverController.dismiss(this.filtros);
  }

 /**
 * Borra el rango de fechas seleccionado según el tipo proporcionado.
 *
 * @param {string} tipo - El tipo de rango de fechas a borrar ('desde' o 'hasta').
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