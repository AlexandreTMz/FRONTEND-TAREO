export interface IPermissionsModules {
  name: string;
  permission: IPermission[];
}

export interface IPermission {
  id_spermiso: string;
  sp_nombre: string;
  id_mpermiso: string;
  hasPermission: boolean;
}
export interface IUser {
  id_persona: string;
  datos: string;
  id_usuario: string;
  id_tpusuario: string;
  us_usuario: string;
  tpu_descripcion: string;
  us_contrasenia: string;
  phc_foto_perfil: string;
  permission: IPermissionsModules[];
  estado?: string;
  pe_perfil?: string;
}

export interface IBank {
  ba_abreviatura: string;
  ba_descripcion: string;
  ba_estado: string;
  ba_nombre: string;
  datos: string;
  estado: string;
  id_banco: string;
}

export interface ITpDocument {
  id_tpdocumento: string;
  tpd_estado: string;
  tpd_descripcion: string;
  tpd_abreviatura: string;
  tpd_longitud: number;
  estado: string;
  datos: string;
  action?: number;
}
export interface ISede extends ILogTable {
  datos: string;
  estado: string;
  id_sede: string;
  se_cantidad: string;
  se_descripcion: string;
  se_estado: string;
  se_lugar: string;
}

export interface ITareo {
  CANTIDAD: string;
  FECHA: string;
}
export interface ISuplente {
  id_persona: string;
  id_tpdocumento: string;
  id_nacionalidad: number;
  per_nombre: string;
  per_apellido_paterno: string;
  per_apellido_materno: string;
  per_documento: string;
  datos: string;
  na_descripcion: string;
  tpd_descripcion: string;
  pe_estado: number;
  phb_cuenta?: string;
  phb_cci?: string;
  tpc_descripcion?: string;
}

export interface IPosition extends ILogTable {
  ca_abreviatura: string;
  ca_descripcion: string;
  ca_estado: string;
  datos: string;
  estado: string;
  id_cargo: string;
}

export interface IDocumentType {
  datos: string;
  estado: string;
  id_tpdocumento: string;
  tpd_abreviatura: string;
  tpd_descripcion: string;
  tpd_estado: string;
  tpd_longitud: string;
}

export interface INationality {
  datos: string;
  estado: string;
  id_nacionalidad: string;
  na_abreviatura: string;
  na_descripcion: string;
  na_estado: string;
}

export interface IAccountType {
  datos: string;
  id_tpcuenta: string;
  tpc_abreviatura: string;
  tpc_descripcion: string;
}
export interface IFeriado {
  estado: string;
  id_feriado: string;
  fe_descripcion: string;
  fe_estado: string;
  fe_dia: string;
}
export interface IPermiso {
  estado: string;
  id_permiso: string;
  pe_descripcion: string;
  pe_estado: string;
  pe_nombre: string;
}
export interface ICargo {
  id_cargo: number;
  id_tpusuario: number;
  ca_descripcion: string;
  ca_abreviatura: string;
  ca_estado: string;
  estado: string;
  datos: string;
}

export interface IMarcador {
  id_marcador: number;
  ma_estado: string;
  estado: string;
  ma_descripcion: string;
  ma_abreviatura: string;
  datos: string;
}
export interface INacionalidad extends ILogTable {
  id_nacionalidad: number;
  na_descripcion: string;
  na_abreviatura: string;
  na_estado: string;
  estado: string;
  datos: string;
}

export interface IEmpleado {
  id_persona: number;
  id_tpdocumento: string;
  id_nacionalidad: string;
  per_nombre: string;
  per_apellido_paterno: string;
  per_apellido_materno: string;
  per_documento: number;
  datos: string;
  na_descripcion: string;
  tpd_descripcion: string;
  ca_descripcion: string;
  phc_estado: string;
  pe_estado: number;
  banco: string;
  cuenta: string;
  tpCuenta: string;
  cci: string;
  suplente: number;
}

export interface IEmpleadoCese extends IEmpleado {
  id_cese: string;
  ce_estado: string;
}

export interface IDocument {
  auditoria1: string;
  auditoria2: string;
  auditoria3: string;
  auditoria4: string;
  de_descripcion: string;
  de_fecha: string;
  de_nombre: string;
  de_obligatirio: string;
  id_emdocumento: string;
  id_documento: string;
}

export interface IEmployeeDocument{
  id_docemp: string;
  id_documento: string;
  id_persona: string;
  per_documento: string;
  do_descripcion: string;
  do_peso: string;
  do_ruta: string;
  do_emision: string;
  do_vigencia: string;
}

export interface ISalary {
  id_persona: string;
  id_sueldo: string;
  ta_alimentos: string;
  ta_asignacion_familiar: string;
  ta_basico: string;
  ta_bonificacion: string;
  ta_csdia: string;
  ta_estado: string;
  ta_fecha_r: string;
  ta_movilidad: string;
  ta_total: string;
  ta_vigenciaFin: string;
  ta_vigenciaInicio: string;
}

