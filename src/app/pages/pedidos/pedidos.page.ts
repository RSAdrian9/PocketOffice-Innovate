import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { ActivatedRoute } from '@angular/router';
import { pedidos } from 'src/app/models/pedidos.model';
import { Platform, NavController, InfiniteScrollCustomEvent, IonInfiniteScroll, IonInfiniteScrollContent, PopoverController, IonBadge, IonButton, IonItem, IonItemDivider, IonGrid, IonRow, IonCol, IonIcon } from '@ionic/angular/standalone';
import { DbService } from 'src/app/services/db.service';
import { FiltroPedidosComponent } from 'src/app/components/filtro-pedidos/filtro-pedidos.component';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
  standalone: true,
  providers: [DatePipe],
  imports: [IonicModule, CommonModule, FormsModule, IonInfiniteScroll, IonInfiniteScrollContent, IonBadge, IonButton, IonItem, IonItemDivider, IonGrid, IonRow, IonCol, IonIcon]
})
export class PedidosPage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  codigo: string = '';
  tipo: string = '';
  nombre: string = ''
  private series: Array<any> = [];
  private estados: Array<any> = [];
  public pedidos: Array<pedidos> = [];
  private pedidosAUX: Array<pedidos> = [];
  private filtroBusqueda: string = '';
  private pedidosPorPagina: number = 25;
  private registros: number = 0;
  public hayMasPedidos: boolean = true;
  public consultaRealizada: boolean = false;
  public mostrarBusqueda: boolean = false;
  public importePedidos: number = 0;
  public filtros: any = { texto: '', servido: 'Todos', estado: 'Todos', serie: 'Todos', fechaDesde: '', fechaHasta: '', orden: '1', nFiltrosAplicados: 0 };


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

  pageController() {
    this.filtroBusqueda = this.devuelveFiltroSentencia(this.filtros);
    this.cargarPedidos(this.filtroBusqueda);

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

  public async filtrarPedidos($event: any) {

    this.filtros.texto = $event.detail.value;
    this.filtroBusqueda = this.devuelveFiltroSentencia(this.filtros);
    this.pedidos = [];

    this.cargarPedidos(this.filtroBusqueda);
  }

  private devuelveFiltroSentencia(filtros: any): string {
    let filtro = '';
    let nFiltrosAnadidos = 0;

    if (filtros.texto != '' || filtros.fechaDesde != '' || filtros.fechaHasta != '' || filtros.servido != 'Todos' || filtros.estado != 'Todos' || filtros.serie != 'Todos') {
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

    if (filtros.servido != 'Todos') {
      if (nFiltrosAnadidos > 0) {
        filtro = filtro + " AND ser = '" + filtros.servido + "' ";
        nFiltrosAnadidos++;
      } else {
        filtro = filtro + " ser = '" + filtros.servido + "' ";
        nFiltrosAnadidos++;
      }
    }    

    if (filtros.estado != 'Todos') {
      if (nFiltrosAnadidos > 0) {
        filtro = filtro + " AND est = '" + filtros.estado + "' ";
        nFiltrosAnadidos++;
      } else {
        filtro = filtro + " est = '" + filtros.estado + "' ";
        nFiltrosAnadidos++;
      }
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
      component: FiltroPedidosComponent,
      componentProps: { filtros: this.filtros, series: this.series, estados: this.estados },
      event: ev,
      translucent: true
    });
    await popover.present();

    popover.onDidDismiss().then((data) => {
      if (data.data != undefined) {
        console.log(data);
        this.filtros = data.data;
        this.filtroBusqueda = this.devuelveFiltroSentencia(this.filtros);
        this.pedidos = [];

        this.cargarPedidos(this.filtroBusqueda);
      } else {
        this.filtros = { texto: '', servido: 'Todos', estado: 'Todos', serie: 'Todos', fechaDesde: '', fechaHasta: '', orden: '1', nFiltrosAplicados: 0 };
      }
    }).catch((err) => {
      this.filtros = { texto: '', servido: 'Todos', estado: 'Todos', serie: 'Todos', fechaDesde: '', fechaHasta: '', orden: '1', nFiltrosAplicados: 0 };
    })
  }

  private cargarPedidos(filtro: string) {
    switch (this.tipo) {
      case 'cliente':
        this.consultaRealizada = false;
        this.dbService.getListadoPedidos('CL', this.codigo, filtro).then((pedidos) => {
          this.pedidosAUX = pedidos;
          this.calcularImportePedidos();
          this.consultaRealizada = true;
          this.registros = this.pedidos.length;

          for (let i = 0; i < this.pedidosPorPagina; i++) {
            if (this.pedidos.length < this.pedidosAUX.length) {
              this.pedidos.push(this.pedidosAUX[this.registros + i]);
              this.hayMasPedidos = true;
            } else {
              this.hayMasPedidos = false;
            }
          }
        });
        this.dbService.getNombreCliente(this.codigo).then((nombre) => {
          this.nombre = nombre;
        });
        this.dbService.getSeriesDocumento('CL', 'pedido', this.codigo).then((series) => {
          this.series = series;
        });
        this.dbService.getEstadosPedidos('CL', this.codigo).then((estados) => {
          this.estados = estados;
        });
        break;
      case 'proveedor':
        this.consultaRealizada = false;
        this.dbService.getListadoPedidos('PR', this.codigo, filtro).then((pedidos) => {
          this.pedidosAUX = pedidos;
          this.calcularImportePedidos();
          this.consultaRealizada = true;
          this.registros = this.pedidos.length;

          for (let i = 0; i < this.pedidosPorPagina; i++) {
            if (this.pedidos.length < this.pedidosAUX.length) {
              this.pedidos.push(this.pedidosAUX[this.registros + i]);
              this.hayMasPedidos = true;
            } else {
              this.hayMasPedidos = false;
            }
          }
        });
        this.dbService.getNombreProveedor(this.codigo).then((nombre) => {
          this.nombre = nombre;
        });
        this.dbService.getSeriesDocumento('PR', 'pedido', this.codigo).then((series) => {
          this.series = series;
        });
        this.dbService.getEstadosPedidos('PR', this.codigo).then((estados) => {
          this.estados = estados;
        });
        break;
    }
  }

  calcularImportePedidos() {
    this.importePedidos = 0;
    for (let index = 0; index < this.pedidosAUX.length; index++) {
      let importe = this.pedidosAUX[index].toteu;
      if (importe != null || importe != undefined) {
        this.importePedidos = this.importePedidos + parseFloat(importe);
      }
    }

    this.importePedidos = parseFloat(this.importePedidos.toFixed(2));
  }

  onIonInfinite(ev: InfiniteScrollCustomEvent) {

    if (this.registros != this.pedidosAUX.length) {
      this.cargarPedidos(this.filtroBusqueda);
      setTimeout(() => {
        (ev as InfiniteScrollCustomEvent).target.complete();
      }, 500);
    } else {

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

  comprobarServido(pedido: pedidos): string {
    if (pedido.ser == "") {
      return "rowBackgroundRed";
    } else if (pedido.ser == "1") {
      return "rowBackgroundCian";
    } else if (pedido.ser == "2") {
      return "rowBackgroundGreen";
    } else {
      return "rowBackgroundGray";
    }
  }

  formatearNumero(numero: any) {
    let numeroFormateado = parseFloat(numero).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    return numeroFormateado;
  }

}