import { Component, ViewChild, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { NavParams } from '@ionic/angular/standalone';
import { NgApexchartsModule, ChartComponent } from 'ng-apexcharts';

@Component({
  selector: 'app-modal-grafica',
  templateUrl: './modal-grafica.component.html',
  styleUrls: ['./modal-grafica.component.scss'],
  standalone: true,
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgApexchartsModule
  ]
})
export class ModalGraficaComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent | undefined;
  public chartOptions: any;

  constructor(
    private navParams: NavParams
  ) {
    
  }

  ngOnInit() {
    this.controlGrafica();
  }

  ionViewDidEnter() {
    this.controlGrafica();
  }

  controlGrafica(){
    let id = this.navParams.data['id'];
    let titulo = this.navParams.data['titulo'];
    let tipoGrafica = this.navParams.data['tipoGrafica'];

    switch (tipoGrafica) {
      case 'barras':
        this.cargarGraficaBarras(id, titulo);
        break;
      case 'sectores':
        this.cargarGraficaSectores(id, titulo);
        break;

      default:
        break;
    }
  }

  /*El id se utilizara para saber que consulta se tiene que ejecutar para cargar los datos correspondientes*/
  cargarGraficaBarras(id:number, titulo:string) {
    this.chartOptions = {
      series: [
        {
          name: "My-series",
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
        }
      ],
      chart: {
        height: 350,
        type: "bar"
      },
      title: {
        text: titulo
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"]
      }
    };
  }
  
  /*El id se utilizara para saber que consulta se tiene que ejecutar para cargar los datos correspondientes*/
  cargarGraficaSectores(id:number, titulo:string) {
    this.chartOptions = {
      series: [44, 55, 13, 43, 22],
      chart: {
        width: 380,
        type: "pie"
      },
      labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
      title: {
        text: titulo
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    }

  }

}
