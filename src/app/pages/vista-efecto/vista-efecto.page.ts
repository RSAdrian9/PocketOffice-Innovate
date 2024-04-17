import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-vista-efecto',
  templateUrl: './vista-efecto.page.html',
  styleUrls: ['./vista-efecto.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class VistaEfectoPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
