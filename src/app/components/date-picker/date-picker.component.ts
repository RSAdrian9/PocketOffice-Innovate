import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonModal, IonDatetime, IonButtons, IonButton, NavParams, ModalController, IonItemDivider, IonItem } from '@ionic/angular/standalone';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, IonModal, IonDatetime, IonButtons, IonButton, IonItemDivider, IonItem]
})
export class DatePickerComponent implements OnInit {
  @ViewChild('datetime') datetimePicker?: any;
  filtros: any = {};
  tipo: string = '';
  fechaSeleccionada: string = (new Date()).toISOString();
  reestablecerPulsado: boolean = false;

 /**
 * Crea una nueva instancia de la clase.
 *
 * @param {ModalController} modalCtrl - El controlador de modal.
 * @param {NavParams} navParams - Los parámetros de navegación.
 */
  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams
  ) { }

 /**
 * Inicializa el componente y establece los valores iniciales de las propiedades basados en los datos pasados a través de los parámetros de navegación.
 *
 * @return {void} Esta función no devuelve nada.
 */
  ngOnInit() { 

  }

 /**
 * Se ejecuta cuando la vista ha sido completamente ingresada y ahora es la vista activa.
 * Establece los valores iniciales de las propiedades basados en los datos pasados a través de los parámetros de navegación.
 *
 * @return {void} Esta función no devuelve nada.
 */
  ionViewDidEnter() {
    let data: any = this.navParams.data;
    this.reestablecerPulsado = false;
    this.tipo = data.tipo;

    this.filtros.texto = data.filtros.texto;
    this.filtros.estCobro = data.filtros.estCobro;
    this.filtros.fechaDesde = data.filtros.fechaDesde;
    this.filtros.fechaHasta = data.filtros.fechaHasta;

    switch (this.tipo) {
      case 'desde':
        if (this.filtros.fechaDesde != '') {
          this.fechaSeleccionada = this.filtros.fechaDesde;
        }
        break;
      case 'hasta':
        if (this.filtros.fechaHasta != '') {
          this.fechaSeleccionada = this.filtros.fechaHasta;
        }
        break;
    }
  }

 /**
 * Actualiza la propiedad 'fechaDesde' o 'fechaHasta' del objeto 'filtros' según el valor de 'tipo' y el estado de 'reestablecerPulsado'.
 * Si 'reestablecerPulsado' es falso, la propiedad correspondiente se establece en 'fechaSeleccionada'.
 * Si 'reestablecerPulsado' es verdadero, la propiedad correspondiente se establece en una cadena vacía.
 * Finalmente, se descarta el modal con el objeto 'filtros' actualizado y 'cancelar' establecido en falso.
 */
  aceptar() {
    switch (this.tipo) {
      case 'desde':
        if (!this.reestablecerPulsado) {
          this.filtros.fechaDesde = this.fechaSeleccionada;
        } else {
          this.filtros.fechaDesde = '';
        }
        break;
      case 'hasta':
        if (!this.reestablecerPulsado) {
          this.filtros.fechaHasta = this.fechaSeleccionada;
        } else {
          this.filtros.fechaHasta = '';
        }
        break;
    }

    this.modalCtrl.dismiss({ filtros: this.filtros, cancelar: false });
  }

 /**
 * Cancela la operación actual al desactivar el modal y pasar una bandera que indica el cancelamiento.
 *
 * @return {void} Esta función no devuelve nada.
 */
  cancelar() {
    this.modalCtrl.dismiss({ cancelar: true });
  }

 /**
 * Reinicia el datetimePicker, establece la fechaSeleccionada en la fecha actual y establece reestablecerPulsado en true.
 *
 * @return {void} Esta función no devuelve nada.
 */
  reestablecer() {
    this.datetimePicker.reset();
    this.fechaSeleccionada = (new Date()).toISOString();
    this.reestablecerPulsado = true;
  }
}
