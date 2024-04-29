import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, Platform } from '@ionic/angular';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IonList, IonInfiniteScroll, InfiniteScrollCustomEvent, IonInfiniteScrollContent } from '@ionic/angular/standalone';
import { efectos } from 'src/app/models/efectos.model';
import { DbService } from 'src/app/services/db.service';
import { efectosTmp } from 'src/app/models/efectosTmp.model';
import { addIcons } from 'ionicons';
import { openOutline } from 'ionicons/icons';

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

  public efectos: Array<efectosTmp> = [];
  private efectosAUX: Array<efectosTmp> = [];
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
  ) { 
    addIcons ({
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

  async cargarEfectos() {
    switch (this.tipo) {
      case 'cliente':
        this.consultaRealizada = false;
        this.dbService.getListadoEfectos('C', this.codigo, this.filtro).then((efectos) => {
          this.efectosAUX = efectos;
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
        break;
      case 'proveedor':
        this.consultaRealizada = false;
        this.dbService.getListadoEfectos('P', this.codigo, this.filtro).then((efectos) => {
          this.efectosAUX = efectos;
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

  formatearNumero(numero: any) {
    let numeroFormateado = parseFloat(numero).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    return numeroFormateado;
  }

}
