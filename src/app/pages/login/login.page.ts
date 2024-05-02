import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { navigate } from 'ionicons/icons';
import { Router } from '@angular/router';
import { IonCard, IonItem ,IonLabel, IonInput, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, IonCard, IonItem ,IonLabel, IonInput, IonButton]
})
export class LoginPage implements OnInit {
  email: string | undefined;
  password: string | undefined;

  constructor(private router: Router) { }

  ngOnInit() {
  }


  login() {
    this.router.navigate(['/home']);
  }

}