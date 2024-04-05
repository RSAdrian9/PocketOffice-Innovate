import { albaranes } from "./albaranes.model";
import { banco } from "./banco.model";
import { contacto } from "./contacto.model";
import { direccion } from "./direccion.model";
import { efectos } from "./efectos.model";
import { estados } from "./estados.model";
import { facturas } from "./facturas.model";
import { mayor } from "./mayor.model";
import { pedidos } from "./pedidos.model";


export interface proveedor {
    actividad?:string,
    autof?:string,
    avi0alb?:string,
    avi0fac?:string,
    avi0ped?:string,
    avi0rec?:string,
    avi1alb?:string,
    avi1fac?:string,
    avi1ped?:string,
    avi1rec?:string,
    avi2alb?:string,
    avi2fac?:string,
    avi2ped?:string,
    avi2rec?:string,
    avi_alb?:string,
    avi_fac?:string,
    avi_ped?:string,
    avi_rec?:string,
    bancos?:banco[],
    car?:string,
    cer_cal?:string,
    cer_med?:string,
    cer_pre?:string,
    cod?:string,
    contactos?:contacto[],
    contrato?:string,
    cri_caja?:string,
    ctg?:string,
    di1?:string,
    di2?:string,
    di3?:string,
    diasmax?:string,
    dir?:string,
    direcciones?:direccion[],
    doc?:string,
    dt2?:string,
    dto?:string,
    dtorap?:string,
    ext?:string,
    fax?:string,
    fec_apro?:string,
    fec_eval?:string,
    for?:string,
    fot?:string,
    historia?:string,
    id?:string,
    imprap?:string,
    ivainc?:string,
    lopd_ces?:string,
    lopd_ori?:string,
    lopd_otr_c?:string,
    lopd_otr_o?:string,
    mar?:string,
    mnp?:string,
    moneda?: 1
    mov?:string,
    nif?:string,
    nom?:string,
    nota_eval?:string,
    npro?:string,
    ob1?:string,
    ob2?:string,
    ob3?:string,
    obs_cal?:string,
    pais?:string,
    per?:string,
    perrap?:string,
    perval?:string,
    poa?:string,
    pob?:string,
    por?:string,
    pro?:string,
    pro_idioma?:string,
    product1?:string,
    product2?:string,
    red?:string,
    rediva1?:string,
    rediva2?:string,
    rediva3?:string,
    rediva4?:string,
    rediva5?:string,
    res_eval?:string,
    ret?:string,
    te1?:string,
    te2?:string,
    ter?:string,
    tia?:string,
    tip_rem?:string,
    tre?: string,
    v01?:string,
    v02?:string,
    v03?:string,
    v04?:string,
    v05?:string,
    v06?:string,
    v07?:string,
    v08?:string,
    v09?:string,
    v10?:string,
    v11?:string,
    v12?:string,
    web?:string,
    xxx?:string,
    facturas?:facturas[],
    albaranes?: albaranes[],
    pedidos?:pedidos[],
    estados?:estados[],
    efectos?: efectos[],
    mayor?: mayor[],

}