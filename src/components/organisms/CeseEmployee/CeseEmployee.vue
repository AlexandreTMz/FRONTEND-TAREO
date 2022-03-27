<template>
  <div class="o-ceseEmployee">
    <div class="o-ceseEmployee__box -filter">
      <div class="o-ceseEmployee__box__header">
        <h2 class="o-ceseEmployee__box__header__title">Buscar empleado</h2>
      </div>

      <div class="o-ceseEmployee__box__body">
        <q-form
          class="o-ceseEmployee__box__body__form"
          @submit.prevent="handleForm"
        >
          <q-select
            filled
            dense
            :options="optionsState"
            v-model="optionSelected"
          >
            <template v-slot:prepend>
              <q-icon name="event" />
            </template>
          </q-select>

          <q-input
            v-if="optionSelected.value === 1"
            label="Documentos"
            filled
            dense
            v-model="document"
          >
            <template v-slot:prepend>
              <q-icon name="event" />
            </template>
          </q-input>

          <q-input
            v-if="optionSelected.value === 2"
            label="Nombre"
            filled
            dense
            v-model="name"
          >
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>

          <q-select
            v-if="optionSelected.value === 3"
            label="Sede"
            filled
            dense
            :options="optionsCampus"
            v-model="sede"
          >
            <template v-slot:prepend>
              <q-icon name="event" />
            </template>
          </q-select>

          <q-select
            v-if="optionSelected.value === 4"
            label="Cargo"
            filled
            dense
            :options="optionsPosition"
            v-model="position"
          >
            <template v-slot:prepend>
              <q-icon name="event" />
            </template>
          </q-select>

          <q-btn label="Buscar" color="primary" type="submit" />
        </q-form>
      </div>
    </div>

    <div class="o-ceseEmployee__box">
      <div class="o-ceseEmployee__box__header">
        <h2 class="o-ceseEmployee__box__header__title">Lista de Empleados</h2>
      </div>

      <div class="o-ceseEmployee__box__body">
        <q-table
          flat
          no-data-label="No hay registros"
          :columns="columnsEmpleado"
          :rows="rows"
          :rows-per-page-options="[50, 100]"
        >
          <template v-slot:body-cell-ce_estado="props">
            <q-td :props="props">
              <q-badge
                :color="props.row.ce_estado === '0' ? 'orange' : 'green'"
              >
                {{ props.row.ce_estado === '0' ? 'CESADO' : 'ACTIVO' }}
              </q-badge>
            </q-td>
          </template>
          <template v-slot:body-cell-ce_historial="props">
            <q-td :props="props">
              <q-btn
                icon="fas fa-eye"
                flat
                fab-mini
                color="blue"
                :disable="props.row.ce_cantidad !== null ? false : true"
                @click="handleSelectHistoryCese(props.row)"
              ></q-btn>
            </q-td>
          </template>
          <template v-slot:body-cell-control="props">
            <q-td :props="props">
              <q-btn
                icon="fas fa-edit"
                flat
                fab-mini
                color="green"
                :disable="
                  props.row.id_cese !== null
                    ? true
                    : !can('Registrar', 'Cese')
                    ? true
                    : false
                "
                @click="handleSelectEmployeeCese(props.row)"
              ></q-btn>
              <q-btn
                icon="fas fa-minus-circle q-icon"
                flat
                fab-mini
                color="red"
                :disable="
                  props.row.id_cese !== null
                    ? !can('Anular', 'Cese')
                      ? true
                      : false
                    : true
                "
                @click="handleSelectCancelCese(props.row)"
              ></q-btn>
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
    <m-modal-cese-employee
      v-if="isOpenModalAddCese"
      :isOpenModal="isOpenModalAddCese"
      :idEmployee="idEmployeeSelect"
      @close-modal="handleCloseModalAddCese"
      :handleForm="handleForm"
    />

    <m-modal-cese-cancel
      v-if="isOpenModalCancelCese"
      :isOpenModal="isOpenModalCancelCese"
      :CeseEmployeeCancel="ceseEmployeeSelect"
      @close-modal="handleCloseModalCancelCese"
      :handleForm="handleForm"
    />

    <m-modal-cese-history
      v-if="isOpenModalHistoryCese"
      :isOpenModal="isOpenModalHistoryCese"
      :CeseEmployeeCancel="ceseEmployeeSelect"
      @close-modal="handleCloseModalHistoryCese"
      :handleForm="handleForm"
    />

    <m-modal-log-table
      v-if="isOpenModalLog"
      :isOpenModalLog="isOpenModalLog"
      @mtd_closeModalLog="mtd_closeModalLog"
      :ILogTable="LogCeseEmpleado"
    ></m-modal-log-table>
  </div>
</template>

<script lang="ts">
import { ICeseEmployee } from 'src/types';
import { defineComponent, ref, PropType } from 'vue';
import MModalCeseEmployee from 'components/molecules/ModalCeseEmployee';
import MModalCeseCancel from 'components/molecules/ModalCeseCancel';
import MModalCeseHistory from 'components/molecules/ModalCeseHistory';
import { can } from 'src/utils/permission';
import { MessageError } from 'src/utils/swal';
import { MESSAGE_LISTANEGRA } from 'src/utils/messages';
import MModalLogTable from 'src/components/molecules/ModalLogTables';

