import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, Platform } from '@ionic/angular';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { InfiniteScrollCustomEvent, IonInfiniteScroll, IonInfiniteScrollContent, PopoverController, IonBadge, IonButton, IonItem, IonItemDivider, IonGrid, IonRow, IonCol, IonIcon } from '@ionic/angular/standalone';
import { mayor } from 'src/app/models/mayor.model';
import { DbService } from 'src/app/services/db.service';
import { addIcons } from 'ionicons';
import { openOutline } from 'ionicons/icons';

@Component({
  selector: 'app-mayor',
  templateUrl: './mayor.page.html',
  styleUrls: ['./mayor.page.scss'],
  standalone: true,
  providers: [DatePipe],
  imports: [IonicModule, RouterModule, CommonModule, FormsModule, IonInfiniteScroll, IonInfiniteScrollContent, IonBadge, IonButton, IonItem, IonItemDivider, IonGrid, IonRow, IonCol, IonIcon
  ]
})
export class MayorPage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  codigo: string = ''
  tipo: string = ''
  nombre: string = '';
  filtro: string = ''

  public mayor: Array<mayor> = [];
  private mayorAUX: Array<mayor> = [];
  private filtroBusqueda: string = '';
  private mayorPorPagina: number = 10;
  private registros: number = 0;
  public hayMasMayor: boolean = true;
  public consultaRealizada: boolean = false;
  public mostrarBusqueda: boolean = false;
  public totalDebe: number = 0;
  public totalHaber: number = 0;
  public totalSaldo: number = 0;
  public filtros: any = { texto: '', estCobro: '0', facturadoSi: '', facturadoNo: '', nFiltrosAplicados: 0 };

  constructor(    
    private platform: Platform,
    private transferirService: TransferirDatosService,
    private navC: NavController,
    private dbService: DbService
  ) { 
    addIcons({
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

  async cargarMayor() {
    switch (this.tipo) {
      case 'cliente':
        this.consultaRealizada = false;
        this.dbService.getListadoMayorDeCuentas('CL', this.codigo, this.filtro).then((mayor) => {
          this.mayorAUX = mayor;
          this.calcularImporteMayor();
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

  calcularImporteMayor() {
    this.totalDebe = 0; 
    this.totalHaber = 0;
    this.totalSaldo = 0;
    for (let index = 0; index < this.mayorAUX.length; index++) {
      let importeDebe = this.mayorAUX[index].deb;
      if (importeDebe != null || importeDebe != undefined) {
        this.totalDebe = this.totalDebe + parseFloat(importeDebe);
      }
      let importeHaber = this.mayorAUX[index].hab;
      if (importeHaber != null || importeHaber != undefined) {
        this.totalHaber = this.totalHaber + parseFloat(importeHaber);
      }

    }

    this.totalDebe = parseFloat(this.totalDebe.toFixed(2));
    this.totalHaber = parseFloat(this.totalHaber.toFixed(2));
    this.totalSaldo = this.totalDebe - this.totalHaber;
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
