<template>
  <div class="m-tableHistoryPayment">
    <div>
      <h2 class="m-tableHistoryPayment__title">Cuentas Propias</h2>

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
        </div>

        <div class="o-editEmployee__form__card__body__inputGroup">
          <q-input label="Numero" dense filled v-model="bankNumber">
            <template v-slot:prepend>
              <q-icon name="fab fa-cc-visa" color="primary" />
            </template>
          </q-input>
        </div>
        <div class="m-tableHistoryPayment__form__inputGroup">
          <q-input label="CCI" dense filled v-model="bankCCI">
            <template v-slot:prepend>
              <q-icon name="fab fa-cc-visa" color="primary" />
            </template>
          </q-input>
        </div>

        <div class="m-tableHistoryPayment__form__actions">
          <q-btn
            :label="id === null ? 'Registrar cuenta' : 'Actualizar cuenta'"
            color="green"
            type="submit"
            :disable="!can('Acceso Forma de pago', 'Empleado', 'Editar')"
          />
          <q-btn label="Limpiar" color="primary" />
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
                @click="handleEditBank(props.row)"
              />
              <q-btn
                icon="fas fa-minus-circle"
                flat
                fab-mini
                color="negative"
                :disable="
                  !can('Acceso Forma de pago', 'Empleado', 'Editar') ||
                  String(props.row.phb_estado) === '0'
                "
                @click="handleChangeStateBank(props.row, 0)"
              />
              <q-btn
                icon="fas fa-check-circle"
                flat
                fab-mini
                color="green"
                :disable="
                  !can('Acceso Forma de pago', 'Empleado', 'Editar') ||
                  String(props.row.phb_estado) === '1'
                "
                @click="handleChangeStateBank(props.row, 1)"
              />
              <q-btn
                icon="fas fa-book"
                fab-mini
                flat
                color="blue"
                @click="mtd_slcRowTableLog(props.row)"
              />
            </div>
          </q-td>
        </template>
      </q-table>
    </div>

    <div>
      <h2 class="m-tableHistoryPayment__title">Suplentes</h2>
      <div class="m-tableHistoryPayment__form -document">
        <q-input
          class="m-tableHistoryPayment__form__input"
          label="Documento/Nombres"
          dense
          filled
          v-model="searchSustitute"
        />

        <q-btn
          class="m-tableHistoryPayment__form__button"
          label="Buscar"
          color="primary"
          :disable="!can('Acceso Forma de pago', 'Empleado', 'Editar')"
          dense
          @click="handleSearchEmployee"
        />
        <q-btn
          class="m-tableHistoryPayment__form__button"
          label="Agregar Pesona"
          color="green"
          dense
          target="_blank"
          :to="{ name: 'RegisterSubstitute' }"
          :disable="!can('Acceso Forma de pago', 'Empleado', 'Editar')"
        />
      </div>

      <q-list class="m-tableHistoryPayment__list">
        <q-item
          v-for="item in sustitutes"
          :key="item.id_persona"
          :class="{
            'm-tableHistoryPayment__active':
              sustituteSelect && item.id_persona === sustituteSelect.id_persona,
          }"
          :disable="isExistsSustitute(item.per_documento)"
        >
          <q-item-section top avatar>
            <q-avatar rounded>
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ item.datos }}</q-item-label>
            <q-item-label caption
              ><div class="m-tableHistoryPayment__list__information">
                <div><strong>Banco :</strong> {{ item.banco }}</div>
                <div>
                  <strong>Tipo cuenta :</strong> {{ item.tpc_descripcion }}
                </div>
                <div><strong>Cuenta : </strong>{{ item.phb_cuenta }}</div>
                <div><strong>CCI : </strong>{{ item.phb_cci }}</div>
              </div></q-item-label
            >
          </q-item-section>

          <q-item-section side>
            <q-item-label caption>
              <q-btn
                label="Seleccionar"
                color="green"
                size="sm"
                @click="handleSelectSustitute(item)"
                :disable="!can('Acceso Forma de pago', 'Empleado', 'Editar')"
                v-if="!isExistsSustitute(item.per_documento)"
              />

              <q-chip v-else color="red" size="small" text-color="white"
                >REGISTRADO</q-chip
              >
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <br />
      <q-btn
        v-if="sustituteSelect"
        label="Registrar suplente"
        color="green"
        @click="handleAddSustitute"
        :disable="!can('Acceso Forma de pago', 'Empleado', 'Editar')"
      />
      <br />

      <q-table
        key="table-sustitute"
        flat
        :columns="columnsSustitute"
        :rows="rowsSustitute"
        no-data-label="No hay registros"
        :rows-per-page-options="[25, 50]"
      >
        <template v-slot:body-cell-options="props">
          <q-td :props="props">
            <div class="m-tableHistoryPayment__table__actions">
              <q-btn
                icon="fas fa-minus-circle"
                flat
                fab-mini
                color="negative"
                :disable="
                  !can('Acceso Forma de pago', 'Empleado', 'Editar') ||
                  String(props.row.suc_estado) === '0'
                "
                @click="handleChangeStateSustitute(props.row, 0)"
              />
              <q-btn
                icon="fas fa-check-circle"
                flat
                fab-mini
                color="green"
                :disable="
                  !can('Acceso Forma de pago', 'Empleado', 'Editar') ||
                  String(props.row.suc_estado) === '1'
                "
                @click="handleChangeStateSustitute(props.row, 1)"
              />
            </div>
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
  <m-modal-log-table
    v-if="isOpenModalLog"
    :isOpenModalLog="isOpenModalLog"
    @mtd_closeModalLog="mtd_closeModalLog"
    :ILogTable="LogDatosPago"
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
import {
  defineComponent,
  PropType,
  ref,
  onMounted,
  reactive,
  toRefs,
} from 'vue';
import { can } from 'src/utils/permission';
import { removeAccents } from 'src/utils/regEx';
import { getCreateUserTrack } from 'src/utils/userTrack';
import MModalLogTable from 'src/components/molecules/ModalLogTables';

