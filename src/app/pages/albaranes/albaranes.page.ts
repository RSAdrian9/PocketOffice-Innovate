import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { ActivatedRoute } from '@angular/router';
import { Platform, NavController, InfiniteScrollCustomEvent, IonInfiniteScroll, IonInfiniteScrollContent, PopoverController, IonBadge, IonButton, IonItem, IonItemDivider, IonGrid, IonRow, IonCol, IonIcon } from '@ionic/angular/standalone';
import { DbService } from 'src/app/services/db.service';
import { albaranesCliente } from 'src/app/models/albaranes-cliente.model';
import { albaranesProveedor } from 'src/app/models/albaranes-proveedor.model';
import { FiltroAlbaranesComponent } from 'src/app/components/filtro-albaranes/filtro-albaranes.component';

@Component({
  selector: 'app-albaranes',
  templateUrl: './albaranes.page.html',
  styleUrls: ['./albaranes.page.scss'],
  standalone: true,
  providers: [DatePipe],
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AlbaranesPage implements OnInit {

  private activatedRoute = inject(ActivatedRoute);
  codigo: string = '';
  tipo: string = '';
  nombre: string = '';
  private series: Array<any> = [];
  public albaranesCliente: Array<albaranesCliente> = [];
  private albaranesAUXCliente: Array<albaranesCliente> = [];
  public albaranesProveedor: Array<albaranesProveedor> = [];
  private albaranesAUXProveedor: Array<albaranesProveedor> = [];
  private filtroBusqueda: string = '';
  private albaranesPorPagina: number = 25;
  private registros: number = 0;
  public hayMasAlbaranes: boolean = true;
  public consultaRealizada: boolean = false;
  public mostrarBusqueda: boolean = false;
  public importeAlbaranes: number = 0;
  public filtros: any = { texto: '', facturado: '0', serie: 'Todos', estCobro: '0', fechaDesde: '', fechaHasta: '', orden: '1', nFiltrosAplicados: 0 };


  constructor(
    private platform: Platform,
    private transferirService: TransferirDatosService,
    private navC: NavController,
    private popoverController: PopoverController,
    private datepipe: DatePipe,
    private dbService: DbService
  ) { }

  ngOnInit() {
    this.tipo = this.activatedRoute.snapshot.paramMap.get('tipo') as string;
    this.codigo = this.activatedRoute.snapshot.paramMap.get('codigo') as string;

    this.pageController();
  }

  ionViewDidEnter() {
    this.tipo = this.activatedRoute.snapshot.paramMap.get('tipo') as string;
    this.codigo = this.activatedRoute.snapshot.paramMap.get('codigo') as string;

    this.pageController();
  }

  pageController() {
    this.filtroBusqueda = this.devuelveFiltroSentencia(this.filtros);
    this.cargarAlbaranes(this.filtroBusqueda);

    this.transferirService.sendObjectSource({ codigo: this.codigo })
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.goBack();
    });
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
  public async filtrarAlbaranes($event: any) {

    this.filtros.texto = $event.detail.value;
    this.filtroBusqueda = this.devuelveFiltroSentencia(this.filtros);
    this.albaranesCliente = [];
    this.albaranesProveedor = [];

    this.cargarAlbaranes(this.filtroBusqueda);
  }

  private devuelveFiltroSentencia(filtros: any): string {
    let filtro = '';
    let nFiltrosAnadidos = 0;

    if (filtros.texto != '' || filtros.fechaDesde != '' || filtros.fechaHasta != '' || filtros.estCobro != '0' || filtros.facturado != '0' || filtros.serie != 'Todos') {
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

    if (filtros.serie != 'Todos') {
      if (nFiltrosAnadidos > 0) {
        filtro = filtro + " AND substr(num,1,2) = '" + filtros.serie + "' ";
        nFiltrosAnadidos++;
      } else {
        filtro = filtro + " substr(num,1,2) = '" + filtros.serie + "' ";
        nFiltrosAnadidos++;
      }
    }

    switch (filtros.facturado) {
      case '0':
        filtro = filtro + '';
        break;
      case '1':
        if (nFiltrosAnadidos > 0) {
          filtro = filtro + " AND fac = 0 ";
          nFiltrosAnadidos++;
        } else {
          filtro = filtro + " fac = 0 ";
          nFiltrosAnadidos++;
        }
        break;
      case '2':
        if (nFiltrosAnadidos > 0) {
          filtro = filtro + " AND fac = 1 AND (LTRIM(RTRIM(n_f)) <> '' AND LTRIM(RTRIM(n_f)) <> '/') ";
          nFiltrosAnadidos++;
        } else {
          filtro = filtro + " fac = 1 AND (LTRIM(RTRIM(n_f)) <> '' AND LTRIM(RTRIM(n_f)) <> '/') ";
          nFiltrosAnadidos++;
        }
        break;
      case '3':
        if (nFiltrosAnadidos > 0) {
          filtro = filtro + " AND fac=1 AND (LTRIM(RTRIM(n_f))='' OR LTRIM(RTRIM(n_f)) ='/') ";
          nFiltrosAnadidos++;
        } else {
          filtro = filtro + " fac=1 AND (LTRIM(RTRIM(n_f))='' OR LTRIM(RTRIM(n_f)) ='/') ";
          nFiltrosAnadidos++;
        }
        break;
    }

    switch (filtros.estCobro) {
      case '0':
        filtro = filtro + '';
        break;
      case '1':
        if (nFiltrosAnadidos > 0) {
          filtro = filtro + " AND cobeu = 0 ";
          nFiltrosAnadidos++;
        } else {
          filtro = filtro + " cobeu = 0 ";
          nFiltrosAnadidos++;
        }
        break;
      case '2':
        if (nFiltrosAnadidos > 0) {
          filtro = filtro + " AND cobeu <> 0 AND cobeu < toteu ";
          nFiltrosAnadidos++;
        } else {
          filtro = filtro + " cobeu <> 0 AND cobeu < toteu ";
          nFiltrosAnadidos++;
        }
        break;
      case '3':
        if (nFiltrosAnadidos > 0) {
          filtro = filtro + " AND cobeu = toteu ";
          nFiltrosAnadidos++;
        } else {
          filtro = filtro + " cobeu = toteu ";
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
      component: FiltroAlbaranesComponent,
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
        this.albaranesCliente = [];
        this.albaranesProveedor = [];

        this.cargarAlbaranes(this.filtroBusqueda);
      } else {
        this.filtros = { texto: '', facturado: '0', serie: 'Todos', estCobro: '0', fechaDesde: '', fechaHasta: '', orden: '1', nFiltrosAplicados: 0 };
      }
    }).catch((err) => {
      this.filtros = { texto: '', facturado: '0', serie: 'Todos', estCobro: '0', fechaDesde: '', fechaHasta: '', orden: '1', nFiltrosAplicados: 0 };
    })
  }

  private cargarAlbaranes(filtro: string) {
    switch (this.tipo) {
      case 'cliente':
        this.consultaRealizada = false;
        this.dbService.getListadoAlbaranes('CL', this.codigo, filtro).then((albaranes) => {
          this.albaranesAUXCliente = albaranes;
          this.calcularImporteAlbaranes();
          this.consultaRealizada = true;
          this.registros = this.albaranesCliente.length;

          for (let i = 0; i < this.albaranesPorPagina; i++) {
            if (this.albaranesCliente.length < this.albaranesAUXCliente.length) {
              this.albaranesCliente.push(this.albaranesAUXCliente[this.registros + i]);
              this.hayMasAlbaranes = true;
            } else {
              this.hayMasAlbaranes = false;
            }
          }
        });
        this.dbService.getNombreCliente(this.codigo).then((nombre) => {
          this.nombre = nombre;
        });
        this.dbService.getSeriesDocumento('CL', 'albaran', this.codigo).then((series) => {
          this.series = series;
        });
        break;
      case 'proveedor':
        this.consultaRealizada = false;
        this.dbService.getListadoAlbaranes('PR', this.codigo, filtro).then((albaranes) => {
          this.albaranesAUXProveedor = albaranes;
          this.calcularImporteAlbaranes();
          this.consultaRealizada = true;
          this.registros = this.albaranesProveedor.length;

          for (let i = 0; i < this.albaranesPorPagina; i++) {
            if (this.albaranesProveedor.length < this.albaranesAUXProveedor.length) {
              this.albaranesProveedor.push(this.albaranesAUXProveedor[this.registros + i]);
              this.hayMasAlbaranes = true;
            } else {
              this.hayMasAlbaranes = false;
            }
          }
        });
        this.dbService.getNombreProveedor(this.codigo).then((nombre) => {
          this.nombre = nombre;
        });
        this.dbService.getSeriesDocumento('PR', 'albaran', this.codigo).then((series) => {
          this.series = series;
        });
        break;
    }
  }

  calcularImporteAlbaranes() {
    this.importeAlbaranes = 0;
    if (this.tipo == 'cliente'){
      for (let index = 0; index < this.albaranesAUXCliente.length; index++) {
        let importe = this.albaranesAUXCliente[index].toteu;
        if (importe != null || importe != undefined) {
          this.importeAlbaranes = this.importeAlbaranes + parseFloat(importe);
        }
      }
    } else if (this.tipo == 'proveedor'){
      for (let index = 0; index < this.albaranesAUXProveedor.length; index++) {
        let importe = this.albaranesAUXProveedor[index].toteu;
        if (importe != null || importe != undefined) {
          this.importeAlbaranes = this.importeAlbaranes + parseFloat(importe);
        }
      }
    }
    this.importeAlbaranes = parseFloat(this.importeAlbaranes.toFixed(2));

  }

  onIonInfinite(ev: InfiniteScrollCustomEvent) {
    if (this.tipo == 'cliente') {
      if (this.registros != this.albaranesAUXCliente.length) {
        this.cargarAlbaranes(this.filtroBusqueda);
        setTimeout(() => {
          (ev as InfiniteScrollCustomEvent).target.complete();
        }, 500);
      }
    } else if (this.tipo == 'proveedor') {
      if (this.registros != this.albaranesAUXProveedor.length) {
        this.cargarAlbaranes(this.filtroBusqueda);
        setTimeout(() => {
          (ev as InfiniteScrollCustomEvent).target.complete();
        }, 500);
      }
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

  comprobarAlbaran(albaran: any): string {
    if (albaran.est == "3") {
      return "rowBackgroundGreen";
    } else if (albaran.est == "1") {
      return "rowBackgroundRed";
    } else if (albaran.est == "2") {
      return "rowBackgroundCian";
    } else {
      return "rowBackgroundGray";
    }
  }

  comprobarAlbaranNofacturable(albaran: any): string {
    if (albaran.fac == "1" && albaran.n_f!="NO FACTURABLE") {
      return "rowBackgroundGreen";
    } else if (albaran.fac == "1" && albaran.n_f =="NO FACTURABLE") {
      return "rowBackgroundCian";
    } else {
      return "";
    }
  }

  formatearNumero(numero: any){
    let numeroFormateado = parseFloat(numero).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    return numeroFormateado;
  }

}