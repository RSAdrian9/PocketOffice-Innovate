import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-datos-direcciones',
  templateUrl: './datos-direcciones.page.html',
  styleUrls: ['./datos-direcciones.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DatosDireccionesPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
