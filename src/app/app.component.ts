import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonItemDivider, IonButton, Platform } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { businessSharp, peopleSharp, cardSharp, compassOutline, clipboardOutline } from 'ionicons/icons';
import { TransferirDatosService } from './services/transferir-datos.service';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { Router } from '@angular/router';
import { DbService } from './services/db.service';


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

  constructor(private transferirService: TransferirDatosService, private platform: Platform, private router: Router, private dbService: DbService) {
    addIcons({ businessSharp, peopleSharp, cardSharp, compassOutline, clipboardOutline });
    this.platform.ready().then(() => {
      this.router.navigateByUrl('/home');
    });
    this.initializeApp();
  }

  initializeApp() {
    if (this.platform.is("android") || this.platform.is("ios")) {
      let androidPermissions: AndroidPermissions = new AndroidPermissions();


      androidPermissions.requestPermissions(
        [
          androidPermissions.PERMISSION.INTERNET,
          androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
          androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
        ]
      ).then((result) => {
        
        this.dbService.initializePlugin();

      })
    }

  }

  ngOnInit(): void {
    this.pageController('/home');
  }

  closeMenu() {
    this.active = false;
  }

  exit() {
    this.active = false;
  }

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

  pageController(route: string) {
    this.transferirService.sendObjectSource({ ruta: route });
  }

  opcionesMenuPrincipal() {
    this.opcionesMenu = [
      { title: 'Inicio', url: '/home', icon: 'business-sharp' },
      { title: 'Clientes', url: '/clientes', icon: 'people-sharp' },
      { title: 'Proveedores', url: '/proveedores', icon: 'assets/icons/proveedor-hotelero.svg' }
    ]
  }


  opcionesMenuCliente() {
    let codigo = '';
    this.transferirService.$getObjectSource.subscribe(res => {
      //console.log(res);
      codigo = res.codigo;
      this.opcionesClientes = [
        { title: 'Contactos', url: '/contactos/cliente/' + codigo, icon: 'assets/icons/cuaderno.svg' },
        { title: 'Datos Bancarios', url: '/bancos/cliente/' + codigo, icon: 'card-sharp' },
        { title: 'Direcciones', url: '/direcciones/cliente/' + codigo, icon: 'compass-outline' },
        { title: 'Historial', url: '/historial/cliente/' + codigo, icon: 'clipboard-outline' },
        { title: 'Listado Facturas', url: '/listado-facturas/cliente/' + codigo, icon: 'assets/icons/bill.svg' },
        { title: 'Listado Albaranes', url: '/listado-albaranes/cliente/' + codigo, icon: 'assets/icons/delivery-note.svg' },
        { title: 'Listado Presupuestos', url: '/listado-presupuestos/cliente/' + codigo, icon: 'assets/icons/finanzas.svg' },
        { title: 'Listado Pedidos', url: '/listado-pedidos/cliente/' + codigo, icon: 'assets/icons/caja.svg' },
        { title: 'Efectos', url: '/efectos/cliente/' + codigo, icon: 'assets/icons/flujo-de-efectivo.svg' },
        { title: 'Mayor de Cuentas', url: '/mayor/cliente/' + codigo, icon: 'assets/icons/mayor.svg' },
        { title: 'Situación de Riesgo', url: '/situaciones-riesgo/' + codigo, icon: 'assets/icons/caution-sign.svg' },
        { title: 'Rentabilidad', url: '/rentabilidad/' + codigo, icon: 'assets/icons/money-bag.svg' },
        { title: 'Resumen Mensual de Ventas', url: '/resumen-mensual-ventas/cliente/' + codigo, icon: 'assets/icons/sales.svg' }
      ];
    });


  }

  opcionesMenuProveedor() {
    this.opcionesProveedores = [
      { title: 'Contactos', url: '/contactos/:tipo/:codigo', icon: 'assets/icons/cuaderno.svg' },
      { title: 'Datos Bancarios', url: '/bancos/:tipo/:codigo', icon: 'card-sharp' },
      { title: 'Direcciones', url: '/direcciones/:tipo/:codigo', icon: 'compass-outline' },
      { title: 'Historial', url: '/historial/:tipo/:codigo', icon: 'clipboard-outline' },
      { title: 'Listado Facturas', url: '/listado-facturas/:tipo/:codigo', icon: 'assets/icons/bill.svg' },
      { title: 'Listado Albaranes', url: '/listado-albaranes/:tipo/:codigo', icon: 'assets/icons/delivery-note.svg' },
      { title: 'Listado Presupuestos', url: '/listado-presupuestos/:tipo/:codigo', icon: 'assets/icons/finanzas.svg' },
      { title: 'Listado Pedidos', url: '/listado-pedidos/:tipo/:codigo', icon: 'assets/icons/caja.svg' },
      { title: 'Efectos', url: '/efectos/:tipo/:codigo', icon: 'assets/icons/flujo-de-efectivo.svg' },
      { title: 'Mayor de Cuentas', url: '/mayor/:tipo/:codigo', icon: 'assets/icons/mayor.svg' },
      { title: 'Resumen Mensual de Ventas', url: '/resumen-mensual-ventas/:tipo/:codigo', icon: 'assets/icons/sales.svg' }
    ];
  }
}