<template>
  <div class="o-formTareoEmployee">
    <div
      class="o-formTareoEmployee__wraper o-formTareoEmployee__wraper--center o-formTareoEmployee__wraper--sm"
    >
      <div class="o-formTareoEmployee__header">Listar tareo celular</div>
      <q-form
        class="o-formTareoEmployee__form"
        ref="form"
        @submit.prevent="mtd_handleSearchTareoEmployee"
      >
        <div class="o-formTareoEmployee__box">
          <div class="o-formTareoEmployee__inputGroups">
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
            <q-input
              label="Documento/Nombres"
              filled
              dense
              v-model="filterName"
            >
              <template v-slot:prepend>
                <q-icon color="primary" name="fas fa-map-signs" />
              </template>
            </q-input>
          </div>
          <div class="o-formTareoEmployee__inputGroups">
            <q-input filled dense v-model="filterStart" type="date">
              <template v-slot:prepend>
                <q-icon color="primary" name="fas fa-map-signs" />
              </template>
            </q-input>
            <q-input filled dense v-model="filterEnd" type="date">
              <template v-slot:prepend>
                <q-icon color="primary" name="fas fa-map-signs" />
              </template>
            </q-input>
          </div>
          <div class="o-formTareoEmployee__inputGroups">
            <q-select
              v-model="filterSlcTpMarcador"
              :options="optionMarcador"
              dense
              filled
              label="Marcador"
            >
              <template v-slot:prepend>
                <q-icon color="primary" name="badge" />
              </template>
            </q-select>
          </div>
          <div class="o-formTareoEmployee__inputGroups">
            <q-btn label="Buscar tareo" color="green" type="submit"></q-btn>
          </div>
        </div>
      </q-form>
    </div>

    <div
      class="o-formTareoEmployee__wraper o-formTareoEmployee__wraper--center o-formTareoEmployee__wraper--lg o-formTareoEmployee__wraper--marginTop"
    >
      <div class="o-formTareoEmployee__header">Lista de tareos</div>
      <div class="o-formTareoEmployee__box">
        <q-table
          flat
          :columns="columnsTareoEmpleado"
          :rows="rowsTareoEmployee"
          no-data-label="No hay registros"
          :rows-per-page-options="[50, 100, 200]"
        >
          <template v-slot:top-rigth>
            <q-input label="Buscar" color="priamry" v-model="search">
              <template v-slot:prepend>
                <q-icon color="green" name="search"></q-icon>
              </template>
            </q-input>
          </template>
          <template v-slot:body-cell-control="props">
            <q-td :props="props">
              <q-btn
                icon="fas fa-edit"
                fab-mini
                flat
                color="green"
                :disable="!can('Editar', 'Tareo')"
                @click="press(props.row)"
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
  <m-edit-tareo-employee
    v-if="isOpenModal"
    :isOpenModal="isOpenModal"
    @close-modal="handleCloseModal"
    :employeeEdit="employeeEdit"
    @mtd_handleSearchTareoEmployee="mtd_handleSearchTareoEmployee"
  ></m-edit-tareo-employee>

  <m-modal-log-table
    v-if="isOpenModalLog"
    :isOpenModalLog="isOpenModalLog"
    @mtd_closeModalLog="mtd_closeModalLog"
    :ILogTable="LogTareo"
  ></m-modal-log-table>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, PropType } from 'vue';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';
import { IMarcador, IResponseFetch, ISede } from 'src/types';
import { QForm } from 'quasar';
import { ITareoEmpleado } from 'src/types/index';
import { getDateYYYMMDD } from 'src/utils/date';
import MEditTareoEmployee from 'components/molecules/EditTareoEmployee';
import { can } from 'src/utils/permission';
import MModalLogTable from 'src/components/molecules/ModalLogTables';

interface ISelecetForm {
  value: string;
  label: string;
}

interface ITareoEmployeeForm {
  id_sede: number;
  inicio: string;
  fin: string;
  documento: string;
  marcador: string;
}

