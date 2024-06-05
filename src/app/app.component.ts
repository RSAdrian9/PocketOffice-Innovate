import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonItemDivider, IonButton, Platform } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { businessSharp, peopleSharp, cardSharp, compassOutline, clipboardOutline } from 'ionicons/icons';
import { TransferirDatosService } from './services/transferir-datos.service';
import { Router } from '@angular/router';
import { DbService } from './services/db.service';
import { ToastService } from './services/toast.service';
import { FilesystemService } from './services/filesystem.service';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonItemDivider, IonButton],
})

export class AppComponent {
  mostrarOpcionesCliente: boolean = false;
  mostrarOpcionesProveedor: boolean = false;
  active: boolean = true;
  tienePermisos: boolean = false;

  public opcionesMenu = [
    { title: '', url: '', icon: '' }
  ];

  public opcionesClientes = [
    { title: '', url: '', icon: '' }
  ];

  public opcionesProveedores = [
    { title: '', url: '', icon: '' }
  ];

 /**
 * Construye una nueva instancia de la clase AppComponent.
 *
 * @param {TransferirDatosService} transferirService - El servicio para transferir datos.
 * @param {Platform} platform - El objeto de la plataforma.
 * @param {Router} router - El objeto del enrutador.
 * @param {ToastService} toastService - El servicio de toasts.
 * @param {DbService} dbService - El servicio de base de datos.
 * @param {FilesystemService} filesystem - El servicio de sistema de archivos.
 */
  constructor(
    private transferirService: TransferirDatosService,
    private platform: Platform,
    private router: Router,
    private toastService: ToastService,
    private dbService: DbService,
    private filesystem: FilesystemService
  ) {
    addIcons({ businessSharp, peopleSharp, cardSharp, compassOutline, clipboardOutline });

    this.initializeApp();

  }

 /**
 * Inicializa la aplicación mostrando la pantalla de carga, conectándose a la base de datos
 * y navegando a la página de inicio después de que la plataforma esté lista.
 *
 * @return {Promise<void>} Una promesa que se resuelve cuando se completa la inicialización.
 */
  private async initializeApp() {
    await SplashScreen.show({
      autoHide: false,
    });

    this.filesystem.crearDirectorioTmp();
    const functionResult = await this.dbService.connectDatabase();

    if(functionResult){

      await SplashScreen.hide();
      this.platform.ready().then(() => {
        this.router.navigateByUrl('/home');
      });
    }
  }

  
 /**
 * Inicializa el componente y llama al método pageController con la ruta '/home'.
 *
 * @return {void} Esta función no devuelve nada.
 */
  ngOnInit(): void {
    this.pageController('/home');
  }

 /**
 * Cierra el menú estableciendo la propiedad 'active' en false.
 *
 * @return {void} Esta función no devuelve ningún valor.
 */
  closeMenu() {
    this.active = false;
  }

 /**
 * Cierra el menú estableciendo la propiedad 'active' en false.
 *
 * @return {void} Esta función no devuelve ningún valor.
 */
  exit() {
    this.active = false;
  }

 /**
 * Establece la ruta enviándola al servicio de transferencia.
 *
 * @param {string} ruta - La ruta a establecer.
 * @return {void} Esta función no devuelve nada.
 */
  setRuta(ruta: string) {
    this.transferirService.sendObjectSource({ ruta: ruta });
  }

