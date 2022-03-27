<template>
  <div class="o-formListPermissionTareoEmployee">
    <q-form class="o-formListPermissionTareoEmployee__form"
     @submit.prevent="mtd_searchEmployeeLogs"
    >
      <div
        class="o-formListPermissionTareoEmployee__wraper o-formListPermissionTareoEmployee__wraper--center o-formListPermissionTareoEmployee__wraper--sm"
      >
        <div class="o-formListPermissionTareoEmployee__header">
          Parametros de filtro
        </div>
        <div class="o-formListPermissionTareoEmployee__box">
          <div class="o-formListPermissionTareoEmployee__inputGroups">
            <q-select
              label="Tabla"
              filled
              dense
              v-model="filterSlcTables"
              :options="optionsTables"
            >
              <template color="primary" v-slot:prepend>
                <q-icon color="primary" name="fas fa-clipboard-check"></q-icon>
              </template>
            </q-select>
          </div>
          <div class="o-formListPermissionTareoEmployee__inputGroups">
            <q-input
              label="Fech. inicio"
              filled
              dense
              v-model="filterInicio"
              type="date"
            >
              <template v-slot:prepend>
                <q-icon color="primary" name="fas fa-keyboard" />
              </template>
            </q-input>
            <q-input
              label="Fech. Fin"
              filled
              dense
              v-model="filterFin"
              type="date"
            >
              <template v-slot:prepend>
                <q-icon color="primary" name="fas fa-keyboard"></q-icon>
              </template>
            </q-input>
          </div>
          <div class="o-formListPermissionTareoEmployee__inputGroups">
            <q-select
              label="Usuario"
              filled
              dense
              v-model="filterSlcUser"
              :options="optionsUser"
            >
              <template color="primary" v-slot:prepend>
                <q-icon color="primary" name="fas fa-clipboard-check"></q-icon>
              </template>
            </q-select>
          </div>
          <div class="o-formListPermissionTareoEmployee__inputGroups">
            <q-select
              label="Tipo de auditoria"
              filled
              dense
              v-model="filterSlcTipoAuditoria"
              :options="optionsTipoAuditoria"
            >
              <template color="primary" v-slot:prepend>
                <q-icon color="primary" name="fas fa-clipboard-check"></q-icon>
              </template>
            </q-select>
          </div>
          <q-btn
            class="o-formPersonSustitute__form__submit"
            type="submit"
            label="GENERAR REPORTE"
            color="green"
          />
        </div>
      </div>
    </q-form>
  </div>
</template>

<script lang="ts">
import { IResponseFetch, IUser } from 'src/types';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';
import { getDateYYYMMDD } from 'src/utils/date';
import { MessageError, MessageSuccess } from 'src/utils/swal';
//import { MessageError, MessageSuccess } from 'src/utils/swal';
import { defineComponent, ref, onMounted } from 'vue';
import { useStore } from 'src/store';
import XLSX from 'xlsx';

interface ISelecetForm {
  value: string;
  label: string;
}

interface ITablesDBA {
  id_tablas: string;
  tbs_mostrar: string;
  tbs_real: string;
}

interface IResReportLogs {
  tbs_mostrar: string;
  fecha: string;
  tipo_auditoria: string;
  old_value: string;
  new_value: string;
  usuario: string;
}

