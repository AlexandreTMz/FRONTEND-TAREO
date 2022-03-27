<template>
  <div class="o-formPersonSustitute">
    <div class="o-formPersonSustitute__form">
      <q-form
        @submit.prevent="handleForm"
        ref="form"
        class="o-formPersonSustitute__form__wrapper"
      >
        <div class="o-formPersonSustitute__form__header">Datos personales</div>

        <div class="o-formPersonSustitute__form__wrapper__box">
          <div class="o-formPersonSustitute__form__inputGroups">
            <q-input
              filled
              dense
              label="Nombres"
              v-model="name"
              :rules="[
                (val) => (val && val.length > 0) || 'El nombre es obligatorio',
              ]"
            >
              <template v-slot:prepend>
                <q-icon color="primary" name="badge" />
              </template>
            </q-input>
            <q-input
              dense
              filled
              label="Apellido paterno"
              outlined
              v-model="lastName"
              :rules="[
                (val) =>
                  (val && val.length > 0) ||
                  'El apellido paterno es obligatorio',
              ]"
            >
              <template v-slot:prepend>
                <q-icon color="primary" name="badge" />
              </template>
            </q-input>
            <q-input
              dense
              filled
              label="Apellido materno"
              outlined
              v-model="motherLastName"
              :rules="[
                (val) =>
                  (val && val.length > 0) ||
                  'El apellido materno es obligatorio',
              ]"
            >
              <template v-slot:prepend>
                <q-icon color="primary" name="badge" />
              </template>
            </q-input>
            <q-select
              dense
              filled
              label="Sexo"
              outlined
              :options="SEX_OPTIONS"
              v-model="sex"
              :rules="[
                (val) =>
                  (val && val.value.length > 0) || 'Debe seleccionar el sexo',
              ]"
            >
              <template v-slot:prepend>
                <q-icon color="primary" name="fas fa-venus-mars" />
              </template>
            </q-select>
          </div>

          <div class="o-formPersonSustitute__form__inputGroups">
            <q-select
              dense
              filled
              label="Nacionalidad"
              outlined
              :options="nationalityOptions"
              v-model="nationality"
              :rules="[
                (val) =>
                  (val && val.id_nacionalidad.length > 0) ||
                  'Debe seleccionar una nacionalidad',
              ]"
              ><template v-slot:prepend>
                <q-icon
                  color="primary"
                  name="fas fa-globe-americas"
                /> </template
            ></q-select>
            <q-select
              dense
              filled
              label="Tipo de documento"
              outlined
              :options="documentTypeOptions"
              v-model="documentType"
              :rules="[
                (val) =>
                  (val && val.id_tpdocumento.length > 0) ||
                  'Debe seleccionar un tipo de documento',
              ]"
              ><template v-slot:prepend>
                <q-icon color="primary" name="fas fa-passport" /> </template
            ></q-select>
            <q-input
              dense
              filled
              label="Numero documento"
              outlined
              v-model="documentNumber"
              :rules="[
                (val) =>
                  (val && val.length > 0) ||
                  'El número de documento es obligatorio',
              ]"
              ><template v-slot:prepend>
                <q-icon
                  color="primary"
                  name="fas fa-sort-numeric-up"
                /> </template
            ></q-input>
            <q-input
              dense
              type="date"
              filled
              stack-label
              label="Fecha de nacimiento"
              v-model="dateBirth"
              :rules="[
                (val) =>
                  (val && val.length > 0) ||
                  'La fecha de nacimiento es obligatorio',
              ]"
              outlined
              ><template v-slot:prepend>
                <q-icon color="primary" name="fas fa-calendar-alt" /> </template
            ></q-input>
          </div>

          <div class="o-formPersonSustitute__form__inputGroups">
            <q-input
              filled
              dense
              label="Direccion"
              outlined
              v-model="direction"
            >
              <template v-slot:prepend>
                <q-icon color="primary" name="fas fa-map-marked-alt" />
              </template>
            </q-input>
            <q-input
              filled
              dense
              type="number"
              label="Celular"
              outlined
              v-model="cellPhone"
            >
              <template v-slot:prepend>
                <q-icon color="primary" name="fas fa-phone-square-alt" />
              </template>
            </q-input>
            <q-input filled dense label="Correo" outlined v-model="mail">
              <template v-slot:prepend>
                <q-icon color="primary" name="fas fa-envelope-square" />
              </template>
            </q-input>
            <q-select
              label="Estado"
              dense
              filled
              :options="[
                { label: 'Activo', value: '1 ' },
                { label: 'Inactivo', value: '0' },
              ]"
              v-model="state"
            >
              <template v-slot:prepend>
                <q-icon name="fas fa-envelope-square" color="primary" />
              </template>
            </q-select>
          </div>

          <div>
            <q-btn
              :disable="!can('Editar', 'Sustituto')"
              label="Actualizar datos"
              color="green"
              type="submit"
            />
          </div>
        </div>
      </q-form>

      <div class="o-formPersonSustitute__form__wrapper">
        <div class="o-formPersonSustitute__form__header">Bancos</div>

        <div class="o-formPersonSustitute__form__wrapper__box">
          <m-table-history-payment-sustitute
            :accountTypeOptions="accountTypeOptions"
            :bankOptions="bankOptions"
            :idSustitute="sustitute.id_persona"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  PropType,
  reactive,
  toRefs,
  ref,
  onMounted,
} from 'vue';

