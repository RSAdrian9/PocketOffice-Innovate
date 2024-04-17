import { Component, OnInit } from '@angular/core';
import { IonButton, IonCheckbox, IonItem, IonItemDivider, IonList, NavParams, PopoverController } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filtro-clientes',
  templateUrl: './filtro-clientes.component.html',
  styleUrls: ['./filtro-clientes.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, IonItem, IonList, IonItemDivider, IonCheckbox, IonButton]
})
export class FiltroClientesComponent implements OnInit {
  filtros: any = { texto: '', actividad: '0', riesgo: '0', nFiltrosAplicados: 0 };
  checkConActividad: boolean = false;
  checkSinActividad: boolean = false;
  checkConRiesgo: boolean = false;
  checkSinRiesgo: boolean = false;

  valorActividad: string = '';
  valorRiesgo: string = '';
  nFiltrosAplicados: number = 0;

  constructor(
    private popoverController: PopoverController,
    private navParams: NavParams
  ) { }

  ngOnInit() { }

  ionViewDidEnter() {
    let data: any = this.navParams.data;
    this.filtros.texto = data.texto;
    this.filtros.actividad = data.actividad;
    this.filtros.riesgo = data.riesgo;
    this.filtros.nFiltrosAplicados = data.nFiltrosAplicados;

    switch (this.filtros.actividad) {
      case '1':
        this.checkConActividad = true;
        break;
      case '2':
        this.checkSinActividad = true;
        break;
    }

    if (this.filtros.riesgo == '1') {
      this.checkConRiesgo = true;
    }
  }

  controladorCheckConActividad(ev: any) {
    if (ev.detail.checked && this.checkSinActividad) {
      this.checkConActividad = true;
      this.checkSinActividad = false;
    } else if (ev.detail.checked) {
      this.checkConActividad = true;
    } else {
      this.checkConActividad = false;
    }
  }

  controladorCheckSinActividad(ev: any) {
    if (ev.detail.checked && this.checkConActividad) {
      this.checkConActividad = false;
      this.checkSinActividad = true;
    } else if (ev.detail.checked) {
      this.checkSinActividad = true;
    } else {
      this.checkSinActividad = false;
    }
  }

  controladorCheckConRiesgo(ev: any) {
    if (ev.detail.checked) {
      this.checkConRiesgo = true;
    } else {
      this.checkConRiesgo = false;
    }
  }



  aplicarFiltros() {
    this.nFiltrosAplicados = 0;

    if (this.checkConActividad) {
      this.nFiltrosAplicados++;
      this.valorActividad = '1';
    } else if (this.checkSinActividad) {
      this.nFiltrosAplicados++;
      this.valorActividad = '2';
    } else {
      this.valorActividad = '0';
    }

    if (this.checkConRiesgo) {
      this.nFiltrosAplicados++;
      this.valorRiesgo = '1';
    } else {
      this.valorRiesgo = '0';
    }

    let texto = this.filtros.texto;

    this.filtros = { texto: texto, actividad: this.valorActividad, riesgo: this.valorRiesgo, nFiltrosAplicados: this.nFiltrosAplicados }

    this.popoverController.dismiss(this.filtros);
  }

}
