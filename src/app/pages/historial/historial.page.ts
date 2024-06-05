import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, Platform } from '@ionic/angular';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { ActivatedRoute } from '@angular/router';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HistorialPage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  codigo: string = ''
  tipo: string = ''
  historia: string = '';
  nombre: string = '';

    /**
 * Constructor de la clase HistorialPage.
 *
 * @param {Platform} platform - El servicio de la plataforma.
 * @param {DbService} dbService - El servicio de base de datos.
 * @param {TransferirDatosService} transferirService - El servicio de transferencia de datos.
 * @param {NavController} navC - El controlador de navegación.
 */
  constructor(
    private platform: Platform,
    private transferirService: TransferirDatosService,
    private navC: NavController,
    private dbService: DbService
  ) { }

/**
* Inicializa el componente y establece las propiedades 'tipo' y 'codigo' basadas en los parámetros de la ruta activada.
* Luego llama al método 'pageController'.
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
   * Establece las propiedades 'tipo' y 'codigo' basadas en los parámetros de la ruta activada.
   * Llama al método 'pageController'.
   *
   * @return {void} Esta función no devuelve nada.
   */
  ionViewDidEnter() {
    this.tipo = this.activatedRoute.snapshot.paramMap.get('tipo') as string;
    this.codigo = this.activatedRoute.snapshot.paramMap.get('codigo') as string;
    this.pageController();
  }

    /**
   * Asincrónicamente carga el historial basado en el valor de `this.tipo` y `this.codigo`.
   * Si `this.tipo` es 'cliente', recupera el historial de la base de datos utilizando el prefijo 'CL' y `this.codigo`.
   * Si es exitoso, registra el historial en la consola y lo asigna a `this.historia`.
   * También recupera el nombre del cliente de la base de datos y lo asigna a `this.nombre`.
   * Si `this.tipo` es 'proveedor', recupera el historial utilizando el prefijo 'PR' y `this.codigo`.
   * Si es exitoso, registra el historial en la consola y lo asigna a `this.historia`.
   * También recupera el nombre del cliente de la base de datos y lo asigna a `this.nombre`.
   *
   * @return {Promise<void>} Una promesa que se resuelve cuando se carga y se asigna el historial.
   */
  async cargarHistorial() {
    switch (this.tipo) {
      case 'cliente':
        this.dbService.getHistoria('CL', this.codigo).then((historia) => {
          console.log('Historial:', historia); // Agregar esta línea para imprimir el resultado en la consola
          this.historia = historia;
        }).catch((err) => {
          console.log(err);
        });
        this.dbService.getNombreCliente(this.codigo).then((nombre) => {
          this.nombre = nombre;
        });
        break;
      case 'proveedor':
        this.dbService.getHistoria('PR', this.codigo).then((historia) => {
          console.log('Historial:', historia); // Agregar esta línea para imprimir el resultado en la consola
          this.historia = historia;
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
  * Navega hacia atrás a la página anterior según el valor de `this.tipo`.
  * Si `this.tipo` es 'cliente', navega hacia atrás a '/vista-cliente/{this.codigo}'.
  * Si `this.tipo` es 'proveedor', navega hacia atrás a '/vista-proveedor/{this.codigo}'.
  * También envía un objeto que contiene la ruta a `this.transferirService`.
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
 * Inicializa la página cargando los datos históricos y configurando el controlador del botón de retroceso.
 *
 * Esta función llama al método `cargarHistorial()` para cargar los datos históricos.
 * Luego envía un objeto que contiene la propiedad `codigo` a `this.transferirService.sendObjectSource()`
 * para notificar al servicio sobre el código.
 * Finalmente, configura un controlador de evento para el botón de retroceso utilizando `this.platform.backButton.subscribeWithPriority()`
 * con una prioridad de 10. Cuando se presiona el botón de retroceso, llama al método `goBack()`.
 *
 * @return {void} Esta función no devuelve nada.
 */
  pageController() {
    this.cargarHistorial();

    this.transferirService.sendObjectSource({ codigo: this.codigo })
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.goBack();
    });
  }

}
