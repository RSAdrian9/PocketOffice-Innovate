import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, Platform } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { addIcons } from 'ionicons';
import { callOutline, mailOutline } from 'ionicons/icons';
import { direccion } from 'src/app/models/direccion.model';
import { DbService } from 'src/app/services/db.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-direcciones',
  templateUrl: './direcciones.page.html',
  styleUrls: ['./direcciones.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DireccionesPage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  codigo: string = ''
  tipo: string = ''
  direcciones: direccion[] = [];
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

  async cargarDirecciones() {
    switch (this.tipo) {
      case 'cliente':
        this.dbService.getDirecciones('CL', this.codigo).then((direcciones) => {
          this.direcciones = direcciones;
        }).catch((err) => {
          console.log(err);
        });
        this.dbService.getNombreCliente(this.codigo).then((nombre) => {
          this.nombre = nombre;
        });
        break;
      case 'proveedor':
        this.dbService.getDirecciones('PR', this.codigo).then((direcciones) => {
          this.direcciones = direcciones;
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
    this.cargarDirecciones();
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
