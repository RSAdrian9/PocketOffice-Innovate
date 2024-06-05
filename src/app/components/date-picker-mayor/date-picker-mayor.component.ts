import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonModal, IonDatetime, IonButtons, IonButton, NavParams, ModalController, IonItemDivider, IonItem } from '@ionic/angular/standalone';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker-mayor.component.html',
  styleUrls: ['./date-picker-mayor.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, IonModal, IonDatetime, IonButtons, IonButton, IonItemDivider, IonItem]
})
export class DatePickerMayorComponent implements OnInit {
  @ViewChild('datetime') datetimePicker?: any;
  filtros: any = {};
  tipo: string = '';
  anio: string = '';
  fechaSeleccionada: string = (new Date()).toISOString();
  reestablecerPulsado: boolean = false;

 /**
 * Constructor para la clase DatePickerMayorComponent.
 *
 * @param {ModalController} modalCtrl - La instancia de ModalController.
 * @param {NavParams} navParams - La instancia de NavParams.
 */
  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams
  ) { }

 /**
 * Inicializa el componente y establece los valores iniciales.
 *
 * Este gancho de ciclo de vida se llama después de que Angular haya inicializado todas las propiedades vinculadas a datos de un componente.
 * Es un buen lugar para poner el código de inicialización, como obtener datos de un servidor o inicializar variables.
 *
 * @return {void} Esta función no devuelve nada.
 */
  ngOnInit() { 

  }

 /**
 * Se ejecuta cuando la vista ha terminado de entrar y ahora es la vista activa.
 * Establece los valores de 'reestablecerPulsado', 'tipo', 'anio', 'filtros.texto', 'filtros.fechaDesde' y 'filtros.fechaHasta'
 * basándose en los datos pasados a través de 'navParams'.
 * Establece el valor de 'fechaSeleccionada' basándose en los valores de 'tipo' y 'anio'.
 *
 * @return {void} Esta función no devuelve nada.
 */
  ionViewDidEnter() {
    let data: any = this.navParams.data;

    this.reestablecerPulsado = false;
    this.tipo = data.tipo;
    this.anio = data.anio;

    this.filtros.texto = data.filtros.texto;
    this.filtros.fechaDesde = data.filtros.fechaDesde;
    this.filtros.fechaHasta = data.filtros.fechaHasta;

    switch (this.tipo) {
      case 'desde':
        if (this.filtros.fechaDesde != '') {
          this.fechaSeleccionada = this.filtros.fechaDesde;
        } else {
          this.fechaSeleccionada = new Date(this.anio + '-01-01').toISOString();
        }
        break;
      case 'hasta':
        if (this.filtros.fechaHasta != '') {
          this.fechaSeleccionada = this.filtros.fechaHasta;
        } else {
          this.fechaSeleccionada = new Date(this.anio + '-12-31').toISOString();
        }
        break;
    }
  }

 /**
 * Actualiza la propiedad 'fechaDesde' o 'fechaHasta' del objeto 'filtros' basándose en el valor de la propiedad 'tipo'.
 * Si 'reestablecerPulsado' es falso, la propiedad correspondiente se establece en el valor de 'fechaSeleccionada'.
 * De lo contrario, la propiedad correspondiente se establece en una cadena vacía.
 * Descarta el modal con el objeto 'filtros' actualizado.
 *
 * @return {void}
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
 * Reinicia el datetimePicker y establece la fecha seleccionada en función de los valores de 'tipo' y 'anio'.
 *
 * @return {void} Esta función no devuelve nada.
 */
  reestablecer() {
    this.datetimePicker.reset();

    switch (this.tipo) {
      case 'desde':
        this.fechaSeleccionada = new Date(this.anio + '-01-01').toISOString();
        break;
      case 'hasta':
        this.fechaSeleccionada = new Date(this.anio + '-12-31').toISOString();
        break;
    }
    
    this.reestablecerPulsado = true;
  }
}