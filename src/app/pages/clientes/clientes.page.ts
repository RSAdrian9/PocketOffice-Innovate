import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonItem, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonImg, InfiniteScrollCustomEvent, Platform, NavController, IonList, IonInfiniteScroll, IonInfiniteScrollContent, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonButton, IonSearchbar, PopoverController, IonProgressBar, IonCheckbox, IonBadge } from '@ionic/angular/standalone';
import { clienteTmp } from 'src/app/models/clienteTmp';
import { DbService } from 'src/app/services/db.service';
import { addIcons } from 'ionicons';
import { alertCircle, eyeOutline, funnel, search } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { FiltroClientesComponent } from 'src/app/components/filtro-clientes/filtro-clientes.component';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonImg, IonList, IonInfiniteScroll, IonInfiniteScrollContent, IonIcon, IonItem, RouterLink, RouterLinkActive, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonButton, IonSearchbar, IonProgressBar, IonCheckbox, IonBadge]
})

export class ClientesPage implements OnInit {
  public clientes: Array<clienteTmp> = [];
  private clientesAUX: Array<clienteTmp> = [];
  private filtroBusqueda: string = '';
  private clientesPorPagina: number = 25;
  private registros: number = 0;
  public hayMasClientes: boolean = true;
  public consultaRealizada: boolean = false;
  public mostrarBusqueda: boolean = false;
  public filtros: any = { texto: '', actividad: '0', riesgo: '0', nFiltrosAplicados: 0 };

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
    this.pageController('/clientes');
    this.cargarClientes('');
  }

  ionViewDidEnter() {
    this.pageController('/clientes');
  }

  public async filtrarClientes($event: any) {

    this.filtros.texto = $event.detail.value;
    this.filtroBusqueda = this.devuelveFiltroSentencia(this.filtros);
    this.clientes = [];

    this.cargarClientes(this.filtroBusqueda);
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
      component: FiltroClientesComponent,
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

  private cargarClientes(filtro: string) {
    this.consultaRealizada = false;
    this.dbService.getClientesParaLista(filtro).then((clientes) => {
      this.clientesAUX = clientes;
      this.consultaRealizada = true;
      this.registros = this.clientes.length;

      for (let i = 0; i < this.clientesPorPagina; i++) {
        if (this.clientes.length < this.clientesAUX.length) {
          this.clientes.push(this.clientesAUX[this.registros + i]);
          this.hayMasClientes = true;
        } else {
          this.hayMasClientes = false;
        }
      }
    });
  }


  onIonInfinite(ev: InfiniteScrollCustomEvent) {

    if (this.registros != this.clientesAUX.length) {
      this.cargarClientes(this.filtroBusqueda);
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

  comprobarDiferencia(s: clienteTmp) {
    if (s.riesgo > 0.00) {
      if (s.totalimp > s.riesgo) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }

}
