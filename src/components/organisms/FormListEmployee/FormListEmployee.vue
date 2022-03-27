<template>
  <div class="o-formListEmployee">
    <div
      class="o-formListEmployee__wraper o-formListEmployee__wraper--center o-formListEmployee__wraper--sm"
    >
      <div class="o-formListEmployee__header">Opciones de búsqueda</div>
      <q-form
        class="o-formListEmployee__form"
        ref="form"
        @submit.prevent="mtd_handleSearchEmployee"
      >
        <div class="o-formListEmployee__box">
          <div class="o-formListEmployee__inputGroups">
            <q-select
              label="Filtrar por"
              filled
              dense
              v-model="filter"
              :options="optionsState"
            >
              <template color="primary" v-slot:prepend>
                <q-icon color="primary" name="fas fa-clipboard-check"></q-icon>
              </template>
            </q-select>
          </div>
          <div
            class="o-formListEmployee__inputGroups"
            v-if="filter?.value == 1"
          >
            <q-input
              label="Documento"
              filled
              dense
              v-model="filterDocument"
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Debe ingresar un documento',
              ]"
            >
              <template v-slot:prepend>
                <q-icon color="primary" name="fas fa-map-signs" />
              </template>
            </q-input>
          </div>
          <div
            class="o-formListEmployee__inputGroups"
            v-if="filter?.value == 2"
          >
            <q-input
              label="Nombre"
              filled
              dense
              v-model="filterName"
              :rules="[
                (val) => (val && val.length > 0) || 'Debe ingresar un nombre',
              ]"
            >
              <template v-slot:prepend>
                <q-icon color="primary" name="fas fa-map-signs" />
              </template>
            </q-input>
          </div>
          <div
            class="o-formListEmployee__inputGroups"
            v-if="filter?.value == 3"
          >
            <q-select
              label="Sede"
              filled
              dense
              v-model="filterSlcCampus"
              :options="optionsCampus"
            >
              <template color="primary" v-slot:prepend>
                <q-icon color="primary" name="fas fa-clipboard-check"></q-icon>
              </template>
            </q-select>
          </div>
          <div
            class="o-formListEmployee__inputGroups"
            v-if="filter?.value == 4"
          >
            <q-select
              label="Cargo"
              filled
              dense
              v-model="filterSlcPosition"
              :options="optionsPosition"
            >
              <template color="primary" v-slot:prepend>
                <q-icon color="primary" name="fas fa-clipboard-check"></q-icon>
              </template>
            </q-select>
          </div>
          <div class="o-formListEmployee__inputGroups">
            <q-checkbox v-model="opcionSede" label="Con sede?" />
            <p v-if="opcionSede">
              Con esta opción se podrá visualizar las sedes de los empleados; sin embargo, la información mostrada podría duplicarse (Solo será visual)
            </p>
          </div>
          <div class="o-formListEmployee__inputGroups">
            <q-btn label="Buscar" color="green" type="submit"></q-btn>
          </div>
        </div>
      </q-form>
    </div>

    <div
      class="o-formListEmployee__wraper o-formListEmployee__wraper--center o-formListEmployee__wraper--lg o-formListEmployee__wraper--marginTop"
    >
      <div class="o-formListEmployee__header">Lista de empleados</div>
      <div class="o-formListEmployee__box">
        <q-table
          flat
          :columns="columnsEmpleado"
          :rows="rowsEmployee"
          no-data-label="No hay registros"
          :rows-per-page-options="[50, 100]"
        >
          <template v-slot:top-rigth>
            <q-input label="Buscar" color="priamry">
              <template v-slot:prepend>
                <q-icon color="green" name="search"></q-icon>
              </template>
            </q-input>
          </template>

          <template v-slot:body-cell-pe_estado="props">
            <q-td :props="props">
              <q-badge
                :color="
                  props.row.pe_estado === '0'
                    ? 'orange'
                    : props.row.phc_estado === '3'
                    ? 'primary'
                    : 'green'
                "
              >
                {{
                  props.row.pe_estado === '0'
                    ? 'INACTIVO'
                    : props.row.phc_estado === '3'
                    ? 'POR APROBAR'
                    : 'ACTIVO'
                }}
              </q-badge>
            </q-td>
          </template>
          <template v-slot:body-cell-control="props">
            <q-td :props="props">
              <q-btn
                icon="fas fa-edit"
                fab-mini
                flat
                color="green"
                @click="handleEditEmployee(props.row)"
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
    :ILogTable="LogEmpleado"
  ></m-modal-log-table>
</template>
<script lang="ts">
import { ICargo, IEmpleado, IResponseFetch, ISede } from 'src/types';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';

import { defineComponent, ref, onMounted, PropType } from 'vue';
import { useRouter } from 'vue-router';
import MModalLogTable from 'src/components/molecules/ModalLogTables';

import { MESSAGE_ERROR } from 'src/utils/messages';

