import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, Platform } from '@ionic/angular';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { ActivatedRoute } from '@angular/router';
import { IonList, IonInfiniteScroll, InfiniteScrollCustomEvent, IonInfiniteScrollContent } from '@ionic/angular/standalone';
import { pedidos } from 'src/app/models/pedidos.model';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, IonList, IonInfiniteScroll, IonInfiniteScrollContent,
  ]
})
export class PedidosPage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  codigo: string = ''
  tipo: string = ''
  filtro: string = ''
  nombre: string = '';

  public pedidos: Array<pedidos> = [];
  private pedidosAUX: Array<pedidos> = [];
  private filtroBusqueda: string = '';
  private pedidosPorPagina: number = 5;
  private registros: number = 0;
  public hayMasPedidos: boolean = true;
  public consultaRealizada: boolean = false;
  public mostrarBusqueda: boolean = false;
  public filtros: any = { texto: '', estCobro: '0', facturadoSi: '', facturadoNo: '', nFiltrosAplicados: 0 };

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

  ionViewDidEnter() {
    this.tipo = this.activatedRoute.snapshot.paramMap.get('tipo') as string;
    this.codigo = this.activatedRoute.snapshot.paramMap.get('codigo') as string;
    this.pageController();
  }

  async cargarPedidos() {
    switch (this.tipo) {
      case 'cliente':
        this.consultaRealizada = false;
        this.dbService.getListadoPedidos('CL', this.codigo, this.filtro).then((pedidos) => {
          this.pedidosAUX = pedidos;
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
        break;
      case 'proveedor':
        this.consultaRealizada = false;
        this.dbService.getListadoPedidos('PR', this.codigo, this.filtro).then((pedidos) => {
          this.pedidosAUX = pedidos;
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
        break;
    }
  }


  goBack() {
    this.navC.navigateBack('/vista-cliente/' + this.codigo);
    this.transferirService.sendObjectSource({ ruta: '/vista-cliente' });
  }


  pageController() {
    this.cargarPedidos();

    this.transferirService.sendObjectSource({ codigo: this.codigo })
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.goBack();
    });
  }

  onIonInfinite(ev: InfiniteScrollCustomEvent) {

    if (this.registros != this.pedidosAUX.length) {
      this.cargarPedidos();
      setTimeout(() => {
        (ev as InfiniteScrollCustomEvent).target.complete();
      }, 500);
    } else {

    }
  }

}