export default defineComponent({
  name: 'OFormListLogsDb',
  setup() {
    const filterSlcTables = ref<ISelecetForm>();
    const optionsTables = ref<ISelecetForm[]>([]);

    const filterSlcUser = ref<ISelecetForm>();
    const optionsUser = ref<ISelecetForm[]>([]);

    const filterSlcTipoAuditoria = ref<ISelecetForm>({
      value: 'T',
      label: 'TODOS',
    });
    const optionsTipoAuditoria = ref<ISelecetForm[]>([
      {
        value: 'T',
        label: 'TODOS',
      },
      {
        value: '1',
        label: 'REGISTRO',
      },
      {
        value: '2',
        label: 'EDICION',
      },
      {
        value: '3',
        label: 'ANULACION',
      },
      {
        value: '3',
        label: 'ELIMINACION',
      },
    ]);

    const filterInicio = ref(getDateYYYMMDD());
    const filterFin = ref(getDateYYYMMDD());

    const { commit } = useStore();

    const mtd_getTablesDba = async () => {
      const resTables = (await fetchRequestAPI({
        url: '/adm/api/tablas-db',
        method: 'GET',
      })) as boolean | IResponseFetch;

      if (
        readErrorFetch({
          responseFetch: resTables,
          message: '¡Ocurrió un error!',
        })
      ) {
        return;
      }
      optionsTables.value = (
        (resTables as IResponseFetch).data as ITablesDBA[]
      ).map((e: ITablesDBA) => ({
        value: e.id_tablas,
        label: e.tbs_mostrar,
      }));
      filterSlcTables.value = optionsTables?.value[0];
    };

    const mtd_getUsuarios = async () => {
      const resUsers = (await fetchRequestAPI({
        url: '/adm/usuarios/sistema',
        method: 'GET',
      })) as boolean | IResponseFetch;

      if (
        readErrorFetch({
          responseFetch: resUsers,
          message: '¡Ocurrió un error!',
        })
      ) {
        return;
      }
      optionsUser.value = ((resUsers as IResponseFetch).data as IUser[]).map(
        (e: IUser) => ({
          value: e.us_usuario,
          label: e.us_usuario,
        })
      );
      optionsUser.value.unshift({
        value: 'T',
        label: 'TODOS',
      });
      filterSlcUser.value = optionsUser?.value[0];
    };

    function addMonths(date: Date, months: number) {
      let d = date.getDate();
      date.setMonth(date.getMonth() + +months);
      if (date.getDate() != d) {
        date.setDate(0);
      }
      return date;
    }

    const mtd_searchEmployeeLogs = async () => {
      const myDateInitial = new Date(
        String(filterInicio.value).split('-').join('/')
      );
      const myDateEnd = new Date(String(filterFin.value).split('-').join('/'));
      const myDateThreeMonth = addMonths(myDateInitial, 3);

      if (myDateEnd > myDateThreeMonth) {
        MessageError({
          title: 'Aviso del sistema',
          text: '¡Solo se puede sacar un reporte como maxio a 3 meses!',
        });
        return;
      }

      const formSearch = {
        idTablas: filterSlcTables?.value?.value,
        fechaInicio: filterInicio.value,
        fechaFin: filterFin.value,
        usaurio: filterSlcUser.value?.value,
        tpAuditoria: filterSlcTipoAuditoria.value.value,
      };
      // loading.value = true;
      commit('commitLoading', true);
      const resSearchEmployee = await fetchRequestAPI({
        method: 'POST',
        url: '/adm/db/logs',
        body: JSON.stringify(formSearch),
      });

      if (
        readErrorFetch({
          responseFetch: resSearchEmployee,
          message: 'Ocurrió un error',
        })
      ) {
        commit('commitLoading', false);
        return;
      }

      const resultResponseEmployee =
        ((resSearchEmployee as IResponseFetch).data as IResReportLogs[]) || [];
      commit('commitLoading', false);

      if (resultResponseEmployee.length <= 0) {
        MessageError({
          title: 'Aviso del sistema',
          text: '¡No se encontraron datos para generar el reporte!',
        });
        return;
      }

      MessageSuccess({
        title: 'Aviso del sistema',
        text: 'Se está generando el reporte, por favor esperé un momento....',
      });

      // Generar excel
      handleExportData(resultResponseEmployee);
      // loading.value = false;
    };

    const handleExportData = (ResponseDocuments: IResReportLogs[]) => {
      commit('commitLoading', true);
      const formatDataToExcel = ResponseDocuments.map(
        (item: IResReportLogs) => ({
          Tabla: String(item.tbs_mostrar),
          'Fecha': item.fecha,
          'Tipo de auditoria': item.tipo_auditoria,
          'Anterior registro': item.old_value,
          'Nuevo registro': item.new_value,
          'Usuario': item.usuario
        })
      );
      var animalWS = XLSX.utils.json_to_sheet(formatDataToExcel);

      var wb = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(wb, animalWS, 'Documentos');
      XLSX.writeFile(wb, `Auditoria-${getDateYYYMMDD()}.xlsx`);
      commit('commitLoading', false);
    };

    // #region onMounted
    onMounted(async () => {
      await mtd_getTablesDba();
      await mtd_getUsuarios();
    });
    // #endregion

    return {
      filterSlcTables,
      optionsTables,
      filterInicio,
      filterFin,
      filterSlcUser,
      optionsUser,
      filterSlcTipoAuditoria,
      optionsTipoAuditoria,
      mtd_searchEmployeeLogs
    };
  },
});
</script>

<style lang="scss" scoped>
@import url('./FormListLogsDb.scss');
</style>
