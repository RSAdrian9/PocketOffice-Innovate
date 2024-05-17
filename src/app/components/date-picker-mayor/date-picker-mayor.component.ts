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

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams
  ) { }

  ngOnInit() { }

  ionViewDidEnter() {
    let data: any = this.navParams.data;

    this.reestablecerPulsado = false;
    this.tipo = data.tipo;
    this.anio = this.filtros.anio;

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