import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root'
})

export class ToastService {

  constructor(private toastController: ToastController) { }

  public async mostrarToast(texto: string, duration: number, position: 'top' | 'middle' | 'bottom', layout: 'stacked' |'baseline'){

    const toast = await this.toastController.create({
      message: texto,
      duration: duration,
      position: position,
      layout: layout
    });

    await toast.present();
  }  
}
