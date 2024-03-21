import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-lista-facturas',
  templateUrl: './lista-facturas.page.html',
  styleUrls: ['./lista-facturas.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ListaFacturasPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
