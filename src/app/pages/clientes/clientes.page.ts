import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonItem, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonImg, InfiniteScrollCustomEvent, Platform, NavController, IonList, IonInfiniteScroll, IonInfiniteScrollContent, IonIcon, IonCardContent, IonCardHeader, IonCardTitle, IonCard, IonCardSubtitle, IonButton, IonSearchbar } from '@ionic/angular/standalone';
import { clienteTmp } from 'src/app/models/clienteTmp';
import { DbService } from 'src/app/services/db.service';
import { addIcons } from 'ionicons';
import { alertCircle, eyeOutline, searchOutline } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonImg, IonList, IonInfiniteScroll, IonInfiniteScrollContent, IonIcon, IonItem, RouterLink, RouterLinkActive, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonButton, IonSearchbar]
})
export class ClientesPage implements OnInit {
  clientes: Array<clienteTmp> = [];
  clientesAUX: Array<clienteTmp> = [];
  constructor(
    private platform: Platform,
    private dbService: DbService,
    private navC: NavController,
    private transferirService: TransferirDatosService
  ) { 
    addIcons({ eyeOutline, searchOutline, alertCircle });
  }

  ngOnInit() {
    this.pageController('/clientes');
    this.cargarClientes();
  }

  async filtrarClientes($event: any) {
    console.log($event.detail.value);
  }

  private cargarClientes(){
    this.dbService.getClientesParaLista().then((clientes) => {
      this.clientesAUX = clientes;

      const registros =this.clientes.length;
      if (this.clientes.length > 25) {
      for (let i= 0; i < 25; i++) {
        this.clientes.push(this.clientesAUX[registros+i]);
      } 
    } else {
      for (let i= 0; i < clientes.length; i++) {
        this.clientes.push(this.clientesAUX[registros+i]);
      } 
    }
    });
  }

  onIonInfinite(ev: InfiniteScrollCustomEvent) {
    this.cargarClientes();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  pageController(route:string){
    this.transferirService.sendObjectSource({ruta: route});
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navC.navigateBack('/home');
      this.transferirService.sendObjectSource({ruta: '/home'});
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