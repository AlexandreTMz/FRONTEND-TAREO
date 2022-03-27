<template>
  <div class="m-tableHistoryPosition">
    <q-form
      ref="form"
      class="m-tableHistoryPosition__form"
      @submit.prevent="handleForm"
    >
      <div class="m-tableHistoryPosition__form__inputGroup">
        <q-select
          label="Cargo"
          dense
          filled
          :options="positionOptions"
          v-model="position"
          :rules="[
            (val) =>
              (val && val.id_cargo.length > 0) || 'Debe seleccionar un cargo',
          ]"
        >
          <template v-slot:prepend>
            <q-icon name="fas fa-address-card" color="primary" />
          </template>
        </q-select>
        <div class="m-tableHistoryPosition__form__empty"></div>
        <div class="m-tableHistoryPosition__form__empty"></div>
      </div>

      <div class="m-tableHistoryPosition__form__inputGroup">
        <q-input label="Observacion" filled v-model="observations"> </q-input>
        <div class="m-tableHistoryPosition__form__empty"></div>
      </div>

      <div class="m-tableHistoryPosition__form__actions">
        <q-btn
          :label="id === null ? 'Registrar' : 'Actualizar'"
          color="green"
          type="submit"
          :disable="!can('Acceso Cargo', 'Empleado', 'Editar')"
        />
        <q-btn label="Limpiar" color="primary" @click="resetFormData" />
      </div>
    </q-form>

    <q-table
      class="m-tableHistoryPosition__table"
      flat
      :columns="columns"
      title="Historicos de cargos"
      :rows="rows"
      no-data-label="No hay registros"
      :rows-per-page-options="[25, 50]"
    >
      <template v-slot:body-cell-options="props">
        <q-td :props="props">
          <div class="m-tableHistoryPosition__table__actions">
            <q-btn
              icon="fas fa-check-circle"
              flat
              fab-mini
              color="green"
              :disable="String(props.row.ce_estado) === '1'"
              @click="handleReactivePosition(props.row)"
            />
            <q-btn
              icon="fas fa-minus-circle"
              flat
              fab-mini
              color="negative"
              :disable="
                !can('Acceso Cargo', 'Empleado', 'Editar') ||
                String(props.row.ce_estado) === '0'
              "
              @click="handleDeletePosition(props.row)"
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
  <m-modal-log-table
    v-if="isOpenModalLog"
    :isOpenModalLog="isOpenModalLog"
    @mtd_closeModalLog="mtd_closeModalLog"
    :ILogTable="LogCargo"
  ></m-modal-log-table>
</template>

<script lang="ts">
import { QForm } from 'quasar';
import { IDatosPosition, IPosition, IResponseFetch } from 'src/types';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';
import { MessageSuccess } from 'src/utils/swal';
import {
  defineComponent,
  reactive,
  toRefs,
  ref,
  onMounted,
  PropType,
} from 'vue';
import { can } from 'src/utils/permission';
import { getCreateUserTrack } from 'src/utils/userTrack';
import MModalLogTable from 'src/components/molecules/ModalLogTables';

interface IFormPosition {
  position: null | IPosition;
  observations: null | string;
  id: null | string;
}

