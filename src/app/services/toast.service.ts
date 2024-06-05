import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root'
})

export class ToastService {

  constructor(private toastController: ToastController) { }

 /**
 * Muestra un mensaje de toast con el texto, duración, posición y diseño proporcionados.
 *
 * @param {string} texto - El texto que se mostrará en el mensaje de toast.
 * @param {number} duration - La duración en milisegundos para la cual se mostrará el mensaje de toast.
 * @param {'top' | 'middle' | 'bottom'} position - La posición del toast en la pantalla.
 * @param {'stacked' | 'baseline'} layout - El diseño del mensaje de toast.
 * @return {Promise<void>} Una promesa que se resuelve cuando se presenta el toast.
 */
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
