<template>
  <div class="m-tableHistoryPayment">
    <q-form
      ref="form"
      class="m-tableHistoryPayment__form"
      @submit.prevent="handleForm"
    >
      <div class="m-tableHistoryPayment__form__inputGroup">
        <q-select
          label="Banco"
          dense
          filled
          :options="bankOptions"
          v-model="bank"
          :rules="[
            (val) =>
              (val && val.id_banco.length > 0) || 'El banco es obligatorio ',
          ]"
        >
          <template v-slot:prepend>
            <q-icon name="fas fa-university" color="primary" />
          </template>
        </q-select>
        <q-select
          label="Tipo de cuenta"
          dense
          filled
          :options="accountTypeOptions"
          v-model="accountType"
          :rules="[
            (val) =>
              (val && val.id_tpcuenta.length > 0) ||
              'El tipo de cuenta es obligatorio ',
          ]"
        >
          <template v-slot:prepend>
            <q-icon name="fas fa-university" color="primary" />
          </template>
        </q-select>
        <div class="m-tableHistoryPayment__form__empty"></div>
        <div class="m-tableHistoryPayment__form__empty"></div>
      </div>

      <div class="m-tableHistoryPayment__form__inputGroup">
        <q-input label="Numero" dense filled v-model="bankNumber">
          <template v-slot:prepend>
            <q-icon name="fab fa-cc-visa" color="primary" />
          </template>
        </q-input>
        <div class="m-tableHistoryPayment__form__empty"></div>
      </div>
      <div class="m-tableHistoryPayment__form__inputGroup">
        <q-input label="CCI" dense filled v-model="bankCCI">
          <template v-slot:prepend>
            <q-icon name="fab fa-cc-visa" color="primary" />
          </template>
        </q-input>
        <div class="m-tableHistoryPayment__form__empty"></div>
      </div>

      <div class="m-tableHistoryPayment__form__inputGroup">
        <q-select
          label="Estado"
          dense
          filled
          :options="[
            { label: 'Activo', value: '1' },
            { label: 'Inactivo', value: '0' },
          ]"
          v-model="state"
        >
          <template v-slot:prepend>
            <q-icon name="fab fa-cc-visa" color="primary" />
          </template>
        </q-select>
        <div class="m-tableHistoryPayment__form__empty"></div>
      </div>

      <div class="m-tableHistoryPayment__form__actions">
        <q-btn
          :label="id === '' ? 'Registrar cuenta' : 'Actualizar cuenta'"
          color="green"
          type="submit"
          :disable="!can('Editar', 'Sustituto')"
        />
        <q-btn
          label="Limpiar"
          color="primary"
          :disable="!can('Editar', 'Sustituto')"
        />
      </div>
    </q-form>

    <q-table
      title="Historico de pagos"
      class="m-tableHistoryPayment__table"
      flat
      :columns="columns"
      :rows="rows"
      no-data-label="No hay registros"
      :rows-per-page-options="[25, 50]"
    >
      <template v-slot:body-cell-options="props">
        <q-td :props="props">
          <div class="m-tableHistoryPayment__table__actions">
            <q-btn
              icon="edit"
              flat
              fab-mini
              color="green"
              :disable="!can('Editar', 'Sustituto')"
              @click="handleEditBank(props.row)"
            />
            <q-btn
              icon="fas fa-book"
              fab-mini
              flat
              color="blue"
              @click="mtd_slcRowTableLog(props.row)"
            />
            <!-- <q-btn
              icon="fas fa-minus-circle"
              flat
              fab-mini
              color="negative"
              :disable="String(props.row.phb_estado) === '0'"
              @click="handleChangeStateBank(props.row, 0)"
            /> -->
            <!-- <q-btn
              icon="fas fa-check-circle"
              flat
              fab-mini
              color="green"
              :disable="String(props.row.phb_estado) === '1'"
              @click="handleChangeStateBank(props.row, 1)"
            /> -->
          </div>
        </q-td>
      </template>
    </q-table>
  </div>
  <m-modal-log-table
    v-if="isOpenModalLog"
    :isOpenModalLog="isOpenModalLog"
    @mtd_closeModalLog="mtd_closeModalLog"
    :ILogTable="LogBanco"
  ></m-modal-log-table>
</template>

<script lang="ts">
import { QForm } from 'quasar';
import { useStore } from 'src/store';
import {
  IAccountType,
  IBank,
  IDatosBank,
  IDatosSustitute,
  IResponseFetch,
  ISuplente,
} from 'src/types';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';
import { MessageError, MessageSuccess } from 'src/utils/swal';
import { can } from 'src/utils/permission';
import {
  defineComponent,
  PropType,
  ref,
  onMounted,
  reactive,
  toRefs,
} from 'vue';

import {
  MESSAGE_ANULAR,
  MESSAGE_EDITAR,
  MESSAGE_HABILITADO,
  MESSAGE_REGISTRO,
} from 'src/utils/messages';
import { getCreateUserTrack } from 'src/utils/userTrack';
import MModalLogTable from 'src/components/molecules/ModalLogTables';

interface IFormBank {
  bank: null | IBank;
  accountType: null | IAccountType;
  bankNumber: null | string;
  bankCCI: null | string;
  id: null | string;
  state: IFormOption;
}

interface IFormOption {
  value: string;
  label: string;
}

