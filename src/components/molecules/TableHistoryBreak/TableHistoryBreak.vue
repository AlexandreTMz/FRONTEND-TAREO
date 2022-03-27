<template>
  <div class="m-tableHistoryBreak">
    <q-form
      ref="form"
      class="m-tableHistoryBreak__form"
      @submit.prevent="handleForm"
    >
      <div class="m-tableHistoryBreak__form__inputGroup">
        <q-select
          v-model="breakDay"
          label="Descanso"
          dense
          filled
          :options="BREAK_OPTIONS"
          :rules="[
            (val) =>
              (val && val.label.length > 0) || 'Debe seleccionar un día ',
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
          :options="[
            { label: 'Activo', value: 1 },
            { label: 'Inactivo', value: 0 },
          ]"
          :rules="[
            (val) =>
              (val && val.label.length > 0) || 'Debe seleccionar un estado',
          ]"
          v-model="state"
        >
          <template v-slot:prepend>
            <q-icon name="fas fa-address-card" color="primary" />
          </template>
        </q-select>
        <div class="m-tableHistoryBreak__form__empty"></div>
        <div class="m-tableHistoryBreak__form__empty"></div>
      </div>

      <div class="m-tableHistoryBreak__form__inputGroup">
        <q-input label="Observacion" filled v-model="observation"> </q-input>
        <div class="m-tableHistoryBreak__form__empty"></div>
      </div>

      <div class="m-tableHistoryBreak__form__actions">
        <q-btn
          :label="id === null ? 'Registrar' : 'Actualizar'"
          color="green"
          type="submit"
          :disable="!can('Acceso Descanso', 'Empleado', 'Editar')"
        />
        <q-btn label="Limpiar" color="primary" @click="resetFormData" />
      </div>
    </q-form>

    <q-table
      title="Historico de descansos"
      class="m-tableHistoryBreak__table"
      flat
      :columns="columns"
      :rows="rows"
      no-data-label="No hay registros"
      :rows-per-page-options="[25, 50]"
    >
      <template v-slot:body-cell-options="props">
        <q-td :props="props">
          <div class="m-tableHistoryBreak__table__actions">
            <!-- <q-btn
              icon="add"
              flat
              fab-mini
              color="green"
              @click="handleEdit(props.row)"
            /> -->
            <q-btn
              icon="check"
              flat
              fab-mini
              color="green"
              @click="handleChangeActive(props.row)"
              :disable="!can('Acceso Descanso', 'Empleado', 'Editar')"
            />
            <q-btn
              icon="fas fa-minus-circle q-icon"
              flat
              fab-mini
              color="negative"
              @click="handleDeleteBreak(props.row)"
              :disable="!can('Acceso Descanso', 'Empleado', 'Editar')"
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
    :ILogTable="LogDescanso"
  ></m-modal-log-table>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref, onMounted } from 'vue';
import { BREAK_OPTIONS } from 'src/constant';
import { IBreak, IResponseFetch } from 'src/types';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';
import { MessageSuccess } from 'src/utils/swal';
import { QForm } from 'quasar';
import { can } from 'src/utils/permission';
import { getCreateUserTrack } from 'src/utils/userTrack';
import MModalLogTable from 'src/components/molecules/ModalLogTables';

interface IOptionForm {
  label: string;
  value: string;
}

interface IFormBreak {
  breakDay: IOptionForm | null;
  state: IOptionForm | null;
  observation: string | null;
  id: string | null;
}

