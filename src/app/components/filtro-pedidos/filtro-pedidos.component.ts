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
  filtros: any = { texto: '', servido: 'Todos', estado: 'Todos', serie: 'Todos', fechaDesde: '', fechaHasta: '', orden: '1', nFiltrosAplicados: 0 };
  nFiltrosAplicados: number = 0;
  public series: Array<any> = [];
  public estados: Array<any> = [];

  constructor(
    private popoverController: PopoverController,
    private datepipe: DatePipe,
    private navParams: NavParams,
    private modalController: ModalController
  ) {
    addIcons({ calendarOutline, trashBin });
  }

  ngOnInit() { }

  controladorSelectServido(ev: any) {
    this.filtros.servido = ev.detail.value;
  }

  controladorSelectEstado(ev: any) {
    this.filtros.estado = ev.detail.value;
  }

  controladorSelectSerie(ev: any) {
    this.filtros.serie = ev.detail.value;
  }

  controladorSelectOrden(ev: any) {
    this.filtros.orden = ev.detail.value;
  }

  ionViewDidEnter() {
    let data: any = this.navParams.data;
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

    //console.log(this.filtros);
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