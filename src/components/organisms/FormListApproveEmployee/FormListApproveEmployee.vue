<template>
  <div class="o-formListApproveEmployee">
    <q-form
      class="o-formListApproveEmployee__wraper -filter"
      v-model="form"
      @submit.prevent="mtd_searchAproveEmployee"
    >
      <div class="o-formListApproveEmployee__header">
        Lista de personas faltantes a aprobar
      </div>

      <div class="o-formListApproveEmployee__box">
        <q-select
          dense
          filled
          :options="[
            { label: 'Sedes', value: '1' },
            { label: 'Documento', value: '2' },
            { label: 'Nombre', value: '3' },
          ]"
          v-model="optionSelectFilter"
        >
          <template v-slot:prepend> <q-icon name="event" /> </template
        ></q-select>

        <q-input
          v-if="optionSelectFilter.value !== '1'"
          dense
          filled
          :label="optionSelectFilter.value === '2' ? 'Documento' : 'Nombre'"
          v-model="filterDato"
        >
          <template v-slot:prepend>
            <q-icon name="event" />
          </template>
        </q-input>
        <q-select
          v-else
          filled
          dense
          :options="optionsCampus"
          v-model="filterSelectCampus"
          option-value="id_sede"
          option-label="se_descripcion"
        >
          <template v-slot:prepend>
            <q-icon name="event" />
          </template>
        </q-select>

        <q-btn label="Buscar" color="primary" type="submit"> </q-btn>
      </div>
    </q-form>

    <div
      class="o-formListApproveEmployee__wraper o-formListApproveEmployee__wraper--center o-formListApproveEmployee__wraper--lg o-formListApproveEmployee__wraper--marginTop"
    >
      <div class="o-formListApproveEmployee__header">
        Lista de personas faltantes a aprobar
      </div>
      <div class="o-formListApproveEmployee__box">
        <q-table
          flat
          :columns="columnsApproveEmployee"
          :rows="rows"
          no-data-label="No hay registros"
          :rows-per-page-options="[25, 50]"
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
              <!-- <q-btn
                icon="fas fa-edit"
                fab-mini
                flat
                color="green"
                @click="press(props.row)"
              /> -->
              <q-btn
                icon="fas fa-check-circle"
                fab-mini
                flat
                color="green"
                @click="mtd_ValidarDesicion(props.row, 1)"
              />
              <q-btn
                icon="fas fa-times-circle"
                fab-mini
                flat
                color="red"
                @click="mtd_ValidarDesicion(props.row, 0)"
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
  <m-approve-employee
    v-if="isOpenModal"
    :isOpenModal="isOpenModal"
    @close-modal="handleCloseModal"
    :employeeEdit="employeeEdit"
    @mtd_searchAproveEmployee="mtd_searchAproveEmployee"
  ></m-approve-employee>

  <m-modal-log-table
    v-if="isOpenModalLog"
    :isOpenModalLog="isOpenModalLog"
    @mtd_closeModalLog="mtd_closeModalLog"
    :ILogTable="LogEmpleadoAprobado"
  ></m-modal-log-table>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  computed,
  PropType,
  reactive,
  toRefs,
} from 'vue';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';
import MApproveEmployee from 'components/molecules/ApproveEmployee';
import { IEmployeeApprove, IResponseFetch, ISede } from 'src/types';
import { QForm } from 'quasar';
import { MessageConfirmation, MessageSuccess } from 'src/utils/swal';
import {
  MESSAGE_APROBADO,
  MESSAGE_ERROR,
  MESSAGE_RECHAZADO,
} from 'src/utils/messages';
import { getCreateUserTrack } from 'src/utils/userTrack';
import MModalLogTable from 'src/components/molecules/ModalLogTables';

// #region interface

interface IFormSearchApprove {
  opcion: string;
  dato: string;
}

interface IFormEmployeeApprove {
  id_persona: string;
  opcion: string;
}

// #endregion

