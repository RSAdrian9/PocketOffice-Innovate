import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, Platform } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { efectos } from 'src/app/models/efectos.model';
import { DbService } from 'src/app/services/db.service';


@Component({
  selector: 'app-vista-efecto',
  templateUrl: './vista-efecto.page.html',
  styleUrls: ['./vista-efecto.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class VistaEfectoPage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  codigo: string = ''
  tipo: string = ''
  numero: string = ''
  efecto: efectos = {}

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
 * InInicializa el componente y recupera los parámetros 'tipo', 'codigo' y 'numero' del snapshot de la ruta activada.
 * Llama al método 'pageController'.
 */
  ngOnInit() {
    this.tipo = this.activatedRoute.snapshot.paramMap.get('tipo') as string;
    this.codigo = this.activatedRoute.snapshot.paramMap.get('codigo') as string;
    this.numero = this.activatedRoute.snapshot.paramMap.get('numero') as string;

    this.pageController();
  }

 /**
 * Se ejecuta cuando la vista ha completado la entrada y ahora es la vista activa.
 * Establece las propiedades 'tipo', 'codigo' y 'numero' basadas en los parámetros de la ruta activada en el snapshot.
 * Llama al método 'pageController'.
 */
  ionViewDidEnter() {
    this.tipo = this.activatedRoute.snapshot.paramMap.get('tipo') as string;
    this.codigo = this.activatedRoute.snapshot.paramMap.get('codigo') as string;
    this.numero = this.activatedRoute.snapshot.paramMap.get('numero') as string;

    this.pageController();
  }

 /**
 * Inicializa la página y carga el efecto.
 * Envía el objeto fuente al servicio de transferencia.
 * Se suscribe al evento del botón de retroceso con prioridad 10 y llama al método goBack.
 */
  pageController() {
    this.cargarEfecto();

    this.transferirService.sendObjectSource({ codigo: this.codigo })
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.goBack();
    });
  }

 /**
 * Navega hacia atrás a la página anterior y envía el objeto fuente al servicio de transferencia.
 *
 * @return {void} Esta función no devuelve nada.
 */
  goBack() {
    this.navC.navigateBack('/efectos/' + this.tipo + '/' + this.codigo);
    this.transferirService.sendObjectSource({ ruta: '/efectos' });

  }

 /**
 * Carga el efecto en función del valor de 'this.tipo'.
 *
 * @return {Promise<void>} Una promesa que se resuelve cuando el efecto ha sido cargado.
 */
  cargarEfecto() {
    switch (this.tipo) {
      case 'cliente':
        this.dbService.getDatosEfecto('C', this.codigo, this.numero).then((efecto) => {
          this.efecto = efecto;
        });
        break;

      case 'proveedor':
        this.dbService.getDatosEfecto('P', this.codigo, this.numero).then((efecto) => {
          this.efecto = efecto;
        });
        break;
    }
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