export default defineComponent({
  name: 'MTableHistoryBreak',
  components: {
    MModalLogTable,
  },
  props: {
    idEmployee: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const columns = [
      {
        label: 'Días de descanso (Referencia)',
        name: 'de_referencia',
        field: 'de_referencia',
        align: 'center',
      },
      {
        label: 'Estado',
        name: 'estado',
        field: 'estado',
        align: 'center',
      },
      {
        label: 'Observación',
        name: 'de_observacion',
        field: 'de_observacion',
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
    const LogDescanso = ref<IBreak>();

    const mtd_closeModalLog = () => {
      isOpenModalLog.value = false;
    };

    const mtd_slcRowTableLog = (logTable: IBreak) => {
      LogDescanso.value = logTable;
      isOpenModalLog.value = true;
    };

    const breakForm = reactive<IFormBreak>({
      breakDay: null,
      state: { label: 'Activo', value: '1' },
      observation: null,
      id: null,
    });

    const userTrack = getCreateUserTrack();

    const handleEdit = (breakParam: IBreak) => {
      breakForm.breakDay = BREAK_OPTIONS.find(
        (item) =>
          String(item.label).toLowerCase() ===
          String(breakParam.de_referencia).toLowerCase()
      ) as IOptionForm;
      breakForm.state =
        breakParam.de_estado == '0'
          ? { label: 'Inactivo', value: '0' }
          : { label: 'Activo', value: '1' };
      breakForm.observation = breakParam.de_observacion;
    };

    const handleForm = async () => {
      let body = {
        id_persona: props.idEmployee,
        de_fecha: '',
        de_estado: breakForm.state?.value,
        de_observacion: breakForm.observation,
        de_referencia: breakForm.breakDay?.label,
        dia: breakForm.breakDay?.label,
        id_descanso: breakForm.id === null ? 0 : breakForm.id,
      };

      const breakFetch = await fetchRequestAPI({
        url: '/adm/persona/empleado/descanso',
        body: JSON.stringify({ ...body, ...userTrack }),
        method: 'POST',
      });

      if (
        readErrorFetch({
          responseFetch: breakFetch,
          message:
            breakForm.id === null
              ? 'El descanso no se pudo registrar'
              : 'El descanso no se ha podido actualizar',
        })
      ) {
        return;
      }

      MessageSuccess({
        title:
          breakForm.id === null
            ? 'El descanso se ha registrado'
            : 'El descanso se actualizó',
      });
      resetFormData();
      await asyncGetBreak();
    };

    const resetFormData = () => {
      breakForm.breakDay = null;
      breakForm.state = { label: 'Activo', value: '1' };
      breakForm.observation = null;
      breakForm.id = null;

      form.value?.reset();
    };

    const asyncGetBreak = async () => {
      const breakFetch = await fetchRequestAPI({
        url: `/adm/persona/empleado/descanso/${String(props.idEmployee)}`,
        method: 'GET',
      });

      if (
        readErrorFetch({
          responseFetch: breakFetch,
          message: 'Ocurrió un error al mostrar los descansos',
        })
      ) {
        return;
      }

      rows.value = (breakFetch as IResponseFetch).data;
    };

    const handleDeleteBreak = async (breakParam: IBreak) => {
      const breakFetch = await fetchRequestAPI({
        url: '/adm/persona/empleado/descanso',
        method: 'PUT',
        body: JSON.stringify({
          id_descanso: String(breakParam.id_descanso),
          ...userTrack,
        }),
      });

      if (
        readErrorFetch({
          responseFetch: breakFetch,
          message: 'Ocurrió un error al deshabilitar el descanso',
        })
      ) {
        return;
      }

      MessageSuccess({ title: 'Descanso deshabilitado correctamente' });
      await asyncGetBreak();
    };

    const handleChangeActive = async (breakParam: IBreak) => {
      const breakFetch = await fetchRequestAPI({
        url: '/adm/persona/empleado/active/descanso',
        method: 'PUT',
        body: JSON.stringify({
          id_descanso: String(breakParam.id_descanso),
          ...userTrack,
        }),
      });

      if (
        readErrorFetch({
          responseFetch: breakFetch,
          message: 'Ocurrió un error al deshabilitar el descanso',
        })
      ) {
        return;
      }

      MessageSuccess({ title: 'Descanso habilitado correctamente' });
      await asyncGetBreak();
    };

    onMounted(async () => {
      await asyncGetBreak();
    });

    return {
      columns,
      BREAK_OPTIONS,
      ...toRefs(breakForm),
      handleEdit,
      rows,
      handleDeleteBreak,
      handleForm,
      form,
      resetFormData,
      handleChangeActive,
      can,
      mtd_closeModalLog,
      isOpenModalLog,
      mtd_slcRowTableLog,
      LogDescanso,
    };
  },
});
</script>
<style lang="scss" scoped>
@import './TableHistoryBreak.scss';
</style>
