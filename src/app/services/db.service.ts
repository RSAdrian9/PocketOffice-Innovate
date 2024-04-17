import { Injectable } from '@angular/core';
import { CapacitorSQLite, CapacitorSQLitePlugin, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

import { clienteTmp } from '../models/clienteTmp';
import { proveedorTmp } from '../models/proveedorTmp.model';
import { FilesystemService } from './filesystem.service';
import { direccion } from '../models/direccion.model';
import { banco } from '../models/banco.model';
import { contacto } from '../models/contacto.model';
import { facturas } from '../models/facturas.model';
import { albaranes } from '../models/albaranes.model';
import { presupuestos } from '../models/presupuestos.model';
import { pedidos } from '../models/pedidos.model';
import { efectos } from '../models/efectos.model';
import { mayor } from '../models/mayor.model';
import { situacionriesgo } from '../models/situacionriesgo.model';
import { rentabilidad } from '../models/rentabilidad.model';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  sqliteConnection!: SQLiteConnection;
  isService: boolean = false;
  platform!: string;
  sqlitePlugin!: CapacitorSQLitePlugin;
  native: boolean = false;
  loadToVersion: number = 1;
  nombreDB: string = 'oficinavirtual.db';
  directorioDB: string = 'io.ionic.appEmpresa';

  db!: SQLiteDBConnection;

  constructor(private filesystemService: FilesystemService) { }

  async initializePlugin(): Promise<boolean> {
    this.platform = Capacitor.getPlatform();
    if (this.platform === 'ios' || this.platform === 'android') this.native = true;
    this.sqlitePlugin = CapacitorSQLite;
    this.sqliteConnection = new SQLiteConnection(this.sqlitePlugin);
    this.isService = true;

    this.filesystemService.copiarBBDDExternaAInterna(this.nombreDB).then(() => {
      this.moverBBDDAInterna().then(() => {
        this.connectDatabase();
      })
    })

    return true;
  }

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

  async moverBBDDAInterna() {
    this.sqlitePlugin.moveDatabasesAndAddSuffix({ folderPath: Directory.External, dbNameList: [this.nombreDB] });
  }

  async connectDatabase() {
    this.db = await this.openDatabase(
      this.nombreDB,
      false,
      'no-encryption',
      this.loadToVersion,
      false
    );
  }

  devuelveListaBBDD() {
    let BBDDs = this.sqliteConnection.getDatabaseList();

    console.log(BBDDs);
  }

  async testConsulta() {
    const test: any[] = (await this.db.query("SELECT name FROM sqlite_schema WHERE type ='table' ")).values as any[];

    console.log(test);
  }

  public async getNombreCliente(codigo: string) {
    var nombre: string = '';
    var sentencia = "SELECT nom FROM CLIENT WHERE cod='" + codigo + "';";
    const result = await this.db.query(sentencia);

    if (result.values && result.values.length > 0) {
      nombre = result.values[0].nom;
    }
    return nombre;
  }

  public async getNombreProveedor(codigo: string) {
    var nombre: string = '';
    var sentencia = "SELECT nom FROM PROVEE WHERE cod='" + codigo + "';";
    const result = await this.db.query(sentencia);

    if (result.values && result.values.length > 0) {
      nombre = result.values[0].nom;
    }
    return nombre;
  }

  public async getClientesParaLista(filtro: string) {
    var clientes: clienteTmp[] = [];
    var sentencia = "SELECT t1.id, t1.cod, t1.nom, t1.historia, (SELECT COUNT(cod) FROM CLIENT WHERE (cod IN (SELECT cli FROM ALBARA WHERE strftime('%Y', fec)=strftime('%Y',DATE('now'))) OR cod IN (SELECT cli FROM CABPRE WHERE strftime('%Y',fec)=strftime('%Y',DATE('now'))) OR cod IN (SELECT cue FROM FACEMI WHERE strftime('%Y',fee)=strftime('%Y',DATE('now')))) AND cod = t1.cod) AS activo, (SELECT rie FROM SITUAC AS t2 WHERE t1.cod=t2.cod) AS riesgo, (SELECT total FROM SITUAC AS t2 WHERE t1.cod=t2.cod) AS totalimp FROM CLIENT AS t1 " + filtro + " ORDER BY t1.nom ";

    clientes = (await this.db.query(sentencia)).values as clienteTmp[];

    return clientes;
  }

  public async getCliente(codigo: string) {

    var cliente: any;
    var sentencia = "SELECT t1.id, t1.cod, t1.nom, t1.sno, t1.dir, t1.pob, t1.npro, t1.pro, t1.nif, t1.te1, t1.te2, t1.fax, t1.mov, t1.per, t1.car, t1.ter, t1.req, t1.red, t1.dto, t1.com, t1.fin, t1.fac, t1.tar, t1.for||' - '||(SELECT nom FROM FORPAG WHERE id=t1.for) AS 'for', t1.di1, t1.di2, t1.di3, t1.mnp, t1.m30, t1.vto, t1.inc, t1.rie,  t1.rut||' - '||(SELECT nom FROM RUTASV WHERE id=t1.rut) AS 'rut', t1.age||' - '||(SELECT nom FROM AGENTG WHERE id=t1.age) AS 'age', t1.nco, t1.alv, t1.fa1, t1.fa2, t1.tra, t1.mar, t1.dt2, t1.tia, t1.fo2||' - '||(SELECT nom FROM FORPAG WHERE id=t1.fo2) AS 'fo2', t1.d1b, t1.d2b, t1.d3b, t1.mnb, t1.imp, t1.tre, t1.ret, t1.fgl, t1.ifg, t1.web, t1.doc, t1.fpd, t1.pais, t1.ext, t1.ob1, t1.ob2, t1.rediva1, t1.rediva2, t1.rediva3, t1.rediva4, t1.rediva5, t1.avi0ped, t1.avi1ped, t1.avi2ped, t1.avi0alb, t1.avi1alb, t1.avi2alb, t1.avi0fac, t1.avi1fac, t1.avi2fac, t1.avi0rec, t1.avi1rec, t1.avi2rec, t1.avi0pre, t1.avi1pre, t1.avi2pre, t1.ivainc,  t1.fot, t1.env, t1.xxx, t1.fcr_crm, t1.tip_crm||' - '||(SELECT nom FROM TIPCLI WHERE id=t1.tip_crm) AS 'tip_crm', t1.ftr_crm, t1.tco_crm, t1.ref_crm, t1.vis_crm, t1.pvi_crm, t1.lla_crm, t1.pll_crm, t1.ru1_crm, t1.ru2_crm, t1.ru3_crm, t1.sec_crm, t1.dias_crm, t1.tpl_crm, t1.fna_crm, t1.imprap, t1.dtorap, t1.tar_art||' - '||(SELECT nom FROM CATAAR WHERE cod=t1.tar_art) AS 'tar_art', t1.tar_fam||' - '||(SELECT nom FROM CATAFA WHERE cod=t1.tar_fam) AS 'tar_fam', t1.efactura, t1.perrap, t1.facedir, t1.facepob, t1.facenpro, t1.facepro, t1.facepais, t1.facenom, t1.faceape1, t1.faceape2, t1.facefoj, t1.v01, t1.v02, t1.v03, t1.v04, t1.v05, t1.v06, t1.v07, t1.v08, t1.v09, t1.v10, t1.v11, t1.v12, t1.historia, t1.lopd_ori, t1.lopd_otr_o, t1.lopd_ces, t1.lopd_otr_c, t1.cli_facalb||' - '||(SELECT nom FROM CLIENT WHERE cod =t1.cli_facalb) AS 'cli_facalb', t1.cln_tarsub||' - '||(SELECT nom FROM CATASU WHERE cod=t1.cln_tarsub) AS 'cln_tarsub', t1.cln_tarmar||' - '||(SELECT nom FROM CATAMA WHERE cod=t1.cln_tarmar) AS 'cln_tarmar', t1.cln_idioma, t1.moneda, t1.avi0dep, t1.avi_dep, t1.avi_ped, t1.avi_pre, t1.avi_alb, t1.avi_fac, t1.avi_rec, t1.web_acc, t1.web_psw, t1.obs_doc, t1.actividad, t1.emailweb, t1.web_exepor, t1.tip_rem, t1.fec_man, t1.cri_caja, t1.facemed, t1.faceiban, t1.facever, t1.facepol, t1.por_efac, t1.web_codact, t1.sincro, (SELECT COUNT(cod) FROM CLIENT WHERE (cod IN (SELECT cli FROM ALBARA WHERE strftime('%Y', fec)=strftime('%Y',DATE('now'))) OR cod IN (SELECT cli FROM CABPRE WHERE strftime('%Y',fec)=strftime('%Y',DATE('now'))) OR cod IN (SELECT cue FROM FACEMI WHERE strftime('%Y',fee)=strftime('%Y',DATE('now')))) AND cod = t1.cod) AS activo FROM CLIENT AS t1 WHERE cod = '" + codigo + "' ";

    const result = await this.db.query(sentencia);
    if (result.values && result.values.length > 0) {
      cliente = result.values[0];
    }

    return cliente;
  }

  public async getProveedoresParaLista(filtro: string) {
    var proveedores: proveedorTmp[] = [];
    var sentencia = "SELECT t1.id, t1.cod, t1.nom, t1.historia, (SELECT COUNT(cod) FROM CLIENT WHERE (cod IN (SELECT cli FROM ALBARA WHERE strftime('%Y', fec)=strftime('%Y',DATE('now'))) OR cod IN (SELECT cli FROM CABPRE WHERE strftime('%Y',fec)=strftime('%Y',DATE('now'))) OR cod IN (SELECT cue FROM FACEMI WHERE strftime('%Y',fee)=strftime('%Y',DATE('now')))) AND cod = t1.cod) AS activo, (SELECT rie FROM SITUAC AS t2 WHERE t1.cod=t2.cod) AS riesgo, (SELECT total FROM SITUAC AS t2 WHERE t1.cod=t2.cod) AS totalimp FROM CLIENT AS t1 " + filtro + " ORDER BY t1.nom ";

    proveedores = (await this.db.query(sentencia)).values as proveedorTmp[];

    return proveedores;
  }

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
  public async getContactos(tipo: string, codigo: string) {
    var contactos: contacto[] = [];
    var sentencia = "SELECT * FROM CONTAC WHERE cod='" + codigo + "' AND cla='" + tipo + "';";

    contactos = (await this.db.query(sentencia)).values as contacto[];

    return contactos;
  }

  public async getDirecciones(tipo: string, codigo: string) {
    var direcciones: direccion[] = [];
    var sentencia = "SELECT * FROM DIRECC WHERE cod='" + codigo + "' AND cla='" + tipo + "';";

    direcciones = (await this.db.query(sentencia)).values as direccion[];

    return direcciones;

  }

  public async getBancos(tipo: string, codigo: string) {
    var bancos: banco[] = [];
    var sentencia = "SELECT DATBAN.*, ENTIDA.nom FROM DATBAN LEFT JOIN ENTIDA ON DATBAN.cu1=ENTIDA.cod WHERE DATBAN.cod='" + codigo + "' AND DATBAN.cla='" + tipo + "';";

    bancos = (await this.db.query(sentencia)).values as banco[];

    return bancos;
  }

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

  public async getListadoFacturas(tipo: string, codigo: string, filtro: string) {
    var facturas: facturas[] = [];
    let sentencia: string;

    if (tipo == 'CL') {
      sentencia = "SELECT num, strftime('%d/%m/%Y',fee) AS fee2, basmon, totmon, toceu, totimpu, impend, est, pdf,IIF(pdf=1,'https://appgp.mjhudesings.com/documentos/clientes/'||cue||'/FACTURA NUMERO '||REPLACE(num,'/','-')||'.PDF','') AS rutapdf FROM FACEMI WHERE cue='" + codigo + "' ORDER BY fee DESC;"
    } else {
      sentencia = "SELECT num, numpro, strftime('%d/%m/%Y',fee) AS fee2, basmon, totmon, toceu, totimpu, impend, est, pdf,IIF(pdf=1,'https://appgp.mjhudesings.com/documentos/proveedores/'||cue||'/FACTURA NUMERO '||REPLACE(num,'/','-')||'.PDF','') AS rutapdf FROM FACREC WHERE cue='" + codigo + "' ORDER BY fee DESC;"
    }

    facturas = (await this.db.query(sentencia)).values as facturas[];

    return facturas;
  }

  public async getListadoAlbaranes(tipo: string, codigo: string, filtro: string) {
    var albaranes: albaranes[] = [];
    let sentencia: string;

    if (tipo == 'CL') {
      sentencia = "SELECT num, fac, n_f, strftime('%d/%m/%Y',fec) AS fec2, baseu, toteu, cobeu, totimpu, impend, est, pdf,IIF(pdf=1,'https://appgp.mjhudesings.com/documentos/clientes/'||cli||'/ALBARAN NUMERO '||REPLACE(num,'/','-')||'.PDF','') AS rutapdf FROM ALBARA WHERE cli='" + codigo + "' ORDER BY fec DESC;"
    } else {
      sentencia = "SELECT num, fac, apr AS numpro, n_f, strftime('%d/%m/%Y',fec) AS fec2,baseu, toteu, cobeu, totimpu, impend, est, pdf,IIF(pdf=1,'https://appgp.mjhudesings.com/documentos/proveedores/'||cli||'/ALBARAN NUMERO '||REPLACE(num,'/','-')||'.PDF','') AS rutapdf FROM ALBENT WHERE cli='" + codigo + "' ORDER BY fec DESC;"
    }

    albaranes = (await this.db.query(sentencia)).values as albaranes[];

    return albaranes;
  }

  public async getListadoPresupuestos(codigo: string, filtro: string) {
    var presupuestos: presupuestos[] = [];
    let sentencia: string = "SELECT num, lit AS des, IIF(aof='F','FACTURA '||doc,IIF(aof='A','ALBARÁN '||doc,'')) AS doc, strftime('%d/%m/%Y',fec) AS fec2, baseu, toteu, totimpu, (SELECT des FROM ESTADO WHERE id=est) AS est, pdf,IIF(pdf=1,'https://appgp.mjhudesings.com/documentos/clientes/'||cli||'/PRESUPUESTO NUMERO '||REPLACE(num,'/','-')||'.PDF','') AS rutapdf FROM CABPRE WHERE cli='" + codigo + "' ORDER BY fec DESC;";

    presupuestos = (await this.db.query(sentencia)).values as presupuestos[];

    return presupuestos;
  }

  public async getListadoPedidos(tipo: string, codigo: string, filtro: string) {
    var pedidos: pedidos[] = [];
    let sentencia: string;

    if (tipo == 'CL') {
      sentencia = "SELECT num, IIF(aof='F','FACTURA '||doc,IIF(aof='A','ALBARÁN '||doc,'')) AS doc, strftime('%d/%m/%Y',fec) AS fec2, baseu, toteu, totimpu, IFNULL((SELECT des FROM ESTADO WHERE id=est),'') AS est, ser, pdf,IIF(pdf=1,'https://appgp.mjhudesings.com/documentos/clientes/'||cli||'/PEDIDO NUMERO '||REPLACE(num,'/','-')||'.PDF','') AS rutapdf FROM CABPED WHERE cli='" + codigo + "' ORDER BY fec DESC;"
    } else {
      sentencia = "SELECT num, IIF(aof='F','FACTURA '||doc,IIF(aof='A','ALBARÁN '||doc,'')) AS doc, strftime('%d/%m/%Y',fec) AS fec2, baseu, toteu, totimpu, ser, pdf,IIF(pdf=1,'https://appgp.mjhudesings.com/documentos/clientes/'||cli||'/PEDIDO NUMERO '||REPLACE(num,'/','-')||'.PDF','') AS rutapdf FROM CAPEPR WHERE cli='" + codigo + "' ORDER BY fec DESC;"
    }

    pedidos = (await this.db.query(sentencia)).values as pedidos[];

    return pedidos;
  }

  public async getListadoEfectos(tipo: string, codigo: string, filtro: string) {
    var efectos: efectos[] = [];
    let sentencia: string = "SELECT num, SUBSTR(fac,3,9) AS fac, strftime('%d/%m/%Y',fec) AS fec2, (SELECT des FROM BANCOS WHERE cue= ban) AS ban, strftime('%d/%m/%Y',vto) AS vto, rem, IIF(dev='S', 'DEVUELTO',IIF(dev='N','NO DEVUELTO','NO DEVUELTO')) AS dev, impeu, pageu, impend, ((SELECT nom FROM ENTIDA WHERE cod=cu1)||' '||cu1||' '||cu2||' '||cu3||' '|| cu4) AS banefe, IIF(efe_tipagr='A', 'EFECTO AGRUPADO', IIF(efe_tipagr='G','EFECTO DE AGRUPACIÓN', 'NINGUNA')) AS efe_tipagr, efe_docagr, est FROM EFECTO WHERE cue='" + codigo + "' AND  tip = '" + tipo + "' ORDER BY fec DESC;";

    efectos = (await this.db.query(sentencia)).values as efectos[];

    return efectos;
  }

  public async getListadoMayorDeCuentas(tipo: string, codigo: string, filtro: string) {
    var lineasMayor: mayor[] = [];
    let sentencia: string = "SELECT num, con, strftime('%d/%m/%Y',fec) AS fec2, cla, sig, impeu , deb, hab, sal, 'AÑO '||anio AS anio2 FROM APUNXX WHERE SUBSTR(cue,-6)='" + codigo + "'  AND cla = '" + tipo + "' ORDER BY anio DESC, num;"

    lineasMayor = (await this.db.query(sentencia)).values as mayor[];

    return lineasMayor;
  }

  public async getSituacionDeRiesgo(codigo: string) {
    var situacion: situacionriesgo = {};
    let sentencia: string = "SELECT rie, sal, totalb, totped, total, diferencia, nefetot, totefetot, neferem, toteferem, nefepen, totefepen, nefedev, totefedev, nfacpen, totfacpen FROM SITUAC WHERE cod='" + codigo + "';"

    const result = await this.db.query(sentencia);
    if (result.values && result.values.length > 0) {
      situacion = result.values[0] as situacionriesgo;
    }

    return situacion;
  }

  public async getRentabilidad(codigo: string) {
    var rentabilidad: rentabilidad = {};
    let sentencia: string = "SELECT impcom, impven, benefi, besove, besoco FROM RENTAB WHERE cod='" + codigo + "' AND (impcom > 0 OR impven > 0);";

    const result = await this.db.query(sentencia);
    if (result.values && result.values.length > 0) {
      rentabilidad = result.values[0] as rentabilidad;
    }

    return rentabilidad;
  }

  public async getResumenMensual(tipo: string, codigo: string) {
    var resumen: any = {};
    let sentencia: string = "SELECT trim1, trim2, trim3, trim4, total, trim1iva, trim2iva, trim3iva, trim4iva, totaliva  FROM RESUME WHERE cod='" + codigo + "'AND cla='" + tipo + "';"

    const result = await this.db.query(sentencia);
    if (result.values && result.values.length > 0) {
      resumen = result.values[0] as any;
    }

    return resumen;
  }



}
