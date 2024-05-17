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

  constructor(
    private popoverController: PopoverController,
    private datepipe: DatePipe,
    private navParams: NavParams,
    private modalController: ModalController
  ) {
    addIcons({ calendarOutline, trashBin });
  }

  ngOnInit() { }

  controladorSelectAnio(ev: any) {
    this.filtros.anio = ev.detail.value;
  }  

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

  public formatearFecha(fecha: string) {
    let fechaFormateada;
    if (fecha != null) {
      fechaFormateada = this.datepipe.transform(fecha, 'dd/MM/yyyy');
    } else {
      fechaFormateada = '';
    }

    return fechaFormateada;
  }

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