interface IFormBank {
  bank: null | IBank;
  accountType: null | IAccountType;
  bankNumber: null | string;
  bankCCI: null | string;
  id: null | string;
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
    idEmployee: {
      type: String,
      default: '',
    },
    documentEmployee: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const columns = [
      {
        label: 'Banco',
        name: 'ba_nombre',
        field: 'ba_nombre',
        align: 'left',
      },
      {
        label: 'Tipo de Cuenta',
        name: 'tpc_descripcion',
        field: 'tpc_descripcion',
        align: 'center',
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

    const columnsSustitute = [
      {
        label: 'Nombres',
        name: 'datos',
        field: 'datos',
        align: 'left',
      },
      {
        label: 'Banco',
        name: 'banco',
        field: 'banco',
        align: 'center',
      },
      {
        label: 'Tipo de cuenta',
        name: 'tpc_descripcion',
        field: 'tpc_descripcion',
        align: 'center',
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
    const LogDatosPago = ref<IDatosBank>();

    const formBank = reactive<IFormBank>({
      bank: null,
      accountType: null,
      bankNumber: null,
      bankCCI: null,
      id: null,
    });

    const mtd_closeModalLog = () => {
      isOpenModalLog.value = false;
    };

    const mtd_slcRowTableLog = (logTable: IDatosBank) => {
      LogDatosPago.value = logTable;
      isOpenModalLog.value = true;
    };
    const handleForm = async () => {
      if (!formBank.bankNumber && !formBank.bankCCI) {
        MessageError({ title: 'Debe ingresar una cuenta de banco o CCI' });

        return;
      }

      let body = {
        id_persona: props.idEmployee,
        id_banco: formBank.bank?.id_banco,
        id_tpcuenta: formBank.accountType?.id_tpcuenta,
        phb_cuenta: formBank.bankNumber,
        phb_cci: formBank.bankCCI,
        id_phbbanco: formBank.id === null ? 0 : formBank.id,
      };

      const bankFetch = await fetchRequestAPI({
        url: '/adm/persona/empleado/cuenta/titular',
        body: JSON.stringify({ ...body, ...userTrack }),
        method: 'POST',
      });

      if (
        readErrorFetch({
          responseFetch: bankFetch,
          message:
            formBank.id === null
              ? 'La cuenta no se pudo registrar'
              : 'La cuenta no se ha podido actualizar',
        })
      ) {
        return;
      }

      MessageSuccess({
        title:
          formBank.id === null
            ? 'La cuenta se ha registrado'
            : 'La cuenta se  actualizo',
      });
      resetFormData();
      await getAsyncData();
      await getAsyncDataSustitute();
    };

    const resetFormData = () => {
      formBank.bank = null;
      formBank.bankNumber = null;
      formBank.bankCCI = null;
      formBank.id = null;
      form.value?.reset();
    };

    const getAsyncData = async () => {
      const countFetch = await fetchRequestAPI({
        url: `/adm/persona/empleado/cuentas/${props.idEmployee}`,
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

    const getAsyncDataSustitute = async () => {
      const sustitutetFetch = await fetchRequestAPI({
        url: `/adm/persona/empleado/suplente/${props.idEmployee}`,
        method: 'GET',
      });

      if (
        readErrorFetch({
          responseFetch: sustitutetFetch,
          message: 'Ocurrió un error al mostrar los suplentes',
        })
      ) {
        return;
      }

      rowsSustitute.value = (sustitutetFetch as IResponseFetch)
        .data as IDatosSustitute[];
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
          id_persona: props.idEmployee,
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
              ? 'Ocurrió un error al desabilitar la cuenta'
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
            ? 'Cuenta deshabilitada satisfactoriamente!'
            : 'Cuenta activada satisfactoriamente!',
      });

      await getAsyncData();
      await getAsyncDataSustitute();
    };

    const handleChangeStateSustitute = async (
      sustituteParam: IDatosSustitute,
      active: number
    ) => {
      commit('commitLoading', true);
      const salaryFetch = await fetchRequestAPI({
        url: '/adm/persona/empleado/cuenta/tercero',
        method: 'PUT',
        body: JSON.stringify({
          id_persona: props.idEmployee,
          id_sucobrar: sustituteParam.id_sucobrar,
          opcion: active,
          ...userTrack,
        }),
      });

      if (
        readErrorFetch({
          responseFetch: salaryFetch,
          message:
            active === 0
              ? 'Ocurrió un error al desabilitar la cuenta'
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
            ? 'Cuenta deshabilitada satisfactoriamente!'
            : 'Cuenta activada satisfactoriamente!',
      });

      await getAsyncData();
      await getAsyncDataSustitute();
    };

    const handleSearchEmployee = async () => {
      if (Number(String(searchSustitute.value).length) <= 0) {
        commit('commitLoading', false);
        return
      }
      commit('commitLoading', true);
      const employeeFetch = await fetchRequestAPI({
        url: `/adm/persona/suplente/tareo/${String(
          removeAccents(searchSustitute.value) || ''
        )}`,
        method: 'GET',
      });

      if (
        !readErrorFetch({
          responseFetch: employeeFetch,
          message: 'Ocurrió un error!',
        })
      ) {
        commit('commitLoading', false);
        const sustituSearch = (employeeFetch as IResponseFetch)
          .data as ISuplente[];
        sustitutes.value = sustituSearch.filter(
          (item) => item.per_documento !== props.documentEmployee
        );
      }
      commit('commitLoading', false);
    };

    const handleSelectSustitute = (sustituteParam: ISuplente) => {
      sustituteSelect.value = sustituteParam;
      sustitutes.value = sustitutes.value.filter(
        (item) => item.id_persona === sustituteParam.id_persona
      );
    };

    const handleAddSustitute = async () => {
      commit('commitLoading', true);
      const sustituteFetch = await fetchRequestAPI({
        url: '/adm/persona/empleado/cuenta/tercero',
        method: 'POST',
        body: JSON.stringify({
          id_origen: props.idEmployee,
          doc_suplente: sustituteSelect.value?.per_documento,
          ...userTrack,
        }),
      });

      if (
        readErrorFetch({
          responseFetch: sustituteFetch,
          message: 'Ocurrió un error el suplente  no se pudo registrar',
        })
      ) {
        commit('commitLoading', false);
        return;
      }
      commit('commitLoading', false);
      MessageSuccess({ title: 'El suplente ha sido registrado con exito' });
      sustitutes.value = [];
      sustituteSelect.value = null;
      searchSustitute.value = '';
      await getAsyncData();
      await getAsyncDataSustitute();
    };

    const isExistsSustitute = (documentSustitute: string) => {
      if (rowsSustitute.value?.length === 0) {
        return false;
      }
      return (rowsSustitute.value as IDatosSustitute[]).some(
        (item) => String(item.per_documento) === String(documentSustitute)
      );
    };

    onMounted(async () => {
      await getAsyncDataSustitute();
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
      handleSearchEmployee,
      sustitutes,
      searchSustitute,
      sustituteSelect,
      handleAddSustitute,
      handleSelectSustitute,
      columnsSustitute,
      rowsSustitute,
      handleChangeStateSustitute,
      can,
      isExistsSustitute,
      mtd_closeModalLog,
      isOpenModalLog,
      mtd_slcRowTableLog,
      LogDatosPago,
    };
  },
});
</script>

<style lang="scss" scoped>
@import './TableHistoryPayment.scss';
</style>
