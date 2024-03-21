import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-lista-direcciones',
  templateUrl: './lista-direcciones.page.html',
  styleUrls: ['./lista-direcciones.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ListaDireccionesPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
