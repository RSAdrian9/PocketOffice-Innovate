import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, Platform } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { DbService } from 'src/app/services/db.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { addIcons } from 'ionicons';
import { callOutline, mailOutline, globeOutline } from 'ionicons/icons';
import { IonItem, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonImg, IonList, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-vista-cliente',
  templateUrl: './vista-cliente.page.html',
  styleUrls: ['./vista-cliente.page.scss'],
  standalone: true,
  providers: [DatePipe],
  imports: [IonicModule, CommonModule, FormsModule, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonImg, IonList, IonIcon, IonItem ]
})
export class VistaClientePage implements OnInit {

  public codigoCliente!: string;
  public cliente!: any;
  private activatedRoute = inject(ActivatedRoute);
  public fechaTipo: any = '';

  constructor(
    private platform: Platform,
    private navC: NavController,
    private transferirService: TransferirDatosService,
    private dbService: DbService,
    private datepipe: DatePipe,    
    private utils: UtilitiesService
  ) { 
    addIcons({ callOutline, mailOutline, globeOutline });
  }

  ngOnInit() {
    this.codigoCliente = this.activatedRoute.snapshot.paramMap.get('codigo') as string;
    this.pageController('/vista-cliente');    
    this.cargarDatosCliente();
  }

  private cargarDatosCliente() {
    this.dbService.getCliente(this.codigoCliente).then((cliente) => {
      this.cliente = cliente;
      this.fechaTipo = this.datepipe.transform(this.cliente.fcr_crm, 'dd/MM/yyyy');
    });
  }

  pageController(route: string) {
    this.transferirService.sendObjectSource({ ruta: route });
    this.transferirService.sendObjectSource({ codigo: this.codigoCliente })
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navC.navigateBack('/clientes');
      this.transferirService.sendObjectSource({ ruta: '/clientes' });
    });
  }

  valid(e: String) {
    return this.utils.valid(e)
  }

  callNumber(number: string) {
    window.open(`tel:${number}`, '_system');
  }

  mailto(email: string) {
    window.open(`mailto:${email}`, '_system');
  }

  web(web: string) {
    window.open(`http://${web}`, '_system');
  }

}