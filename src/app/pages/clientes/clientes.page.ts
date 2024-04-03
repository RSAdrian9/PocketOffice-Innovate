import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonItem, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonImg, InfiniteScrollCustomEvent, Platform, NavController, IonList, IonInfiniteScroll, IonInfiniteScrollContent, IonIcon, IonCardContent, IonCardHeader, IonCardTitle, IonCard, IonCardSubtitle, IonButton, IonSearchbar, IonProgressBar, PopoverController } from '@ionic/angular/standalone';
import { clienteTmp } from 'src/app/models/clienteTmp';
import { DbService } from 'src/app/services/db.service';
import { addIcons } from 'ionicons';
import { alertCircle, eyeOutline, funnel, search } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { PopoverComponent } from 'src/app/components/popover/popover.component';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonImg, IonList, IonInfiniteScroll, IonInfiniteScrollContent, IonIcon, IonItem, RouterLink, RouterLinkActive, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonButton, IonSearchbar, IonProgressBar]
})

export class ClientesPage implements OnInit {
  public clientes: Array<clienteTmp> = [];
  private clientesAUX: Array<clienteTmp> = [];
  private filtro: string = '';
  private clientesPorPagina: number = 25;
  private registros: number = 0;
  public hayMasClientes: boolean = true;
  public consultaRealizada: boolean = false;
  public mostrarBusqueda: boolean = false;

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

  ionViewDidEnter(){
    this.pageController('/clientes');
  }

  public async filtrarClientes($event: any) {

    this.filtro = "WHERE t1.cod LIKE '%" + $event.detail.value + "%' OR t1.nom LIKE '%" + $event.detail.value + "%' ";
    //console.log(this.filtro);
    this.clientes = [];

    this.cargarClientes(this.filtro);
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      translucent: true
    });
    return await popover.present();
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
        }else{
          this.hayMasClientes = false;
        }
      }


    });
  }


  onIonInfinite(ev: InfiniteScrollCustomEvent) {
    console.log(this.hayMasClientes);
    if (this.registros != this.clientesAUX.length) {
      this.cargarClientes(this.filtro);
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
      if (s.total > s.riesgo) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }
}