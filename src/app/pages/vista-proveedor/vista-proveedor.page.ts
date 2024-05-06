import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  selector: 'app-vista-proveedor',
  templateUrl: './vista-proveedor.page.html',
  styleUrls: ['./vista-proveedor.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonImg, IonList, IonIcon, IonItem]
})
export class VistaProveedorPage implements OnInit {
  public codigoProveedor!: string;
  public proveedor!: any;
  private activatedRoute = inject(ActivatedRoute);

  constructor(
    private platform: Platform,
    private navC: NavController,
    private transferirService: TransferirDatosService,
    private dbService: DbService,
    private utils: UtilitiesService
  ) {
    addIcons({ callOutline, mailOutline, globeOutline });

  }

  ngOnInit() {
    this.codigoProveedor = this.activatedRoute.snapshot.paramMap.get('codigo') as string;
    this.cargarDatosProveedor();
    this.pageController('/vista-proveedor');
  }

  ionViewDidEnter() {
    this.codigoProveedor = this.activatedRoute.snapshot.paramMap.get('codigo') as string;
    this.pageController('/vista-proveedor');
  }

  private cargarDatosProveedor() {
    this.dbService.getProveedor(this.codigoProveedor).then((proveedor) => {
      this.proveedor = proveedor;
    });
  }

  pageController(route: string) {
    this.transferirService.sendObjectSource({ ruta: route });
    this.transferirService.sendObjectSource({ codigo: this.codigoProveedor });

    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navC.navigateBack('/proveedores');
      this.transferirService.sendObjectSource({ ruta: '/proveedores' });
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
