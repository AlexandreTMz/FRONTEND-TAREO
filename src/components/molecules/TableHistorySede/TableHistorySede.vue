<template>
  <div class="m-tableHistorySede">
    <q-form
      ref="form"
      class="m-tableHistorySede__form"
      @submit.prevent="handleForm"
    >
      <div class="m-tableHistorySede__form__inputGroup">
        <q-select
          label="Sedes"
          dense
          filled
          :options="sedeOptions"
          v-model="sede"
          :rules="[
            (val) =>
              (val && val.id_sede.length > 0) || 'Debe seleccionar una sede',
          ]"
        >
          <template v-slot:prepend>
            <q-icon name="fas fa-address-card" color="primary" />
          </template>
        </q-select>
        <q-select
          label="Estado"
          dense
          filled
          v-model="state"
          :options="[
            { label: 'Activo', value: 1 },
            { label: 'Inactivo', value: 0 },
          ]"
          :rules="[
            (val) =>
              (val && val.label.length > 0) || 'Debe seleccionar un estado',
          ]"
        >
          <template v-slot:prepend>
            <q-icon name="fas fa-address-card" color="primary" />
          </template>
        </q-select>
        <div class="m-tableHistorySede__form__empty"></div>
        <div class="m-tableHistorySede__form__empty"></div>
      </div>

      <div class="m-tableHistorySede__form__inputGroup">
        <q-input label="Observación" filled v-model="observation" />
        <div class="m-tableHistorySede__form__empty"></div>
      </div>

      <div class="m-tableHistorySede__form__actions">
        <q-btn
          :label="id === null ? 'Registrar' : 'Actualizar'"
          color="green"
          type="submit"
          :disable="!can('Acceso Sede', 'Empleado', 'Editar')"
        />
        <q-btn label="Limpiar" color="primary" @click="resetFormData" />
      </div>
    </q-form>

    <q-table
      title="Historico de Sedes"
      class="m-tableHistorySede__table"
      flat
      :columns="columns"
      :rows="rows"
      no-data-label="No hay registros"
      :rows-per-page-options="[25, 50]"
    >
      <template v-slot:body-cell-options="props">
        <q-td :props="props">
          <div>
            <q-btn
              icon="fas fa-check-circle"
              flat
              fab-mini
              color="green"
              :disable="
                !can('Acceso Sede', 'Empleado', 'Editar') ||
                props.row.sm_estado === '1'
              "
              @click="handleAciveSede(props.row, 1)"
            />
            <q-btn
              icon="fas fa-minus-circle"
              flat
              fab-mini
              color="negative"
              :disable="
                !can('Acceso Sede', 'Empleado', 'Editar') ||
                props.row.sm_estado === '0'
              "
              @click="handleAciveSede(props.row, 0)"
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
    :ILogTable="LogSede"
  ></m-modal-log-table>
</template>

<script lang="ts">
import { QForm } from 'quasar';
import { IDatosSede, IResponseFetch, ISede } from 'src/types';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';
import { MessageSuccess } from 'src/utils/swal';
import {
  defineComponent,
  PropType,
  ref,
  onMounted,
  reactive,
  toRefs,
} from 'vue';
import { can } from 'src/utils/permission';
import { getCreateUserTrack } from 'src/utils/userTrack';
import MModalLogTable from 'src/components/molecules/ModalLogTables';

interface IFormSede {
  sede: null | ISede;
  state: null | { value: string; label: string };
  observation: null | string;
  id: null | string;
}

export default defineComponent({
  name: 'MTableHistorySede',
  components: {
    MModalLogTable,
  },
  props: {
    sedeOptions: {
      type: Array as PropType<ISede[]>,
      default: () => [],
    },
    idEmployee: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const columns = [
      {
        label: 'Fecha de registro',
        name: 'ta_fecha_r',
        field: 'ta_fecha_r',
        align: 'center',
      },
      {
        label: 'Sede',
        name: 'sede',
        field: 'sede',
        align: 'center',
      },
      {
        label: 'Observación',
        name: 'sm_observacion',
        field: 'sm_observacion',
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

    const rows = ref();
    const form = ref<QForm>();
    const isOpenModalLog = ref(false);
    const LogSede = ref<IDatosSede>();

    const sedeForm = reactive<IFormSede>({
      sede: null,
      state: { label: 'Activo', value: '1' },
      observation: null,
      id: null,
    });

    const userTrack = getCreateUserTrack();

    const mtd_closeModalLog = () => {
      isOpenModalLog.value = false;
    };

    const mtd_slcRowTableLog = (logTable: IDatosSede) => {
      LogSede.value = logTable;
      isOpenModalLog.value = true;
    };

    const handleForm = async () => {
      let body = {
        id_persona: props.idEmployee,
        id_sede: sedeForm.sede?.id_sede,
        sm_estado: sedeForm.state?.value,
        sm_observacion: sedeForm.observation,
        id_sede_em: sedeForm.id === null ? 0 : sedeForm.id,
      };

      const breakFetch = await fetchRequestAPI({
        url: '/adm/persona/empleado/sede',
        body: JSON.stringify({ ...body, ...userTrack }),
        method: 'POST',
      });

      if (
        readErrorFetch({
          responseFetch: breakFetch,
          message:
            sedeForm.id === null
              ? 'La sede no se pudo registrar'
              : 'La sede no se ha podido actualizar',
        })
      ) {
        return;
      }

      MessageSuccess({
        title:
          sedeForm.id === null
            ? 'La sede se ha registrado'
            : 'La sede se actualizó',
      });
      resetFormData();
      await asyncGetSede();
    };

    const resetFormData = () => {
      sedeForm.id = null;
      sedeForm.state = { label: 'Activo', value: '1' };
      sedeForm.observation = null;
      sedeForm.sede = null;

      form.value?.reset();
    };

    const asyncGetSede = async () => {
      const sedeFetch = await fetchRequestAPI({
        url: `/adm/persona/empleado/sede/${String(props.idEmployee)}`,
        method: 'GET',
      });

      if (
        readErrorFetch({
          responseFetch: sedeFetch,
          message: 'Ocurrió un error al mostrar las sedes',
        })
      ) {
        return;
      }

      rows.value = (sedeFetch as IResponseFetch).data;
    };

    const handleAciveSede = async (sedeParam: IDatosSede, active: number) => {
      const breakFetch = await fetchRequestAPI({
        url: '/adm/persona/empleado/sede',
        method: 'PUT',
        body: JSON.stringify({
          id_sede_em: String(sedeParam.id_sede_em),
          opcion: active,
          ...userTrack,
        }),
      });

      if (
        readErrorFetch({
          responseFetch: breakFetch,
          message:
            active === 0
              ? 'Ocurrió un error al deshabilitar la sede'
              : 'Ocurrió un error al habilitar la sede',
        })
      ) {
        return;
      }

      MessageSuccess({
        title:
          active === 0
            ? 'Sede deshabilitado correctamente'
            : 'Sede se activó correctamente',
      });
      await asyncGetSede();
    };

    onMounted(async () => {
      await asyncGetSede();
    });
    return {
      columns,
      rows,
      handleAciveSede,
      resetFormData,
      ...toRefs(sedeForm),
      handleForm,
      form,
      can,
      mtd_closeModalLog,
      isOpenModalLog,
      mtd_slcRowTableLog,
      LogSede,
    };
  },
});
</script>

<style lang="scss" scoped>
@import './TableHistorySede.scss';
</style>