import { SEX_OPTIONS } from 'src/constant';
import {
  IAccountType,
  IBank,
  IDocumentType,
  IEditSuplente,
  INationality,
} from 'src/types';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';
import { MessageSuccess } from 'src/utils/swal';
import { QForm } from 'quasar';
import { getDateYYYMMDD } from 'src/utils/date';
import MTableHistoryPaymentSustitute from 'components/molecules/TableHistoryPaymentSustitute';
import { can } from 'src/utils/permission';
import { MESSAGE_EDITAR } from 'src/utils/messages';
import { getCreateUserTrack } from 'src/utils/userTrack';

interface IFormPersonSustitute {
  name: string | null;
  lastName: string | null;
  motherLastName: string | null;
  sex: IFormOption | null;
  nationality: INationality | null;
  documentType: IDocumentType | null;
  documentNumber: string | null;
  dateBirth: string | null;
  direction: string | null;
  cellPhone: number | null;
  mail: string | null;
  state: IFormOption;
}

interface IFormOption {
  value: string;
  label: string;
}

export default defineComponent({
  name: 'OFormPersonSustitute',
  components: {
    MTableHistoryPaymentSustitute,
  },
  props: {
    documentTypeOptions: {
      type: Array as PropType<IDocumentType[]>,
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
    sustitute: {
      type: Object as PropType<IEditSuplente>,
      default: () => null,
    },
  },
  setup(props) {
    const personSustitute = reactive<IFormPersonSustitute>({
      name: null,
      lastName: null,
      motherLastName: null,
      sex: SEX_OPTIONS[0],
      nationality: null,
      documentType: null,
      documentNumber: '',
      dateBirth: getDateYYYMMDD(),
      direction: null,
      cellPhone: 0,
      mail: null,
      state: { label: 'Activo', value: '1' },
    });

    const form = ref<QForm>();

    // const handleResetDataPersonSustitute = () => {
    //   personSustitute.name = null;
    //   personSustitute.lastName = null;
    //   personSustitute.motherLastName = null;
    //   personSustitute.sex = SEX_OPTIONS[0];
    //   personSustitute.nationality = null;
    //   personSustitute.documentType = null;
    //   personSustitute.documentNumber = '';
    //   personSustitute.dateBirth = getDateYYYMMDD();
    //   personSustitute.direction = null;
    //   personSustitute.cellPhone = 0;
    //   personSustitute.mail = null;

    //   (form.value as QForm).reset();
    // };

    const userTrack = getCreateUserTrack();

    const handleForm = async () => {
      const sustituteForm = {
        id_persona: props.sustitute.id_persona,
        nombres: personSustitute.name,
        apellido_paterno: personSustitute.lastName,
        apellido_materno: personSustitute.motherLastName,
        sexo: personSustitute.sex?.value,
        nacionalidad: personSustitute.nationality?.id_nacionalidad,
        tipo_documento: personSustitute.documentType?.id_tpdocumento,
        documento: personSustitute.documentNumber,
        fecha_nacimiento: personSustitute.dateBirth,
        direccion: personSustitute.direction,
        celular: personSustitute.cellPhone,
        correo: personSustitute.mail,
        titular: 1,
        estado: personSustitute.state.value,
        usuario: 1,
      };

      const sustituteFetch = await fetchRequestAPI({
        url: '/adm/persona/actualizar',
        method: 'POST',
        body: JSON.stringify({ ...sustituteForm, ...userTrack }),
      });
      if (
        readErrorFetch({
          responseFetch: sustituteFetch,
          message: 'Ocurrió un error al registrar al suplente',
        })
      ) {
        return;
      }

      MessageSuccess({ title: MESSAGE_EDITAR('al suplente') });
      // handleResetDataPersonSustitute();
    };

    onMounted(() => {
      personSustitute.name = props.sustitute.per_nombre;
      personSustitute.lastName = props.sustitute.per_apellido_paterno;
      personSustitute.motherLastName = props.sustitute.per_apellido_materno;
      personSustitute.sex =
        SEX_OPTIONS.find((item) => item.value === props.sustitute.pe_sexo) ||
        SEX_OPTIONS[0];

      personSustitute.nationality =
        props.nationalityOptions.find(
          (item) => item.id_nacionalidad == props.sustitute.id_nacionalidad
        ) || null;

      personSustitute.documentType =
        props.documentTypeOptions.find(
          (item) => item.id_tpdocumento == props.sustitute.id_tpdocumento
        ) || null;

      personSustitute.documentNumber = props.sustitute.per_documento;
      personSustitute.dateBirth = props.sustitute.per_fecha_nac;
      personSustitute.direction = props.sustitute.pe_direccion;
      personSustitute.cellPhone = Number(props.sustitute.per_celular);
      personSustitute.mail = props.sustitute.per_correo;
      personSustitute.state = [
        { label: 'Activo', value: '1' },
        { label: 'Inactivo', value: '0' },
      ].find((item) => item.value == props.sustitute.pe_estado) || {
        label: 'Activo',
        value: '1',
      };
    });

    return { handleForm, SEX_OPTIONS, ...toRefs(personSustitute), form, can };
  },
});
</script>
<style lang="scss" scoped>
@import './EditFormPersonSustitute.scss';
</style>
