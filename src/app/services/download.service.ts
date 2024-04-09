import { Injectable } from '@angular/core';
import { Network } from '@capacitor/network';
import { ToastService } from './toast.service';
import { Directory, Filesystem } from '@capacitor/filesystem';
import * as JSZip from 'jszip';
import { DbService } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {
  databaseName = "oficinavirtual.db";
  endpoint: string = "https://appgp.mjhudesings.com/slim/test-download";
  nombre: string = "salida.zip";

  constructor(
    private toastService: ToastService,
    private dbService: DbService

  ) { }

  public async descargarPaqueteDatos() {
    try {
      const status = await Network.getStatus();
      if (status.connected) {
        const downloadResult = await Filesystem.downloadFile({
          path: this.nombre,
          url: this.endpoint,
          directory: Directory.External
        });

        if (downloadResult.path) {
          const zipData = await Filesystem.readFile({
            path: this.nombre,
            directory: Directory.External
          });

          console.log(zipData);
          const zip = new JSZip();
          const zipContent = await zip.loadAsync(zipData.data, { base64: true });
          // Do something with the unzipped files
          console.log('Unzipped files:', zipContent);

          zipContent.forEach(async (relativePath: string, zipFile: JSZip.JSZipObject) => {
            console.log("Write file from zip " + relativePath);
            await Filesystem.writeFile({
              path: relativePath,
              directory: Directory.External,
              data: await zipFile.async('base64'),
              recursive: true
            }).then((data)=>{
              console.log(data);
              this.dbService.initializePlugin();
            });
          });


        } else {

        }


      } else {
        this.toastService.mostrarToast('No tienes conexión a Internet', 1500, 'bottom', 'baseline');
      }
    } catch (error) {
      this.toastService.mostrarToast('Error descargando el paquete:' + error, 1500, 'bottom', 'baseline');
    }
  }

  async borrarFicheroZip(){
    //await Filesystem.deleteFile()
  }
  



}
