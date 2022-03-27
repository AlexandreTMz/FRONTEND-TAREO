<template>
  <div class="o-editEmployee">
    <div class="o-editEmployee__form">
      <q-form
        ref="form"
        class="o-editEmployee__form__card"
        @submit.prevent="handleForm"
      >
        <div class="o-editEmployee__form__card__header">
          <h2 class="o-editEmployee__form__card__header__title">
            Datos personales
          </h2>
        </div>

        <div class="o-editEmployee__form__card__body">
          <div class="o-editEmployee__form__card__body__inputGroup">
            <q-input
              label="Nombres"
              dense
              filled
              v-model="name"
              :rules="[
                (val) => (val && val.length > 0) || 'El nombre es obligatorio',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="fas fa-address-card" color="primary" />
              </template>
            </q-input>
            <q-input
              label="Apellido paterno"
              dense
              filled
              v-model="lastName"
              :rules="[
                (val) =>
                  (val && val.length > 0) ||
                  'El apellido paterno es obligatorio',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="fas fa-address-card" color="primary" />
              </template>
            </q-input>
            <q-input
              label="Apellido materno"
              dense
              filled
              v-model="motherLastName"
              :rules="[
                (val) =>
                  (val && val.length > 0) ||
                  'El apellido materno es obligatorio',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="fas fa-address-card" color="primary" />
              </template>
            </q-input>
            <q-select
              label="Sexo"
              :options="SEX_OPTIONS"
              dense
              filled
              v-model="sex"
              :rules="[
                (val) =>
                  (val && val.value.length > 0) || 'Debe seleccionar el sexo',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="fas fa-venus-mars" color="primary" />
              </template>
            </q-select>
          </div>
          <div class="o-editEmployee__form__card__body__inputGroup">
            <q-select
              label="Nacionalidad"
              :options="nationalityOptions"
              dense
              filled
              v-model="nationality"
              :rules="[
                (val) =>
                  (val && val.id_nacionalidad.length > 0) ||
                  'Debe seleccionar una nacionalidad',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="fas fa-globe-americas" color="primary" />
              </template>
            </q-select>
            <q-select
              label="Tipo de documento"
              dense
              filled
              disable
              :options="documentTypeOptions"
              v-model="documentType"
              :rules="[
                (val) =>
                  (val && val.id_tpdocumento.length > 0) ||
                  'Debe seleccionar un tipo de documento',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="fas fa-passport" color="primary" />
              </template>
            </q-select>
            <q-input
              label="Numero documento"
              dense
              filled
              v-model="documentNumber"
              type="text"
              disable
              :rules="[
                (val) =>
                  (val && String(val).length > 0) ||
                  'EL número de documento es obligatorio',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="fas fa-sort-numeric-up" color="primary" />
              </template>
            </q-input>
            <q-input
              label="Fecha de nacimiento"
              stack-label
              type="date"
              dense
              filled
              v-model="birthDate"
              :rules="[
                (val) =>
                  (val && val.length > 0) ||
                  'Debe seleccionar una fecha válida',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="fas fa-calendar-alt" color="primary" />
              </template>
            </q-input>
          </div>

          <div class="o-editEmployee__form__card__body__inputGroup">
            <q-input label="Direccion" dense filled v-model="direction">
              <template v-slot:prepend>
                <q-icon name="fas fa-map-marked-alt" color="primary" />
              </template>
            </q-input>
            <q-input
              label="Celular"
              dense
              filled
              v-model="cellPhone"
              type="number"
            >
              <template v-slot:prepend>
                <q-icon name="fas fa-phone-square-alt" color="primary" />
              </template>
            </q-input>
            <q-input label="Correo" dense filled v-model="mail">
              <template v-slot:prepend>
                <q-icon name="fas fa-envelope-square" color="primary" />
              </template>
            </q-input>

            <q-select
              label="Estado"
              dense
              filled
              :options="[
                { label: 'Activo', value: 1 },
                { label: 'Inactivo', value: 0 },
                { label: 'Por aprobar', value: 3 },
              ]"
              v-model="state"
              :bg-color="Number(state?.value) === 0 ? 'red' : 'green'"
              disable
            >
              <template v-slot:prepend>
                <q-icon name="fas fa-clipboard-check" color="primary" />
              </template>
            </q-select>
          </div>

          <div class="o-editEmployee__form__card__body__inputGroup">
            <q-input
              label="Fecha de Ingreso"
              stack-label
              type="date"
              dense
              filled
              v-model="dateAdimission"
              :rules="[
                (val) =>
                  (val && val.length > 0) ||
                  'Debe seleccionar una fecha válida',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="fas fa-calendar-alt" color="primary" />
              </template>
            </q-input>
            <div class="o-editEmployee__form__card__body__empty"></div>
            <div class="o-editEmployee__form__card__body__empty"></div>
            <div class="o-editEmployee__form__card__body__empty"></div>
          </div>

          <div
            :class="[
              'o-editEmployee__form__card__body__profile',
              { '--drag': isDragPhotoProfile },
            ]"
            @dragover.prevent
            @drop.prevent="dragPhotoProfile"
            @dragenter="isDragPhotoProfile = true"
            @dragleave="isDragPhotoProfile = false"
            @click="handleClickSelectImage"
          >
            <div class="o-editEmployee__form__card__body__profile__photo">
              <q-icon
                class="o-editEmployee__form__card__body__profile__photo__iconPlus"
                name="fas fa-plus-circle"
                color="orange"
                size="1.5rem"
                v-if="!imageProfilePreview"
              />
              <q-icon
                class="o-editEmployee__form__card__body__profile__photo__icon"
                name="fas fa-camera"
                size="3rem"
                color="primary"
                v-if="!imageProfilePreview"
              />
              <img
                v-if="imageProfilePreview"
                class="o-editEmployee__form__card__body__profile__photo__preview"
                :src="imageProfilePreview"
              />
            </div>
            <div class="o-editEmployee__form__card__body__profile__text">
              <h3
                class="o-editEmployee__form__card__body__profile__text__title"
              >
                Actualice la foto de perfil
              </h3>

              <!-- <p>Arrastre aqui la imagen que desea subir</p> -->
            </div>
          </div>
        </div>

        <q-btn
          label="Actualizar"
          color="green"
          class="o-editEmployee__form__card__edit"
          type="submit"
          :disable="!can('Editar', 'Empleado')"
        ></q-btn>
      </q-form>

      <div class="o-editEmployee__form__card" v-if="tabs.length > 0">
        <div class="o-editEmployee__form__card__header -tab">
          <q-tabs indicator-color="primary" align="left" v-model="tabSelect">
            <q-tab
              v-for="tab in tabs"
              :key="tab.name"
              :label="tab.label"
              :name="tab.name"
            />
          </q-tabs>
        </div>

        <q-tab-panels v-model="tabSelect">
          <q-tab-panel name="personal-information">
            <m-table-history-salary :idEmployee="employee.id_persona" />
          </q-tab-panel>

          <q-tab-panel name="break">
            <m-table-history-break :idEmployee="employee.id_persona" />
          </q-tab-panel>

          <q-tab-panel name="sedes">
            <m-table-history-sede
              :idEmployee="employee.id_persona"
              :sedeOptions="sedeOptions"
            />
          </q-tab-panel>

          <q-tab-panel name="payment-methods">
            <m-table-history-payment
              :idEmployee="employee.id_persona"
              :documentEmployee="employee.per_documento"
              :bankOptions="bankOptions"
              :accountTypeOptions="accountTypeOptions"
            />
          </q-tab-panel>

          <q-tab-panel name="documents">
            <m-table-history-document
              :idEmployee="employee.id_persona"
              :documents="documents"
              :documentEmployee="employee.per_documento"
            />
          </q-tab-panel>

          <q-tab-panel name="position">
            <m-table-history-position
              :idEmployee="employee.id_persona"
              :positionOptions="positionOptions"
            />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  IAccountType,
  IBank,
  IDatosEmployee,
  IDocument,
  IDocumentType,
  INationality,
  IPosition,
  IResponseFetch,
  ISede,
} from 'src/types';
import {
  defineComponent,
  ref,
  PropType,
  reactive,
  toRefs,
  onMounted,
} from 'vue';
import { SEX_OPTIONS, BREAK_OPTIONS } from 'src/constant';
import { QForm } from 'quasar';
import { MessageError, MessageSuccess } from 'src/utils/swal';
import { selectFile } from 'src/utils/selectClickFile';

