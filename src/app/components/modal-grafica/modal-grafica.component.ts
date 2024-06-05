import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { NavParams } from '@ionic/angular/standalone';
import { NgApexchartsModule, ChartComponent } from 'ng-apexcharts';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-modal-grafica',
  templateUrl: './modal-grafica.component.html',
  styleUrls: ['./modal-grafica.component.scss'],
  standalone: true,
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NgApexchartsModule
  ]
})
export class ModalGraficaComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent | undefined;
  public chartOptions: any;
  public datosCargados: boolean = false;

 /**
 * Crea una nueva instancia de la clase.
 *
 * @param {NavParams} navParams - Los parámetros de navegación.
 */
  constructor(
    private navParams: NavParams,
    private dbservice: DbService
  ) { }

 /**
 * Inicializa el componente y llama al método `controlGrafica`.
 *
 * @return {void} No devuelve ningún valor.
 */
  ngOnInit() {
    this.controlGrafica();
  }

 /**
 * Ejecuta el método `controlGrafica` cuando la vista es accedida.
 *
 * @return {void} Esta función no devuelve ningún valor.
 */
  ionViewDidEnter() {
    this.controlGrafica();
  }


 /**
 * Controla la carga de una gráfica según el tipo de gráfica especificado en los parámetros de navegación.
 *
 * @return {Promise<void>} Una promesa que se resuelve cuando se carga la gráfica.
 */
 private async controlGrafica() {
  let id = this.navParams.data['id'];
  let titulo = this.navParams.data['titulo'];

  this.cargarGrafica(id, titulo);

}

 /**
 * Carga una gráfica basada en el tipo de gráfica especificado en los parámetros de navegación.
 *
 * @param {number} id - El ID del tipo de gráfica.
 * @param {string} titulo - El título de la gráfica.
 * @return {Promise<void>} Una promesa que se resuelve cuando se carga la gráfica.
 */
private async cargarGrafica(id: number, titulo: string) {

  switch (id) {
    case 1:
      this.dbservice.devuelveDatosGraficaVentas().then((datosVentas) => {
        this.cargarDatosGraficaBarras(titulo, datosVentas);
        this.datosCargados = true;
      });
      break;
    case 2:
      this.dbservice.devuelveDatosGraficaCompras().then((datosCompras) => {
        this.cargarDatosGraficaBarras(titulo, datosCompras);
        this.datosCargados = true;
      });
      break;
    case 3:

      break;
  }
}

 /**
 * Carga un gráfico de barras con el título y los datos proporcionados.
 *
 * @param {string} titulo - El título del gráfico.
 * @param {any[]} datos - Los datos del gráfico. Cada elemento del arreglo debe tener una propiedad "total".
 * @return {Promise<void>} Una promesa que se resuelve cuando se ha cargado el gráfico.
 */
 private async cargarDatosGraficaBarras(titulo: string, datos: any) {
  this.chartOptions = {
    series: [
      {
        name: "Importe",
        data: [
          this.formatearNumero(datos[0].total),
          this.formatearNumero(datos[1].total),
          this.formatearNumero(datos[2].total),
          this.formatearNumero(datos[3].total),
          this.formatearNumero(datos[4].total),
          this.formatearNumero(datos[5].total),
          this.formatearNumero(datos[6].total),
          this.formatearNumero(datos[7].total),
          this.formatearNumero(datos[8].total),
          this.formatearNumero(datos[9].total),
          this.formatearNumero(datos[10].total),
          this.formatearNumero(datos[11].total)
        ]
      }
    ],
    chart: {
      height: 350,
      type: "bar",
      toolbar:{
        show: false
      }
    },
    tooltip:{
      theme: 'dark'
    },
    title: {
      text: titulo
    },
    xaxis: {
      categories: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    }  
  };
}


 /**
 * Carga de forma asíncrona los datos de la gráfica de sectores con el título y los datos proporcionados.
 *
 * @param {string} titulo - El título de la gráfica.
 * @param {any} datos - Los datos para la gráfica.
 * @return {Promise<void>} Una promesa que se resuelve cuando se cargan los datos de la gráfica.
 */
  private async cargarDatosGraficaSectores(titulo: string, datos: any) {
    this.chartOptions = {
      series: [44, 55, 13, 43, 22],
      chart: {

      }
    }
  }

 /**
 * Formatea un número limitar sus decimales a 2, reemplazando el punto decimal por una coma y agregando separadores de miles.
 *
 * @param {any} numero - El número a formatear.
 * @return {string} El número formateado como una cadena de texto.
 */
  formatearNumero(numero: any) {
    let numeroFormateado = parseFloat(numero).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    return numeroFormateado;
  }

}
