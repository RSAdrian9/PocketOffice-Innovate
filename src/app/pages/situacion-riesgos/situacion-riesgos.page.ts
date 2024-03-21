import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-situacion-riesgos',
  templateUrl: './situacion-riesgos.page.html',
  styleUrls: ['./situacion-riesgos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SituacionRiesgosPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
