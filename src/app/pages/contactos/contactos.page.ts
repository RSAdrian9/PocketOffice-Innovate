import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, Platform } from '@ionic/angular';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { IonList, IonItem, IonCard, IonCardHeader, IonCardSubtitle, IonCardContent } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { DbService } from 'src/app/services/db.service';
import { contacto } from 'src/app/models/contacto.model';
import { addIcons } from 'ionicons';
import { callOutline, mailOutline } from 'ionicons/icons';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-contactos',
  templateUrl: './contactos.page.html',
  styleUrls: ['./contactos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, IonList, IonItem, IonCard, IonCardHeader, IonCardSubtitle, IonCardContent]
})
export class ContactosPage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  codigo: string = ''
  tipo: string = ''
  contactos: contacto[] = [];
  nombre: string = '';

  constructor(
    private platform: Platform,
    private transferirService: TransferirDatosService,
    private navC: NavController,
    private dbService: DbService, 
    private utils: UtilitiesService
  ) {
    addIcons({ callOutline, mailOutline });
  }

  ngOnInit() {
    this.tipo = this.activatedRoute.snapshot.paramMap.get('tipo') as string;
    this.codigo = this.activatedRoute.snapshot.paramMap.get('codigo') as string;
    this.pageController();
  }

  onViewDidEnter() {
    this.tipo = this.activatedRoute.snapshot.paramMap.get('tipo') as string;
    this.codigo = this.activatedRoute.snapshot.paramMap.get('codigo') as string;
    this.pageController();
  }

  async cargarContactos() {
    switch (this.tipo) {
      case 'cliente':
        this.dbService.getContactos('CL', this.codigo).then((contactos) => {
          this.contactos = contactos;
        }).catch((err) => {
          console.log(err);
        });
        this.dbService.getNombreCliente(this.codigo).then((nombre) => {
          this.nombre = nombre;
        });
        break;
      case 'proveedor':
        this.dbService.getContactos('PR', this.codigo).then((contactos) => {
          this.contactos = contactos;
        }).catch((err) => {
          console.log(err);
        });
        this.dbService.getNombreProveedor(this.codigo).then((nombre) => {
          this.nombre = nombre;
        });
        break;
    }
  }

  pageController() {
    this.cargarContactos();
    this.transferirService.sendObjectSource({ codigo: this.codigo })
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.goBack();
    });
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

  valid(e?: String) {
    return this.utils.valid(e);
  }

  callNumber(number?: string) {
    window.open(`tel:${number}`, '_system');
  }

  mailto(email?: string) {
    window.open(`mailto:${email}`, '_system');
  }


}
