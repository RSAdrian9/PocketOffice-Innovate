import { Injectable } from '@angular/core';
import { CapacitorSQLite, CapacitorSQLitePlugin, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

import { clienteTmp } from '../models/clienteTmp.model';
import { proveedorTmp } from '../models/proveedorTmp.model';
import { FilesystemService } from './filesystem.service';
import { direccion } from '../models/direccion.model';
import { banco } from '../models/banco.model';
import { contacto } from '../models/contacto.model';
import { facturasCliente } from '../models/facturas-cliente.model';
import { facturasProveedor } from '../models/facturas-proveedor.model';
import { albaranesCliente } from '../models/albaranes-cliente.model';
import { albaranesProveedor } from '../models/albaranes-proveedor.model';
import { presupuestos } from '../models/presupuestos.model';
import { pedidosCliente } from '../models/pedidos-cliente.model';
import { pedidosProveedor } from '../models/pedidos-proveedor.model';
import { efectos } from '../models/efectos.model';
import { mayor } from '../models/mayor.model';
import { situacionriesgo } from '../models/situacionriesgo.model';
import { rentabilidad } from '../models/rentabilidad.model';
import { resumen } from '../models/resumen.model';
import { ToastService } from './toast.service';
import { efectosTmp } from '../models/efectosTmp.model';
import { anio } from '../models/anio.model';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private sqliteConnection!: SQLiteConnection;
  isService: boolean = false;
  private platform!: string;
  private sqlitePlugin!: CapacitorSQLitePlugin;
  private native: boolean = false;
  private loadToVersion: number = 1;
  public nombreDB: string = 'oficinavirtual.db';
  private host: string = 'appgp.mjhudesings.com';

  private db!: SQLiteDBConnection;

  /**
  * Constructor de la clase DbService. Inicializa la plataforma, sqlitePlugin y sqliteConnection.
  *
  * @param {FilesystemService} filesystemService - El servicio de sistema de archivos utilizado por el DbService.
  * @param {ToastService} toastService - El servicio de notificaciones utilizado por el DbService.
  */
  constructor(
    private filesystemService: FilesystemService,
    private toastService: ToastService
  ) {
    this.platform = Capacitor.getPlatform();
    console.log(this.platform);
    if (this.platform === 'ios' || this.platform === 'android') {
      console.log('Inicializando CapacitorSQLite');
      this.sqlitePlugin = CapacitorSQLite;
      this.sqliteConnection = new SQLiteConnection(this.sqlitePlugin);
    }
  }

  /**
  * Abre una conexión de base de datos SQLite con los parámetros especificados.
  *
  * @param {string} dbName - El nombre de la base de datos que se va a abrir.
  * @param {boolean} encrypted - Si la base de datos debe estar cifrada.
  * @param {string} mode - El modo en que se debe abrir la base de datos.
  * @param {number} version - La versión de la base de datos.
  * @param {boolean} readonly - Si la base de datos debe abrirse en modo de solo lectura.
  * @return {Promise<SQLiteDBConnection>} Una promesa que se resuelve en el objeto SQLiteDBConnection abierto.
  */
  async openDatabase(dbName: string, encrypted: boolean, mode: string, version: number, readonly: boolean): Promise<SQLiteDBConnection> {
    let db: SQLiteDBConnection;

    const retCC = (await this.sqliteConnection.checkConnectionsConsistency()).result;

    let isConn = (await this.sqliteConnection.isConnection(dbName, readonly)).result;

    if (retCC && isConn) {
      db = await this.sqliteConnection.retrieveConnection(dbName, readonly);
    } else {
      db = await this.sqliteConnection
        .createConnection(dbName, encrypted, mode, version, readonly);
    }

    await db.open();
    return db;
  }

 /**
 * Mueve la base de datos especificada al directorio interno y agrega un sufijo a su nombre.
 *
 * @return {Promise<boolean>} Una promesa que se resuelve a true si la base de datos se ha movido exitosamente, o false en caso contrario.
 */
  async moverBBDDAInterna() {
    return await this.sqlitePlugin.moveDatabasesAndAddSuffix({ folderPath: Directory.External, dbNameList: [this.nombreDB] }).then((result)=>{
      return true;
    }).catch(()=>{
      return false;
    });
  }

  /**
  * Conecta a la base de datos.
  *
  * @return {Promise<Boolean>} Una promesa que se resuelve a true si la base de datos se conecta correctamente, de lo contrario false.
  */
  public async connectDatabase(): Promise<Boolean> {
    return await this.openDatabase(
      this.nombreDB,
      false,
      'no-encryption',
      this.loadToVersion,
      false
    ).then((db) => {
      this.db = db;
      return true;
    }).catch(() => {
      return false;
    });
  }

  /**
  * Recupera una lista de bases de datos utilizando la conexión SQLite y la registra en la consola.
  *
  * @return {void} No devuelve ningún valor.
  */
  devuelveListaBBDD() {
    let BBDDs = this.sqliteConnection.getDatabaseList();

    console.log(BBDDs);
  }

  /**
  * Ejecuta de manera asíncrona una consulta para obtener los nombres de todas las tablas en el esquema de la base de datos SQLite.
  *
  * @return {Promise<any[]>} Una promesa que se resuelve en un array de nombres de tablas.
  */
  async testConsulta() {
    const test: any[] = (await this.db.query("SELECT name FROM sqlite_schema WHERE type ='table' ")).values as any[];

    console.log(test);
  }

  /**
  * Recupera el nombre de un cliente de la base de datos basado en el código proporcionado.
  *
  * @param {string} codigo - El código del cliente.
  * @return {Promise<string>} El nombre del cliente, o una cadena vacía si no se encuentra.
  */
  public async getNombreCliente(codigo: string) {
    var nombre: string = '';
    var sentencia = "SELECT nom FROM CLIENT WHERE cod='" + codigo + "';";
    const result = await this.db.query(sentencia);

    if (result.values && result.values.length > 0) {
      nombre = result.values[0].nom;
    }
    return nombre;
  }

  /**
  * Recupera el nombre de un proveedor de la base de datos basado en el código proporcionado.
  *
  * @param {string} codigo - El código del proveedor.
  * @return {Promise<string>} El nombre del proveedor, o una cadena vacía si no se encuentra.
  */
  public async getNombreProveedor(codigo: string) {
    var nombre: string = '';
    var sentencia = "SELECT nom FROM PROVEE WHERE cod='" + codigo + "';";
    const result = await this.db.query(sentencia);

    if (result.values && result.values.length > 0) {
      nombre = result.values[0].nom;
    }
    return nombre;
  }

  /**
  * Recupera una lista de clientes de la base de datos basada en el filtro proporcionado.
  *
  * @param {string} filtro - El filtro que se aplicará a la consulta.
  * @return {Promise<clienteTmp[]>} Una promesa que se resuelve en una matriz de objetos clienteTmp que representan a los clientes.
  */
  public async getClientesParaLista(filtro: string) {
    var clientes: clienteTmp[] = [];
    var sentencia = "SELECT t1.id, t1.cod, t1.nom, t1.historia, (SELECT COUNT(cod) FROM CLIENT WHERE (cod IN (SELECT cli FROM ALBARA WHERE strftime('%Y', fec)=strftime('%Y',DATE('now'))) OR cod IN (SELECT cli FROM CABPRE WHERE strftime('%Y',fec)=strftime('%Y',DATE('now'))) OR cod IN (SELECT cue FROM FACEMI WHERE strftime('%Y',fee)=strftime('%Y',DATE('now')))) AND cod = t1.cod) AS activo, (SELECT rie FROM SITUAC AS t2 WHERE t1.cod=t2.cod) AS riesgo, (SELECT total FROM SITUAC AS t2 WHERE t1.cod=t2.cod) AS totalimp FROM CLIENT AS t1 " + filtro + " ORDER BY t1.nom ";

    clientes = (await this.db.query(sentencia)).values as clienteTmp[];

    return clientes;
  }

  /**
  * Recupera un cliente de la base de datos basado en el código proporcionado.
  *
  * @param {string} codigo - El código del cliente.
  * @return {Promise<any>} Una promesa que se resuelve al objeto del cliente, o undefined si no se encuentra.
  */
  public async getCliente(codigo: string) {

    var cliente: any;
    var sentencia = "SELECT t1.id, t1.cod, t1.nom, t1.sno, t1.dir, t1.pob, t1.npro, t1.pro, t1.nif, t1.te1, t1.te2, t1.fax, t1.mov, t1.per, t1.car, t1.ter, t1.req, t1.red, t1.dto, t1.com, t1.fin, t1.fac, t1.tar, t1.for||' - '||(SELECT nom FROM FORPAG WHERE id=t1.for) AS 'for', t1.di1, t1.di2, t1.di3, t1.mnp, t1.m30, t1.vto, t1.inc, t1.rie,  t1.rut||' - '||(SELECT nom FROM RUTASV WHERE id=t1.rut) AS 'rut', t1.age||' - '||(SELECT nom FROM AGENTG WHERE id=t1.age) AS 'age', t1.nco, t1.alv, t1.fa1, t1.fa2, t1.tra, t1.mar, t1.dt2, t1.tia, t1.fo2||' - '||(SELECT nom FROM FORPAG WHERE id=t1.fo2) AS 'fo2', t1.d1b, t1.d2b, t1.d3b, t1.mnb, t1.imp, t1.tre, t1.ret, t1.fgl, t1.ifg, t1.web, t1.doc, t1.fpd, t1.pais, t1.ext, t1.ob1, t1.ob2, t1.rediva1, t1.rediva2, t1.rediva3, t1.rediva4, t1.rediva5, t1.avi0ped, t1.avi1ped, t1.avi2ped, t1.avi0alb, t1.avi1alb, t1.avi2alb, t1.avi0fac, t1.avi1fac, t1.avi2fac, t1.avi0rec, t1.avi1rec, t1.avi2rec, t1.avi0pre, t1.avi1pre, t1.avi2pre, t1.ivainc,  t1.fot, t1.env, t1.xxx, t1.fcr_crm, t1.tip_crm||' - '||(SELECT nom FROM TIPCLI WHERE id=t1.tip_crm) AS 'tip_crm', t1.ftr_crm, t1.tco_crm, t1.ref_crm, t1.vis_crm, t1.pvi_crm, t1.lla_crm, t1.pll_crm, t1.ru1_crm, t1.ru2_crm, t1.ru3_crm, t1.sec_crm, t1.dias_crm, t1.tpl_crm, t1.fna_crm, t1.imprap, t1.dtorap, t1.tar_art||' - '||(SELECT nom FROM CATAAR WHERE cod=t1.tar_art) AS 'tar_art', t1.tar_fam||' - '||(SELECT nom FROM CATAFA WHERE cod=t1.tar_fam) AS 'tar_fam', t1.efactura, t1.perrap, t1.facedir, t1.facepob, t1.facenpro, t1.facepro, t1.facepais, t1.facenom, t1.faceape1, t1.faceape2, t1.facefoj, t1.v01, t1.v02, t1.v03, t1.v04, t1.v05, t1.v06, t1.v07, t1.v08, t1.v09, t1.v10, t1.v11, t1.v12, t1.historia, t1.lopd_ori, t1.lopd_otr_o, t1.lopd_ces, t1.lopd_otr_c, t1.cli_facalb||' - '||(SELECT nom FROM CLIENT WHERE cod =t1.cli_facalb) AS 'cli_facalb', t1.cln_tarsub||' - '||(SELECT nom FROM CATASU WHERE cod=t1.cln_tarsub) AS 'cln_tarsub', t1.cln_tarmar||' - '||(SELECT nom FROM CATAMA WHERE cod=t1.cln_tarmar) AS 'cln_tarmar', t1.cln_idioma, t1.moneda, t1.avi0dep, t1.avi_dep, t1.avi_ped, t1.avi_pre, t1.avi_alb, t1.avi_fac, t1.avi_rec, t1.web_acc, t1.web_psw, t1.obs_doc, t1.actividad, t1.emailweb, t1.web_exepor, t1.tip_rem, t1.fec_man, t1.cri_caja, t1.facemed, t1.faceiban, t1.facever, t1.facepol, t1.por_efac, t1.web_codact, t1.sincro, (SELECT COUNT(cod) FROM CLIENT WHERE (cod IN (SELECT cli FROM ALBARA WHERE strftime('%Y', fec)=strftime('%Y',DATE('now'))) OR cod IN (SELECT cli FROM CABPRE WHERE strftime('%Y',fec)=strftime('%Y',DATE('now'))) OR cod IN (SELECT cue FROM FACEMI WHERE strftime('%Y',fee)=strftime('%Y',DATE('now')))) AND cod = t1.cod) AS activo FROM CLIENT AS t1 WHERE cod = '" + codigo + "' ";

    const result = await this.db.query(sentencia);
    if (result.values && result.values.length > 0) {
      cliente = result.values[0];
    }

    return cliente;
  }


  /**
  * Recupera una lista de proveedores de la base de datos basada en el filtro proporcionado.
  *
  * @param {string} filtro - El filtro a aplicar a la consulta.
  * @return {Promise<proveedorTmp[]>} Una promesa que se resuelve en un array de objetos que representan a los proveedores.
  */
  public async getProveedoresParaLista(filtro: string) {
    var proveedores: proveedorTmp[] = [];
    var sentencia = "SELECT t1.id, t1.cod, t1.nom, (SELECT COUNT(cod) FROM PROVEE WHERE (cod IN (SELECT cli FROM ALBENT WHERE strftime('%Y', fec)=strftime('%Y',DATE('now'))) OR cod IN (SELECT cli FROM CAPEPR WHERE strftime('%Y',fec)=strftime('%Y',DATE('now'))) OR cod IN (SELECT cue FROM FACREC WHERE strftime('%Y',fee)=strftime('%Y',DATE('now')))) AND cod = t1.cod) AS activo FROM PROVEE AS t1 " + filtro + " ORDER BY t1.nom ";

    proveedores = (await this.db.query(sentencia)).values as proveedorTmp[];

    return proveedores;
  }

  /**
  * Recupera un proveedor de la base de datos basado en el código proporcionado.
  *
  * @param {string} codigo - El código del proveedor.
  * @return {Promise<any>} Una promesa que se resuelve en el objeto del proveedor.
  */
  public async getProveedor(codigo: string) {

    var proveedor: any;
    var sentencia = "SELECT t1.id, t1.cod, t1.nom, t1.dir, t1.npro, t1.pob, t1.pro, t1.nif, t1.te1, t1.te2, t1.fax, t1.mov, t1.ter, t1.per, t1.car, t1.for||' - '||(SELECT nom FROM FORPAG WHERE id=t1.for) AS 'for', t1.dto, t1.red, t1.por, t1.poa, t1.ctg, t1.mar, t1.dt2, t1.di1, t1.di2, t1.di3, t1.mnp, t1.tia, t1.tre, t1.ret, t1.ob1, t1.ob2, t1.ob3, t1.web, t1.ext, t1.rediva1, t1.rediva2, t1.rediva3,t1.rediva4,t1.rediva5,t1.avi0ped,t1.avi1ped,t1.avi2ped,t1.avi0alb,t1.avi1alb,t1.avi2alb,t1.avi0fac,t1.avi1fac,t1.avi2fac,t1.avi0rec,t1.avi1rec,t1.avi2rec,t1.ivainc,t1.fot,t1.doc,t1.pais,t1.xxx,t1.imprap,t1.dtorap,t1.perrap,t1.v01,t1.v02,t1.v03,t1.v04,t1.v05,t1.v06,t1.v07,t1.v08,t1.v09,t1.v10,t1.v11,t1.v12,t1.historia,t1.lopd_ori,t1.lopd_otr_o,t1.lopd_ces,t1.lopd_otr_c,t1.pro_idioma,t1.moneda,t1.avi_ped,t1.avi_alb,t1.avi_fac,t1.avi_rec,t1.actividad,t1.contrato,t1.fec_eval,t1.res_eval,t1.fec_apro,t1.nota_eval,t1.product1,t1.product2,t1.obs_cal,t1.cer_cal,t1.cer_med,t1.cer_pre,t1.perval,t1.diasmax,t1.autof,t1.tip_rem,t1.cri_caja, (SELECT COUNT(cod) FROM PROVEE WHERE (cod IN (SELECT cli FROM ALBENT WHERE strftime('%Y',fec)=strftime('%Y',DATE('now'))) OR cod IN (SELECT cue FROM FACREC WHERE strftime('%Y',fee)=strftime('%Y',DATE('now')))) AND cod = t1.cod) AS activo FROM PROVEE AS t1 WHERE cod = '" + codigo + "' ";

    const result = await this.db.query(sentencia);
    if (result.values && result.values.length > 0) {
      proveedor = result.values[0];
    }

    return proveedor;
  }

  /*********************************LISTADOS INFORMES******************************/

  /**
  * Recupera una lista de contactos basada en el tipo y código proporcionados.
  *
  * @param {string} tipo - El tipo de contactos a recuperar.
  * @param {string} codigo - El código de los contactos a recuperar.
  * @return {Promise<contacto[]>} - Una promesa que se resuelve en una matriz de objetos de contacto.
  */
  public async getContactos(tipo: string, codigo: string) {
    var contactos: contacto[] = [];
    var sentencia = "SELECT * FROM CONTAC WHERE cod='" + codigo + "' AND cla='" + tipo + "';";

    contactos = (await this.db.query(sentencia)).values as contacto[];

    return contactos;
  }

  /**
  * Recupera una lista de direcciones basada en el tipo y código proporcionados.
  *
  * @param {string} tipo - El tipo de direcciones a recuperar.
  * @param {string} codigo - El código de las direcciones a recuperar.
  * @return {Promise<direccion[]>} - Una promesa que se resuelve en una matriz de objetos de dirección.
  */
  public async getDirecciones(tipo: string, codigo: string) {
    var direcciones: direccion[] = [];
    var sentencia = "SELECT cod, den, dir, pob, npro, pro, email, rut, (SELECT nom FROM RUTASV WHERE RUTASV.cod=DIRECC.rut) AS nomrut, hab, per FROM DIRECC WHERE cod='" + codigo + "' AND cla='" + tipo + "';";

    direcciones = (await this.db.query(sentencia)).values as direccion[];

    return direcciones;

  }

  /**
  * Recupera una lista de bancos basada en el tipo y código proporcionados.
  *
  * @param {string} tipo - El tipo de bancos a recuperar.
  * @param {string} codigo - El código de los bancos a recuperar.
  * @return {Promise<banco[]>} - Una promesa que se resuelve en una matriz de objetos de banco.
  */
  public async getBancos(tipo: string, codigo: string) {
    var bancos: banco[] = [];
    var sentencia = "SELECT DATBAN.*, ENTIDA.nom FROM DATBAN LEFT JOIN ENTIDA ON DATBAN.cu1=ENTIDA.cod WHERE DATBAN.cod='" + codigo + "' AND DATBAN.cla='" + tipo + "';";

    bancos = (await this.db.query(sentencia)).values as banco[];

    return bancos;
  }

  /**
  * Recupera la historia basada en el tipo y código proporcionados.
  *
  * @param {string} tipo - El tipo de historia a recuperar.
  * @param {string} codigo - El código de la historia a recuperar.
  * @return {Promise<string>} - Una promesa que se resuelve con la historia recuperada.
  */
  public async getHistoria(tipo: string, codigo: string) {
    var historia: string = "";
    var sentencia = "";

    if (tipo == 'CL') {
      sentencia = "SELECT historia FROM CLIENT WHERE cod='" + codigo + "';";
    } else {
      sentencia = "SELECT historia FROM PROVEE WHERE cod='" + codigo + "';";
    }

    const result = await this.db.query(sentencia);
    if (result.values && result.values.length > 0) {
      historia = result.values[0].historia;
    }

    return historia;
  }

  /**
  * Recupera una lista de facturas basada en el tipo, código y filtro proporcionados.
  *
  * @param {string} tipo - El tipo de facturas a recuperar.
  * @param {string} codigo - El código de las facturas a recuperar.
  * @param {string} filtro - El filtro para aplicar a las facturas.
  * @return {Promise<any[]>} - Una promesa que se resuelve en una matriz de facturas.
  */
  public async getListadoFacturas(tipo: string, codigo: string, filtro: string) {
    var facturas: any[] = [];
    let sentencia: string;

    if (tipo == 'CL') {
      sentencia = "SELECT num, strftime('%d/%m/%Y',fee) AS fee2, basmon, totmon, toceu, totimpu, impend, est, pdf,IIF(pdf=1,'https://" + this.host + "/documentos/clientes/'||cue||'/FACTURA NUMERO '||REPLACE(num,'/','-')||'.PDF','') AS rutapdf FROM FACEMI WHERE cue='" + codigo + "' " + filtro;
      facturas = (await this.db.query(sentencia)).values as facturasCliente[];
    } else {
      sentencia = "SELECT num, numpro, strftime('%d/%m/%Y',fee) AS fee2, basmon, totmon, toceu, totimpu, impend, est, pdf,IIF(pdf=1,'https://" + this.host + "/documentos/proveedores/'||cue||'/FACTURA NUMERO '||REPLACE(num,'/','-')||'.PDF','') AS rutapdf FROM FACREC WHERE cue='" + codigo + "' " + filtro;
      facturas = (await this.db.query(sentencia)).values as facturasProveedor[];
    }



    return facturas;
  }

  /**
  * Obtiene una lista de albaranes basados en los parámetros proporcionados.
  *
  * @param {string} tipo - El tipo de albaranes a obtener ('CL' para cliente, cualquier otro para proveedor).
  * @param {string} codigo - El código del cliente o proveedor.
  * @param {string} filtro - El filtro a aplicar a los albaranes.
  * @return {Promise<any[]>} Una promesa que se resuelve en una lista de albaranes.
  */
  public async getListadoAlbaranes(tipo: string, codigo: string, filtro: string) {
    var albaranes: any[] = [];
    let sentencia: string;

    if (tipo == 'CL') {
      sentencia = "SELECT num, fac, IIF(fac=1 AND (LTRIM(RTRIM(n_f))='' OR LTRIM(RTRIM(n_f)) ='/'),'NO FACTURABLE', n_f) AS n_f, strftime('%d/%m/%Y',fec) AS fec2, baseu, toteu, cobeu, totimpu, impend, est, pdf,IIF(pdf=1,'https://" + this.host + "/documentos/clientes/'||cli||'/ALBARAN NUMERO '||REPLACE(num,'/','-')||'.PDF','') AS rutapdf FROM ALBARA WHERE cli='" + codigo + "' " + filtro;
      albaranes = (await this.db.query(sentencia)).values as albaranesCliente[];
    } else {
      sentencia = "SELECT num, fac, apr AS numpro, IIF(fac=1 AND (LTRIM(RTRIM(n_f))='' OR LTRIM(RTRIM(n_f)) ='/'),'NO FACTURABLE', n_f) AS n_f, strftime('%d/%m/%Y',fec) AS fec2,baseu, toteu, cobeu, totimpu, impend, est, pdf,IIF(pdf=1,'https://" + this.host + "/documentos/proveedores/'||cli||'/ALBARAN NUMERO '||REPLACE(num,'/','-')||'.PDF','') AS rutapdf FROM ALBENT WHERE cli='" + codigo + "' " + filtro;
      albaranes = (await this.db.query(sentencia)).values as albaranesProveedor[];
    }


    return albaranes;
  }

  /**
  * Recupera una lista de presupuestos basados en los parámetros proporcionados.
  *
  * @param {string} codigo - El código del cliente o proveedor.
  * @param {string} filtro - El filtro a aplicar a los presupuestos.
  * @return {Promise<presupuestos[]>} Una promesa que se resuelve en una matriz de presupuestos.
  */
  public async getListadoPresupuestos(codigo: string, filtro: string) {
    var presupuestos: presupuestos[] = [];
    let sentencia: string = "SELECT num, LTRIM(RTRIM(lit)) AS des, LTRIM(RTRIM(aof)) AS aof, IIF(aof='F','Nº Factura', IIF(aof='A','Nº Albarán',IIF(aof='P','Nº Pedido',''))) AS tipdoc, doc, strftime('%d/%m/%Y',fec) AS fec2, baseu, toteu, totimpu, (SELECT des FROM ESTADO WHERE id=est) AS est, pdf, IIF(pdf=1,'https://" + this.host + "/documentos/clientes/'||cli||'/PRESUPUESTO NUMERO '||REPLACE(num,'/','-')||'.PDF','') AS rutapdf FROM CABPRE WHERE cli='" + codigo + "' " + filtro;

    presupuestos = (await this.db.query(sentencia)).values as presupuestos[];

    return presupuestos;
  }

  /**
  * Recupera una lista de pedidos basada en los parámetros proporcionados.
  *
  * @param {string} tipo - El tipo de pedido ('CL' para cliente, otro para proveedor).
  * @param {string} codigo - El código del cliente o proveedor.
  * @param {string} filtro - El filtro a aplicar a los pedidos.
  * @return {Promise<any[]>} Una promesa que se resuelve en una matriz de pedidos.
  */
  public async getListadoPedidos(tipo: string, codigo: string, filtro: string) {
    var pedidos: any[] = [];
    let sentencia: string;

    if (tipo == 'CL') {
      sentencia = "SELECT num, LTRIM(RTRIM(aof)) AS aof, IIF(aof='F','Nº Factura',IIF(aof='A','Nº Albarán','')) AS tipdoc, doc, strftime('%d/%m/%Y',fec) AS fec2, baseu, toteu, totimpu, IFNULL((SELECT des FROM ESTADO WHERE id=est),'') AS est, ser, pdf, IIF(pdf=1,'https://" + this.host + "/documentos/clientes/'||cli||'/PEDIDO NUMERO '||REPLACE(num,'/','-')||'.PDF','') AS rutapdf FROM CABPED WHERE cli='" + codigo + "' " + filtro;
      pedidos = (await this.db.query(sentencia)).values as pedidosCliente[];
    } else {
      sentencia = "SELECT num, LTRIM(RTRIM(aof)) AS aof, IIF(aof='F','Nº Factura',IIF(aof='A','Nº Albarán','')) AS tipdoc, doc, strftime('%d/%m/%Y',fec) AS fec2, baseu, toteu, totimpu, ser, pdf,IIF(pdf=1,'https://" + this.host + "/documentos/clientes/'||cli||'/PEDIDO NUMERO '||REPLACE(num,'/','-')||'.PDF','') AS rutapdf FROM CAPEPR WHERE cli='" + codigo + "' " + filtro;
      pedidos = (await this.db.query(sentencia)).values as pedidosProveedor[];
    }


    return pedidos;
  }

  /**
  * Retrieves a list of effects based on the provided parameters.
  *
  * @param {string} tipo - The type of effect ('C' for credit, 'D' for debit).
  * @param {string} codigo - The code of the client or supplier.
  * @param {string} filtro - The filter to apply to the effects.
  * @return {Promise<efectosTmp[]>} A promise that resolves to an array of effects.
  */
  public async getListadoEfectos(tipo: string, codigo: string, filtro: string) {
    var efectos: efectosTmp[] = [];
    let sentencia: string = "SELECT num, SUBSTR(fac,3,9) AS fac, strftime('%d/%m/%Y',fec) AS fec2, strftime('%d/%m/%Y',vto) AS vto, est, IIF(est=1, 'PENDIENTE',IIF(est=2,IIF(tip='C', 'PARC. COBRADO', 'PARC. PAGADO'),IIF(tip='C', 'COBRADO', 'PAGADO'))) AS nomest, impeu, pageu, impend FROM EFECTO WHERE cue='" + codigo + "' AND  tip = '" + tipo + "' " + filtro;

    efectos = (await this.db.query(sentencia)).values as efectosTmp[];

    return efectos;
  }

 /**
 * Recupera los detalles de un efecto basado en los parámetros proporcionados.
 *
 * @param {string} tipo - El tipo de efecto ('C' para crédito, 'D' para débito).
 * @param {string} codigo - El código del cliente o proveedor.
 * @param {string} num - El número del efecto.
 * @return {Promise<efectos>} Una promesa que se resuelve en los detalles del efecto.
 */
  public async getDatosEfecto(tipo: string, codigo: string, num: string) {
    var efecto: efectos = {};
    let sentencia: string = "SELECT num,  SUBSTR(fac,3,9) AS fac, strftime('%d/%m/%Y',fec) AS fec2, IFNULL((SELECT des FROM BANCOS WHERE cue= ban), '') AS ban, strftime('%d/%m/%Y',vto) AS vto, rem, IIF(dev='S', 'DEVUELTO',IIF(dev='N','NO DEVUELTO','NO DEVUELTO')) AS dev, impeu, pageu, impend, IFNULL(((SELECT nom FROM ENTIDA WHERE cod=cu1)||' '||cu1||' '||cu2||' '||cu3||' '|| cu4), '') AS banefe, IIF(efe_tipagr='A', 'EFECTO AGRUPADO', IIF(efe_tipagr='G','EFECTO DE AGRUPACIÓN', 'NINGUNA')) AS efe_tipagr, efe_docagr, IIF(est=1, 'PENDIENTE',IIF(est=2,IIF(tip='C', 'PARC. COBRADO', 'PARC. PAGADO'),IIF(tip='C', 'COBRADO', 'PAGADO'))) AS est FROM EFECTO WHERE cue='" + codigo + "' AND  tip = '" + tipo + "' AND num ='" + num + "';";

    const result = await this.db.query(sentencia);
    if (result.values && result.values.length > 0) {
      efecto = result.values[0] as efectos;
    }

    return efecto;
  }

 /**
 * Recupera una lista de cuentas mayor basada en los criterios proporcionados.
 *
 * @param {string} tipo - El tipo de cuenta mayor a recuperar.
 * @param {string} codigo - El código del cliente o proveedor.
 * @param {string} filtro - El filtro para aplicar a la consulta.
 * @return {Promise<mayor[]>} Una promesa que se resuelve en una matriz de objetos de cuenta mayor.
 */
  public async getListadoMayorDeCuentas(tipo: string, codigo: string, filtro: string) {
    var lineasMayor: mayor[] = [];
    let sentencia: string = "SELECT num, con, strftime('%d/%m/%Y',fec) AS fec2, cla, sig, impeu , deb, hab, sal, 'AÑO '||anio AS anio2 FROM APUNXX WHERE SUBSTR(cue,-6)='" + codigo + "' AND cla = '" + tipo + "' " + filtro + "ORDER BY fec";

    lineasMayor = (await this.db.query(sentencia)).values as mayor[];

    return lineasMayor;
  }

 /**
 * Recupera los detalles de la cuenta mayor basados en los criterios proporcionados.
 *
 * @param {string} tipo - El tipo de cuenta mayor a recuperar.
 * @param {string} codigo - El código del cliente o proveedor.
 * @param {string} numero - El número de la cuenta mayor.
 * @return {Promise<any>} Una promesa que se resuelve con los detalles de la cuenta mayor.
 */
  public async getDatosMayorDeCuentas(tipo: string, codigo: string, numero: string) {
    var mayor: any;
    let sentencia: string = "SELECT num, con, strftime('%d/%m/%Y',fec) AS fec2, cla, sig, impeu , deb, hab, sal, 'AÑO '||anio AS anio2 FROM APUNXX WHERE SUBSTR(cue,-6)='" + codigo + "' AND cla = '" + tipo + "' AND num = '" + numero + "'";

    const result = await this.db.query(sentencia);
    if (result.values && result.values.length > 0) {
      mayor = result.values[0];
    }

    return mayor;
  }


  //*************************PARA LAS GRAFICAS*****************************

 /**
 * Calcula de manera asíncrona la cantidad total de ventas para los últimos 12 meses.
 *
 * @return {Promise<any>} La cantidad total de ventas para los últimos 12 meses.
 */
  public async devuelveImporteVentasUltimos12Meses() {
    var importeVentas: any;
    let sentencia: string = "SELECT (SELECT IFNULL(SUM(baseu), 0.00) FROM ALBARA WHERE fac = 0 AND fec >= date('now','-12 month'))+(SELECT IFNULL(SUM(basmon), 0.00) FROM FACEMI WHERE  fee >= date('now','-12 month')) AS ventas";

    const result = await this.db.query(sentencia);
    if (result.values && result.values.length > 0) {
      importeVentas = result.values[0].ventas;
    }

    return importeVentas;
  }

 /**
 * Asincrónicamente recupera el importe total de las compras de los últimos 12 meses.
 *
 * @return {Promise<any>} El importe total de las compras de los últimos 12 meses.
 */
  public async devuelveImporteComprasUltimos12Meses() {
    var importeCompras: any;
    let sentencia: string = "SELECT (SELECT IFNULL(SUM(baseu), 0.00) FROM ALBENT WHERE fac = 0 AND fec >= date('now','-12 month'))+(SELECT IFNULL(SUM(basmon), 0.00) FROM FACREC WHERE  fee >= date('now','-12 month')) AS compras";

    const result = await this.db.query(sentencia);
    if (result.values && result.values.length > 0) {
      importeCompras = result.values[0].compras;
    }

    return importeCompras;
  }

 /**
 * Recupera los datos de la tarjeta para el año actual.
 *
 * @return {Promise<{importeVentas: string, importeCompras: string, efectosPendientes: string}>}
 * Un objeto que contiene la suma de importes de ventas, importes de compras y el recuento de efectos pendientes.
 */
  public async devuelveDatosTarjetas() {
    var datosTarjetas = {
      importeVentas: '0',
      importeCompras: '0',
      efectosPendientes: '0'
    }
    let sentencia = "SELECT (SELECT IFNULL(SUM(baseu), 0.00) FROM ALBARA WHERE fac = 0 AND fec >= date('now','-12 month'))+(SELECT IFNULL(SUM(basmon), 0.00) FROM FACEMI WHERE fee >= date('now','-12 month')) AS ventas, (SELECT IFNULL(SUM(baseu), 0.00) FROM ALBENT WHERE fac = 0 AND fec >= date('now','-12 month'))+(SELECT IFNULL(SUM(basmon), 0.00) FROM FACREC WHERE fee >= date('now','-12 month')) AS compras, (SELECT COUNT(num) FROM EFECTO WHERE tip = 'C' AND pageu = 0 AND impeu <> 0 AND efe_tipagr <> 'A' AND dev <> 'S') AS efectosPendientes;";

    const result = await this.db.query(sentencia);
    if (result.values && result.values.length > 0) {
      datosTarjetas.importeVentas = result.values[0].ventas;
      datosTarjetas.importeCompras = result.values[0].compras;
      datosTarjetas.efectosPendientes = result.values[0].efectosPendientes;
    }

    return datosTarjetas;
  }

 /**
 * Recupera datos para un gráfico de ventas.
 *
 * @return {Promise<any>} Un array de objetos que contiene el mes, el nombre del mes, el año y el total de ventas para los últimos 12 meses.
 */
  public async devuelveDatosGraficaVentas(){
    let datosVentas: any;

    let sentencia = "";

    for (let index = 1; index <= 12; index++) {
      
      if(index == 12){
        sentencia = sentencia + "SELECT strftime('%m', date('now','start of month')) AS mes, substr('--EneFebMarAbrMayJunJulAgoSepOctNovDic', strftime ('%m', date('now','start of month')) * 3, 3) as mesletras, strftime('%Y', date('now', 'start of month')) AS periodo, ((SELECT IFNULL(SUM(baseu),0) FROM ALBARA WHERE fec >= date('now','start of month') AND strftime('%m', fec) = strftime('%m', date('now', 'start of month'))  AND fac = 0)+(SELECT IFNULL(SUM(basmon),0) FROM FACEMI WHERE fee >= date('now','start of month') AND strftime('%m', fee) =strftime('%m', date('now', 'start of month')))) AS total ORDER BY periodo, mes;"
      }else{
        sentencia = sentencia + "SELECT strftime('%m', date('now', '-"+(12-index)+" month')) AS mes, substr('--EneFebMarAbrMayJunJulAgoSepOctNovDic',strftime ('%m', date('now','-"+(12-index)+" month')) * 3, 3) as mesletras, strftime('%Y', date('now', '-"+(12-index)+" month')) AS periodo, ((SELECT IFNULL(SUM(baseu),0) FROM ALBARA WHERE fec >= date('now','-"+(12-index)+" month') AND strftime('%m', fec) =strftime('%m', date('now', '-"+(12-index)+" month'))  AND fac = 0)+(SELECT IFNULL(SUM(basmon),0) FROM FACEMI WHERE fee >= date('now','-"+(12-index)+" month') AND strftime('%m', fee) =strftime('%m', date('now', '-"+(12-index)+" month')))) AS total UNION ";
      }

    }

    datosVentas = (await this.db.query(sentencia)).values;
    
    return datosVentas;    
  }

 /**
 * Recupera datos para un gráfico de compras.
 *
 * @return {Promise<any>} Un array de objetos que contiene el mes, el nombre del mes, el año y el total de compras para los últimos 12 meses.
 */
  public async devuelveDatosGraficaCompras(){
    let datosCompras: any;

    let sentencia = "";

    for (let index = 1; index <= 12; index++) {
      if(index == 12){
        sentencia = sentencia + "SELECT strftime('%m', date('now','start of month')) AS mes, substr('--EneFebMarAbrMayJunJulAgoSepOctNovDic', strftime ('%m', date('now','start of month')) * 3, 3) as mesletras, strftime('%Y', date('now', 'start of month')) AS periodo, ((SELECT IFNULL(SUM(baseu),0) FROM ALBENT WHERE fec >= date('now','start of month') AND strftime('%m', fec) = strftime('%m', date('now', 'start of month'))  AND fac = 0)+(SELECT IFNULL(SUM(basmon),0) FROM FACREC WHERE fee >= date('now','start of month') AND strftime('%m', fee) =strftime('%m', date('now', 'start of month')))) AS total ORDER BY periodo, mes;"
      }else{
        sentencia = sentencia + "SELECT strftime('%m', date('now', '-"+(12-index)+" month')) AS mes, substr('--EneFebMarAbrMayJunJulAgoSepOctNovDic',strftime ('%m', date('now','-"+(12-index)+" month')) * 3, 3) as mesletras, strftime('%Y', date('now', '-"+(12-index)+" month')) AS periodo, ((SELECT IFNULL(SUM(baseu),0) FROM ALBENT WHERE fec >= date('now','-"+(12-index)+" month') AND strftime('%m', fec) =strftime('%m', date('now', '-"+(12-index)+" month'))  AND fac = 0)+(SELECT IFNULL(SUM(basmon),0) FROM FACREC WHERE fee >= date('now','-"+(12-index)+" month') AND strftime('%m', fee) =strftime('%m', date('now', '-"+(12-index)+" month')))) AS total UNION ";
      }      
    }

    datosCompras = (await this.db.query(sentencia)).values;
    
    return datosCompras;    
  }

  //*************************PARA LOS FILTROS*****************************

 /**
 * Recupera la lista de años de la tabla APUNXX basada en el tipo y código dados.
 *
 * @param {string} tipo - El parámetro tipo utilizado para filtrar la tabla APUNXX.
 * @param {string} codigo - El parámetro código utilizado para filtrar la tabla APUNXX.
 * @return {Promise<anio[]>} Una promesa que se resuelve en una matriz de objetos anio.
 */
  public async getAniosApuntes(tipo: string, codigo: string) {
    var anios: anio[] = [];
    let sentencia = "SELECT 'AÑO ' || strftime('%Y', DATE()) AS 'aniodef', strftime('%Y', DATE()) AS 'anioval' UNION ALL SELECT 'AÑO ' || anio AS 'aniodef', anio AS 'anioval' FROM APUNXX WHERE cla='" + tipo + "' AND substr(cue, -6)='" + codigo + "' AND anio <> strftime('%Y', DATE()) GROUP BY anio ORDER BY anio DESC";

    anios = (await this.db.query(sentencia)).values as anio[];

    return anios;
  }

 /**
 * Recupera una lista de estados para un tipo y código dados.
 *
 * @param {string} tipo - El tipo de entidad ('CL' para cliente, 'PR' para proveedor).
 * @param {string} codigo - El código de la entidad.
 * @return {Promise<any[]>} Una promesa que se resuelve en una matriz de estados.
 */
  public async getEstadosPedidos(tipo: string, codigo: string) {
    var estados: any[] = [];
    let sentencia = "";

    switch (tipo) {
      case 'CL':
        sentencia = "SELECT 'Todos' AS id, 'Todos' AS [des] UNION ALL SELECT id, [des] FROM ESTPED WHERE id IN (SELECT est FROM CABPED WHERE cli='" + codigo + "');";
        break;
      case 'PR':
        sentencia = "SELECT 'Todos' AS id, 'Todos' AS [des] UNION ALL SELECT id, [des] FROM ESTPED WHERE id IN (SELECT est FROM CAPEPR WHERE cli='" + codigo + "');";
        break;
    }

    estados = (await this.db.query(sentencia)).values as any[];

    return estados;
  }

 /**
 * Recupera la lista de estados de presupuestos para un código de cliente dado.
 *
 * @param {string} codigo - El código del cliente.
 * @return {Promise<any[]>} Una promesa que se resuelve en una matriz de estados de presupuestos.
 */
  public async getEstadosPresupuestos(codigo: string) {
    var estados: any[] = [];
    let sentencia = "SELECT 'Todos' AS id, 'Todos' AS [des] UNION ALL SELECT id, [des] FROM ESTADO WHERE id IN (SELECT est FROM CABPRE WHERE cli='" + codigo + "');";

    estados = (await this.db.query(sentencia)).values as any[];

    return estados;
  }

  /**
* Recupera las series de un documento específico para un tipo y código dados.
*
* @param {string} tipo - El tipo de documento ('CL' para cliente o 'PR' para proveedor).
 * @param {string} documento - El tipo de documento ('factura', 'albarán', 'pedido', 'presupuesto' o 'efecto').
 * @param {string} codigo - El código asociado al documento.
 * @return {Promise<any[]>} Una promesa que se resuelve en una matriz de series.
 */
  public async getSeriesDocumento(tipo: string, documento: string, codigo: string) {
    var series: any[] = [];
    let sentencia = "";

    switch (documento) {
      case 'factura':

        if (tipo == 'CL') {
          sentencia = "SELECT 'Todas' AS serie UNION ALL SELECT DISTINCT(substr(num,1,2)) AS serie FROM FACEMI WHERE cue ='" + codigo + "'";
        } else {
          sentencia = "SELECT 'Todas' AS serie UNION ALL SELECT DISTINCT(substr(num,1,2)) AS serie FROM FACREC WHERE cue ='" + codigo + "'";
        }

        break;
      case 'albaran':

        if (tipo == 'CL') {
          sentencia = "SELECT 'Todos' AS serie UNION ALL SELECT DISTINCT(substr(num,1,2)) AS serie FROM ALBARA WHERE cli ='" + codigo + "'";
        } else {
          sentencia = "SELECT 'Todos' AS serie UNION ALL SELECT DISTINCT(substr(num,1,2)) AS serie FROM ALBENT WHERE cli ='" + codigo + "'";
        }

        break;
      case 'pedido':

        if (tipo == 'CL') {
          sentencia = "SELECT 'Todos' AS serie UNION ALL SELECT DISTINCT(substr(num,1,2)) AS serie FROM CABPED WHERE cli ='" + codigo + "'";
        } else {
          sentencia = "SELECT 'Todos' AS serie UNION ALL SELECT DISTINCT(substr(num,1,2)) AS serie FROM CAPEPR WHERE cli ='" + codigo + "'";
        }

        break;
      case 'presupuesto':

        sentencia = "SELECT 'Todos' AS serie UNION ALL SELECT DISTINCT(substr(num,1,2)) AS serie FROM CABPRE WHERE cli ='" + codigo + "'";

        break;
      case 'efecto':
        if (tipo == 'CL') {
          sentencia = "SELECT 'Todos' AS serie UNION ALL SELECT DISTINCT(substr(fac,2,2)) AS serie FROM EFECTO WHERE tip = 'C' AND cue ='" + codigo + "'";
        } else {
          sentencia = "SELECT 'Todos' AS serie UNION ALL SELECT DISTINCT(substr(fac,2,2)) AS serie FROM EFECTO WHERE tip = 'P' AND cue ='" + codigo + "'";
        }


        break;
    }

    series = (await this.db.query(sentencia)).values as any[];

    return series;

  }

  /**
  * Recupera la situación de riesgo para un código dado.
  *
  * @param {string} codigo - El código para recuperar la situación de riesgo.
  * @return {Promise<situacionriesgo>} Una promesa que se resuelve con el objeto de situación de riesgo.
  */
  public async getSituacionDeRiesgo(codigo: string) {
    var situacion: situacionriesgo = {};
    let sentencia: string = "SELECT rie, sal, totalb, totped, total, diferencia, nefetot, totefetot, neferem, toteferem, nefepen, totefepen, nefedev, totefedev, nfacpen, totfacpen FROM SITUAC WHERE cod='" + codigo + "';"

    const result = await this.db.query(sentencia);
    if (result.values && result.values.length > 0) {
      situacion = result.values[0] as situacionriesgo;
    }

    return situacion;
  }

  /**
  * Recupera el objeto rentabilidad de la base de datos basado en el código proporcionado.
  *
  * @param {string} codigo - El código utilizado para consultar la base de datos.
  * @return {Promise<rentabilidad>} Una Promesa que se resuelve en el objeto rentabilidad.
  */
  public async getRentabilidad(codigo: string) {
    var rentabilidad: rentabilidad = {};
    let sentencia: string = "SELECT impcom, impven, benefi, besove, besoco FROM RENTAB WHERE cod='" + codigo + "' AND (impcom > 0 OR impven > 0);";

    const result = await this.db.query(sentencia);
    if (result.values && result.values.length > 0) {
      rentabilidad = result.values[0] as rentabilidad;
    }

    return rentabilidad;
  }

  /**
  * Recupera el resumen mensual para un tipo y código dados.
  *
  * @param {string} tipo - El tipo de resumen a recuperar.
  * @param {string} codigo - El código del resumen a recuperar.
  * @return {Promise<resumen>} Una promesa que se resuelve en el objeto de resumen mensual.
  */
  public async getResumenMensual(tipo: string, codigo: string) {
    var resumen: resumen = {};
    let sentencia: string = "SELECT trim1, enero, febrero, marzo, trim2, abril, mayo, junio, trim3, julio, agosto, septiembre, trim4, octubre, noviembre, diciembre, total, trim1iva, eneroiva, febreroiva, marzoiva, trim2iva, abriliva, mayoiva, junioiva, trim3iva, julioiva, agostoiva, septiembreiva, trim4iva, octubreiva, noviembreiva, diciembreiva, totaliva  FROM RESUME WHERE cod='" + codigo + "'AND cla='" + tipo + "';"

    const result = await this.db.query(sentencia);
    if (result.values && result.values.length > 0) {
      resumen = result.values[0] as resumen;
    }

    return resumen;
  }



}
