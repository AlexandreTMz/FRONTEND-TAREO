<template>
  <div class="o-registerBank">
    <div class="o-registerBank__card">
      <div class="o-registerBank__card__header">
        <h2 class="o-registerBank__card__header__title">Datos Necesarios</h2>
      </div>

      <div class="o-registerBank__card__body">
        <q-form
          ref="form"
          class="o-registerBank__card__body__form"
          @submit.prevent="handleRegisterBank"
        >
          <div class="o-registerBank__card__body__form__inputGroup">
            <q-input
              v-model="name"
              filled
              dense
              label="Nombres"
              :rules="[
                (val) => (val && val.length > 0) || 'El nombre es obligatorio',
              ]"
            >
              <template v-slot:prepend>
                <q-icon color="primary" name="badge" />
              </template>
            </q-input>
            <q-input
              v-model="abbreviation"
              filled
              dense
              label="Abreviatura"
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'La abreviatura es obligatorio',
              ]"
            >
              <template v-slot:prepend>
                <q-icon color="primary" name="badge" />
              </template>
            </q-input>
          </div>
          <q-select
            v-model="state"
            filled
            dense
            label="Estado"
            :options="options"
            :rules="[
              (val) => (val && val.length > 0) || 'Debe seleccionar un estado ',
            ]"
          >
            <template v-slot:prepend>
              <q-icon color="primary" name="badge" />
            </template>
          </q-select>
          <q-input
            v-model="description"
            filled
            dense
            label="Descripción"
            :rules="[
              (val) =>
                (val && val.length > 0) || 'La Descripción es oblogatorio',
            ]"
          >
            <template v-slot:prepend>
              <q-icon color="primary" name="badge" />
            </template>
          </q-input>

          <div class="o-registerBank__card__body__form__inputGroup">
            <q-btn
              :label="
                id_banco === null || id_banco === '' ? 'Registrar' : 'Grabar'
              "
              :disable="!can('Registrar', 'Banco') && !can('Editar', 'Banco')"
              v-if="can('Registrar', 'Banco') && can('Editar', 'Banco')"
              color="green"
              type="submit"
            />

            <q-btn
              label="Registrar"
              v-else-if="can('Registrar', 'Banco')"
              color="green"
              type="submit"
            />

            <q-btn
              label="Grabar"
              v-else-if="can('Editar', 'Banco')"
              color="green"
              type="submit"
            />

            <q-btn v-else label="Registrar " color="green" disable />

            <q-btn
              label="Limpiar"
              color="primary"
              @click="handleResetDataBank"
            />
          </div>
        </q-form>
      </div>
    </div>

    <div class="o-registerBank__card -table">
      <div class="o-registerBank__card__header">
        <h2 class="o-registerBank__card__header__title">Lista de bancos</h2>
      </div>

      <div class="o-registerBank__card__body">
        <q-table
          flat
          :columns="columnsBanks"
          :rows="banks"
          no-data-label="No hay registros"
          :rows-per-page-options="[25, 50]"
        >
          <template v-slot:top-right>
            <q-input dense placeholder="Buscar" debounce="200" v-model="search">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
          <template v-slot:body-cell-option="props">
            <q-td :props="props">
              <q-btn
                icon="edit"
                fab-mini
                flat
                color="blue"
                :disable="!can('Editar', 'Banco')"
                @click="handleEditBank(props.row)"
              />
              <q-btn
                icon="fas fa-book"
                fab-mini
                flat
                color="blue"
                @click="mtd_slcRowTableLog(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </div>
  <m-modal-log-table
    v-if="isOpenModalLog"
    :isOpenModalLog="isOpenModalLog"
    @mtd_closeModalLog="mtd_closeModalLog"
    :ILogTable="LogBanco"
  ></m-modal-log-table>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  toRefs,
  computed,
  PropType,
} from 'vue';
import { IBank } from 'src/types';
import { can } from 'src/utils/permission';
import { QForm } from 'quasar';
import MModalLogTable from 'src/components/molecules/ModalLogTables';

interface IBankForm {
  name: string | null;
  state: string | null;
  description: string | null;
  abbreviation: string | null;
  id_banco: string | null;
}

export default defineComponent({
  props: {
    rowsBank: {
      type: Array as PropType<IBank[]>,
      default: () => [],
    },
  },
  components: {
    MModalLogTable,
  },
  emits: ['bank'],
  setup(props, { emit }) {
    const columnsBanks = [
      {
        label: 'Nombre',
        field: 'ba_nombre',
        sortable: true,
        align: 'left',
        name: 'ba_nombre',
      },
      {
        label: 'Descripcion',
        field: 'ba_descripcion',
        sortable: true,
        align: 'left',
        name: 'ba_descripcion',
      },
      {
        label: 'Abreviatura',
        field: 'ba_abreviatura',
        sortable: true,
        align: 'left',
        name: 'ba_abreviatura',
      },
      {
        label: 'Estado',
        field: 'estado',
        sortable: true,
        align: 'left',
        name: 'estado',
      },
      {
        label: 'Datos',
        field: 'datos',
        sortable: true,
        align: 'left',
        name: 'datos',
      },
      {
        label: 'Opciones',
        field: 'option',
        align: 'center',
        name: 'option',
      },
    ];

    const options = ['ACTIVO', 'INACTIVO'];
    const search = ref('');
    const form = ref<QForm>();
    const isOpenModalLog = ref(false);
    const LogBanco = ref<IBank>();

    const bank = reactive<IBankForm>({
      name: '',
      state: 'ACTIVO',
      description: '',
      abbreviation: '',
      id_banco: '',
    });

    const mtd_closeModalLog = () => {
      isOpenModalLog.value = false;
    };

    const mtd_slcRowTableLog = (logTable: IBank) => {
      LogBanco.value = logTable;
      isOpenModalLog.value = true;
    };

    const banks = computed(() => {
      return props.rowsBank.filter((item) => {
        const joinData = `${item.ba_nombre} ${item.ba_descripcion} ${item.ba_abreviatura} ${item.estado} ${item.datos}`;
        return (
          joinData.toLowerCase().indexOf(search.value.toLowerCase()) !== -1
        );
      });
    });

    const handleEditBank = (bankEdit: IBank) => {
      bank.name = bankEdit.ba_nombre;
      bank.state = bankEdit.estado;
      bank.description = bankEdit.ba_descripcion;
      bank.abbreviation = bankEdit.ba_abreviatura;
      bank.id_banco = bankEdit.id_banco;
    };

    const handleResetDataBank = () => {
      bank.name = null;
      bank.state = 'ACTIVO';
      bank.description = null;
      bank.abbreviation = null;
      bank.id_banco = null;
      (form.value as QForm).reset();
    };

    const handleRegisterBank = () => {
      const bankForm = {
        ba_nombre: bank.name,
        ba_abreviatura: bank.abbreviation,
        ba_descripcion: bank.description,
        ba_estado: bank.state === 'ACTIVO' ? 1 : 0,
      };

      if (bank.id_banco === '') {
        emit('bank', bankForm);
      } else {
        emit('bank', { ...bankForm, id_banco: bank.id_banco });
      }
      handleResetDataBank();
    };

    return {
      banks,
      columnsBanks,
      ...toRefs(bank),
      options,
      handleEditBank,
      search,
      handleResetDataBank,
      handleRegisterBank,
      form,
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
@import url('./RegisterBank.scss');
</style>
