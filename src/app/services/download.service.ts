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

  constructor(
    private filesystemService: FilesystemService,
    private toastService: ToastService,
    private dbService: DbService

  ) { }

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
            console.log(relativePath);
            await this.filesystemService.crearFichero(relativePath, Directory.External, await zipFile.async('base64'), true).then(() => {
              this.dbService.initializePlugin();
              this.filesystemService.borrarArchivo(this.directorioTmp + "/" + this.nombre, Directory.External);
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
