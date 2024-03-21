import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-lista-presupuestos',
  templateUrl: './lista-presupuestos.page.html',
  styleUrls: ['./lista-presupuestos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ListaPresupuestosPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