import { useStore } from 'src/store';
import MTableHistorySalary from 'components/molecules/TableHistorySalary';
import MTableHistoryBreak from 'components/molecules/TableHistoryBreak';
import MTableHistoryPosition from 'components/molecules/TableHistoryPosition';
import MTableHistorySede from 'components/molecules/TableHistorySede';
import MTableHistoryPayment from 'components/molecules/TableHistoryPayment';
import MTableHistoryDocument from 'components/molecules/TableHistoryDocument';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';
import { getServerFilePhoto } from 'src/utils/staticFiles';
import { can } from 'src/utils/permission';
import { getDateYYYMMDD } from 'src/utils/date';
import { getCreateUserTrack } from 'src/utils/userTrack';

interface IOptionForm {
  value: string;
  label: string;
}

interface ITabs {
  label: string;
  name: string;
  permission: string;
}

interface IEmployeeForm {
  name: string | null;
  motherLastName: string | null;
  lastName: string | null;
  sex: null | IOptionForm;
  nationality: INationality | null;
  documentType: IDocumentType | null;
  documentNumber: string | null;
  birthDate: string | null;
  direction: string | null;
  cellPhone: number | null;
  mail: string | null;
  dateAdimission: string | null;
  state: null | IOptionForm;
}

export default defineComponent({
  name: 'OEditEmployee',
  components: {
    MTableHistorySalary,
    MTableHistoryBreak,
    MTableHistoryPosition,
    MTableHistorySede,
    MTableHistoryPayment,
    MTableHistoryDocument,
  },
  props: {
    positionOptions: {
      type: Array as PropType<IPosition[]>,
      default: () => [],
    },
    documentTypeOptions: {
      type: Array as PropType<IDocumentType[]>,
      default: () => [],
    },
    sedeOptions: {
      type: Array as PropType<ISede[]>,
      default: () => [],
    },
    nationalityOptions: {
      type: Array as PropType<INationality[]>,
      default: () => [],
    },
    bankOptions: {
      type: Array as PropType<IBank[]>,
      default: () => [],
    },
    accountTypeOptions: {
      type: Array as PropType<IAccountType[]>,
      default: () => [],
    },
    documents: {
      type: Array as PropType<IDocument[]>,
      default: () => [],
    },
    employee: {
      type: Object as PropType<IDatosEmployee>,
      default: () => ({}),
    },
  },

  setup(props) {
    const tabSelect = ref('personal-information');
    const switchHeadline = ref(true);
    const form = ref<QForm>();
    const isDragPhotoProfile = ref(false);
    const filePhotoProfile = ref();
    const imageProfilePreview = ref<string | ArrayBuffer | null>(
      getServerFilePhoto(props.employee.per_documento, props.employee.em_foto)
    );

    const tabs = ref<ITabs[]>([
      {
        name: 'personal-information',
        label: 'SUELDOS',
        permission: 'Acceso Sueldo',
      },
      {
        name: 'break',
        label: 'DESCANSO (Informativo)',
        permission: 'Acceso Descanso',
      },
      {
        name: 'position',
        label: 'CARGO',
        permission: 'Acceso Cargo',
      },
      {
        name: 'sedes',
        label: 'SEDES',
        permission: 'Acceso Sede',
      },
      {
        name: 'payment-methods',
        label: 'FORMAS DE PAGO',
        permission: 'Acceso Forma de pago',
      },
      {
        name: 'documents',
        label: 'DOCUMENTOS',
        permission: 'Acceso Documentos',
      },
    ]);

    const { commit } = useStore();

    // 0 -> PENDIENTE, 1 -> SUBIDO

    const employeeForm = reactive<IEmployeeForm>({
      name: null,
      motherLastName: null,
      lastName: null,
      sex: null,
      nationality: null,
      documentType: null,
      documentNumber: null,
      birthDate: null,
      direction: null,
      cellPhone: null,
      mail: null,
      dateAdimission: null,
      state: null,
    });

    const userTrack = getCreateUserTrack();

    const dragPhotoProfile = (e: DragEvent) => {
      const files = (e.dataTransfer as DataTransfer).files;
      handleSetImage(files);
    };

    const handleClickSelectImage = async () => {
      const files = (await selectFile('image/*', false)) as File;
      handleSetImage([files] as unknown as FileList);
    };

    const handleSetImage = (files: FileList) => {
      isDragPhotoProfile.value = false;
      if (files.length === 1 && files[0].type.indexOf('image') !== -1) {
        filePhotoProfile.value = files[0];
        imageProfilePreview.value = URL.createObjectURL(files[0]);

        let reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onloadend = function () {
          imageProfilePreview.value = reader.result;
        };
      } else {
        MessageError({ title: 'Escoja una imagen válida' });
      }
    };

    const handleForm = async () => {
      commit('commitLoading', true);

      const dateAdmission = new Date(
        String(employeeForm.dateAdimission).split('-').join('/')
      );
      const dateValidation = new Date(getDateYYYMMDD().split('-').join('/'));
      const lastDayOfMonth = new Date(
        dateValidation.getFullYear(),
        dateValidation.getMonth() + 1 + 1,
        0
      );

      if (dateAdmission > lastDayOfMonth) {
        MessageError({
          text: 'La fecha ingresada debe ser menor o igual, que el fin del siguiente mes de la fecha actual.',
        });
        tabSelect.value = tabs.value.length > 0 ? tabs.value[0].name : '';
        commit('commitLoading', false);
        return;
      }

      const body = {
        id_persona: props.employee.id_persona,
        nombres: employeeForm.name,
        apellido_paterno: employeeForm.lastName,
        apellido_materno: employeeForm.motherLastName,
        sexo: employeeForm.sex?.value,
        nacionalidad: employeeForm.nationality?.id_nacionalidad,
        tipo_documento: employeeForm.documentType?.id_tpdocumento,
        documento: employeeForm.documentNumber,
        fecha_nacimiento: employeeForm.birthDate,
        direccion: employeeForm.direction,
        celular: employeeForm.cellPhone,
        correo: employeeForm.mail,
        titular: 1,
        estado: employeeForm.state?.value,
        fecha_ingreso: employeeForm.dateAdimission,
        fecha_cese: props.employee.pe_fecha_cese,
        usuario: 1,
      };

      const fetchEmployee = (await fetchRequestAPI({
        url: '/adm/persona/actualizar',
        method: 'POST',
        body: JSON.stringify({ ...body, ...userTrack }),
      })) as boolean | IResponseFetch;

      if (
        readErrorFetch({
          responseFetch: fetchEmployee,
          message: 'Ocurrió un error al actualizar los datos',
        })
      ) {
        commit('commitLoading', false);
        return;
      }

      if (filePhotoProfile.value) {
        const formData = new FormData();

        formData.append('image', filePhotoProfile.value);
        formData.append('documento', String(props.employee.per_documento));
        formData.append('userCreacion', userTrack.userCreacion);

        const uploadPhotoProfile = await fetchRequestAPI({
          url: '/adm/api/imegen/empleado',
          method: 'POST',
          body: formData,
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (
          readErrorFetch({
            responseFetch: uploadPhotoProfile,
            message: 'Ocurrió un error inténtelo de nuevo',
          })
        ) {
          commit('commitLoading', false);

          return;
        }
      }

      MessageSuccess({ title: 'Los datos fueron actualizados' });

      commit('commitLoading', false);
    };

    onMounted(() => {
      employeeForm.name = props.employee.per_nombre;
      employeeForm.lastName = props.employee.per_apellido_paterno;
      employeeForm.motherLastName = props.employee.per_apellido_materno;
      employeeForm.sex =
        String(props.employee.pe_sexo) === '1'
          ? { label: 'FEMENINO', value: '1' }
          : { label: 'MASCULINO', value: '2' };

      employeeForm.nationality = props.nationalityOptions.find(
        (item) => item.id_nacionalidad === props.employee.id_nacionalidad
      ) as INationality;

      employeeForm.documentType = props.documentTypeOptions.find(
        (item) => item.id_tpdocumento === props.employee.id_tpdocumento
      ) as IDocumentType;

      employeeForm.documentNumber = String(props.employee.per_documento);
      employeeForm.birthDate = props.employee.per_fecha_nac;
      employeeForm.direction = props.employee.pe_direccion;
      employeeForm.cellPhone = Number(props.employee.per_celular);
      employeeForm.mail = props.employee.per_correo;
      employeeForm.dateAdimission = props.employee.pe_fecha_ingreso;
      employeeForm.state =
        String(props.employee.pe_estado) === '1'
          ? { label: 'Activo', value: '1' }
          : { label: 'Inactivo', value: '0' };

      tabs.value = tabs.value.filter((item) =>
        can(item.permission, 'Empleado', 'Editar')
      );

      tabSelect.value = tabs.value.length > 0 ? tabs.value[0].name : '';
    });

    return {
      tabSelect,
      switchHeadline,
      handleForm,
      SEX_OPTIONS,
      BREAK_OPTIONS,
      form,
      dragPhotoProfile,
      filePhotoProfile,
      isDragPhotoProfile,
      imageProfilePreview,
      handleClickSelectImage,
      can,
      tabs,
      ...toRefs(employeeForm),
    };
  },
});
</script>
<style lang="scss" scoped>
@import './EditEmployee.scss';
</style>
