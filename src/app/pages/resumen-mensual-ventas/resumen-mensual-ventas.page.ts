import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-resumen-mensual-ventas',
  templateUrl: './resumen-mensual-ventas.page.html',
  styleUrls: ['./resumen-mensual-ventas.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ResumenMensualVentasPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
