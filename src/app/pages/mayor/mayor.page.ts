import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, Platform } from '@ionic/angular';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IonList, IonInfiniteScroll, IonInfiniteScrollContent, InfiniteScrollCustomEvent } from '@ionic/angular/standalone';
import { mayor } from 'src/app/models/mayor.model';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-mayor',
  templateUrl: './mayor.page.html',
  styleUrls: ['./mayor.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,  RouterModule, IonList, IonInfiniteScroll, IonInfiniteScrollContent,
  ]
})
export class MayorPage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  codigo: string = ''
  tipo: string = ''
  filtro: string = ''
  nombre: string = '';

  public mayor: Array<mayor> = [];
  private mayorAUX: Array<mayor> = [];
  private filtroBusqueda: string = '';
  private mayorPorPagina: number = 10;
  private registros: number = 0;
  public hayMasMayor: boolean = true;
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
    console.log(this.activatedRoute.snapshot.params);
    
    this.pageController();
  }

  async cargarMayor() {
    switch (this.tipo) {
      case 'cliente':
        this.consultaRealizada = false;
        this.dbService.getListadoMayorDeCuentas('CL', this.codigo, this.filtro).then((mayor) => {
          this.mayorAUX = mayor;
          this.consultaRealizada = true;
          this.registros = this.mayor.length;
          
          for (let i = 0; i < this.mayorPorPagina; i++) {
            if (this.mayor.length < this.mayorAUX.length) {
              this.mayor.push(this.mayorAUX[this.registros + i]);
              this.hayMasMayor = true;
            } else {
              this.hayMasMayor = false;
            }
          }
          
        });
        this.dbService.getNombreCliente(this.codigo).then((nombre) => {
          this.nombre = nombre;
        });
        break;
      case 'proveedor':
        this.consultaRealizada = false;
        this.dbService.getListadoMayorDeCuentas('PR', this.codigo, this.filtro).then((mayor) => {
          this.mayorAUX = mayor;
          this.consultaRealizada = true;
          this.registros = this.mayor.length;
          
          for (let i = 0; i < this.mayorPorPagina; i++) {
            if (this.mayor.length < this.mayorAUX.length) {
              this.mayor.push(this.mayorAUX[this.registros + i]);
              this.hayMasMayor = true;
            } else {
              this.hayMasMayor = false;
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
    this.cargarMayor();

    this.transferirService.sendObjectSource({ codigo: this.codigo })
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.goBack();
    });
  }

  onIonInfinite(ev: InfiniteScrollCustomEvent) {

    if (this.registros != this.mayorAUX.length) {
      this.cargarMayor();
      setTimeout(() => {
        (ev as InfiniteScrollCustomEvent).target.complete();
      }, 500);
    } else {

    }
  }

  formatearNumero(numero: any) {
    let numeroFormateado = parseFloat(numero).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    return numeroFormateado;
  }

}
