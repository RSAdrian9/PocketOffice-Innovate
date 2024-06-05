import { Injectable } from '@angular/core';
import { Network } from '@capacitor/network';
import { ToastService } from './toast.service';
import { Directory, Filesystem } from '@capacitor/filesystem';
import * as JSZip from 'jszip';
import { DbService } from './db.service';
import { FilesystemService } from './filesystem.service';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {
  databaseName = "oficinavirtual.db";
  endpoint: string = "https://appgp.mjhudesings.com/slim/test-download";
  nombre: string = "salida.zip";
  private directorioTmp: string = 'temp';

 /**
 * Inicializa una nueva instancia de la clase.
 *
 * @param {FilesystemService} filesystemService - El servicio para interactuar con el sistema de archivos.
 * @param {ToastService} toastService - El servicio para mostrar notificaciones de toast.
 * @param {DbService} dbService - El servicio para interactuar con la base de datos.
 */
  constructor(
    private filesystemService: FilesystemService,
    private toastService: ToastService,
    private dbService: DbService

  ) { }

 /**
 * Descarga e extrae un paquete de datos.
 *
 * @return {Promise<void>} - Una promesa que se resuelve cuando el paquete se descarga y extrae correctamente.
 */
  public async descargarYDescomprimirPaqueteDatos() {
    try {
      const status = await Network.getStatus();
      if (status.connected) {
        this.toastService.mostrarToast('Descargando paquete de datos', 1500, 'bottom', 'baseline');
        const downloadResult = await this.filesystemService.descargarFichero(this.directorioTmp + "/" + this.nombre, this.endpoint, Directory.External);

        if (downloadResult.path) {
          this.toastService.mostrarToast('Descarga completada', 1500, 'bottom', 'baseline');
          const zipData = await this.filesystemService.leerFichero(this.directorioTmp + "/" + this.nombre, Directory.External);

          const zip = new JSZip();
          const zipContent = await zip.loadAsync(zipData.data, { base64: true });

          zipContent.forEach(async (relativePath: string, zipFile: JSZip.JSZipObject) => {

            await this.filesystemService.crearFichero(relativePath, Directory.External, await zipFile.async('base64'), true).then(() => {
              //this.dbService.initializePlugin();
              this.filesystemService.copiarBBDDExternaAInterna(this.dbService.nombreDB).then(() => {

                this.dbService.moverBBDDAInterna().then(() => {
                  this.dbService.connectDatabase();
                });
              });
            });
          });
        } else {
          this.toastService.mostrarToast('No hay ningun paquete de datos', 1500, 'bottom', 'baseline');
        }

      } else {
        this.toastService.mostrarToast('No tienes conexión a Internet', 1500, 'bottom', 'baseline');
      }
    } catch (error) {
      this.toastService.mostrarToast('Error descargando el paquete:' + error, 1500, 'bottom', 'baseline');
    }
  }

}
