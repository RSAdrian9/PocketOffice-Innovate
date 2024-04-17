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

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams
  ) { }

  ngOnInit() { }

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

  cancelar() {
    this.modalCtrl.dismiss({ cancelar: true });
  }

  reestablecer() {
    this.datetimePicker.reset();
    this.fechaSeleccionada = (new Date()).toISOString();
    this.reestablecerPulsado = true;
  }



}
