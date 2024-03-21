import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-mayor-datos',
  templateUrl: './mayor-datos.page.html',
  styleUrls: ['./mayor-datos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class MayorDatosPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
