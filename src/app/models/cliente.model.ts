import { albaranes } from "./albaranes.model";
import { anios } from "./anios.model";
import { banco } from "./banco.model";
import { contacto } from "./contacto.model";
import { direccion } from "./direccion.model";
import { efectos } from "./efectos.model";
import { estados } from "./estados.model";
import { facturas } from "./facturas.model";
import { mayor } from "./mayor.model";
import { pedidos } from "./pedidos.model";
import { presupuestos } from "./presupuestos.model";
import { rentabilidad } from "./rentabilidad.model";
import { situacionriesgo } from "./situacionriesgo.model";

export interface cliente {
    actividad?: string,
    age?: string,
    alv?: string,
    avi0alb?: string,
    avi0dep?: string,
    avi0fac?: string,
    avi0ped?: string,
    avi0pre?: string,
    avi0rec?: string,
    avi1alb?: string,
    avi1fac?: string,
    avi1ped?: string,
    avi1pre?: string,
    avi1rec?: string,
    avi2alb?: string,
    avi2fac?: string,
    avi2ped?: string,
    avi2pre?: string,
    avi2rec?: string,
    avi_alb?: string,
    avi_dep?: string,
    avi_fac?: string,
    avi_ped?: string,
    avi_pre?: string,
    avi_rec?: string,
    c_almnot?: string,
    c_premin?: string,
    c_rep?: string,
    c_sernot?: string,
    c_tipnot?: string,
    car?: string,
    cli_facalb?: string,
    cln_idioma?: string,
    cln_tarmar?: string,
    cln_tarsub?: string,
    cod?: string,
    com?: string,
    cri_caja?: string,
    d1b?: string,
    d2b?: string,
    d3b?: string,
    di1?: string,
    di2?: string,
    di3?: string,
    dias_crm?: string,
    dir?: string,
    doc?: string,
    dt2?: string,
    dto?: string,
    dtorap?: string,
    efactura?: string,
    emailweb?: string,
    env?: string,
    ext?: string,
    fa1?: string,
    fa2?: string,
    fac?: string,
    faceape1?: string,
    faceape2?: string,
    facedir?: string,
    facefoj?: string,
    faceiban?: string,
    facemed?: string,
    facenom?: string,
    facenpro?: string,
    facepais?: string,
    facepob?: string,
    facepol?: string,
    facepro?: string,
    facever?: string,
    fax?: string,
    fcr_crm?: string,
    fec_man?: string,
    fgl?: string,
    fin?: string,
    fna_crm?: string,
    fo2?: string,
    for?: string,
    fot?: string,
    fpd?: string,
    ftr_crm?: string,
    historia?: string,
    id?: string,
    ifg?: string,
    imp?: string,
    imprap?: string,
    inc?: string,
    ivainc?: string,
    lla_crm?: string,
    lopd_ces?: string,
    lopd_ori?: string,
    lopd_otr_c?: string,
    lopd_otr_o?: string,
    m30?: string,
    mar?: string,
    mnb?: string,
    mnp?: string,
    moneda?: string,
    mov?: string,
    nco?: string,
    nif?: string,
    nom?: string,
    npro?: string,
    ob1?: string,
    ob2?: string,
    obs_doc?: string,
    pais?: string,
    per?: string,
    perrap?: string,
    pll_crm?: string,
    pob?: string,
    por_efac?: string,
    pro?: string,
    pvi_crm?: string,
    red?: string,
    rediva1?: string,
    rediva2?: string,
    rediva3?: string,
    rediva4?: string,
    rediva5?: string,
    ref_crm?: string,
    req?: string,
    ret?: string,
    rie?: string,
    ru1_crm?: string,
    ru2_crm?: string,
    ru3_crm?: string,
    rut?: string,
    sec_crm?: string,
    sincro?: string,
    sno?: string,
    tar?: string,
    tar_art?: string,
    tar_fam?: string,
    tco_crm?: string,
    te1?: string,
    te2?: string,
    ter?: string,
    tia?: string,
    tip_crm?: string,
    tip_rem?: string,
    tpl_crm?: string,
    tra?: string,
    tre?: string,
    v01?: string,
    v02?: string,
    v03?: string,
    v04?: string,
    v05?: string,
    v06?: string,
    v07?: string,
    v08?: string,
    v09?: string,
    v10?: string,
    v11?: string,
    v12?: string,
    vis_crm?: string,
    vto?: string,
    web?: string,
    web_acc?: string,
    web_codact?: string,
    web_exepor?: string,
    web_psw?: string,
    xxx?: string,    
    activo?:string,
    riesgo?:string,
    total?:string
}