 /**
 * Abre el menú y establece la propiedad 'active' en true.
 * Suscribe a el observable 'getObjectSource' del servicio 'transferirService'
 * para determinar la acción apropiada basada en el valor recibido de 'ruta'.
 *
 * @return {void} Esta función no devuelve nada.
 */
  openMenu() {
    this.active = true;
    this.transferirService.$getObjectSource.subscribe(res => {

      switch (res.ruta) {
        case '/home':
          this.mostrarOpcionesCliente = false;
          this.mostrarOpcionesProveedor = false;
          this.opcionesMenuPrincipal();
          break;
        case '/clientes':
          this.mostrarOpcionesCliente = false;
          this.mostrarOpcionesProveedor = false;
          this.opcionesMenuPrincipal();
          break;
        case '/proveedores':
          this.mostrarOpcionesCliente = false;
          this.mostrarOpcionesProveedor = false;
          this.opcionesMenuPrincipal();
          break;
        case '/vista-cliente':
          this.mostrarOpcionesCliente = true;
          this.mostrarOpcionesProveedor = false;
          this.opcionesMenuCliente();
          break;
        case '/vista-proveedor':
          this.mostrarOpcionesCliente = false;
          this.mostrarOpcionesProveedor = true;
          this.opcionesMenuProveedor();
          break;
      }
    });
  }

 /**
 * Envía la ruta proporcionada al servicio de transferencia.
 *
 * @param {string} route - La ruta a enviar.
 */
  pageController(route: string) {
    this.transferirService.sendObjectSource({ ruta: route });
  }