export default defineComponent({
  name: 'OFormListApproveEmployee',
  emits: ['emitSearchEmployee'],
  components: {
    MApproveEmployee,
    MModalLogTable,
  },
  props: {
    rowsEmployee: {
      type: Array as PropType<IEmployeeApprove[]>,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    // #region declares
    const columnsApproveEmployee = [
      {
        label: 'FECHA REGISTRO',
        field: 'phc_fecha_r',
        sortable: true,
        align: 'left',
        name: 'phc_fecha_r',
      },
      {
        label: 'PERSONA',
        field: 'datos',
        sortable: true,
        align: true,
        name: 'datos',
      },
      {
        label: 'TP DOC',
        field: 'tpd_descripcion',
        sortable: true,
        align: true,
        name: 'tpd_descripcion',
      },
      {
        label: 'DOCUMENTO',
        field: 'per_documento',
        sortable: true,
        align: true,
        name: 'per_documento',
      },
      {
        label: 'NACIONALIDAD',
        field: 'na_descripcion',
        sortable: true,
        align: 'left',
        name: 'na_descripcion',
      },
      {
        label: 'CARGO',
        field: 'ca_descripcion',
        sortable: true,
        align: 'left',
        name: 'ca_descripcion',
      },
      {
        label: 'SEDE',
        field: 'se_descripcion',
        sortable: true,
        align: 'left',
        name: 'se_descripcion',
      },
      {
        label: 'Control',
        field: 'control',
        sortable: true,
        align: 'left',
        name: 'control',
      },
    ];
    const search = ref('');
    const isOpenModal = ref(false);
    const employeeEdit = ref<IEmployeeApprove | null>(null);
    const optionSelectFilter = ref({ label: 'Documento', value: '2' });
    const optionsCampus = ref<ISede[]>();
    const filterSelectCampus = ref<ISede>();
    const filterDato = ref('');
    const form = ref<QForm>();
    const userTrack = getCreateUserTrack();
    const formApproveEmployee = reactive<IFormEmployeeApprove>({
      id_persona: '0',
      opcion: '0',
    });

    const isOpenModalLog = ref(false);
    const LogEmpleadoAprobado = ref<IEmployeeApprove>();

    // #endregion

    // #region methods

    const mtd_closeModalLog = () => {
      isOpenModalLog.value = false;
    };

    const mtd_slcRowTableLog = (logTable: IEmployeeApprove) => {
      LogEmpleadoAprobado.value = logTable;
      isOpenModalLog.value = true;
    };

    const mtd_ValidarDesicion = async (
      slcEmployeeApprove: IEmployeeApprove,
      opcion: number
    ) => {
      if (opcion === 0) {
        const objL_msgConfirmacion = await MessageConfirmation({
          text: '¿Está seguro de realizar esta acción?, Se eliminarán los datos del sistema de esta persona',
          confirmButtonText: 'Confirmar',
          cancelButtonText: 'cancel',
          showCancelButton: true,
        });

        if (objL_msgConfirmacion.isConfirmed) {
          void mtd_aceptacionDeDestino(slcEmployeeApprove, opcion);
          return;
        } else {
          return;
        }
      }
      void mtd_aceptacionDeDestino(slcEmployeeApprove, opcion);
    };

    const mtd_aceptacionDeDestino = async (
      slcEmployeeApprove: IEmployeeApprove,
      opcion: number
    ) => {
      const formSendApprove = {
        id_persona: slcEmployeeApprove.id_persona,
        opcion: opcion,
      };
      const employeeApprove = await fetchRequestAPI({
        url: '/adm/api/empleado/aprobacion',
        method: 'POST',
        body: JSON.stringify({ ...formSendApprove, ...userTrack }),
      });

      if (
        readErrorFetch({
          responseFetch: employeeApprove,
          message: MESSAGE_ERROR(),
        })
      ) {
        return;
      }

      MessageSuccess({
        title:
          opcion === 0
            ? MESSAGE_RECHAZADO('al empleado')
            : MESSAGE_APROBADO('al empleado'),
      });
      mtd_searchAproveEmployee();
    };

    const mtd_searchAproveEmployee = () => {
      const dataFormSearchEmployee: IFormSearchApprove = {
        opcion: optionSelectFilter.value.value,
        dato:
          optionSelectFilter.value.value === '1'
            ? String(filterSelectCampus.value?.id_sede)
            : filterDato.value,
      };
      emit('emitSearchEmployee', dataFormSearchEmployee);
    };

    const mtd_asyncGetCampus = async () => {
      const resCampus = await fetchRequestAPI({
        url: '/adm/api/sede',
        method: 'GET',
      });

      if (
        readErrorFetch({
          responseFetch: resCampus,
          message: 'Ocurrió un error',
        })
      ) {
        return;
      }

      optionsCampus.value =
        ((resCampus as IResponseFetch).data as ISede[]) || [];
    };

    const approveEmployeeResFilter = computed(() => {
      return props.rowsEmployee.filter((item) => {
        const joinData = `${item.datos} ${item.se_descripcion} ${item.ca_descripcion} ${item.per_documento}`;
        return (
          joinData.toLowerCase().indexOf(search.value.toLowerCase()) !== -1
        );
      });
    });

    const press = (employeeApprove: IEmployeeApprove) => {
      employeeEdit.value = employeeApprove;
      isOpenModal.value = true;
    };

    const handleCloseModal = () => {
      isOpenModal.value = false;
      employeeEdit.value = null;
    };
    // #endregion

    // #region onMounted
    onMounted(async () => {
      await mtd_asyncGetCampus();
    });
    // #endregion

    return {
      columnsApproveEmployee,
      rows: approveEmployeeResFilter,
      search,
      isOpenModal,
      press,
      handleCloseModal,
      employeeEdit,
      optionSelectFilter,
      filterSelectCampus,
      optionsCampus,
      form,
      mtd_searchAproveEmployee,
      filterDato,
      ...toRefs(formApproveEmployee),
      mtd_aceptacionDeDestino,
      mtd_ValidarDesicion,
      mtd_closeModalLog,
      isOpenModalLog,
      mtd_slcRowTableLog,
      LogEmpleadoAprobado,
    };
  },
});
</script>

<style lang="scss" scoped>
@import url('./FormListApproveEmployee.scss');
</style>
