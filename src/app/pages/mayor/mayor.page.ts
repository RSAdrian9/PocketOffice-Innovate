import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, Platform } from '@ionic/angular';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { InfiniteScrollCustomEvent, IonInfiniteScroll, IonInfiniteScrollContent, PopoverController, IonBadge, IonButton, IonItem, IonItemDivider, IonGrid, IonRow, IonCol, IonIcon } from '@ionic/angular/standalone';
import { DbService } from 'src/app/services/db.service';
import { addIcons } from 'ionicons';
import { openOutline } from 'ionicons/icons';
import { mayor } from 'src/app/models/mayor.model';
import { anio } from 'src/app/models/anio.model';
import { FiltroMayorComponent } from 'src/app/components/filtro-mayor/filtro-mayor.component';

@Component({
  selector: 'app-mayor',
  templateUrl: './mayor.page.html',
  styleUrls: ['./mayor.page.scss'],
  standalone: true,
  providers: [DatePipe],
  imports: [IonicModule, RouterModule, CommonModule, FormsModule, IonInfiniteScroll, IonInfiniteScrollContent, IonBadge, IonButton, IonItem, IonItemDivider, IonGrid, IonRow, IonCol, IonIcon]
})
export class MayorPage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  codigo: string = '';
  tipo: string = '';
  nombre: string = '';
  public anios: Array<anio> = [];
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
  public filtros: any = { texto: '', anio: this.devuelveAnioDefecto(), fechaDesde: '', fechaHasta: '', nFiltrosAplicados: 1 };

  constructor(
    private platform: Platform,
    private transferirService: TransferirDatosService,
    private navC: NavController,
    private dbService: DbService,
    private datepipe: DatePipe,
    private popoverController: PopoverController
  ) {
    addIcons({
      openOutline
    });
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

  async cargarMayor(filtro: string) {
    switch (this.tipo) {
      case 'cliente':
        this.consultaRealizada = false;
        this.dbService.getListadoMayorDeCuentas('CL', this.codigo, filtro).then((mayor) => {
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
        this.dbService.getAniosApuntes('CL', this.codigo).then((anios) => {
          this.anios = anios;
        });
        break;
      case 'proveedor':
        this.consultaRealizada = false;
        this.dbService.getListadoMayorDeCuentas('PR', this.codigo, filtro).then((mayor) => {
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
        this.dbService.getAniosApuntes('PR', this.codigo).then((anios) => {
          this.anios = anios;
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
    this.filtroBusqueda = this.devuelveFiltroSentencia(this.filtros);
    this.cargarMayor(this.filtroBusqueda);

    this.transferirService.sendObjectSource({ codigo: this.codigo })
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.goBack();
    });
  }

  public async filtrarEfectos($event: any) {

    this.filtros.texto = $event.detail.value;
    this.filtroBusqueda = this.devuelveFiltroSentencia(this.filtros);
    this.mayor = [];

    this.cargarMayor(this.filtroBusqueda);
  }

  private devuelveFiltroSentencia(filtros: any): string {
    let filtro = '';
    let nFiltrosAnadidos = 0;

    if (filtros.texto != '' || filtros.anio != '' || filtros.fechaDesde != '' || filtros.fechaHasta != '') {
      filtro = filtro + 'AND ';
    }

    if (filtros.texto != '') {
      if (nFiltrosAnadidos > 0) {
        filtro = filtro + " AND con LIKE '%" + filtros.texto + "%' ";
        nFiltrosAnadidos++;
      } else {
        filtro = filtro + " con LIKE '%" + filtros.texto + "%' ";
        nFiltrosAnadidos++;
      }
    }

    if (filtros.anio != '') {
      if (nFiltrosAnadidos > 0) {
        filtro = filtro + " AND anio='" + filtros.anio + "' ";
        nFiltrosAnadidos++;
      } else {
        filtro = filtro + " anio='" + filtros.anio + "' ";
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

    return filtro;
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: FiltroMayorComponent,
      componentProps: { filtros: this.filtros, anios: this.anios },
      event: ev,
      translucent: true
    });
    await popover.present();

    popover.onDidDismiss().then((data) => {
      if (data.data != undefined) {
        console.log(data);
        this.filtros = data.data;
        this.filtroBusqueda = this.devuelveFiltroSentencia(this.filtros);
        this.mayor = [];

        console.log(this.filtroBusqueda);
        this.cargarMayor(this.filtroBusqueda);
      } else {
        this.filtros = { texto: '', anio: this.devuelveAnioDefecto(), fechaDesde: '', fechaHasta: '', nFiltrosAplicados: 1 };
      }
    }).catch((err) => {
      this.filtros = { texto: '', anio: this.devuelveAnioDefecto(), fechaDesde: '', fechaHasta: '', nFiltrosAplicados: 1 };
    })
  }

  calcularImporteMayor() {
    this.totalDebe = 0;
    this.totalHaber = 0;
    this.totalSaldo = 0;

    for (let index = 0; index < this.mayorAUX.length; index++) {
      let importeDebe = this.mayorAUX[index].impeu;
      if (importeDebe != null || importeDebe != undefined) {
        if (this.mayorAUX[index].sig == 'D') {
          this.totalDebe = this.totalDebe + parseFloat(importeDebe);
        }
      }

      let importeHaber = this.mayorAUX[index].impeu;
      if (importeHaber != null || importeHaber != undefined) {
        if (this.mayorAUX[index].sig == 'H') {
          this.totalHaber = this.totalHaber + parseFloat(importeHaber);
        }
      }

    }

    this.totalDebe = parseFloat(this.totalDebe.toFixed(2));
    this.totalHaber = parseFloat(this.totalHaber.toFixed(2));
    this.totalSaldo = this.totalDebe - this.totalHaber;
  }

  onIonInfinite(ev: InfiniteScrollCustomEvent) {

    if (this.registros != this.mayorAUX.length) {
      this.cargarMayor(this.filtroBusqueda);
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

  formatearNumero(numero: any) {
    let numeroFormateado = parseFloat(numero).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    return numeroFormateado;
  }

  devuelveAnioDefecto(): string {
    return (new Date()).getFullYear().toString();
  }


}