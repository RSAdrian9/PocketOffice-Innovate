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
 * Descarga e infla un paquete de datos.
 *
 * @return {Promise<void>} Una promesa que se resuelve cuando se completa la descarga e inflación.
 * @throws {Error} Si no hay conexión a Internet o ocurre un error durante el proceso de descarga o inflación.
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
              this.filesystemService.copiarBBDDExternaAInterna(this.dbService.nombreDB).then(() => {

                this.dbService.moverBBDDAInterna().then(() => {
                  this.dbService.connectDatabase().then((result) => {
                    return result;
                  });
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

 /**
 * Descarga e infla un paquete de datos.
 *
 * @return {Promise<boolean>} Retorna verdadero si la base de datos se conecta correctamente, de lo contrario retorna falso.
 * @throws {Error} Si no hay conexión a Internet o ocurre un error durante el proceso de descarga o inflación.
 */
  public async descargarYDescomprimirPaqueteDatos2() {
    const hayConexion = (await Network.getStatus()).connected;
    if(hayConexion){
      const paqueteDescargado = await this.descargarPaquete();
      if(paqueteDescargado){
        const paqueteDescomprimido = await this.descomprimirPaquete();
        if(paqueteDescomprimido){
          const baseDeDatosMovida = await this.moverBaseDeDatos();
          if(baseDeDatosMovida){
            const conectado = await this.dbService.connectDatabase();
            if(conectado){
              return true;
            }else{
              this.toastService.mostrarToast('No se ha podido conectar con la base de datos.', 1500, 'bottom', 'baseline');
              return false;
            }
          }else{
            this.toastService.mostrarToast('Ha ocurrido un error al mover la base de datos a la memoria interna.', 1500, 'bottom', 'baseline');
            return false;
          }         
        }else{
          this.toastService.mostrarToast('Ha ocurrido un error al descomprimir el paquete.', 1500, 'bottom', 'baseline');
          return false;
        }        
      }else{
        this.toastService.mostrarToast('Ha ocurrido un error al descargar el paquete de datos.', 1500, 'bottom', 'baseline');
        return false;
      }    
    }else{
      this.toastService.mostrarToast('No tienes conexión a Internet.', 1500, 'bottom', 'baseline');
      return false;
    }    
  }

 /**
 * Descarga un paquete de datos.
 *
 * @return {Promise<boolean>} Una promesa que se resuelve a true si la descarga es exitosa, de lo contrario se resuelve a false.
 */
  public async descargarPaquete() {
    this.toastService.mostrarToast('Descargando paquete de datos', 1500, 'bottom', 'baseline');
    this.filesystemService.crearDirectorioTmp();
    const downloadResult = await this.filesystemService.descargarFichero(this.directorioTmp + "/" + this.nombre, this.endpoint, Directory.External).then(()=>{
      return true;
    }).catch(()=>{
      return false;
    });

    return downloadResult;
  }

 /**
 * Descomprime asincrónicamente un paquete.
 *
 * @return {Promise<boolean>} Una promesa que se resuelve a true si la descompresión es exitosa, de lo contrario se resuelve a false.
 */
  public async descomprimirPaquete() {
    const zipData = await this.filesystemService.leerFichero(this.directorioTmp + "/" + this.nombre, Directory.External);

    const zip = new JSZip();
    const zipContent = await zip.loadAsync(zipData.data, { base64: true });

    const result = await zipContent.file(this.databaseName);

    if (result) {
      return await this.filesystemService.crearFichero(this.databaseName, Directory.External, await result.async('base64'), true).then(()=>{
        return true;
      }).catch(()=>{
        return false;
      });
    } else {
      return false;
    }
  }

 /**
 * Mueve la base de datos desde el directorio externo al directorio interno y agrega un sufijo a su nombre.
 *
 * @return {Promise<boolean>} Una promesa que se resuelve a true si la base de datos se mueve correctamente, o false en caso contrario.
 */
  public async moverBaseDeDatos() {
    const result = await this.filesystemService.copiarBBDDExternaAInterna(this.dbService.nombreDB);
    if (result) {
      return await this.dbService.moverBBDDAInterna();
    } else {
      return false;
    }
  }

}