export default defineComponent({
  name: 'MTableHistoryPayment',
  components: {
    MModalLogTable,
  },
  props: {
    bankOptions: {
      type: Array as PropType<IBank[]>,
      default: () => [],
    },
    accountTypeOptions: {
      type: Array as PropType<IAccountType[]>,
      default: () => [],
    },
    idSustitute: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const columns = [
      {
        label: 'Banco',
        name: 'banco',
        field: 'banco',
        align: 'left',
      },
      {
        label: 'Cuenta',
        name: 'phb_cuenta',
        field: 'phb_cuenta',
        align: 'center',
      },
      {
        label: 'CCI',
        name: 'phb_cci',
        field: 'phb_cci',
        align: 'left',
      },
      {
        label: 'Estado',
        name: 'estado',
        field: 'estado',
        align: 'center',
      },
      {
        label: 'Opciones',
        name: 'options',
        field: 'options',
        align: 'center',
      },
    ];

    const rows = ref<IDatosBank[]>([]);
    const rowsSustitute = ref<IDatosSustitute[]>();
    const form = ref<QForm>();
    const { commit } = useStore();
    const sustituteSelect = ref<ISuplente | null>();
    const sustitutes = ref<ISuplente[]>([]);
    const searchSustitute = ref();
    const userTrack = getCreateUserTrack();
    const isOpenModalLog = ref(false);
    const LogBanco = ref<IDatosBank>();

    const formBank = reactive<IFormBank>({
      bank: null,
      accountType: null,
      bankNumber: null,
      bankCCI: null,
      id: '',
      state: { label: 'Activo', value: '1' },
    });

    const mtd_closeModalLog = () => {
      isOpenModalLog.value = false;
    };

    const mtd_slcRowTableLog = (logTable: IDatosBank) => {
      LogBanco.value = logTable;
      isOpenModalLog.value = true;
    };

    const handleForm = async () => {
      if (!formBank.bankNumber && !formBank.bankCCI) {
        MessageError({ title: 'Debe ingresar una cuenta de banco o CCI' });

        return;
      }

      let body = {
        id_persona: props.idSustitute,
        id_banco: formBank.bank?.id_banco,
        id_tpcuenta: formBank.accountType?.id_tpcuenta,
        phb_cuenta: formBank.bankNumber,
        phb_cci: formBank.bankCCI,
        id_phbanco: formBank.id === '' ? null : formBank.id,
        phb_estado: formBank.state.value,
      };

      const bankFetch = await fetchRequestAPI({
        url: 'adm/suplente/actualizar/cuenta',
        body: JSON.stringify({ ...body, ...userTrack }),
        method: 'POST',
      });

      if (
        readErrorFetch({
          responseFetch: bankFetch,
          message:
            formBank.id === ''
              ? 'La cuenta no se pudo registrar'
              : 'La cuenta no se ha podido actualizar',
        })
      ) {
        return;
      }

      console.log('id banck', formBank.id);

      MessageSuccess({
        title:
          formBank.id === ''
            ? MESSAGE_REGISTRO('la cuenta')
            : MESSAGE_EDITAR('la cuenta'),
      });
      resetFormData();
      await getAsyncData();
    };

    const resetFormData = () => {
      formBank.bank = null;
      formBank.bankNumber = null;
      formBank.bankCCI = null;
      formBank.id = '';

      form.value?.reset();
    };

    const getAsyncData = async () => {
      const countFetch = await fetchRequestAPI({
        url: `/adm/suplente/cuentas/${props.idSustitute}`,
        method: 'GET',
      });

      if (
        readErrorFetch({
          responseFetch: countFetch,
          message: 'Ocurrió un error al mostrar los cuentas',
        })
      ) {
        return;
      }

      rows.value = (countFetch as IResponseFetch).data as IDatosBank[];
    };

    const handleEditBank = (bankParam: IDatosBank) => {
      formBank.bank = props.bankOptions.find(
        (item) => item.id_banco === bankParam.id_banco
      ) as IBank;

      formBank.accountType = props.accountTypeOptions.find(
        (item) => item.id_tpcuenta === bankParam.id_tpcuenta
      ) as IAccountType;

      formBank.bankNumber = bankParam.phb_cuenta;
      formBank.bankCCI = bankParam.phb_cci;
      formBank.id = bankParam.id_phbanco;
    };

    const handleChangeStateBank = async (
      bankParam: IDatosBank,
      active: number
    ) => {
      commit('commitLoading', true);
      const salaryFetch = (await fetchRequestAPI({
        url: '/adm/persona/empleado/cuenta/titular',
        method: 'PUT',
        body: JSON.stringify({
          id_persona: props.idSustitute,
          id_phbbanco: bankParam.id_phbanco,
          opcion: active,
          ...userTrack,
        }),
      })) as boolean;

      if (
        readErrorFetch({
          responseFetch: salaryFetch,
          message:
            active === 0
              ? 'Ocurrió un error al deshabilitar la cuenta'
              : 'Ocurrió un error al activar la cuenta',
        })
      ) {
        commit('commitLoading', false);
        return;
      }

      commit('commitLoading', false);

      MessageSuccess({
        title:
          active === 0
            ? MESSAGE_ANULAR('la cuenta')
            : MESSAGE_HABILITADO('la cuenta'),
      });

      await getAsyncData();
    };

    onMounted(async () => {
      await getAsyncData();
    });

    return {
      columns,
      rows,
      ...toRefs(formBank),
      handleForm,
      handleEditBank,
      form,
      handleChangeStateBank,
      resetFormData,
      sustitutes,
      searchSustitute,
      sustituteSelect,
      rowsSustitute,
      can,
      mtd_closeModalLog,
      isOpenModalLog,
      mtd_slcRowTableLog,
      LogBanco,
    };
  },
});
</script>

<style lang="scss" scoped>
@import './TableHistoryPaymentSustitute.scss';
</style>