export interface IDatosEmployee {
  em_foto: string;
  id_nacionalidad: string;
  id_persona: string;
  id_tpdocumento: string;
  pe_direccion: string;
  pe_estado: string;
  pe_fecha_cese: string;
  pe_fecha_ingreso: string;
  pe_sexo: string;
  pe_titular: string;
  pe_usuario: string;
  per_apellido_materno: string;
  per_apellido_paterno: string;
  per_celular: string;
  per_correo: string;
  per_documento: string;
  per_fecha_nac: string;
  per_nombre: string;
}

export interface IListaNegra extends IDatosEmployee {
  id_lista: string;
  lis_motivo: string;
  lis_fecha_lista: string;
}

export interface ICeseEmployee extends IDatosEmployee, IListaNegra {
  id_cese: string;
  ce_motivo: string;
  ce_fecha_cese: string;
  ls_estado: number;
  ce_cantidad: number;
}

export interface IBreak {
  id_descanso: string;
  de_referencia: string;
  estado: string;
  dia: string;
  de_fecha: string;
  de_estado: string;
  de_observacion: string;
  id_persona: string;
  id_tpdocumento: string;
  id_nacionalidad: string;
}

export interface IDatosPosition {
  id_caempleado: string;
  ce_fecha_r: string;
  estado: string;
  ce_estado: string;
  ce_observacion: string;
  ca_descripcion: string;
  id_cargo: string;
  id_persona: string;
  id_tpdocumento: string;
  id_nacionalidad: string;
}

export interface IDatosSede {
  id_sede_em: string;
  id_sede: string;
  id_persona: string;
  ta_fecha_r: string;
  estado: string;
  sm_estado: string;
  sede: string;
  sm_observacion: string;
}

export interface IDatosBank {
  id_phbanco: string;
  id_banco: string;
  id_tpcuenta: string;
  phb_estado: string;
  ba_nombre: string;
  phb_cuenta: string;
  phb_cci: string;
  estado: string;
}

export interface IDatosSustitute {
  id_sucobrar: string;
  datos: string;
  banco: string;
  phb_cuenta: string;
  phb_cci: string;
  estado: string;
  suc_estado: string;
  per_documento: string;
}

export interface IDatosEmployeeDocument {
  codigo: string;
  id_persona: string;
  datos: string;
  posicion: string;
  documento: string;
  isPossesihng: string;
  sede: string;
  per_documento?: string;
}

export interface ITareoEmpleado {
  id_tareo: number;
  estado: string;
  codigo: string;
  datos: string;
  sede_datos: string;
  fecha_ingreso: string;
  hora_ingreso: string;
  fecha_cierre: string;
  hora_cierre: string;
  marcador_datos: string;
  ta_estado: number;
  estado2: string;
}

export interface IPermissionTareoEmpleado {
  id_tareo: number;
  estado: string;
  codigo: string;
  datos: string;
  sede_datos: string;
  fecha_ingreso: string;
  marcador_datos: string;
  permiso: string;
  tipo_permiso: string;
  ta_remunerado: number;
  ta_estado: number;
}

export interface IResponseFetch {
  data: unknown;
  status: boolean;
}

export interface IResponseJsonMessage {
  msg: string;
}

export interface IDocumentEmployee {
  id_emdocumento: number | null;
  estado: string;
  de_nombre: string;
  de_descripcion: string;
  datos: string;
  flEliminado: number;
  userCreation: string;
}

export interface IEditSuplente {
  id_nacionalidad: string;
  id_persona: string;
  id_tpdocumento: string;
  pe_direccion: string;
  pe_estado: string;
  pe_fecha_cese: string;
  pe_fecha_ingreso: string;
  pe_sexo: string;
  pe_titular: string;
  pe_usuario: string;
  per_apellido_materno: string;
  per_apellido_paterno: string;
  per_celular: string;
  per_correo: string;
  per_documento: string;
  per_fecha_nac: string;
  per_nacionalidad: string;
  per_nombre: string;
}

export interface IEmployeeApprove {
  id_persona: number;
  id_tpdocumento: string;
  id_nacionalidad: number;
  per_documento: string;
  datos: string;
  sede: string;
  ca_descripcion: string;
  se_descripcion: string;
  na_descripcion: string;
  tpd_descripcion: string;
  id_sueldo?: string;
  phc_fecha_r?: string;
}
export interface ITiposMotivo {
  id_motivo: number;
  mo_nombre: string;
}

export interface IHistoryCese {
  ce_fecha_cese: string;
  mo_nombre: string;
  ce_motivo: string;
  ls_negra: string;
}

export interface IHistoryListBlack {
  fechaCreacion: string;
  lis_motivo: string;
}

export interface IUserTrack {
  userCreacion: string;
  fechaCreacion?: string;
  userModificacion: string;
  fechaModificacion?: string;
  flEliminado?: string;
}

export interface IProfileUserPermission {
  id_tpusuario: string;
  tpu_descripcion: string;
  tpu_estado: string;
  estado: string;
  tpu_abreviatura: string;
  datos: string;
  cantidad: string;
}

export interface ILogTable {
  userCreacion?: string;
  fechaCreacion?: string;
  userModificacion?: string;
  fechaModificacion?: string;
  flEliminado?: string;
}
