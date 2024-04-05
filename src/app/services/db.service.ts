import { Injectable } from '@angular/core';
import { CapacitorSQLite, CapacitorSQLitePlugin, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

import { clienteTmp } from '../models/clienteTmp';
import { proveedorTmp } from '../models/proveedorTmp.model';

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

  constructor() { }

  async initializePlugin(): Promise<boolean> {
    this.platform = Capacitor.getPlatform();
    if (this.platform === 'ios' || this.platform === 'android') this.native = true;
    this.sqlitePlugin = CapacitorSQLite;
    this.sqliteConnection = new SQLiteConnection(this.sqlitePlugin);
    this.isService = true;

    this.copiarBBDDExternaAInterna().then(()=>{
      this.moverBBDDAInterna().then(()=>{
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

  async copiarBBDDExternaAInterna() {

    const fileExists = await Filesystem.readFile({
      path: this.nombreDB,
      directory: Directory.External
    });

    const internalDatabasePath = this.nombreDB;

    await Filesystem.writeFile({
      path: internalDatabasePath,
      data: fileExists.data,
      directory: Directory.Data
    })
  }

  async moverBBDDAInterna(){
    this.sqlitePlugin.moveDatabasesAndAddSuffix({folderPath: Directory.External, dbNameList: [this.nombreDB]});  
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

  public async getClientesParaLista(filtro: string) {
    var clientes: clienteTmp[] = [];
    var sentencia = "SELECT t1.id, t1.cod, t1.nom, t1.historia, (SELECT COUNT(cod) FROM CLIENT WHERE (cod IN (SELECT cli FROM ALBARA WHERE strftime('%Y', fec)=strftime('%Y',DATE('now'))) OR cod IN (SELECT cli FROM CABPRE WHERE strftime('%Y',fec)=strftime('%Y',DATE('now'))) OR cod IN (SELECT cue FROM FACEMI WHERE strftime('%Y',fee)=strftime('%Y',DATE('now')))) AND cod = t1.cod) AS activo, (SELECT rie FROM SITUAC AS t2 WHERE t1.cod=t2.cod) AS riesgo, (SELECT total FROM SITUAC AS t2 WHERE t1.cod=t2.cod) AS totalimp FROM CLIENT AS t1 "+filtro+" ORDER BY t1.nom ";
    
    clientes = (await this.db.query(sentencia)).values as clienteTmp[];
    
    return clientes;
  }

  public async getCliente(codigo: string) {
   
    var cliente: any;
    var sentencia = "SELECT t1.id, t1.cod, t1.nom, t1.sno, t1.dir, t1.pob, t1.npro, t1.pro, t1.nif, t1.te1, t1.te2, t1.fax, t1.mov, t1.per, t1.car, t1.ter, t1.req, t1.red, t1.dto, t1.com, t1.fin, t1.fac, t1.tar, t1.for||' - '||(SELECT nom FROM FORPAG WHERE id=t1.for) AS 'for', t1.di1, t1.di2, t1.di3, t1.mnp, t1.m30, t1.vto, t1.inc, t1.rie,  t1.rut||' - '||(SELECT nom FROM RUTASV WHERE id=t1.rut) AS 'rut', t1.age||' - '||(SELECT nom FROM AGENTG WHERE id=t1.age) AS 'age', t1.nco, t1.alv, t1.fa1, t1.fa2, t1.tra, t1.mar, t1.dt2, t1.tia, t1.fo2||' - '||(SELECT nom FROM FORPAG WHERE id=t1.fo2) AS 'fo2', t1.d1b, t1.d2b, t1.d3b, t1.mnb, t1.imp, t1.tre, t1.ret, t1.fgl, t1.ifg, t1.web, t1.doc, t1.fpd, t1.pais, t1.ext, t1.ob1, t1.ob2, t1.rediva1, t1.rediva2, t1.rediva3, t1.rediva4, t1.rediva5, t1.avi0ped, t1.avi1ped, t1.avi2ped, t1.avi0alb, t1.avi1alb, t1.avi2alb, t1.avi0fac, t1.avi1fac, t1.avi2fac, t1.avi0rec, t1.avi1rec, t1.avi2rec, t1.avi0pre, t1.avi1pre, t1.avi2pre, t1.ivainc,  t1.fot, t1.env, t1.xxx, t1.fcr_crm, t1.tip_crm||' - '||(SELECT nom FROM TIPCLI WHERE id=t1.tip_crm) AS 'tip_crm', t1.ftr_crm, t1.tco_crm, t1.ref_crm, t1.vis_crm, t1.pvi_crm, t1.lla_crm, t1.pll_crm, t1.ru1_crm, t1.ru2_crm, t1.ru3_crm, t1.sec_crm, t1.dias_crm, t1.tpl_crm, t1.fna_crm, t1.imprap, t1.dtorap, t1.tar_art||' - '||(SELECT nom FROM CATAAR WHERE cod=t1.tar_art) AS 'tar_art', t1.tar_fam||' - '||(SELECT nom FROM CATAFA WHERE cod=t1.tar_fam) AS 'tar_fam', t1.efactura, t1.perrap, t1.facedir, t1.facepob, t1.facenpro, t1.facepro, t1.facepais, t1.facenom, t1.faceape1, t1.faceape2, t1.facefoj, t1.v01, t1.v02, t1.v03, t1.v04, t1.v05, t1.v06, t1.v07, t1.v08, t1.v09, t1.v10, t1.v11, t1.v12, t1.historia, t1.lopd_ori, t1.lopd_otr_o, t1.lopd_ces, t1.lopd_otr_c, t1.cli_facalb||' - '||(SELECT nom FROM CLIENT WHERE cod =t1.cli_facalb) AS 'cli_facalb', t1.cln_tarsub||' - '||(SELECT nom FROM CATASU WHERE cod=t1.cln_tarsub) AS 'cln_tarsub', t1.cln_tarmar||' - '||(SELECT nom FROM CATAMA WHERE cod=t1.cln_tarmar) AS 'cln_tarmar', t1.cln_idioma, t1.moneda, t1.avi0dep, t1.avi_dep, t1.avi_ped, t1.avi_pre, t1.avi_alb, t1.avi_fac, t1.avi_rec, t1.web_acc, t1.web_psw, t1.obs_doc, t1.actividad, t1.emailweb, t1.web_exepor, t1.tip_rem, t1.fec_man, t1.cri_caja, t1.facemed, t1.faceiban, t1.facever, t1.facepol, t1.por_efac, t1.web_codact, t1.sincro, (SELECT COUNT(cod) FROM CLIENT WHERE (cod IN (SELECT cli FROM ALBARA WHERE strftime('%Y', fec)=strftime('%Y',DATE('now'))) OR cod IN (SELECT cli FROM CABPRE WHERE strftime('%Y',fec)=strftime('%Y',DATE('now'))) OR cod IN (SELECT cue FROM FACEMI WHERE strftime('%Y',fee)=strftime('%Y',DATE('now')))) AND cod = t1.cod) AS activo FROM CLIENT AS t1 WHERE cod = '"+codigo+"' ";
   
    const result = await this.db.query(sentencia);
    if (result.values && result.values.length > 0) {
      cliente  = result.values[0];
    }
    
    return cliente;
  }

  public async getProveedoresParaLista(filtro: string) {
    var proveedores: proveedorTmp[] = [];
    var sentencia = "SELECT t1.id, t1.cod, t1.nom, t1.historia, (SELECT COUNT(cod) FROM CLIENT WHERE (cod IN (SELECT cli FROM ALBARA WHERE strftime('%Y', fec)=strftime('%Y',DATE('now'))) OR cod IN (SELECT cli FROM CABPRE WHERE strftime('%Y',fec)=strftime('%Y',DATE('now'))) OR cod IN (SELECT cue FROM FACEMI WHERE strftime('%Y',fee)=strftime('%Y',DATE('now')))) AND cod = t1.cod) AS activo, (SELECT rie FROM SITUAC AS t2 WHERE t1.cod=t2.cod) AS riesgo, (SELECT total FROM SITUAC AS t2 WHERE t1.cod=t2.cod) AS totalimp FROM CLIENT AS t1 "+filtro+" ORDER BY t1.nom ";
    
    proveedores = (await this.db.query(sentencia)).values as proveedorTmp[];
    
    return proveedores;
  }

  public async getProveedor(codigo: string) {
   
    var cliente: any;
    var sentencia = "SELECT t1.id, t1.cod, t1.nom, t1.sno, t1.dir, t1.pob, t1.npro, t1.pro, t1.nif, t1.te1, t1.te2, t1.fax, t1.mov, t1.per, t1.car, t1.ter, t1.req, t1.red, t1.dto, t1.com, t1.fin, t1.fac, t1.tar, t1.for||' - '||(SELECT nom FROM FORPAG WHERE id=t1.for) AS 'for', t1.di1, t1.di2, t1.di3, t1.mnp, t1.m30, t1.vto, t1.inc, t1.rie,  t1.rut||' - '||(SELECT nom FROM RUTASV WHERE id=t1.rut) AS 'rut', t1.age||' - '||(SELECT nom FROM AGENTG WHERE id=t1.age) AS 'age', t1.nco, t1.alv, t1.fa1, t1.fa2, t1.tra, t1.mar, t1.dt2, t1.tia, t1.fo2||' - '||(SELECT nom FROM FORPAG WHERE id=t1.fo2) AS 'fo2', t1.d1b, t1.d2b, t1.d3b, t1.mnb, t1.imp, t1.tre, t1.ret, t1.fgl, t1.ifg, t1.web, t1.doc, t1.fpd, t1.pais, t1.ext, t1.ob1, t1.ob2, t1.rediva1, t1.rediva2, t1.rediva3, t1.rediva4, t1.rediva5, t1.avi0ped, t1.avi1ped, t1.avi2ped, t1.avi0alb, t1.avi1alb, t1.avi2alb, t1.avi0fac, t1.avi1fac, t1.avi2fac, t1.avi0rec, t1.avi1rec, t1.avi2rec, t1.avi0pre, t1.avi1pre, t1.avi2pre, t1.ivainc,  t1.fot, t1.env, t1.xxx, t1.fcr_crm, t1.tip_crm||' - '||(SELECT nom FROM TIPCLI WHERE id=t1.tip_crm) AS 'tip_crm', t1.ftr_crm, t1.tco_crm, t1.ref_crm, t1.vis_crm, t1.pvi_crm, t1.lla_crm, t1.pll_crm, t1.ru1_crm, t1.ru2_crm, t1.ru3_crm, t1.sec_crm, t1.dias_crm, t1.tpl_crm, t1.fna_crm, t1.imprap, t1.dtorap, t1.tar_art||' - '||(SELECT nom FROM CATAAR WHERE cod=t1.tar_art) AS 'tar_art', t1.tar_fam||' - '||(SELECT nom FROM CATAFA WHERE cod=t1.tar_fam) AS 'tar_fam', t1.efactura, t1.perrap, t1.facedir, t1.facepob, t1.facenpro, t1.facepro, t1.facepais, t1.facenom, t1.faceape1, t1.faceape2, t1.facefoj, t1.v01, t1.v02, t1.v03, t1.v04, t1.v05, t1.v06, t1.v07, t1.v08, t1.v09, t1.v10, t1.v11, t1.v12, t1.historia, t1.lopd_ori, t1.lopd_otr_o, t1.lopd_ces, t1.lopd_otr_c, t1.cli_facalb||' - '||(SELECT nom FROM CLIENT WHERE cod =t1.cli_facalb) AS 'cli_facalb', t1.cln_tarsub||' - '||(SELECT nom FROM CATASU WHERE cod=t1.cln_tarsub) AS 'cln_tarsub', t1.cln_tarmar||' - '||(SELECT nom FROM CATAMA WHERE cod=t1.cln_tarmar) AS 'cln_tarmar', t1.cln_idioma, t1.moneda, t1.avi0dep, t1.avi_dep, t1.avi_ped, t1.avi_pre, t1.avi_alb, t1.avi_fac, t1.avi_rec, t1.web_acc, t1.web_psw, t1.obs_doc, t1.actividad, t1.emailweb, t1.web_exepor, t1.tip_rem, t1.fec_man, t1.cri_caja, t1.facemed, t1.faceiban, t1.facever, t1.facepol, t1.por_efac, t1.web_codact, t1.sincro, (SELECT COUNT(cod) FROM CLIENT WHERE (cod IN (SELECT cli FROM ALBARA WHERE strftime('%Y', fec)=strftime('%Y',DATE('now'))) OR cod IN (SELECT cli FROM CABPRE WHERE strftime('%Y',fec)=strftime('%Y',DATE('now'))) OR cod IN (SELECT cue FROM FACEMI WHERE strftime('%Y',fee)=strftime('%Y',DATE('now')))) AND cod = t1.cod) AS activo FROM CLIENT AS t1 WHERE cod = '"+codigo+"' ";
   
    const result = await this.db.query(sentencia);
    if (result.values && result.values.length > 0) {
      cliente  = result.values[0];
    }
    
    return cliente;
  }
}
