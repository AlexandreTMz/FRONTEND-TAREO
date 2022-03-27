<template>
  <div class="o-formListPermissionTareoEmployee">
    <q-form
      class="o-formListPermissionTareoEmployee__form"
      @submit.prevent="mtd_searchEmployeeDocuments"
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
          <div class="o-formListPermissionTareoEmployee__inputGroups">
            <q-select
              label="Fechas"
              filled
              dense
              v-model="filterFecha"
              :options="optionsFecha"
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
              v-if="Number(filterFecha.value) === 2"
            >
              <template v-slot:prepend>
                <q-icon color="primary" name="fas fa-keyboard"></q-icon>
              </template>
            </q-input>
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
import { IResponseFetch, ISede } from 'src/types';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';
import { getDateYYYMMDD } from 'src/utils/date';
import { MessageError, MessageSuccess } from 'src/utils/swal';
import { defineComponent, ref, onMounted } from 'vue';
import { useStore } from 'src/store';
import XLSX from 'xlsx';

interface ISelecetForm {
  value: number;
  label: string;
}
interface IResReportStateDocuments {
  nr_identidad: string;
  documento: string;
  datos: string;
  cargo: string;
  asistencia: string;
  sede: string;
  fecha_vigencia: string;
}
export default defineComponent({
  name: 'OFormReportStateDocumentEmployee',
  setup() {
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
    ];

    const filter = ref({
      label: 'Documento',
      value: 1,
    });

    const optionsFecha = [
      {
        label: 'Vencido al',
        value: 1,
      },
      {
        label: 'Vencerá',
        value: 2,
      },
    ];

    const filterFecha = ref({
      label: 'Vencido al',
      value: 1,
    });

    const filterSlcCampus = ref<ISelecetForm>();
    const filterName = ref<string>('');
    const filterDocument = ref<string>('');
    const optionsCampus = ref<ISelecetForm[]>([]);
    const optionsPosition = ref<ISelecetForm[]>([]);
    const filterInicio = ref(getDateYYYMMDD());
    const filterFin = ref(getDateYYYMMDD());
    const { commit } = useStore();
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
          value: Number(e.id_sede),
          label: e.se_descripcion,
        })
      );
      filterSlcCampus.value = optionsCampus?.value[0];
    };

    const mtd_searchEmployeeDocuments = async () => {
      const formSearch = {
        opcion: filter.value.value,
        nombre: filterName.value,
        sede: filterSlcCampus.value?.value,
        documento: filterDocument.value,
        opcionFecha: filterFecha.value.value,
        inicio: filterInicio.value,
        fin: filterFin.value,
      };
      // loading.value = true;
      commit('commitLoading', true);
      const resSearchEmployee = await fetchRequestAPI({
        method: 'POST',
        url: '/adm/documentos-empleado/reporte/caducado',
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
        ((resSearchEmployee as IResponseFetch)
          .data as IResReportStateDocuments[]) || [];
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

      handleExportData(resultResponseEmployee);
    };

    const handleExportData = (
      ResponseDocuments: IResReportStateDocuments[]
    ) => {
      commit('commitLoading', true);
      const formatDataToExcel = ResponseDocuments.map(
        (item: IResReportStateDocuments) => ({
          'Doc. Identidad': String(item.nr_identidad),
          'Nombres y apellidos': item.datos,
          'Cargo': String(item.cargo),
          'Sede': String(item.sede),
          'Tipo de documento': String(item.documento),
          'Fecha Vencimiento': String(item.fecha_vigencia),
        })
      );
      var animalWS = XLSX.utils.json_to_sheet(formatDataToExcel);

      var wb = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(wb, animalWS, 'Documentos');
      XLSX.writeFile(wb, `Documentos-${getDateYYYMMDD()}.xlsx`);
      commit('commitLoading', false);
    };

    // #region onMounted
    onMounted(async () => {
      await mtd_asyncGetCampus();
    });
    // #endregion

    return {
      filter,
      optionsState,
      filterSlcCampus,
      filterName,
      filterDocument,
      optionsCampus,
      optionsPosition,
      filterInicio,
      filterFin,
      mtd_searchEmployeeDocuments,
      optionsFecha,
      filterFecha,
    };
  },
});
</script>

<style lang="scss" scoped>
@import url('./FormReportStateDocumentEmployee.scss');
</style>
