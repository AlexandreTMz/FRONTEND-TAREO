<template>
  <div class="o-formPersonSustitute">
    <q-form
      class="o-formPersonSustitute__form"
      @submit.prevent="handleForm"
      ref="form"
    >
      <div class="o-formPersonSustitute__form__wrapper">
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
            <div class="o-formPersonSustitute__form__empty"></div>
          </div>
        </div>
      </div>

      <div class="o-formPersonSustitute__form__wrapper">
        <div class="o-formPersonSustitute__form__header">Banco</div>

        <div class="o-formPersonSustitute__form__wrapper__box">
          <div class="o-formPersonSustitute__form__inputGroups">
            <q-select
              filled
              dense
              label="Bancos"
              outlined
              :options="bankOptions"
              v-model="bank"
              :rules="[
                (val) =>
                  (val && val.id_banco.length > 0) ||
                  'El banco es obligatorio ',
              ]"
            >
              <template v-slot:prepend>
                <q-icon color="primary" name="fas fa-university" />
              </template>
            </q-select>
            <q-select
              filled
              dense
              label="Tipo de cuenta"
              outlined
              :options="accountTypeOptions"
              v-model="accountType"
              :rules="[
                (val) =>
                  (val && val.id_tpcuenta.length > 0) ||
                  'El tipo de cuenta es obligatorio ',
              ]"
            >
              <template v-slot:prepend>
                <q-icon color="primary" name="fas fa-university" />
              </template>
            </q-select>

            <div class="o-formPersonSustitute__form__empty"></div>
            <div class="o-formPersonSustitute__form__empty"></div>
          </div>

          <div class="o-formPersonSustitute__form__inputGroups">
            <q-input filled dense label="Numero" outlined v-model="bankNumber"
              ><template v-slot:prepend>
                <q-icon color="primary" name="fab fa-cc-visa" /> </template
            ></q-input>

            <div class="o-formPersonSustitute__form__empty"></div>
          </div>

          <div class="o-formPersonSustitute__form__inputGroups">
            <q-input filled dense label="CCI" outlined v-model="bankCCI">
              <template v-slot:prepend>
                <q-icon color="primary" name="fab fa-cc-visa" />
              </template>
            </q-input>

            <div class="o-formPersonSustitute__form__empty"></div>
          </div>
        </div>

        <q-btn
          class="o-formPersonSustitute__form__submit"
          type="submit"
          label="Registrar"
          color="green"
          :disable="!can('Registrar', 'Sustituto')"
        />
      </div>
    </q-form>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, reactive, toRefs, ref } from 'vue';

import { SEX_OPTIONS } from 'src/constant';
import { IAccountType, IBank, IDocumentType, INationality } from 'src/types';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';
import { MessageError, MessageSuccess } from 'src/utils/swal';
import { QForm } from 'quasar';
import { getDateYYYMMDD } from 'src/utils/date';
import { can } from 'src/utils/permission';
import { MESSAGE_REGISTRO } from 'src/utils/messages';
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
  bank: IBank | null;
  accountType: IAccountType | null;
  bankNumber: string | null;
  bankCCI: string | null;
}

interface IFormOption {
  value: string;
  label: string;
}

export default defineComponent({
  name: 'OFormPersonSustitute',
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
  },
  setup() {
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
      bank: null,
      accountType: null,
      bankNumber: '',
      bankCCI: '',
    });

    const form = ref<QForm>();

    const userTrack = getCreateUserTrack();

    const handleResetDataPersonSustitute = () => {
      personSustitute.name = null;
      personSustitute.lastName = null;
      personSustitute.motherLastName = null;
      personSustitute.sex = SEX_OPTIONS[0];
      personSustitute.nationality = null;
      personSustitute.documentType = null;
      personSustitute.documentNumber = '';
      personSustitute.dateBirth = getDateYYYMMDD();
      personSustitute.direction = null;
      personSustitute.cellPhone = 0;
      personSustitute.mail = null;
      personSustitute.bank = null;
      personSustitute.accountType = null;
      personSustitute.bankNumber = '';
      personSustitute.bankCCI = '';

      (form.value as QForm).reset();
    };

    const handleForm = async () => {
      if (!personSustitute.bankCCI && !personSustitute.bankNumber) {
        MessageError({
          title: 'Es necesaria el número de cuenta o el código CCI',
        });
        return;
      }

      const sustituteForm = {
        apellido_materno: personSustitute.motherLastName,
        apellido_paterno: personSustitute.lastName,
        celular: personSustitute.cellPhone,
        correo: personSustitute.mail,
        direccion: personSustitute.direction,
        documento: personSustitute.documentNumber,
        estado: 1,
        fecha_ingreso: '2022-01-16',
        fecha_nacimiento: personSustitute.dateBirth,
        nacionalidad: personSustitute.nationality?.id_nacionalidad,
        nombres: personSustitute.name,
        pago: [
          {
            tipo: 1,
            banco: personSustitute.bank?.id_banco,
            tipo_cuenta: personSustitute.accountType?.id_tpcuenta,
            cuenta: personSustitute.bankNumber,
            cuentaCi: personSustitute.bankCCI,
          },
        ],
        sexo: personSustitute.sex?.value,
        tipo_documento: personSustitute.documentType?.id_tpdocumento,
        titular: 1,
        usuario: '1',
      };

      const sustituteFetch = await fetchRequestAPI({
        url: '/adm/suplente/register/personas',
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

      MessageSuccess({ title: MESSAGE_REGISTRO('al suplente') });
      handleResetDataPersonSustitute();
    };

    return { handleForm, SEX_OPTIONS, ...toRefs(personSustitute), form, can };
  },
});
</script>
<style lang="scss" scoped>
@import './FormPersonSustitute.scss';
</style>
