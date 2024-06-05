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

    /**
   * Constructor del componente de direcciones para mostrar las direcciones de un cliente o proveedor
   * @param platform
   * @param transferirService
   * @param navC
   * @param dbService
   * @param utils
   */
  constructor(
    private platform: Platform,
    private transferirService: TransferirDatosService,
    private navC: NavController,
    private dbService: DbService,
    private utils: UtilitiesService
  ) {
    addIcons({ callOutline, mailOutline });
  }

  /**
   * Carga la información de los contactos y el nombre del contacto
   * 
   * @return {void} Esta función no devuelve nada.
   */
  ngOnInit() {
    this.tipo = this.activatedRoute.snapshot.paramMap.get('tipo') as string;
    this.codigo = this.activatedRoute.snapshot.paramMap.get('codigo') as string;

    this.pageController();
  }

  /**
   * Carga la información de los contactos y el nombre del contacto
   * 
   * @return {void} Esta función no devuelve nada.
   */
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

  /**
   * Carga la información de los contactos y el nombre del contacto
   * 
   * @return {void} Esta función no devuelve nada.
   */
  pageController() {
    this.cargarDirecciones();
    this.transferirService.sendObjectSource({ codigo: this.codigo })
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.goBack();
    });
  }

  /**
   * Carga la información de los contactos y el nombre del contacto
   * 
   * @return {void} Esta función no devuelve nada.
   */
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

  /**
   * Carga la información de los contactos y el nombre del contacto
   * 
   * @return {void} Esta función no devuelve nada.
   */
  valid(e?: String) {
    return this.utils.valid(e);
  }

  /**
   * Llama al número de telefono
   * @param number 
   * @returns 
   */
  callNumber(number?: string) {
    window.open(`tel:${number}`, '_system');
  }

  /**
   * Llama al correo electronico
   * @param email 
   * @returns 
   */
  mailto(email?: string) {
    window.open(`mailto:${email}`, '_system');
  }

}