interface ISelecetForm {
  value: number;
  label: string;
}

interface IEmployeeForm {
  opcion: number;
  nombres: string;
  documento: string;
  sede: number;
  cargo: number;
  opcionSede: string;
}

export default defineComponent({
  props: {
    rowsEmployee: {
      type: Array as PropType<IEmpleado[]>,
      default: () => [],
    },
  },
  name: 'OFormListEmployee',
  components: {
    MModalLogTable,
  },
  setup(props, { emit }) {
    // #region declares
    const columnsEmpleado = [
      {
        label: 'Codigo',
        field: 'codigo',
        sortable: true,
        align: 'left',
        name: 'codigo',
      },
      {
        label: 'Tip. Doc',
        field: 'id_tpdocumento',
        sortable: true,
        align: 'left',
        name: 'id_tpdocumento',
      },
      {
        label: 'Documento',
        field: 'per_documento',
        sortable: true,
        align: true,
        name: 'per_documento',
      },
      {
        label: 'Nombres y Apellidos',
        field: 'datos',
        sortable: true,
        align: 'left',
        name: 'datos',
      },
      {
        label: 'Sede',
        field: 'sede',
        sortable: true,
        align: 'left',
        name: 'sede',
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
        field: 'pe_estado',
        sortable: true,
        align: 'left',
        name: 'pe_estado',
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
    const filter = ref({
      label: 'Documento',
      value: 1,
    });
    const filterSlcCampus = ref<ISelecetForm>();
    const filterSlcPosition = ref<ISelecetForm>();
    const filterName = ref();
    const filterDocument = ref();
    const optionsCampus = ref<ISelecetForm[]>([]);
    const optionsPosition = ref<ISelecetForm[]>([]);
    const router = useRouter();
    const isOpenModalLog = ref(false);
    const LogEmpleado = ref<IEmpleado>();
    const opcionSede = ref(false);
    // #endregion

    // #region methods

    const mtd_closeModalLog = () => {
      isOpenModalLog.value = false;
    };

    const mtd_slcRowTableLog = (logTable: IEmpleado) => {
      LogEmpleado.value = logTable;
      isOpenModalLog.value = true;
    };

    const handleEditEmployee = (slcEmployee: IEmpleado) => {
      if (Number(slcEmployee.phc_estado) === 3) {
        void router.push({ name: 'ApproveEmployee' });
      } else {
        void router.push({
          name: 'EditEmployee',
          query: { id: slcEmployee.id_persona },
        });
      }
    };

    const mtd_asyncGetCampus = async () => {
      const resSede = (await fetchRequestAPI({
        url: '/adm/api/sede',
        method: 'GET',
      })) as boolean | IResponseFetch;

      if (
        readErrorFetch({
          responseFetch: resSede,
          message: MESSAGE_ERROR(),
        })
      ) {
        return;
      }
      optionsCampus.value = ((resSede as IResponseFetch).data as ISede[]).map(
        (e: ISede) => ({
          value: Number(e.id_sede),
          label: e.se_descripcion,
        })
      );
      filterSlcCampus.value = optionsCampus?.value[0];
    };

    const mtd_asyncGetPosition = async () => {
      const resPosition = (await fetchRequestAPI({
        url: '/adm/api/cargo',
        method: 'GET',
      })) as boolean | IResponseFetch;

      if (
        readErrorFetch({
          responseFetch: resPosition,
          message: MESSAGE_ERROR(),
        })
      ) {
        return;
      }
      optionsPosition.value = (
        (resPosition as IResponseFetch).data as ICargo[]
      ).map((e: ICargo) => ({
        value: Number(e.id_cargo),
        label: e.ca_descripcion,
      }));
      filterSlcPosition.value = optionsPosition?.value[0];
    };

    const mtd_handleSearchEmployee = () => {
      const employeeForm: IEmployeeForm = {
        opcion: Number(filter.value?.value),
        nombres: String(filterName.value),
        documento: String(filterDocument.value),
        sede: Number(filterSlcCampus.value?.value),
        cargo: Number(filterSlcPosition.value?.value),
        opcionSede: opcionSede.value ? '1' : '0',
      };

      emit('handEmployee', employeeForm);
    };
    // #endregion

    // #region onMounted
    onMounted(async () => {
      await mtd_asyncGetCampus();
      await mtd_asyncGetPosition();
    });
    // #endregion
    return {
      optionsState,
      filter,
      optionsCampus,
      optionsPosition,
      filterSlcCampus,
      filterSlcPosition,
      columnsEmpleado,
      filterName,
      filterDocument,
      mtd_handleSearchEmployee,
      handleEditEmployee,
      mtd_closeModalLog,
      isOpenModalLog,
      mtd_slcRowTableLog,
      LogEmpleado,
      opcionSede,
    };
  },
});
</script>

<style lang="scss" scoped>
@import url('./FormListEmployee.scss');
</style>
