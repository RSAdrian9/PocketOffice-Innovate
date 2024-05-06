import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonItem, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonImg, InfiniteScrollCustomEvent, Platform, NavController, IonList, IonInfiniteScroll, IonInfiniteScrollContent, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonButton, IonSearchbar, PopoverController, IonProgressBar, IonCheckbox, IonBadge } from '@ionic/angular/standalone';
import { proveedorTmp } from 'src/app/models/proveedorTmp.model';
import { DbService } from 'src/app/services/db.service';
import { addIcons } from 'ionicons';
import { alertCircle, eyeOutline, funnel, search } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { FiltroProveedoresComponent } from 'src/app/components/filtro-proveedores/filtro-proveedores.component';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.page.html',
  styleUrls: ['./proveedores.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonImg, IonList, IonInfiniteScroll, IonInfiniteScrollContent, IonIcon, IonItem, RouterLink, RouterLinkActive, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonButton, IonSearchbar, IonProgressBar, IonCheckbox, IonBadge]
})
export class ProveedoresPage implements OnInit {
  public proveedores: Array<proveedorTmp> = [];
  private proveedoresAUX: Array<proveedorTmp> = [];
  private filtroBusqueda: string = '';
  private proveedoresPorPagina: number = 25;
  private registros: number = 0;
  public hayMasProveedores: boolean = true;
  public consultaRealizada: boolean = false;
  public mostrarBusqueda: boolean = false;
  public filtros: any = { texto: '', actividad: '0', nFiltrosAplicados: 0 };

  constructor(
    private platform: Platform,
    private dbService: DbService,
    private navC: NavController,
    private transferirService: TransferirDatosService,
    private popoverController: PopoverController

  ) {
    addIcons({ eyeOutline, alertCircle, search, funnel });
    this.mostrarBusqueda = true;
  }

  ngOnInit() {
    this.pageController('/proveedor');
    this.cargarProveedores('');
  }

  ionViewDidEnter() {
    this.pageController('/proveedor');
  }

  public async filtrarProveedores($event: any) {

    this.filtros.texto = $event.detail.value;
    this.filtroBusqueda = this.devuelveFiltroSentencia(this.filtros);
    this.proveedores = [];

    this.cargarProveedores(this.filtroBusqueda);
  }

  private devuelveFiltroSentencia(filtros: any): string {
    let filtro = '';
    let nFiltrosAnadidos = 0;

    if (filtros.texto != '' || filtros.actividad != '0') {

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

    console.log(filtro);
    return filtro;
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: FiltroProveedoresComponent,
      componentProps: this.filtros,
      event: ev,
      translucent: true
    });
    await popover.present();

    popover.onDidDismiss().then((data) => {
      if (data.data != undefined) {
        this.filtros = data.data;
        this.filtroBusqueda = this.devuelveFiltroSentencia(this.filtros);
        this.proveedores = [];

        this.cargarProveedores(this.filtroBusqueda);
      } else {
        this.filtros = { texto: '', actividad: '0', nFiltrosAplicados: 0 };
      }
    }).catch((err) => {
      this.filtros = { texto: '', actividad: '0', nFiltrosAplicados: 0 };
    })
  }

  private cargarProveedores(filtro: string) {
    this.consultaRealizada = false;
    this.dbService.getProveedoresParaLista(filtro).then((proveedores) => {
      this.proveedoresAUX = proveedores;
      this.consultaRealizada = true;
      this.registros = this.proveedores.length;

      for (let i = 0; i < this.proveedoresPorPagina; i++) {
        if (this.proveedores.length < this.proveedoresAUX.length) {
          this.proveedores.push(this.proveedoresAUX[this.registros + i]);
          this.hayMasProveedores = true;
        } else {
          this.hayMasProveedores = false;
        }
      }
    });
  }


  onIonInfinite(ev: InfiniteScrollCustomEvent) {

    if (this.registros != this.proveedoresAUX.length) {
      this.cargarProveedores(this.filtroBusqueda);
      setTimeout(() => {
        (ev as InfiniteScrollCustomEvent).target.complete();
      }, 500);
    } else {

    }
  }

  pageController(route: string) {
    this.transferirService.sendObjectSource({ ruta: route });
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navC.navigateBack('/home');
      this.transferirService.sendObjectSource({ ruta: '/home' });
    });
  }

}

