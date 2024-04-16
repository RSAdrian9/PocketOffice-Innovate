import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, Platform } from '@ionic/angular';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { ActivatedRoute } from '@angular/router';
import { albaranes } from 'src/app/models/albaranes.model';
import { DbService } from 'src/app/services/db.service';
import { IonList, IonInfiniteScroll, InfiniteScrollCustomEvent, IonInfiniteScrollContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-albaranes',
  templateUrl: './albaranes.page.html',
  styleUrls: ['./albaranes.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, IonList, IonInfiniteScroll, IonInfiniteScrollContent]
})
export class AlbaranesPage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  codigo: string = ''
  tipo: string = ''
  filtro: string = ''
  albaran: albaranes[] = [];
  nombre: string = '';

  public albaranes: Array<albaranes> = [];
  private albaranesAUX: Array<albaranes> = [];
  private filtroBusqueda: string = '';
  private albaranesPorPagina: number = 10;
  private registros: number = 0;
  public hayMasAlbaranes: boolean = true;
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

  private cargarAlbaranes(filtro: string) {
    switch (this.tipo) {
      case 'cliente':
        this.consultaRealizada = false;
        this.dbService.getListadoAlbaranes('CL', this.codigo, filtro).then((albaranes) => {
          this.albaranesAUX = albaranes;
          this.consultaRealizada = true;
          this.registros = this.albaranes.length;

          for (let i = 0; i < this.albaranesPorPagina; i++) {
            if (this.albaranes.length < this.albaranesAUX.length) {
              this.albaranes.push(this.albaranesAUX[this.registros + i]);
              this.hayMasAlbaranes = true;
            } else {
              this.hayMasAlbaranes = false;
            }
          }
        });
        this.dbService.getNombreCliente(this.codigo).then((nombre) => {
          this.nombre = nombre;
        });
        break;
      case 'proveedor':
        this.consultaRealizada = false;
        this.dbService.getListadoAlbaranes('PR', this.codigo, filtro).then((albaranes) => {
          this.albaranesAUX = albaranes;
          this.consultaRealizada = true;
          this.registros = this.albaranes.length;

          for (let i = 0; i < this.albaranesPorPagina; i++) {
            if (this.albaranes.length < this.albaranesAUX.length) {
              this.albaranes.push(this.albaranesAUX[this.registros + i]);
              this.hayMasAlbaranes = true;
            } else {
              this.hayMasAlbaranes = false;
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
    this.cargarAlbaranes('');

    this.transferirService.sendObjectSource({ codigo: this.codigo })
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.goBack();
    });
  }

  onIonInfinite(ev: InfiniteScrollCustomEvent) {

    if (this.registros != this.albaranesAUX.length) {
      this.cargarAlbaranes('');
      setTimeout(() => {
        (ev as InfiniteScrollCustomEvent).target.complete();
      }, 500);
    } else {

    }
  }

}