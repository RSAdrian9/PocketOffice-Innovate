import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController, Platform } from '@ionic/angular';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { ActivatedRoute } from '@angular/router';
import { facturas } from 'src/app/models/facturas.model';
import { DbService } from 'src/app/services/db.service';
import { IonList, IonInfiniteScroll, InfiniteScrollCustomEvent, IonInfiniteScrollContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.page.html',
  styleUrls: ['./facturas.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, IonList, IonInfiniteScroll, IonInfiniteScrollContent]
})
export class FacturasPage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  codigo: string = ''
  tipo: string = ''
  filtro: string = ''
  factura: facturas[] = [];
  nombre: string = '';

  public facturas: Array<facturas> = [];
  private facturasAUX: Array<facturas> = [];
  private filtroBusqueda: string = '';
  private facturasPorPagina: number = 10;
  private registros: number = 0;
  public hayMasFacturas: boolean = true;
  public consultaRealizada: boolean = false;
  public mostrarBusqueda: boolean = false;
  public filtros: any = { texto: '', estCobro: '0', fechaDesde: '', fechaHasta: '', nFiltrosAplicados: 0 };

  constructor(
    private platform: Platform,
    private transferirService: TransferirDatosService,
    private navC: NavController,
    private dbService: DbService
  ) { }

  ngOnInit() {
    this.tipo = this.activatedRoute.snapshot.paramMap.get('tipo') as string;
    this.codigo = this.activatedRoute.snapshot.paramMap.get('codigo') as string;
    console.log(this.activatedRoute.snapshot.params);

    this.pageController();
  }

  onViewDidEnter() {
    this.tipo = this.activatedRoute.snapshot.paramMap.get('tipo') as string;
    this.codigo = this.activatedRoute.snapshot.paramMap.get('codigo') as string;
    this.pageController();
  }

  /*
  public async filtrarFacturas($event: any) {

    this.filtros.texto = $event.detail.value;
    this.filtroBusqueda = this.devuelveFiltroSentencia(this.filtros);
    this.facturas = [];

    this.cargarFacturas(this.filtroBusqueda);
  }

  private devuelveFiltroSentencia(filtros: any): string {
    let filtro = '';
    let nFiltrosAnadidos = 0;

    if (filtros.texto != '' || filtros.actividad != '0' || filtros.riesgo != '0') {

      filtro = filtro + 'WHERE ';
    }

    if (filtros.texto != '') {
      if (nFiltrosAnadidos > 0) {
        filtro = filtro + " AND (t1.cod LIKE '%" + filtros.texto + "%' OR t1.nom LIKE '%" + filtros.texto + "%') ";
        nFiltrosAnadidos++;
      } else {
        filtro = filtro + " (t1.cod LIKE '%" + filtros.texto + "%' OR t1.nom LIKE '%" + filtros.texto + "%') ";
        nFiltrosAnadidos++;
      }
    }

    switch (filtros.actividad) {
      case '0':
        filtro = filtro + '';
        break;
      case '1':
        if (nFiltrosAnadidos > 0) {
          filtro = filtro + ' AND activo = 1 ';
          nFiltrosAnadidos++;
        } else {
          filtro = filtro + ' activo = 1 ';
          nFiltrosAnadidos++;
        }
        break;
      case '2':
        if (nFiltrosAnadidos > 0) {
          filtro = filtro + ' AND activo = 0';
          nFiltrosAnadidos++;
        } else {
          filtro = filtro + ' activo = 0';
          nFiltrosAnadidos++;
        }
        break;
    }

    if (filtros.riesgo == '1') {
      if (nFiltrosAnadidos > 0) {
        filtro = filtro + ' AND riesgo > 0 AND totalimp > riesgo ';
        nFiltrosAnadidos++;
      } else {
        filtro = filtro + ' riesgo > 0 AND totalimp > riesgo ';
        nFiltrosAnadidos++;
      }
    } else {
      filtro = filtro + '';
    }

    console.log(filtro);
    return filtro;
  }


  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: FiltroComponent,
      componentProps: this.filtros,
      event: ev,
      translucent: true
    });
    await popover.present();

    popover.onDidDismiss().then((data) => {
      if (data.data != undefined) {
        this.filtros = data.data;
        this.filtroBusqueda = this.devuelveFiltroSentencia(this.filtros);
        this.clientes = [];

        this.cargarClientes(this.filtroBusqueda);
      } else {
        this.filtros = { texto: '', actividad: '0', riesgo: '0', nFiltrosAplicados: 0 };
      }
    }).catch((err) => {
      this.filtros = { texto: '', actividad: '0', riesgo: '0', nFiltrosAplicados: 0 };
    })
  }
    */

  private cargarFacturas(filtro: string) {
    switch (this.tipo) {
      case 'cliente':
        this.consultaRealizada = false;
        this.dbService.getListadoFacturas('CL', this.codigo, filtro).then((facturas) => {
          this.facturasAUX = facturas;
          this.consultaRealizada = true;
          this.registros = this.facturas.length;

          for (let i = 0; i < this.facturasPorPagina; i++) {
            if (this.facturas.length < this.facturasAUX.length) {
              this.facturas.push(this.facturasAUX[this.registros + i]);
              this.hayMasFacturas = true;
            } else {
              this.hayMasFacturas = false;
            }
          }
        });
        this.dbService.getNombreCliente(this.codigo).then((nombre) => {
          this.nombre = nombre;
        });
        break;
      case 'proveedor':
        this.consultaRealizada = false;
        this.dbService.getListadoFacturas('PR', this.codigo, filtro).then((facturas) => {
          this.facturasAUX = facturas;
          this.consultaRealizada = true;
          this.registros = this.facturas.length;

          for (let i = 0; i < this.facturasPorPagina; i++) {
            if (this.facturas.length < this.facturasAUX.length) {
              this.facturas.push(this.facturasAUX[this.registros + i]);
              this.hayMasFacturas = true;
            } else {
              this.hayMasFacturas = false;
            }
          }
        });
        this.dbService.getNombreCliente(this.codigo).then((nombre) => {
          this.nombre = nombre;
        });
        break;
    }

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
    this.cargarFacturas('');

    this.transferirService.sendObjectSource({ codigo: this.codigo })
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.goBack();
    });
  }

  onIonInfinite(ev: InfiniteScrollCustomEvent) {

    if (this.registros != this.facturasAUX.length) {
      this.cargarFacturas('');
      setTimeout(() => {
        (ev as InfiniteScrollCustomEvent).target.complete();
      }, 500);
    } else {

    }
  }

}
