import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-vista-cliente',
  templateUrl: './vista-cliente.page.html',
  styleUrls: ['./vista-cliente.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class VistaClientePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
