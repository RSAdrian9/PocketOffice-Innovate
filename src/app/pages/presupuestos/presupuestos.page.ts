import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, Platform } from '@ionic/angular';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { ActivatedRoute } from '@angular/router';
import { presupuestos } from 'src/app/models/presupuestos.model';
import { DbService } from 'src/app/services/db.service';
import { IonList, IonInfiniteScroll, InfiniteScrollCustomEvent, IonInfiniteScrollContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-presupuestos',
  templateUrl: './presupuestos.page.html',
  styleUrls: ['./presupuestos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, IonList, IonInfiniteScroll, IonInfiniteScrollContent,
  ]
})
export class PresupuestosPage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  codigo: string = ''
  tipo: string = ''
  filtro: string = ''
  nombre: string = '';

  public presupuestos: Array<presupuestos> = [];
  private presupuestosAUX: Array<presupuestos> = [];
  private filtroBusqueda: string = '';
  private presupuestosPorPagina: number = 10;
  private registros: number = 0;
  public hayMasPresupuestos: boolean = true;
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

  private cargarPresupuestos(filtro: string) {
    switch (this.tipo) {
      case 'cliente':
        this.consultaRealizada = false;
        this.dbService.getListadoPresupuestos(this.codigo, '').then((presupuestos) => {
          this.presupuestosAUX = presupuestos;
          this.consultaRealizada = true;
          this.registros = this.presupuestos.length;

          for (let i = 0; i < this.presupuestosPorPagina; i++) {
            if (this.presupuestos.length < this.presupuestosAUX.length) {
              this.presupuestos.push(this.presupuestosAUX[this.registros + i]);
              this.hayMasPresupuestos = true;
            } else {
              this.hayMasPresupuestos = false;
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
    this.cargarPresupuestos('');

    this.transferirService.sendObjectSource({ codigo: this.codigo })
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.goBack();
    });
  }

  onIonInfinite(ev: InfiniteScrollCustomEvent) {

    if (this.registros != this.presupuestosAUX.length) {
      this.cargarPresupuestos('');
      setTimeout(() => {
        (ev as InfiniteScrollCustomEvent).target.complete();
      }, 500);
    } else {

    }
  }

}
