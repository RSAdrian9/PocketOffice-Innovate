import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-datos-contactos',
  templateUrl: './datos-contactos.page.html',
  styleUrls: ['./datos-contactos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DatosContactosPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
