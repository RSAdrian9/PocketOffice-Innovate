import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-datos-pedidos',
  templateUrl: './datos-pedidos.page.html',
  styleUrls: ['./datos-pedidos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DatosPedidosPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
