import { Injectable } from '@angular/core';
import { Directory, DownloadFileResult, Filesystem, ReadFileResult, WriteFileResult } from '@capacitor/filesystem';

@Injectable({
  providedIn: 'root'
})
export class FilesystemService {
  private directorioTmp: string = 'temp';

  constructor() { }

  public async crearDirectorioTmp() {
    const fileExists = await Filesystem.readdir({
      path: this.directorioTmp,
      directory: Directory.External
    }).then((dir) => {
      console.log('El directorio temp ya existe');
    }).catch((err)=>{
      console.log('El directorio temp no existe');
      this.crearDirectorio(this.directorioTmp, Directory.External);
    });

  }

  public async copiarBBDDExternaAInterna(nombreDB: string) {

    const data = await this.compruebaFicheroExiste(nombreDB, Directory.External);
    await this.crearFichero(nombreDB, Directory.Data, data.data);
  }

  public async compruebaFicheroExiste(nombre: string, directorio: Directory): Promise<ReadFileResult> {
    return await Filesystem.readFile({
      path: nombre,
      directory: directorio
    });
  }

  public async crearFichero(nombre: string, directorio: Directory, data?: any, recursive?: boolean): Promise<WriteFileResult> {
    return await Filesystem.writeFile({
      path: nombre,
      directory: directorio,
      data: data,
      recursive: recursive
    });
  }

  public async leerFichero(nombre: string, directorio: Directory): Promise<ReadFileResult> {
    return await Filesystem.readFile({
      path: nombre,
      directory: directorio
    });
  }

  public async borrarArchivo(nombre: string, directorio: Directory): Promise<void> {
    return await Filesystem.deleteFile({
      path: nombre,
      directory: directorio
    });   
  }

  public async descargarFichero(nombre: string, endpoint: string, directorio: Directory): Promise<DownloadFileResult> {
    return await Filesystem.downloadFile({
      path: nombre,
      url: endpoint,
      directory: directorio
    });


  }

  public async crearDirectorio(nombre:string, directorio: Directory ){
    return await Filesystem.mkdir({
      path: nombre,
      directory: directorio
    });
  }


}