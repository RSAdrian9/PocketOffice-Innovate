import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, Platform } from '@ionic/angular';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IonList, IonInfiniteScroll, InfiniteScrollCustomEvent, IonInfiniteScrollContent } from '@ionic/angular/standalone';
import { efectos } from 'src/app/models/efectos.model';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-efectos',
  templateUrl: './efectos.page.html',
  styleUrls: ['./efectos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule, IonList, IonInfiniteScroll, IonInfiniteScrollContent,  
  ]
})
export class EfectosPage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  codigo: string = ''
  tipo: string = ''
  filtro: string = ''
  nombre: string = '';

  public efectos: Array<efectos> = [];
  private efectosAUX: Array<efectos> = [];
  private filtroBusqueda: string = '';
  private efectosPorPagina: number = 10;
  private registros: number = 0;
  public hayMasEfectos: boolean = true;
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

  onViewDidEnter() {
    this.tipo = this.activatedRoute.snapshot.paramMap.get('tipo') as string;
    this.codigo = this.activatedRoute.snapshot.paramMap.get('codigo') as string;
    this.pageController();
  }

  async cargarEfectos() {
    switch (this.tipo) {
      case 'cliente':
        this.dbService.getListadoEfectos('C', this.codigo, this.filtro).then((efectos) => {
          console.log(efectos);
          this.efectos = efectos;
        }).catch((err) => {
          console.log(err);
        });
        this.dbService.getNombreCliente(this.codigo).then((nombre) => {
          this.nombre = nombre;
        });
        break;
      case 'proveedor':
        this.dbService.getListadoEfectos('P', this.codigo, this.filtro).then((efectos) => {
          console.log(efectos);
          this.efectos = efectos;
        }).catch((err) => {
          console.log(err);
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
    this.cargarEfectos();

    this.transferirService.sendObjectSource({ codigo: this.codigo })
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.goBack();
    });
  }

  onIonInfinite(ev: InfiniteScrollCustomEvent) {

    if (this.registros != this.efectosAUX.length) {
      this.cargarEfectos();
      setTimeout(() => {
        (ev as InfiniteScrollCustomEvent).target.complete();
      }, 500);
    } else {

    }
  }

}