export default defineComponent({
  name: 'OFormListTareoEmployee',
  emits: ['handTareoEmployee'],
  components: {
    MEditTareoEmployee,
    MModalLogTable,
  },
  props: {
    rowsTareoEmployee: {
      type: Array as PropType<ITareoEmpleado[]>,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    // #region declares
    const columnsTareoEmpleado = [
      {
        label: '#',
        field: 'codigo',
        sortable: true,
        align: 'left',
        name: 'codigo',
      },
      {
        label: 'Nombres',
        field: 'datos',
        sortable: true,
        align: 'left',
        name: 'datos',
      },
      {
        label: 'Sede',
        field: 'sede_datos',
        sortable: true,
        align: 'left',
        name: 'sede_datos',
      },
      {
        label: 'Estado',
        field: 'estado',
        sortable: true,
        align: true,
        name: 'estado',
      },
      {
        label: 'Etapa',
        field: 'etapa',
        sortable: true,
        align: true,
        name: 'etapa',
      },
      {
        label: 'Fech. Ingreso',
        field: 'fecha_ingreso',
        sortable: true,
        align: 'left',
        name: 'fecha_ingreso',
      },
      {
        label: 'Hor. Ingreso',
        field: 'hora_ingreso',
        sortable: true,
        align: 'left',
        name: 'hora_ingreso',
      },
      {
        label: 'Fech. Cierre',
        field: 'fecha_cierre',
        sortable: true,
        align: 'left',
        name: 'fecha_cierre',
      },
      {
        label: 'Hor. Cierre',
        field: 'hora_cierre',
        sortable: true,
        align: 'left',
        name: 'hora_cierre',
      },
      {
        label: 'Marcador',
        field: 'marcador_datos',
        sortable: true,
        align: 'left',
        name: 'marcador_datos',
      },
      {
        label: 'Control',
        field: 'control',
        sortable: true,
        align: 'left',
        name: 'control',
      },
    ];
    const filterSlcCampus = ref<ISelecetForm>();
    const filterName = ref<string>('');
    const filterStart = ref<string>(getDateYYYMMDD());
    const filterEnd = ref<string>(getDateYYYMMDD());
    const optionsCampus = ref<ISelecetForm[]>([]);
    const search = ref('');
    const form = ref<QForm>();
    const isOpenModal = ref(false);
    const employeeEdit = ref<ITareoEmpleado | null>(null);
    const isOpenModalLog = ref(false);
    const LogTareo = ref<ITareoEmpleado>();
    const filterSlcTpMarcador = ref<ISelecetForm>();
    const optionMarcador = ref<ISelecetForm[]>([]);
    // #endregion

    // #region methods
    const mtd_closeModalLog = () => {
      isOpenModalLog.value = false;
    };

    const mtd_slcRowTableLog = (logTable: ITareoEmpleado) => {
      LogTareo.value = logTable;
      isOpenModalLog.value = true;
    };
    const handleCloseModal = () => {
      isOpenModal.value = false;
      employeeEdit.value = null;
    };

    const mtd_asyncGetCampus = async () => {
      const resSede = (await fetchRequestAPI({
        url: '/adm/api/sede',
        method: 'GET',
      })) as boolean | IResponseFetch;

      if (
        readErrorFetch({
          responseFetch: resSede,
          message: '¡Ocurrió un error!',
        })
      ) {
        return;
      }
      optionsCampus.value = ((resSede as IResponseFetch).data as ISede[]).map(
        (e: ISede) => ({
          value: e.id_sede,
          label: e.se_descripcion,
        })
      );
      filterSlcCampus.value = optionsCampus?.value[0];
    };

    const mtd_asyncGetMarcadores = async () => {
      const resSede = (await fetchRequestAPI({
        url: '/adm/api/marcador-web',
        method: 'GET',
      })) as boolean | IResponseFetch;

      if (
        readErrorFetch({
          responseFetch: resSede,
          message: '¡Ocurrió un error!',
        })
      ) {
        return;
      }
      optionMarcador.value = (
        (resSede as IResponseFetch).data as IMarcador[]
      ).map((e: IMarcador) => ({
        value: String(e.id_marcador),
        label: e.datos,
      }));
      filterSlcTpMarcador.value = optionMarcador?.value[0];
    };

    const mtd_handleSearchTareoEmployee = () => {
      const employeeTareoForm: ITareoEmployeeForm = {
        id_sede: Number(filterSlcCampus.value?.value),
        inicio: String(filterStart.value),
        fin: String(filterEnd.value),
        documento: String(filterName.value),
        marcador: String(filterSlcTpMarcador.value?.value),
      };
      emit('handTareoEmployee', employeeTareoForm);
    };

    const press = (employeeApprove: ITareoEmpleado) => {
      employeeEdit.value = employeeApprove;
      console.log(employeeApprove);
      isOpenModal.value = true;
    };
    // #endregion

    onMounted(async () => {
      await mtd_asyncGetCampus();
      await mtd_asyncGetMarcadores();
    });

    return {
      filterSlcCampus,
      optionsCampus,
      search,
      form,
      mtd_handleSearchTareoEmployee,
      filterName,
      filterStart,
      filterEnd,
      columnsTareoEmpleado,
      handleCloseModal,
      press,
      isOpenModal,
      employeeEdit,
      can,
      mtd_closeModalLog,
      isOpenModalLog,
      mtd_slcRowTableLog,
      LogTareo,
      filterSlcTpMarcador,
      optionMarcador,
    };
  },
});
</script>

<style lang="scss" scoped>
@import url('./FormListTareoEmployee.scss');
</style>
