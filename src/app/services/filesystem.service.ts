import { Injectable } from '@angular/core';
import { Directory, DownloadFileResult, Filesystem, ReadFileResult, WriteFileResult } from '@capacitor/filesystem';

@Injectable({
  providedIn: 'root'
})
export class FilesystemService {
  private directorioTmp: string = 'temp';

  constructor() { }

 /**
 * Solicita y verifica los permisos utilizando la API del Sistema de Archivos.
 *
 * @return {Promise<void>} Una promesa que se resuelve cuando se solicitan y verifican los permisos.
 */
  public async solicitarPermisos(){
    Filesystem.requestPermissions().then((data)=>{
      console.log(data);
    })
    Filesystem.checkPermissions().then((data)=>{
      console.log(data);
    })
  }

 /**
 * Crea un directorio temporal si no existe ya.
 *
 * @return {Promise<void>} Una promesa que se resuelve cuando el directorio se crea o ya existe.
 */
  public async crearDirectorioTmp() {
    const fileExists = await Filesystem.readdir({
      path: this.directorioTmp,
      directory: Directory.External
    }).then((dir) => {      
    }).catch((err)=>{      
      this.crearDirectorio(this.directorioTmp, Directory.External);
    });
  }

 /**
 * Copia una base de datos externa a la interna.
 *
 * @param {string} nombreDB - El nombre de la base de datos a copiar.
 * @return {Promise<void>} Una promesa que se resuelve cuando se ha copiado la base de datos.
 */
  public async copiarBBDDExternaAInterna(nombreDB: string) {
    
    const data = await this.compruebaFicheroExiste(nombreDB, Directory.External);
    await this.crearFichero(nombreDB, Directory.Data, data.data);
  }

 /**
 * Verifica si un archivo existe en el directorio especificado.
 *
 * @param {string} nombre - El nombre del archivo a verificar.
 * @param {Directory} directorio - El directorio en el que se verificará la existencia del archivo.
 * @return {Promise<ReadFileResult>} Una promesa que se resuelve con el resultado de la operación de lectura del archivo.
 */
  public async compruebaFicheroExiste(nombre: string, directorio: Directory): Promise<ReadFileResult> {
    return await Filesystem.readFile({
      path: nombre,
      directory: directorio
    });
  }

 /**
 * Crea un archivo con el nombre proporcionado en el directorio especificado.
 *
 * @param {string} nombre - El nombre del archivo a crear.
 * @param {Directory} directorio - El directorio donde se creará el archivo.
 * @param {any} [data] - Datos opcionales para escribir en el archivo.
 * @param {boolean} [recursive] - Indicador opcional de si se deben crear directorios intermedios si no existen.
 * @return {Promise<WriteFileResult>} Una promesa que se resuelve con el resultado de la operación de escritura.
 */
  public async crearFichero(nombre: string, directorio: Directory, data?: any, recursive?: boolean): Promise<WriteFileResult> {
    return await Filesystem.writeFile({
      path: nombre,
      directory: directorio,
      data: data,
      recursive: recursive
    });
  }

 /**
 * Lee un archivo desde el directorio especificado.
 *
 * @param {string} nombre - El nombre del archivo a leer.
 * @param {Directory} directorio - El directorio donde se encuentra el archivo.
 * @return {Promise<ReadFileResult>} Una promesa que se resuelve con el resultado de la operación de lectura.
 */
  public async leerFichero(nombre: string, directorio: Directory): Promise<ReadFileResult> {
    return await Filesystem.readFile({
      path: nombre,
      directory: directorio
    });
  }

 /**
 * Elimina un archivo con el nombre especificado desde el directorio proporcionado.
 *
 * @param {string} nombre - El nombre del archivo que se va a eliminar.
 * @param {Directory} directorio - El directorio donde se encuentra el archivo.
 * @return {Promise<void>} Una promesa que se resuelve cuando se elimina correctamente el archivo.
 */
  public async borrarArchivo(nombre: string, directorio: Directory): Promise<void> {
    return await Filesystem.deleteFile({
      path: nombre,
      directory: directorio
    });   
  }

 /**
 * Descarga un archivo desde el punto final especificado y lo guarda en el directorio especificado.
 *
 * @param {string} nombre - El nombre del archivo que se va a descargar.
 * @param {string} endpoint - La URL del archivo que se va a descargar.
 * @param {Directory} directorio - El directorio donde se guardará el archivo descargado.
 * @return {Promise<DownloadFileResult>} Una promesa que se resuelve con el resultado de la operación de descarga.
 */
  public async descargarFichero(nombre: string, endpoint: string, directorio: Directory): Promise<DownloadFileResult> {
    return await Filesystem.downloadFile({
      path: nombre,
      url: endpoint,
      directory: directorio
    });    
  }

 /**
 * Crea un nuevo directorio con el nombre proporcionado en el directorio especificado.
 *
 * @param {string} nombre - El nombre del directorio a crear.
 * @param {Directory} directorio - El directorio donde se creará el nuevo directorio.
 * @return {Promise<void>} - Una promesa que se resuelve cuando el directorio se crea correctamente.
 */
  public async crearDirectorio(nombre:string, directorio: Directory ){
    return await Filesystem.mkdir({
      path: nombre,
      directory: directorio
    });
  }

 /**
 * Obtiene la URI de un archivo en el directorio especificado.
 *
 * @param {string} nombreFichero - El nombre del archivo.
 * @param {Directory} directorio - El directorio donde se encuentra el archivo.
 * @return {Promise<string>} Una promesa que se resuelve con la URI del archivo.
 */
  public async devuelveRutaFichero(nombreFichero:string, directorio: Directory){
    let ruta = await Filesystem.getUri({path:nombreFichero, directory: directorio});
    return ruta.uri;
  }


}