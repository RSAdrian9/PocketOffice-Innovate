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

 /**
 * Constructor para la clase VistaClientePage.
 *
 * @param {Platform} platform - El servicio de la plataforma.
 * @param {NavController} navC - El controlador de navegación.
 * @param {TransferirDatosService} transferirService - El servicio de transferencia de datos.
 * @param {DbService} dbService - El servicio de base de datos.
 * @param {DatePipe} datepipe - El servicio de formateo de fechas.
 * @param {UtilitiesService} utils - El servicio de utilidades.
 */
  constructor(
    private platform: Platform,
    private navC: NavController,
    private transferirService: TransferirDatosService,
    private dbService: DbService,
    private utils: UtilitiesService
  ) {
    addIcons({ callOutline, mailOutline, globeOutline });

  }

  /**
  * Inicializa el componente y carga los datos del proveedor.
  *
  * Esta función se llama cuando se inicializa el componente. Obtiene el parámetro 'codigo' del snapshot de la ruta activada y lo asigna a la propiedad 'codigoProveedor'. Luego, llama a la función 'cargarDatosProveedor' para cargar los datos del proveedor. Por último, llama a la función 'pageController' con la ruta '/vista-proveedor'.
  *
  * @return {void} Esta función no devuelve ningún valor.
  */
  ngOnInit() {
    this.codigoProveedor = this.activatedRoute.snapshot.paramMap.get('codigo') as string;
    this.cargarDatosProveedor();
    this.pageController('/vista-proveedor');
  }

 /**
 * Se ejecuta cuando la vista ha terminado de entrar y ahora es la vista activa.
 * Obtiene el parámetro 'codigo' del snapshot de la ruta activada y lo asigna a la propiedad 'codigoProveedor'.
 * Llama a la función 'pageController' con la ruta '/vista-proveedor'.
 */
  ionViewDidEnter() {
    this.codigoProveedor = this.activatedRoute.snapshot.paramMap.get('codigo') as string;
    this.pageController('/vista-proveedor');
  }

 /**
 * Carga los datos del proveedor desde la base de datos y los asigna a la propiedad 'proveedor'.
 *
 * @return {Promise<void>} Una promesa que se resuelve cuando se han cargado los datos del proveedor.
 */
  private cargarDatosProveedor() {
    this.dbService.getProveedor(this.codigoProveedor).then((proveedor) => {
      this.proveedor = proveedor;
    });
  }

 /**
 * Ejecuta la lógica del controlador de página para la ruta dada.
 *
 * @param {string} route - La ruta para la cual se ejecuta la lógica del controlador de página.
 * @return {void} Esta función no devuelve nada.
 */
  pageController(route: string) {
    this.transferirService.sendObjectSource({ ruta: route });
    this.transferirService.sendObjectSource({ codigo: this.codigoProveedor });

    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navC.navigateBack('/proveedores');
      this.transferirService.sendObjectSource({ ruta: '/proveedores' });
    });
  }

 /**
 * Valida la cadena de entrada utilizando el método utils.valid().
 *
 * @param {String} e - La cadena de entrada a validar.
 * @return {any} El resultado del método utils.valid().
 */
  valid(e: String) {
    return this.utils.valid(e)
  }

 /**
 * Abre la aplicación de marcado telefónico predeterminada con el número de teléfono dado.
 *
 * @param {string} number - El número de teléfono a marcar.
 * @return {void} Esta función no devuelve nada.
 */
  callNumber(number: string) {
    window.open(`tel:${number}`, '_system');
  }

 /**
 * Abre la aplicación de correo electrónico predeterminada con la dirección de correo electrónico especificada.
 *
 * @param {string} email - La dirección de correo electrónico a la que se enviará el correo electrónico.
 * @return {void} Esta función no devuelve nada.
 */
  mailto(email: string) {
    window.open(`mailto:${email}`, '_system');
  }

 /**
 * Abre el sitio web especificado en el navegador predeterminado.
 *
 * @param {string} web - La URL del sitio web a abrir.
 * @return {void} Esta función no devuelve nada.
 */
  web(web: string) {
    window.open(`http://${web}`, '_system');
  }

}