 /**
 * Inicializa las opciones del menú principal.
 *
 * Esta función establece la propiedad `opcionesMenu` con un array de objetos, cada uno representando una opción del menú.
 * Cada objeto contiene las siguientes propiedades:
 * - `title`: una cadena que representa el título de la opción del menú.
 * - `url`: una cadena que representa la URL de la opción del menú.
 * - `icon`: una cadena que representa el ícono de la opción del menú.
 *
 * Las opciones del menú son:
 * - Inicio: la página de inicio.
 * - Clientes: la página de clientes.
 * - Proveedores: la página de proveedores.
 *
 * @return {void} Esta función no devuelve nada.
 */
  opcionesMenuPrincipal() {
    this.opcionesMenu = [
      { title: 'Inicio', url: '/home', icon: 'business-sharp' },
      { title: 'Clientes', url: '/clientes', icon: 'people-sharp' },
      { title: 'Proveedores', url: '/proveedores', icon: 'assets/imgs/proveedor-hotelero.svg' }
    ]
  }

/**
 * Inicializa el menú de opciones del cliente.
 *
 * Esta función establece la propiedad `opcionesClientes` con un array de objetos, cada uno representando una opción de menú del cliente.
 * Cada objeto contiene las siguientes propiedades:
 * - `title`: una cadena que representa el título del menú de opciones del cliente.
 * - `url`: una cadena que representa la URL del menú de opciones del cliente.
 * - `icon`: una cadena que representa el icono del menú de opciones del cliente.
 *
 * El menú de opciones del cliente incluye las siguientes opciones:
 * - Contactos: la página de contactos del cliente.
 * - Datos Bancarios: la página de datos bancarios del cliente.
 * - Direcciones: la página de direcciones del cliente.
 * - Historial: la página de historial del cliente.
 * - Listado Facturas: la página de listado de facturas del cliente.
 * - Listado Albaranes: la página de listado de notas de entrega del cliente.
 * - Listado Presupuestos: la página de listado de presupuestos del cliente.
 * - Listado Pedidos: la página de listado de pedidos del cliente.
 * - Efectos: la página de efectos del cliente.
 * - Mayor de Cuentas: la página de mayor de cuentas del cliente.
 * - Situación de Riesgo: la página de situación de riesgo del cliente.
 * - Rentabilidad: la página de rentabilidad del cliente.
 * - Resumen Mensual de Ventas: la página de resumen mensual de ventas del cliente.
 *
 * @return {void} Esta función no devuelve nada.
 */
  opcionesMenuCliente() {
    let codigo = '';
    this.transferirService.$getObjectSource.subscribe(res => {
      //console.log(res);
      codigo = res.codigo;
      this.opcionesClientes = [
        { title: 'Contactos', url: '/contactos/cliente/' + codigo, icon: 'assets/imgs/cuaderno.svg' },
        { title: 'Datos Bancarios', url: '/bancos/cliente/' + codigo, icon: 'card-sharp' },
        { title: 'Direcciones', url: '/direcciones/cliente/' + codigo, icon: 'compass-outline' },
        { title: 'Historial', url: '/historial/cliente/' + codigo, icon: 'clipboard-outline' },
        { title: 'Listado Facturas', url: '/facturas/cliente/' + codigo, icon: 'assets/imgs/bill.svg' },
        { title: 'Listado Albaranes', url: '/albaranes/cliente/' + codigo, icon: 'assets/imgs/delivery-note.svg' },
        { title: 'Listado Presupuestos', url: '/presupuestos/cliente/' + codigo, icon: 'assets/imgs/finanzas.svg' },
        { title: 'Listado Pedidos', url: '/pedidos/cliente/' + codigo, icon: 'assets/imgs/caja.svg' },
        { title: 'Efectos', url: '/efectos/cliente/' + codigo, icon: 'assets/imgs/flujo-de-efectivo.svg' },
        { title: 'Mayor de Cuentas', url: '/mayor/cliente/' + codigo, icon: 'assets/imgs/mayor.svg' },
        { title: 'Situación de Riesgo', url: '/situacion-riesgo/' + codigo, icon: 'assets/imgs/caution-sign.svg' },
        { title: 'Rentabilidad', url: '/rentabilidad/' + codigo, icon: 'assets/imgs/money-bag.svg' },
        { title: 'Resumen Mensual de Ventas', url: '/resumen-mensual-ventas/cliente/' + codigo, icon: 'assets/imgs/sales.svg' }
      ];
    });

  }

  
 /**
 * Inicializa el menú de opciones para el proveedor.
 *
 * Esta función establece la propiedad `opcionesProveedores` con un array de objetos, cada uno representando una opción en el menú.
 * Cada objeto tiene las siguientes propiedades:
 * - `title`: una cadena que representa el título de la opción del menú.
 * - `url`: una cadena que representa la URL de la opción del menú.
 * - `icon`: una cadena que representa el ícono de la opción del menú.
 *
 * Las opciones del menú son:
 * - Contactos: los detalles de contacto del proveedor.
 * - Datos Bancarios: los detalles bancarios del proveedor.
 * - Historial: los registros históricos del proveedor.
 * - Listado Facturas: la lista de facturas del proveedor.
 * - Listado Albaranes: la lista de notas de entrega del proveedor.
 * - Listado Pedidos: la lista de pedidos del proveedor.
 * - Efectos: los registros financieros del proveedor.
 * - Mayor de Cuentas: los registros contables del proveedor.
 * - Resumen Mensual de Ventas: el resumen mensual de ventas del proveedor.
 *
 * @return {void} Esta función no devuelve nada.
 */
  opcionesMenuProveedor() {
    let codigo = '';
    this.transferirService.$getObjectSource.subscribe(res => {
      codigo = res.codigo;
      this.opcionesProveedores = [
        { title: 'Contactos', url: '/contactos/proveedor/' + codigo, icon: 'assets/imgs/cuaderno.svg' },
        { title: 'Datos Bancarios', url: '/bancos/proveedor/' + codigo, icon: 'card-sharp' },
        { title: 'Historial', url: '/historial/proveedor/' + codigo, icon: 'clipboard-outline' },
        { title: 'Listado Facturas', url: '/facturas/proveedor/' + codigo, icon: 'assets/imgs/bill.svg' },
        { title: 'Listado Albaranes', url: '/albaranes/proveedor/' + codigo, icon: 'assets/imgs/delivery-note.svg' },
        { title: 'Listado Pedidos', url: '/pedidos/proveedor/' + codigo, icon: 'assets/imgs/caja.svg' },
        { title: 'Efectos', url: '/efectos/proveedor/' + codigo, icon: 'assets/imgs/flujo-de-efectivo.svg' },
        { title: 'Mayor de Cuentas', url: '/mayor/proveedor/' + codigo, icon: 'assets/imgs/mayor.svg' },
        { title: 'Resumen Mensual de Ventas', url: '/resumen-mensual-ventas/proveedor/' + codigo, icon: 'assets/imgs/sales.svg' }
      ];
    });
  }

}