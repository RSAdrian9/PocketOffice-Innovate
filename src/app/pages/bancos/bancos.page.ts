import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, Platform } from '@ionic/angular';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { ActivatedRoute } from '@angular/router';
import { DbService } from 'src/app/services/db.service';
import { banco } from 'src/app/models/banco.model';
import { addIcons } from 'ionicons';
import { checkmarkOutline } from 'ionicons/icons';

@Component({
  selector: 'app-bancos',
  templateUrl: './bancos.page.html',
  styleUrls: ['./bancos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule/*, IonList, IonItem, IonCard, IonCardHeader, IonCardSubtitle, IonCardContent*/]
})
export class BancosPage implements OnInit {

  private activatedRoute = inject(ActivatedRoute);
  codigo: string = ''
  tipo: string = ''
  bancos: banco[] = [];
  nombre: string = '';

    /**
   * Crea una nueva instancia de la clase.
   *
   * @param {Platform} platform - El servicio de la plataforma.
   * @param {TransferirDatosService} transferirService - El servicio de transferencia de datos.
   * @param {NavController} navC - El controlador de navegación.
   * @param {DbService} dbService - El servicio de la base de datos.
   */
  constructor(
    private platform: Platform,
    private transferirService: TransferirDatosService,
    private navC: NavController,
    private dbService: DbService
  ) {
    addIcons({ checkmarkOutline });
  }

    /**
   * Inicializa el componente y recupera los parámetros 'tipo' y 'codigo' desde la ruta activada.
   * Llama al método pageController.
   *
   * @return {void} Esta función no devuelve nada.
   */
  ngOnInit() {
    this.tipo = this.activatedRoute.snapshot.paramMap.get('tipo') as string;
    this.codigo = this.activatedRoute.snapshot.paramMap.get('codigo') as string;

    this.pageController();

  }

    /**
   * Se ejecuta cuando la vista ha entrado completamente y ahora es la vista activa.
   * Establece las propiedades 'tipo' y 'codigo' a partir de los parámetros de la ruta activada.
   * Llama al método 'pageController'.
   */
  ionViewDidEnter() {
    this.tipo = this.activatedRoute.snapshot.paramMap.get('tipo') as string;
    this.codigo = this.activatedRoute.snapshot.paramMap.get('codigo') as string;

    this.pageController();
  }

    /**
   * Carga de forma asíncrona los bancos basados en el tipo y el código.
   *
   * @return {Promise<void>} Una promesa que se resuelve cuando se cargan los bancos.
   */
  async cargarBancos() {
    switch (this.tipo) {
      case 'cliente':
        this.dbService.getBancos('CL', this.codigo).then((bancos) => {
          console.log(bancos);
          this.bancos = bancos;
        }).catch((err) => {
          console.log(err);
        });
        this.dbService.getNombreCliente(this.codigo).then((nombre) => {
          this.nombre = nombre;
        });
        break;
      case 'proveedor':
        this.dbService.getBancos('PR', this.codigo).then((bancos) => {
          console.log(bancos);
          this.bancos = bancos;
        }).catch((err) => {
          console.log(err);
        });
        this.dbService.getNombreCliente(this.codigo).then((nombre) => {
          this.nombre = nombre;
        });
        break;
    }
  }

    /**
   * Inicializa el controlador de página cargando los bancos según el tipo y código,
   * enviando el código al servicio de transferencia y suscribiéndose al evento del botón de retroceso.
   *
   * @return {void} Esta función no devuelve ningún valor.
   */
  pageController() {
    this.cargarBancos();
    this.transferirService.sendObjectSource({ codigo: this.codigo })
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.goBack();
    });
  }

    /**
   * Navega hacia atrás a la vista adecuada según el tipo y el código, y envía el código al servicio de transferencia.
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

}