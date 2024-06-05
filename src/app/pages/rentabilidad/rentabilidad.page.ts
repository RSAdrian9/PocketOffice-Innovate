import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, Platform } from '@ionic/angular';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { ActivatedRoute } from '@angular/router';
import { rentabilidad } from 'src/app/models/rentabilidad.model';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-rentabilidad',
  templateUrl: './rentabilidad.page.html',
  styleUrls: ['./rentabilidad.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class RentabilidadPage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  codigo: string = ''
  nombre: string = '';
  public rentabilidad: rentabilidad = {};

 /**
 * Constructor de la clase PedidosPage.
 *
 * @param {Platform} platform - El servicio de la plataforma.
 * @param {TransferirDatosService} transferirService - El servicio de transferencia de datos.
 * @param {NavController} navC - El controlador de navegación.
 * @param {DbService} dbService - El servicio de base de datos.
 */
  constructor(    
    private platform: Platform,
    private transferirService: TransferirDatosService,
    private navC: NavController,
    private dbService: DbService
  ) { }

  /**
  * Inicializa el componente y recupera el parámetro 'codigo' de la instantánea de la ruta activada.
  * Llama al método 'pageController'.
  *
  * @return {void} Esta función no devuelve nada.
  */
  ngOnInit() {
    this.codigo = this.activatedRoute.snapshot.paramMap.get('codigo') as string;
    console.log(this.activatedRoute.snapshot.params);

    this.pageController();
  }

  /**
  * Se ejecuta cuando la vista ha completado la entrada y ahora es la vista activa.
  * Recupera el parámetro 'codigo' de la instantánea de la ruta activada y lo asigna a la propiedad 'codigo'.
  * Llama al método 'pageController'.
  *
  * @return {void} Esta función no devuelve nada.
  */
  ionViewDidEnter() {
    this.codigo = this.activatedRoute.snapshot.paramMap.get('codigo') as string;
    this.pageController();
  }

 /**
 * Carga de manera asíncrona los datos de rentabilidad para un código dado y actualiza las propiedades correspondientes.
 *
 * @return {Promise<void>} Una promesa que se resuelve una vez que los datos de rentabilidad se han cargado y las propiedades se hayan actualizado.
 */
  async cargarRentabilidad() {
    this.dbService.getRentabilidad(this.codigo).then((rentabilidad) => {
      this.rentabilidad = rentabilidad;

    });
    this.dbService.getNombreCliente(this.codigo).then((nombre) => {
      this.nombre = nombre;
    });
  }


 /**
 * Navega hacia atrás a la vista adecuada según el valor de 'this.tipo' y envía el objeto fuente al servicio 'this.transferirService'.
 * Si 'this.tipo' es 'cliente', navega hacia atrás a '/vista-cliente/{this.codigo}'.
 *
 * @return {void} Esta función no devuelve nada.
 */
  goBack() {
    this.navC.navigateBack('/vista-cliente/' + this.codigo);
    this.transferirService.sendObjectSource({ ruta: '/vista-cliente' });
  }


   /**
   * Ejecuta la lógica del controlador de página.
   *
   * Esta función carga los datos de rentabilidad y envía el objeto `codigo` al servicio `transferirService`
   * utilizando el método `sendObjectSource`. También establece un controlador de eventos de botón Atrás con una prioridad de 10
   * y llama al método `goBack` cuando se desencadena el evento.
   */
  pageController() {
    this.cargarRentabilidad();

    this.transferirService.sendObjectSource({ codigo: this.codigo })
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.goBack();
    });
  }

 /**
 * Formatea un número limitando sus decimales a 2, reemplazando el punto decimal con una coma y agregando separadores de miles.
 *
 * @param {any} numero - El número a formatear.
 * @return {string} El número formateado como una cadena.
 */
  formatearNumero(numero: any) {
    let numeroFormateado = parseFloat(numero).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    return numeroFormateado;
  }

}
