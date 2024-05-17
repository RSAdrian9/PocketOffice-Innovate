import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Platform, NavController, InfiniteScrollCustomEvent, IonInfiniteScroll, IonInfiniteScrollContent, PopoverController, IonBadge, IonButton, IonItem, IonItemDivider, IonGrid, IonRow, IonCol, IonIcon } from '@ionic/angular/standalone';
import { efectos } from 'src/app/models/efectos.model';
import { DbService } from 'src/app/services/db.service';
import { efectosTmp } from 'src/app/models/efectosTmp.model';
import { addIcons } from 'ionicons';
import { openOutline } from 'ionicons/icons';
import { FiltroEfectosComponent } from 'src/app/components/filtro-efectos/filtro-efectos.component';
import { anio } from 'src/app/models/anio.model';

@Component({
  selector: 'app-efectos',
  templateUrl: './efectos.page.html',
  styleUrls: ['./efectos.page.scss'],
  standalone: true,
  providers: [DatePipe],
  imports: [IonicModule, RouterModule, CommonModule, FormsModule, IonInfiniteScroll, IonInfiniteScrollContent, IonBadge, IonButton, IonItem, IonItemDivider, IonGrid, IonRow, IonCol, IonIcon]
})
export class EfectosPage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  codigo: string = ''
  tipo: string = ''
  nombre: string = '';

  private series: Array<any> = []
  public efectos: Array<efectosTmp> = [];
  private efectosAUX: Array<efectosTmp> = [];
  private filtroBusqueda: string = '';
  private efectosPorPagina: number = 10;
  private registros: number = 0;
  public hayMasEfectos: boolean = true;
  public consultaRealizada: boolean = false;
  public mostrarBusqueda: boolean = false;
  public importeEfectos: number = 0;
  public filtros: any = { texto: '', serie: 'Todos', estCobro: '0', fechaDesde: '', fechaHasta: '', orden: '1', nFiltrosAplicados: 0 };


  constructor(
    private platform: Platform,
    private transferirService: TransferirDatosService,
    private navC: NavController,
    private dbService: DbService,
    private datepipe: DatePipe,
    private popoverController: PopoverController
  ) {
    addIcons({
      openOutline
    })
  }

  ngOnInit() {
    this.tipo = this.activatedRoute.snapshot.paramMap.get('tipo') as string;
    this.codigo = this.activatedRoute.snapshot.paramMap.get('codigo') as string;
    console.log(this.activatedRoute.snapshot.params);

    this.pageController();
  }

  ionViewDidEnter() {
    this.tipo = this.activatedRoute.snapshot.paramMap.get('tipo') as string;
    this.codigo = this.activatedRoute.snapshot.paramMap.get('codigo') as string;
    console.log(this.activatedRoute.snapshot.params);

    this.pageController();
  }

  async cargarEfectos(filtro: string) {
    switch (this.tipo) {
      case 'cliente':
        this.consultaRealizada = false;
        this.dbService.getListadoEfectos('C', this.codigo, filtro).then((efectos) => {
          this.efectosAUX = efectos;
          this.calcularImporteEfectos();
          this.consultaRealizada = true;
          this.registros = this.efectos.length;

          for (let i = 0; i < this.efectosPorPagina; i++) {
            if (this.efectos.length < this.efectosAUX.length) {
              this.efectos.push(this.efectosAUX[this.registros + i]);
              this.hayMasEfectos = true;
            } else {
              this.hayMasEfectos = false;
            }
          }

        });
        this.dbService.getNombreCliente(this.codigo).then((nombre) => {
          this.nombre = nombre;
        });
        this.dbService.getSeriesDocumento('CL', 'efecto', this.codigo).then((series) => {
          this.series = series;
        });
        break;
      case 'proveedor':
        this.consultaRealizada = false;
        this.dbService.getListadoEfectos('P', this.codigo, filtro).then((efectos) => {
          this.efectosAUX = efectos;
          this.calcularImporteEfectos();
          this.consultaRealizada = true;
          this.registros = this.efectos.length;

          for (let i = 0; i < this.efectosPorPagina; i++) {
            if (this.efectos.length < this.efectosAUX.length) {
              this.efectos.push(this.efectosAUX[this.registros + i]);
              this.hayMasEfectos = true;
            } else {
              this.hayMasEfectos = false;
            }
          }
        });
        this.dbService.getNombreCliente(this.codigo).then((nombre) => {
          this.nombre = nombre;
        });
        this.dbService.getSeriesDocumento('PR', 'efecto', this.codigo).then((series) => {
          this.series = series;
        });        
        break;
    }

  }

  calcularImporteEfectos() {
    this.importeEfectos = 0;

    for (let index = 0; index < this.efectosAUX.length; index++) {
      let importe = this.efectosAUX[index].impeu;
      if (importe != null || importe != undefined) {
        this.importeEfectos = this.importeEfectos + parseFloat(importe);
      }
    }

    this.importeEfectos = parseFloat(this.importeEfectos.toFixed(2));
  }


  goBack() {
    switch (this.tipo) {
      case 'cliente':
        this.navC.navigateBack('/vista-cliente/' + this.codigo);
        this.transferirService.sendObjectSource({ ruta: '/vista-cliente' });
        break;
      case 'proveedor':
        this.navC.navigateBack('/vista-proveedor/' + this.codigo);
        this.transferirService.sendObjectSource({ ruta: '/vista-proveedor' });
        break;
    }
  }


  pageController() {
    this.cargarEfectos(this.filtroBusqueda);

    this.transferirService.sendObjectSource({ codigo: this.codigo })
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.goBack();
    });
  }

  public async filtrarEfectos($event: any) {

    this.filtros.texto = $event.detail.value;
    this.filtroBusqueda = this.devuelveFiltroSentencia(this.filtros);
    this.efectos = [];

    this.cargarEfectos(this.filtroBusqueda);
  }

  private devuelveFiltroSentencia(filtros: any): string {
    let filtro = '';
    let nFiltrosAnadidos = 0;

    if (filtros.texto != '' || filtros.serie != 'Todos' || filtros.fechaDesde != '' || filtros.fechaHasta != '' || filtros.estCobro != '0') {
      filtro = filtro + 'AND ';
    }

    if (filtros.texto != '') {
      if (nFiltrosAnadidos > 0) {
        filtro = filtro + " AND num LIKE '%" + filtros.texto + "%' ";
        nFiltrosAnadidos++;
      } else {
        filtro = filtro + " num LIKE '%" + filtros.texto + "%' ";
        nFiltrosAnadidos++;
      }
    }

    if(filtros.serie != 'Todos'){
      if (nFiltrosAnadidos > 0) {
        filtro = filtro + " AND substr(fac,2,2)='" + filtros.serie + "' ";
        nFiltrosAnadidos++;
      } else {
        filtro = filtro + " substr(fac,2,2)='" + filtros.serie + "' ";
        nFiltrosAnadidos++;
      }
    }

    switch (filtros.estCobro) {
      case '0':
        filtro = filtro + '';
        break;
      case '1':
        if (nFiltrosAnadidos > 0) {
          filtro = filtro + " AND pageu = 0 AND impeu <> 0 AND efe_tipagr <> 'A' AND dev <> 'S' ";
          nFiltrosAnadidos++;
        } else {
          filtro = filtro + " pageu = 0 AND impeu <> 0 AND efe_tipagr <> 'A' AND dev <> 'S' ";
          nFiltrosAnadidos++;
        }
        break;
      case '2':
        if (nFiltrosAnadidos > 0) {
          filtro = filtro + " AND pageu = impeu ";
          nFiltrosAnadidos++;
        } else {
          filtro = filtro + " pageu = impeu ";
          nFiltrosAnadidos++;
        }
        break;
    }

    if (filtros.fechaDesde != '') {
      if (nFiltrosAnadidos > 0) {
        filtro = filtro + " AND fec >= '" + this.formatearFecha(filtros.fechaDesde) + "' ";
        nFiltrosAnadidos++;
      } else {
        filtro = filtro + " fec >= '" + this.formatearFecha(filtros.fechaDesde) + "' ";
        nFiltrosAnadidos++;
      }
    } else {
      filtro = filtro + '';
    }

    if (filtros.fechaHasta != '') {
      if (nFiltrosAnadidos > 0) {
        filtro = filtro + " AND fec <= '" + this.formatearFecha(filtros.fechaHasta) + "' ";
        nFiltrosAnadidos++;
      } else {
        filtro = filtro + " fec <= '" + this.formatearFecha(filtros.fechaHasta) + "' ";
        nFiltrosAnadidos++;
      }
    } else {
      filtro = filtro + '';
    }

    switch (filtros.orden) {
      case '1':
        filtro = filtro + " ORDER BY fec DESC";
        break;
      case '2':
        filtro = filtro + " ORDER BY fec ASC";
        break;
      case '3':
        filtro = filtro + " ORDER BY num DESC";
        break;
      case '3':
        filtro = filtro + " ORDER BY num ASC";
        break;
    }

    return filtro;
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: FiltroEfectosComponent,
      componentProps: { filtros: this.filtros, series: this.series },
      event: ev,
      translucent: true
    });
    await popover.present();

    popover.onDidDismiss().then((data) => {
      if (data.data != undefined) {
        console.log(data);
        this.filtros = data.data;
        this.filtroBusqueda = this.devuelveFiltroSentencia(this.filtros);
        this.efectos = [];

        console.log(this.filtroBusqueda);
        this.cargarEfectos(this.filtroBusqueda);
      } else {
        this.filtros = { texto: '', serie: 'Todos', estCobro: '0', fechaDesde: '', fechaHasta: '', orden: '1', nFiltrosAplicados: 0 };
      }
    }).catch((err) => {
      this.filtros = { texto: '', serie: 'Todos', estCobro: '0', fechaDesde: '', fechaHasta: '', orden: '1', nFiltrosAplicados: 0 };
    })
  }

  onIonInfinite(ev: InfiniteScrollCustomEvent) {

    if (this.registros != this.efectosAUX.length) {
      this.cargarEfectos(this.filtroBusqueda);
      setTimeout(() => {
        (ev as InfiniteScrollCustomEvent).target.complete();
      }, 500);
    } else {

    }
  }


  comprobarEfecto(efecto: efectos): string {
    if (efecto.est == "3") {
      return "rowBackgroundGreen";
    } else if (efecto.est == "1") {
      return "rowBackgroundRed";
    } else if (efecto.est == "2") {
      return "rowBackgroundCian";
    } else {
      return "rowBackgroundGray";
    }
  }

  public formatearFecha(fecha: string) {
    let fechaFormateada;
    if (fecha != null) {
      fechaFormateada = this.datepipe.transform(fecha, 'yyyy-MM-dd');
    } else {
      fechaFormateada = '';
    }

    return fechaFormateada;
  }

  formatearNumero(numero: any) {
    let numeroFormateado = parseFloat(numero).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    return numeroFormateado;
  }
}