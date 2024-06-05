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
  imports: [IonicModule, CommonModule, FormsModule, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonImg, IonList, IonIcon, IonItem]
})

export class VistaClientePage implements OnInit {

  public codigoCliente!: string;
  public cliente!: any;
  private activatedRoute = inject(ActivatedRoute);
  public fechaTipo: any = '';

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
    private datepipe: DatePipe,
    private utils: UtilitiesService
  ) {
    addIcons({ callOutline, mailOutline, globeOutline });

  }

  /**
  * Inicializa el componente y carga los datos del cliente.
  *
  * Esta función se llama cuando se inicializa el componente. Obtiene el parámetro 'codigo' del snapshot de la ruta activada y lo asigna a la propiedad 'codigoCliente'. Luego, llama a la función 'cargarDatosCliente' para cargar los datos del cliente. Por último, llama a la función 'pageController' con la ruta '/vista-cliente'.
  *
  * @return {void} Esta función no devuelve ningún valor.
  */
  ngOnInit() {
    this.codigoCliente = this.activatedRoute.snapshot.paramMap.get('codigo') as string;
    this.cargarDatosCliente();
    this.pageController('/vista-cliente');
  }

  /**
  * Se ejecuta cuando la vista ha terminado de entrar y ahora es la vista activa.
  * Obtiene el parámetro 'codigo' del snapshot de la ruta activada y lo asigna a la propiedad 'codigoCliente'.
  * Llama a la función 'pageController' con la ruta '/vista-cliente'.
  */
  ionViewDidEnter() {
    this.codigoCliente = this.activatedRoute.snapshot.paramMap.get('codigo') as string;
    this.pageController('/vista-cliente');
  }

 /**
 * Carga los datos del cliente desde la base de datos y los asigna a la propiedad 'cliente'.
 * También formatea el campo 'fcr_crm' de los datos del cliente utilizando el servicio 'datepipe' y los asigna a la propiedad 'fechaTipo'.
 *
 * @return {Promise<void>} Una promesa que se resuelve cuando se han cargado y formateado los datos del cliente.
 */
  private cargarDatosCliente() {
    this.dbService.getCliente(this.codigoCliente).then((cliente) => {
      this.cliente = cliente;
      this.fechaTipo = this.datepipe.transform(this.cliente.fcr_crm, 'dd/MM/yyyy');
    });
  }

 /**
 * Envía la ruta actual y el código del cliente al servicio de transferencia y configura un escuchador de botón de retroceso para navegar de vuelta a la página de clientes.
 *
 * @param {string} route - La ruta actual.
 * @return {void} Esta función no devuelve nada.
 */
  pageController(route: string) {
    this.transferirService.sendObjectSource({ ruta: route });
    this.transferirService.sendObjectSource({ codigo: this.codigoCliente });
    //*this.transferirService.sendObjectSource({ nombreclipro: this.cliente.nom });*/

    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navC.navigateBack('/clientes');
      this.transferirService.sendObjectSource({ ruta: '/clientes' });
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
