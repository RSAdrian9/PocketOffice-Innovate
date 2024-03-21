import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { logOut, peopleSharp, reload } from 'ionicons/icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HomePage implements OnInit {

  constructor(private router: Router) {
    addIcons({
      peopleSharp,
      logOut,
      reload
    })
   }

  ngOnInit() {
  }

  goToClientes() {
    console.log("goToClientes");
    this.router.navigate(['/clientes']);
  }

  goToProveedores() {
    console.log("goToProveedores");
    this.router.navigate(['/proveedores']);
  }

  logout() {
    console.log("logout");
    this.router.navigate(['/login']);
  }

  actualizar() {
    console.log("Actualizando base de datos");
  }

}