import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { ActivatedRoute } from '@angular/router';
import { facturasCliente } from 'src/app/models/facturas-cliente.model';
import { facturasProveedor } from 'src/app/models/facturas-proveedor.model';
import { DbService } from 'src/app/services/db.service';
import { Platform, NavController, InfiniteScrollCustomEvent, IonInfiniteScroll, IonInfiniteScrollContent, PopoverController, IonBadge, IonButton, IonItem, IonItemDivider, IonGrid, IonRow, IonCol, IonIcon } from '@ionic/angular/standalone';
import { FiltroFacturasComponent } from 'src/app/components/filtro-facturas/filtro-facturas.component';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.page.html',
  styleUrls: ['./facturas.page.scss'],
  standalone: true,
  providers: [DatePipe],
  imports: [IonicModule, CommonModule, FormsModule, IonInfiniteScroll, IonInfiniteScrollContent, IonBadge, IonButton, IonItem, IonItemDivider, IonGrid, IonRow, IonCol, IonIcon]
})
export class FacturasPage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  codigo: string = ''
  tipo: string = ''
  nombre: string = ''
  private series: Array<any> = [];
  public facturasCliente: Array<facturasCliente> = [];
  private facturasAUXCliente: Array<facturasCliente> = [];  
  public facturasProveedor: Array<facturasProveedor> = [];
  private facturasAUXProveedor: Array<facturasProveedor> = [];
  private filtroBusqueda: string = '';
  private facturasPorPagina: number = 25;
  private registros: number = 0;
  public hayMasFacturas: boolean = true;
  public consultaRealizada: boolean = false;
  public mostrarBusqueda: boolean = false;
  public importeFacturas: number = 0;
  public filtros: any = { texto: '', serie: 'Todas', estCobro: '0', fechaDesde: '', fechaHasta: '', orden: '1', nFiltrosAplicados: 0 };

  constructor(
    private platform: Platform,
    private dbService: DbService,
    private datepipe: DatePipe,
    private popoverController: PopoverController,
    private transferirService: TransferirDatosService,
    private navC: NavController
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
    this.filtroBusqueda = this.devuelveFiltroSentencia(this.filtros);
    this.cargarFacturas(this.filtroBusqueda);

    this.transferirService.sendObjectSource({ codigo: this.codigo })
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.goBack();
    });
  }

  public async filtrarFacturas($event: any) {

    this.filtros.texto = $event.detail.value;
    this.filtroBusqueda = this.devuelveFiltroSentencia(this.filtros);
    this.facturasCliente = [];
    this.facturasProveedor = [];

    this.cargarFacturas(this.filtroBusqueda);
  }

  private devuelveFiltroSentencia(filtros: any): string {
    let filtro = '';
    let nFiltrosAnadidos = 0;

    if (filtros.texto != '' || filtros.fechaDesde != '' || filtros.fechaHasta != '' || filtros.estCobro != '0' || filtros.serie != 'Todas') {
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

    if (filtros.serie != 'Todas') {
      if (nFiltrosAnadidos > 0) {
        filtro = filtro + " AND substr(num,1,2) = '" + filtros.serie + "' ";
        nFiltrosAnadidos++;
      } else {
        filtro = filtro + " substr(num,1,2) = '" + filtros.serie + "' ";
        nFiltrosAnadidos++;
      }
    }

    switch (filtros.estCobro) {
      case '0':
        filtro = filtro + '';
        break;
      case '1':
        if (nFiltrosAnadidos > 0) {
          filtro = filtro + " AND toceu = 0 ";
          nFiltrosAnadidos++;
        } else {
          filtro = filtro + " toceu = 0 ";
          nFiltrosAnadidos++;
        }
        break;
      case '2':
        if (nFiltrosAnadidos > 0) {
          filtro = filtro + " AND toceu <> 0 AND toceu < totmon ";
          nFiltrosAnadidos++;
        } else {
          filtro = filtro + " toceu <> 0 AND toceu < totmon ";
          nFiltrosAnadidos++;
        }
        break;
      case '3':
        if (nFiltrosAnadidos > 0) {
          filtro = filtro + " AND toceu = totmon ";
          nFiltrosAnadidos++;
        } else {
          filtro = filtro + " toceu = totmon ";
          nFiltrosAnadidos++;
        }
        break;
    }

    if (filtros.fechaDesde != '') {
      if (nFiltrosAnadidos > 0) {
        filtro = filtro + " AND fee >= '" + this.formatearFecha(filtros.fechaDesde) + "' ";
        nFiltrosAnadidos++;
      } else {
        filtro = filtro + " fee >= '" + this.formatearFecha(filtros.fechaDesde) + "' ";
        nFiltrosAnadidos++;
      }
    } else {
      filtro = filtro + '';
    }

    if (filtros.fechaHasta != '') {
      if (nFiltrosAnadidos > 0) {
        filtro = filtro + " AND fee <= '" + this.formatearFecha(filtros.fechaHasta) + "' ";
        nFiltrosAnadidos++;
      } else {
        filtro = filtro + " fee <= '" + this.formatearFecha(filtros.fechaHasta) + "' ";
        nFiltrosAnadidos++;
      }
    } else {
      filtro = filtro + '';
    }

    switch (filtros.orden) {
      case '1':
        filtro = filtro + " ORDER BY fee DESC";
        break;
      case '2':
        filtro = filtro + " ORDER BY fee ASC";
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
      component: FiltroFacturasComponent,
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
        this.facturasCliente = [];
        this.facturasProveedor = [];

        this.cargarFacturas(this.filtroBusqueda);
      } else {
        this.filtros = { texto: '', serie: 'Todas', estCobro: '0', fechaDesde: '', fechaHasta: '', orden: '1', nFiltrosAplicados: 0 };
      }
    }).catch((err) => {
      this.filtros = { texto: '', serie: 'Todas', estCobro: '0', fechaDesde: '', fechaHasta: '', orden: '1', nFiltrosAplicados: 0 };
    })
  }

  private cargarFacturas(filtro: string) {
    switch (this.tipo) {
      case 'cliente':
        this.consultaRealizada = false;
        this.dbService.getListadoFacturas('CL', this.codigo, filtro).then((facturas) => {
          this.facturasAUXCliente = facturas;
          this.calcularImporteFacturas();
          this.consultaRealizada = true;
          this.registros = this.facturasCliente.length;

          for (let i = 0; i < this.facturasPorPagina; i++) {
            if (this.facturasCliente.length < this.facturasAUXCliente.length) {
              this.facturasCliente.push(this.facturasAUXCliente[this.registros + i]);
              this.hayMasFacturas = true;
            } else {
              this.hayMasFacturas = false;
            }
          }
        });
        this.dbService.getNombreCliente(this.codigo).then((nombre) => {
          this.nombre = nombre;
        });
        this.dbService.getSeriesDocumento('CL', 'factura', this.codigo).then((series) => {
          this.series = series;
        });
        break;
      case 'proveedor':
        this.consultaRealizada = false;
        this.dbService.getListadoFacturas('PR', this.codigo, filtro).then((facturas) => {
          this.facturasAUXProveedor = facturas;
          this.calcularImporteFacturas();
          this.consultaRealizada = true;
          this.registros = this.facturasProveedor.length;

          for (let i = 0; i < this.facturasPorPagina; i++) {
            if (this.facturasProveedor.length < this.facturasAUXProveedor.length) {
              this.facturasProveedor.push(this.facturasAUXProveedor[this.registros + i]);
              this.hayMasFacturas = true;
            } else {
              this.hayMasFacturas = false;
            }
          }
        });
        this.dbService.getNombreProveedor(this.codigo).then((nombre) => {
          this.nombre = nombre;
        });
        this.dbService.getSeriesDocumento('PR', 'factura', this.codigo).then((series) => {
          this.series = series;
        });
        break;
    }
  }

  calcularImporteFacturas() {
    this.importeFacturas = 0;
    if (this.tipo == 'cliente'){
      for (let index = 0; index < this.facturasAUXCliente.length; index++) {
        let importe = this.facturasAUXCliente[index].totmon;
        if (importe != null || importe != undefined) {
          this.importeFacturas = this.importeFacturas + parseFloat(importe);
        }
      }
    } else if (this.tipo == 'proveedor'){
      for (let index = 0; index < this.facturasAUXProveedor.length; index++) {
        let importe = this.facturasAUXProveedor[index].totmon;
        if (importe != null || importe != undefined) {
          this.importeFacturas = this.importeFacturas + parseFloat(importe);
        }
      }
    }
    this.importeFacturas = parseFloat(this.importeFacturas.toFixed(2));
  }


  onIonInfinite(ev: InfiniteScrollCustomEvent) {
    if (this.tipo == 'cliente') {
      if (this.registros != this.facturasAUXCliente.length) {
        this.cargarFacturas(this.filtroBusqueda);
        setTimeout(() => {
          (ev as InfiniteScrollCustomEvent).target.complete();
        }, 500);
      }
    } else if (this.tipo == 'proveedor') {
      if (this.registros != this.facturasAUXProveedor.length) {
        this.cargarFacturas(this.filtroBusqueda);
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

  comprobarFactura(factura: any): string {
    if (factura.est == "3") {
      return "rowBackgroundGreen";
    } else if (factura.est == "1") {
      return "rowBackgroundRed";
    } else if (factura.est == "2") {
      return "rowBackgroundCian";
    } else {
      return "rowBackgroundGray";
    }
  }

  formatearNumero(numero: any){
    let numeroFormateado = parseFloat(numero).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    return numeroFormateado;
  }

}