export default defineComponent({
  name: 'MTableHistoryPosition',
  components: {
    MModalLogTable,
  },
  props: {
    idEmployee: {
      type: String,
      default: '',
    },
    positionOptions: {
      type: Array as PropType<IPosition[]>,
      default: () => [],
    },
  },
  setup(props) {
    const columns = [
      {
        label: 'Fecha de registro',
        field: 'ce_fecha_r',
        name: 'ce_fecha_r',
        align: 'center',
      },
      {
        label: 'Cargo',
        field: 'ca_descripcion',
        name: 'ca_descripcion',
        align: 'center',
      },
      {
        label: 'Estado',
        field: 'estado',
        name: 'estado',
        align: 'center',
      },
      {
        label: 'Observacion',
        field: 'ce_observacion',
        name: 'ce_observacion',
        align: 'center',
      },
      {
        label: 'Opciones',
        field: 'options',
        name: 'options',
        align: 'center',
      },
    ];

    const rows = ref();
    const form = ref<QForm>();

    const userTrack = getCreateUserTrack();
    const isOpenModalLog = ref(false);
    const LogCargo = ref<IDatosPosition>();

    const positionForm = reactive<IFormPosition>({
      position: null,
      observations: null,
      id: null,
    });

    const mtd_closeModalLog = () => {
      isOpenModalLog.value = false;
    };

    const mtd_slcRowTableLog = (logTable: IDatosPosition) => {
      LogCargo.value = logTable;
      isOpenModalLog.value = true;
    };

    const handleForm = async () => {
      let body = {
        id_persona: props.idEmployee,
        id_cargo: positionForm.position?.id_cargo,
        ce_estado: 1,
        ce_observacion: positionForm.observations,
      };

      const breakFetch = await fetchRequestAPI({
        url: '/adm/persona/empleado/cargo',
        body: JSON.stringify({ ...body, ...userTrack }),
        method: 'POST',
      });

      if (
        readErrorFetch({
          responseFetch: breakFetch,
          message:
            positionForm.id === null
              ? 'El cargo no se pudo registrar'
              : 'El cargo no se ha podido actualizar',
        })
      ) {
        return;
      }

      MessageSuccess({
        title:
          positionForm.id === null
            ? 'El cargo se ha registrado'
            : 'El cargo se actualizó',
      });
      resetFormData();
      await asyncGetPosition();
    };

    const resetFormData = () => {
      positionForm.observations = null;
      positionForm.id = null;
      positionForm.position = null;

      form.value?.reset();
    };

    const asyncGetPosition = async () => {
      const positionFetch = await fetchRequestAPI({
        url: `/adm/persona/empleado/cargo/${String(props.idEmployee)}`,
        method: 'GET',
      });

      if (
        readErrorFetch({
          responseFetch: positionFetch,
          message: 'Ocurrió un error al mostrar los cargos',
        })
      ) {
        return;
      }

      rows.value = (positionFetch as IResponseFetch).data;
    };

    const handleDeletePosition = async (positionParam: IDatosPosition) => {
      const breakFetch = await fetchRequestAPI({
        url: '/adm/persona/empleado/cargo',
        method: 'PUT',
        body: JSON.stringify({
          id_caempleado: String(positionParam.id_caempleado),
          ...userTrack,
        }),
      });

      if (
        readErrorFetch({
          responseFetch: breakFetch,
          message: 'Ocurrió un error al deshabilitar el cargo',
        })
      ) {
        return;
      }

      MessageSuccess({ title: 'Cargo deshabilitado correctamente' });
      await asyncGetPosition();
    };

    const handleReactivePosition = async (positionParam: IDatosPosition) => {
      const breakFetch = await fetchRequestAPI({
        url: '/adm/persona/empleado/cargo/reactivar',
        method: 'POST',
        body: JSON.stringify({ ...positionParam, ...userTrack }),
      });

      if (
        readErrorFetch({
          responseFetch: breakFetch,
          message: 'Ocurrió un error al deshabilitar el cargo',
        })
      ) {
        return;
      }

      MessageSuccess({ title: 'Cargo deshabilitado correctamente' });
      await asyncGetPosition();
    };

    onMounted(async () => {
      await asyncGetPosition();
    });

    return {
      columns,
      handleForm,
      rows,
      ...toRefs(positionForm),
      resetFormData,
      handleDeletePosition,
      handleReactivePosition,
      form,
      can,
      mtd_closeModalLog,
      isOpenModalLog,
      mtd_slcRowTableLog,
      LogCargo,
    };
  },
});
</script>

<style lang="scss" scoped>
@import './TableHistoryPosition.scss';
</style>
