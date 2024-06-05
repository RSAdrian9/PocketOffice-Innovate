import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, Platform } from '@ionic/angular';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { ActivatedRoute } from '@angular/router';
import { DbService } from 'src/app/services/db.service';
import { resumen } from 'src/app/models/resumen.model';
import { IonToggle } from '@ionic/angular/standalone';

@Component({
  selector: 'app-resumen-mensual-ventas',
  templateUrl: './resumen-mensual-ventas.page.html',
  styleUrls: ['./resumen-mensual-ventas.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, IonToggle]
})
export class ResumenMensualVentasPage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  codigo: string = ''
  tipo: string = ''
  nombre: string = '';
  public resumen: resumen = {};
  public iva: string = '1'
  ocultar_trim1: boolean = false;
  ocultar_trim2: boolean = false;
  ocultar_trim3: boolean = false;
  ocultar_trim4: boolean = false;


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
 * Inicializa el componente y establece las propiedades 'tipo' y 'codigo' basadas en los parámetros de la ruta activada.
 * Luego llama al método 'pageController'.
 *
 * @return {void} Esta función no devuelve nada.
 */
  ngOnInit() {
    this.tipo = this.activatedRoute.snapshot.paramMap.get('tipo') as string;
    this.codigo = this.activatedRoute.snapshot.paramMap.get('codigo') as string;
    console.log(this.activatedRoute.snapshot.params);

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
    console.log(this.activatedRoute.snapshot.params);

    this.pageController();
  }

 /**
 * Alterna la visibilidad del botón del primer trimestre.
 *
 * Esta función actualiza el valor de la propiedad `ocultar_trim1` negando su valor actual.
 *
 * @return {void} Esta función no devuelve ningún valor.
 */
  control_boton_trim1(){
    this.ocultar_trim1 = !this.ocultar_trim1;
  }

 /**
 * Alterna la visibilidad del botón del segundo trimestre.
 *
 * Esta función actualiza el valor de la propiedad `ocultar_trim2` negando su valor actual.
 *
 * @return {void} Esta función no devuelve ningún valor.
 */
  control_boton_trim2(){
    this.ocultar_trim2 = !this.ocultar_trim2;
  }

 /**
 * Alterna la visibilidad del botón del tercer trimestre.
 *
 * Esta función actualiza el valor de la propiedad `ocultar_trim3` negando su valor actual.
 *
 * @return {void} Esta función no devuelve ningún valor.
 */
  control_boton_trim3(){
    this.ocultar_trim3 = !this.ocultar_trim3;
  }

 /**
 * Alterna la visibilidad del botón del cuarto trimestre.
 *
 * Esta función actualiza el valor de la propiedad `ocultar_trim4` negando su valor actual.
 *
 * @return {void} Esta función no devuelve ningún valor.
 */
  control_boton_trim4(){
    this.ocultar_trim4 = !this.ocultar_trim4;
  }

 /**
 * Actualiza el valor de la propiedad 'iva' basado en el valor seleccionado del evento.
 *
 * @param {any} event - El objeto de evento que contiene el valor seleccionado.
 * @return {void} Esta función no devuelve nada.
 */
  controlSelectIVA(event: any) {
    this.iva = event.detail.value;
  }
  

 /**
 * Asincrónicamente carga el resumen mensual basado en el valor de la propiedad 'tipo'.
 * @return {Promise} Una promesa que se resuelve cuando se carga el resumen mensual. 
 */
  async cargarResumenMensual() {
    switch (this.tipo) {
      case 'cliente':
        this.dbService.getResumenMensual('CL', this.codigo).then((resumen) => {
          this.resumen = resumen;

        });
        this.dbService.getNombreCliente(this.codigo).then((nombre) => {
          this.nombre = nombre;
        });
        break;
      case 'proveedor':
        this.dbService.getResumenMensual('PR', this.codigo).then((resumen) => {
          this.resumen = resumen;

        });
        this.dbService.getNombreCliente(this.codigo).then((nombre) => {
          this.nombre = nombre;
        });
        break;
    }

  }

 /**
 * Navega hacia atrás a la página '/vista-cliente/{this.codigo}' y envía un objeto con la propiedad 'ruta' establecida en '/vista-cliente' al servicio 'transferirService'.
 *
 * @return {void} Esta función no devuelve nada.
 */
  goBack() {
    this.navC.navigateBack('/vista-cliente/' + this.codigo);
    this.transferirService.sendObjectSource({ ruta: '/vista-cliente' });
  }


 /**
 * Inicializa la página cargando el resumen mensual de ventas y enviando el código al servicio de transferencia.
 * También se suscribe al evento del botón de retroceso y llama a la función goBack.
 *
 * @return {void}
 */
  pageController() {
    this.cargarResumenMensual();

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
