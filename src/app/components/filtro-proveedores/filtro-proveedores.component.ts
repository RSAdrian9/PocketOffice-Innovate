import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonModal, IonDatetime, IonButtons, IonButton, IonItemDivider, IonItem, IonList } from '@ionic/angular/standalone';

@Component({
  selector: 'app-filtro-proveedores',
  templateUrl: './filtro-proveedores.component.html',
  styleUrls: ['./filtro-proveedores.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, IonModal, IonDatetime, IonButtons, IonButton, IonItemDivider, IonItem, IonList]
})
export class FiltroProveedoresComponent implements OnInit {
  filtros: any = { texto: '', actividad: '0', nFiltrosAplicados: 0 };
  checkConActividad: boolean = false; 
  checkSinActividad: boolean = false; 
  nFiltrosAplicados: number = 0; 

 /**
 * Constructor de la clase.
 *
 * @param {PopoverController} popoverController - El controlador de popover.
 * @param {NavParams} navParams - Los parámetros de navegación.
 */
  constructor(
    private popoverController: PopoverController, 
    private navParams: NavParams 
  ) { }

  ngOnInit() { }

 /**
 * Se ejecuta cuando se entra en la vista. Obtiene datos de navParams y actualiza el objeto filtros.
 * También actualiza las propiedades booleanas checkConActividad y checkSinActividad basadas en el valor de actividad.
 *
 * @return {void} Esta función no devuelve nada.
 */
  ionViewDidEnter() {
    let data: any = this.navParams.data;
    this.filtros.texto = data.texto;
    this.filtros.actividad = data.actividad;
    this.filtros.nFiltrosAplicados = data.nFiltrosAplicados;

    this.checkConActividad = this.filtros.actividad === '1';
    this.checkSinActividad = this.filtros.actividad === '2';
  }

 /**
 * Maneja el evento cuando se marca o se desmarca la casilla de verificación "Con Actividad".
 *
 * @param {any} ev - El objeto de evento que contiene información sobre el cambio de la casilla de verificación.
 * @return {void} Esta función no devuelve ningún valor.
 */
  controladorCheckConActividad(ev: any) {
    if (ev.detail.checked && this.checkSinActividad) {
      this.checkConActividad = true;
      this.checkSinActividad = false;
    } else if (!ev.detail.checked) {
      this.checkConActividad = false;
    }
  }

 /**
 * Maneja el evento cuando se marca o se desmarca la casilla de verificación "Sin Actividad".
 *
 * @param {any} ev - El objeto de evento que contiene información sobre el cambio de la casilla de verificación.
 * @return {void} Esta función no devuelve nada.
 */
  controladorCheckSinActividad(ev: any) {
    if (ev.detail.checked && this.checkConActividad) {
      this.checkConActividad = false;
      this.checkSinActividad = true;
    } else if (!ev.detail.checked) {
      this.checkSinActividad = false;
    }
  }

 /**
 * Aplica los filtros y cierra el controlador de popover con los filtros actualizados.
 *
 * @return {void} Esta función no devuelve nada.
 */
  aplicarFiltros() {
    this.nFiltrosAplicados = this.checkConActividad || this.checkSinActividad ? 1 : 0;
    this.filtros.actividad = this.checkConActividad ? '1' : this.checkSinActividad ? '2' : '0';

    this.popoverController.dismiss(this.filtros);
  }
}
