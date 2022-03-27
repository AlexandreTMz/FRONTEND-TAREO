<template>
  <div class="o-formListBlackEmployee">
    <div class="o-formListBlackEmployee__box -filter">
      <div class="o-formListBlackEmployee__box__header">
        <h2 class="o-formListBlackEmployee__box__header__title">
          Buscar empleado
        </h2>
      </div>

      <div class="o-formListBlackEmployee__box__body">
        <q-form
          class="o-formListBlackEmployee__box__body__form"
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
            v-if="optionSelected.value === 2"
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
            v-if="optionSelected.value === 3"
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

          <q-select
            label="Estado"
            filled
            dense
            v-model="stateLife"
            :options="optionsStateLife"
            @update:model-value="mtd_eliminar_rows()"
          >
            <template color="primary" v-slot:prepend>
              <q-icon color="primary" name="fas fa-clipboard-check"></q-icon>
            </template>
          </q-select>

          <q-btn label="Buscar" color="primary" type="submit"></q-btn>
        </q-form>
      </div>
    </div>

    <div class="o-formListBlackEmployee__box">
      <div class="o-formListBlackEmployee__box__header">
        <h2 class="o-formListBlackEmployee__box__header__title">
          Lista de negra de empleados
        </h2>
      </div>

      <div class="o-formListBlackEmployee__box__body">
        <q-table
          flat
          no-data-label="No hay registros"
          :columns="columnsEmpleado"
          :rows="rows"
          :rows-per-page-options="[50, 100]"
        >
          <template v-slot:body-cell-control="props">
            <q-td :props="props">
              <q-btn
                icon="settings"
                flat
                fab-mini
                v-if="String(stateLife) === 'ACTIVO'"
                color="red"
                @click="handleSelectEmployeeListBlack(props.row)"
                :disable="!can('Anular', 'Lista Negra')"
              ></q-btn>
              <q-btn
                icon="fas fa-eye q-icon"
                flat
                fab-mini
                color="blue"
                v-if="String(stateLife) === 'INACTIVO'"
                @click="mtd_selectListBlackHistory(props.row)"
                :disable="!can('Anular', 'Lista Negra')"
                title="Motivo lista negra"
              ></q-btn>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
    <m-modal-list-black-employee
      v-if="isOpenModal"
      :isOpenModal="isOpenModal"
      :idListBlack="idListBlackSelect"
      @close-modal="handleCloseModal"
      :handleForm="handleForm"
    />

    <m-modal-list-black-history
      v-if="isOpenModalHistory"
      :isOpenModalHistory="isOpenModalHistory"
      :EmployeeListBlack="idListBlackSelect"
      @close-modal-history="mtd_closeModalListBlackHistory"
      :handleForm="handleForm"
    >
    </m-modal-list-black-history>
  </div>
</template>

<script lang="ts">
import { IListaNegra } from 'src/types';
import { defineComponent, PropType, ref } from 'vue';
import MModalListBlackEmployee from 'components/molecules/ModalListBlackEmployee';
import MModalListBlackHistory from 'components/molecules/ModalListBlackHistory';

import { can } from 'src/utils/permission';
import { MessageCommon } from 'src/utils/swal';

interface IFormOption {
  value: string;
  label: string;
}

export default defineComponent({
  name: 'OFormListBlackEmployee',
  components: {
    MModalListBlackEmployee,
    MModalListBlackHistory,
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
      type: Array as PropType<IListaNegra[]>,
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
        label: 'Control',
        field: 'control',
        sortable: true,
        align: 'left',
        name: 'control',
      },
    ];
    const optionsState = [
      {
        label: 'Nombre',
        value: 1,
      },
      {
        label: 'Sede',
        value: 2,
      },
      {
        label: 'Cargo',
        value: 3,
      },
    ];

    const optionsStateLife = ['ACTIVO', 'INACTIVO'];

    const document = ref('');
    const name = ref('');
    const sede = ref<IFormOption | null>(null);
    const position = ref<IFormOption | null>(null);
    const idListBlackSelect = ref<null | IListaNegra>(null);
    const stateLife = ref('ACTIVO');

    const isOpenModal = ref(false);
    const isOpenModalHistory = ref(false);

    const optionSelected = ref({
      label: 'Nombre',
      value: 1,
    });

    const handleForm = () => {
      emit('select-filter', {
        documento: document.value,
        nombres: name.value,
        sede: sede.value?.value || null,
        cargo: position.value?.value || null,
        opcion: optionSelected.value.value,
        estado: stateLife.value === 'ACTIVO' ? 1 : 0,
      });
    };

    const mtd_verMotivo = (employeeSelect: IListaNegra) => {
      MessageCommon({
        title: 'Motivo de lista negra',
        text: `
            <div style='text-align: left;'>
              ${employeeSelect.lis_motivo}
            </div>
          `,
      });
    };

    const mtd_eliminar_rows = () => {
      emit('mtd_clearRows');
    };

    const handleSelectEmployeeListBlack = (employeeSelect: IListaNegra) => {
      idListBlackSelect.value = employeeSelect;
      isOpenModal.value = true;
    };

    const handleCloseModal = () => {
      isOpenModal.value = false;
    };


    const mtd_selectListBlackHistory = (employeeSelect: IListaNegra) => {
      idListBlackSelect.value = employeeSelect;
      isOpenModalHistory.value = true;
    };

    const mtd_closeModalListBlackHistory = () => {
      isOpenModalHistory.value = false;
    };

    return {
      mtd_selectListBlackHistory,
      mtd_closeModalListBlackHistory,
      isOpenModalHistory,
      handleForm,
      columnsEmpleado,
      optionsState,
      optionSelected,
      document,
      name,
      sede,
      position,
      isOpenModal,
      handleCloseModal,
      idListBlackSelect,
      handleSelectEmployeeListBlack,
      can,
      optionsStateLife,
      stateLife,
      mtd_eliminar_rows,
      mtd_verMotivo,
    };
  },
});
</script>

<style lang="scss" scoped>
@import url('./FormListBlackEmployee.scss');
</style>