interface IFormOption {
  value: string;
  label: string;
}

export default defineComponent({
  name: 'TCeseEmployee',
  components: {
    MModalCeseEmployee,
    MModalCeseCancel,
    MModalCeseHistory,
    MModalLogTable,
  },
  props: {
    optionsPosition: {
      type: Array as PropType<IFormOption[]>,
      default: () => [],
    },
    optionsCampus: {
      type: Array as PropType<IFormOption[]>,
      default: () => [],
    },
    rows: {
      type: Array as PropType<ICeseEmployee[]>,
      default: () => [],
    },
  },
  setup(_, { emit }) {
    const columnsEmpleado = [
      {
        label: 'TP. Documento',
        field: 'tpd_descripcion',
        sortable: true,
        align: 'left',
        name: 'tpd_descripcion',
      },
      {
        label: 'Documento',
        field: 'per_documento',
        sortable: true,
        align: true,
        name: 'per_documento',
      },
      {
        label: 'Nombres',
        field: 'datos',
        sortable: true,
        align: 'left',
        name: 'datos',
      },
      {
        label: 'Nacionalidad',
        field: 'na_descripcion',
        sortable: true,
        align: 'left',
        name: 'na_descripcion',
      },
      {
        label: 'Cargo',
        field: 'ca_descripcion',
        sortable: true,
        align: 'left',
        name: 'ca_descripcion',
      },
      {
        label: 'Estado',
        field: 'ce_estado',
        sortable: true,
        align: 'left',
        name: 'ce_estado',
      },
      {
        label: 'Historial',
        field: 'ce_historial',
        sortable: true,
        align: 'left',
        name: 'ce_historial',
      },
      {
        label: 'Control',
        field: 'control',
        sortable: true,
        align: 'left',
        name: 'control',
      },
    ];
    const optionsState = [
      {
        label: 'Documento',
        value: 1,
      },
      {
        label: 'Nombre',
        value: 2,
      },
      {
        label: 'Sede',
        value: 3,
      },
      {
        label: 'Cargo',
        value: 4,
      },
    ];

    const document = ref('');
    const name = ref('');
    const sede = ref<IFormOption | null>(null);
    const position = ref<IFormOption | null>(null);
    const idEmployeeSelect = ref<null | ICeseEmployee>(null);
    const ceseEmployeeSelect = ref<null | ICeseEmployee>(null);

    const isOpenModalAddCese = ref(false);
    const isOpenModalCancelCese = ref(false);
    const isOpenModalHistoryCese = ref(false);

    const isOpenModalLog = ref(false);
    const LogCeseEmpleado = ref<ICeseEmployee>();

    const optionSelected = ref({
      label: 'Documento',
      value: 1,
    });

    const mtd_closeModalLog = () => {
      isOpenModalLog.value = false;
    };

    const mtd_slcRowTableLog = (logTable: ICeseEmployee) => {
      LogCeseEmpleado.value = logTable;
      isOpenModalLog.value = true;
    };

    const handleForm = () => {
      emit('select-filter', {
        documento: document.value,
        nombres: name.value,
        sede: sede.value?.value || null,
        cargo: position.value?.value || null,
        opcion: optionSelected.value.value,
      });
    };

    const handleSelectEmployeeCese = (idEmployee: ICeseEmployee) => {
      idEmployeeSelect.value = idEmployee;
      isOpenModalAddCese.value = true;
    };

    const handleCloseModalAddCese = () => {
      isOpenModalAddCese.value = false;
    };

    const handleSelectCancelCese = (CeseEmploye: ICeseEmployee) => {
      if (String(CeseEmploye.ls_estado) === '1') {
        MessageError({
          title: MESSAGE_LISTANEGRA(),
        });
        return;
      }
      ceseEmployeeSelect.value = CeseEmploye;
      isOpenModalCancelCese.value = true;
    };

    const handleCloseModalCancelCese = () => {
      isOpenModalCancelCese.value = false;
    };

    const handleSelectHistoryCese = (CeseEmploye: ICeseEmployee) => {
      ceseEmployeeSelect.value = CeseEmploye;
      isOpenModalHistoryCese.value = true;
    };

    const handleCloseModalHistoryCese = () => {
      isOpenModalHistoryCese.value = false;
    };

    return {
      handleForm,
      columnsEmpleado,
      optionsState,
      optionSelected,
      document,
      name,
      sede,
      position,
      isOpenModalAddCese,
      handleCloseModalAddCese,
      idEmployeeSelect,
      handleSelectEmployeeCese,
      handleSelectCancelCese,
      handleCloseModalCancelCese,
      isOpenModalCancelCese,
      ceseEmployeeSelect,
      handleSelectHistoryCese,
      handleCloseModalHistoryCese,
      isOpenModalHistoryCese,
      can,
      mtd_closeModalLog,
      isOpenModalLog,
      mtd_slcRowTableLog,
      LogCeseEmpleado,
    };
  },
});
</script>

<style lang="scss" scoped>
@import './CeseEmployee.scss';
</style>
