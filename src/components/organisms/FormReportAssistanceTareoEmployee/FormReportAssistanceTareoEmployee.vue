<template>
  <div class="o-formListPermissionTareoEmployee">
    <q-form
      class="o-formListPermissionTareoEmployee__form"
      @submit.prevent="mtd_searchEmployeeAssistence"
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
              label="Turno"
              filled
              dense
              v-model="filterSlcMarcador"
              :options="optionsMarcador"
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
            <q-checkbox
              v-model="opcionTareo"
              label="Solo personas tareadas ?"
            />
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
import { useStore } from 'src/store';
import { IMarcador, IResponseFetch, ISede } from 'src/types';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';
import { getDateYYYMMDD } from 'src/utils/date';
import { MessageError, MessageSuccess } from 'src/utils/swal';
import { defineComponent, ref, onMounted } from 'vue';
import XLSX from 'xlsx';

interface ISelecetForm {
  value: number;
  label: string;
}

interface IResReportAssistence {
  id_persona: string;
  documento: string;
  nombres: string;
  cargo: string;
  dia: string;
  asistencia: string;
  sede: string;
}

export default defineComponent({
  name: 'OFormReportAssistanceTareoEmployee',
  setup() {
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
    ];

    const filter = ref({
      label: 'Documento',
      value: 1,
    });

    const filterSlcCampus = ref<ISelecetForm>();
    const filterName = ref<string>('');
    const filterDocument = ref<string>('');
    const optionsCampus = ref<ISelecetForm[]>([]);
    const optionsPosition = ref<ISelecetForm[]>([]);
    const filterInicio = ref(getDateYYYMMDD());
    const filterFin = ref(getDateYYYMMDD());
    const optionsMarcador = ref<ISelecetForm[]>([]);
    const filterSlcMarcador = ref<ISelecetForm>();
    const opcionTareo = ref(false);

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

    const mtd_asyncGetMarcadores = async () => {
      const resMarcadores = (await fetchRequestAPI({
        url: '/adm/api/marcador/1',
        method: 'GET',
      })) as boolean | IResponseFetch;

      if (
        readErrorFetch({
          responseFetch: resMarcadores,
          message: '¡Ocurrió un error!',
        })
      ) {
        return;
      }
      optionsMarcador.value = (
        (resMarcadores as IResponseFetch).data as IMarcador[]
      ).map((e: IMarcador) => ({
        value: Number(e.id_marcador),
        label: e.datos,
      }));
      filterSlcMarcador.value = optionsMarcador?.value[0];
    };

    function addMonths(date: Date, months: number) {
      let d = date.getDate();
      date.setMonth(date.getMonth() + +months);
      if (date.getDate() != d) {
        date.setDate(0);
      }
      return date;
    }

    const mtd_searchEmployeeAssistence = async () => {
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

      console.log(
        myDateThreeMonth.toISOString(),
        ' - ',
        myDateEnd.toISOString()
      );

      /*if (
        dateDiffGetDays(
          parseStringToDate(filterInicio.value),
          parseStringToDate(filterFin.value)
        ) > 90
      ) {
        MessageError({
          title: 'Aviso del sistema',
          text: '¡Solo se puede sacar un reporte como maxio a 3 meses!',
        });
        return;
      }*/

      const formSearch = {
        opcion: filter.value.value,
        nombre: filterName.value,
        sede: filterSlcCampus.value?.value,
        documento: filterDocument.value,
        inicio: filterInicio.value,
        fin: filterFin.value,
        turno: filterSlcMarcador.value?.value,
        opcionTareo: opcionTareo.value ? '1' : '0',
      };
      // loading.value = true;
      commit('commitLoading', true);
      const resSearchEmployee = await fetchRequestAPI({
        method: 'POST',
        url: '/adm/empleado/asistencia',
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
          .data as IResReportAssistence[]) || [];
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
      excel(resultResponseEmployee);
      // loading.value = false;
    };

    const excel = (input_data: IResReportAssistence[]) => {
      const headers: Array<string> = [
        'Documento',
        'Datos personales',
        'Cargo',
        'Sede',
      ].concat(
        Array.prototype.concat
          .apply(
            [],
            [...new Set(input_data.map((obj) => obj.dia))].map((id) => id)
          )
          .concat(['Días asistidos', 'Faltas'])
      );

      const uniques = [
        ...new Set(
          input_data.map((obj: IResReportAssistence) => [
            obj.documento,
            obj.nombres,
            obj.cargo,
            obj.sede,
          ])
        ),
      ];

      function uniqBy(a: string[][], key: (x: string | string[]) => string) {
        return [...new Map(a.map((x) => [key(x), x])).values()];
      }
      // organise the data - in wide format
      const ws_data = uniqBy(uniques, JSON.stringify).map((ts) => {
        const objByTimestamp = input_data.filter(
          (obj) => obj.documento === ts[0]
        );
        let asis = 0;
        let falta = 0;

        input_data
          .filter((obj) => obj.documento === ts[0])
          .forEach((e) => {
            if (e.asistencia === '1') {
              asis++;
            } else {
              falta++;
            }
          });

        let arr = [ts[0], ts[1], ts[2], ts[3]];
        objByTimestamp.forEach((obj) => (arr = arr.concat([obj.asistencia])));
        return arr.concat([String(asis)], [String(falta)]);
      });

      const footer = Array.prototype.concat.apply(
        [],
        [...new Set(input_data.map((obj) => obj.dia))].map((id) => id)
      );

      let countsIo: Array<string> = ['', '', '', 'Total Asistencia'];
      let counter = 0;
      footer.forEach((e) => {
        input_data
          .filter((a) => a.dia === e)
          .map((element: IResReportAssistence) => {
            if (element.asistencia === '1') {
              counter++;
            }
          });
        countsIo = [...countsIo, ...String(counter)];
        counter = 0;
      });

      // prepend the headers
      ws_data.unshift(headers);
      ws_data.push(countsIo);
      // to Excel
      // new workbook
      const wb = XLSX.utils.book_new();

      // create sheet with array-of-arrays to sheet method
      const ws = XLSX.utils.aoa_to_sheet(ws_data);

      // assign sheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Asistencia');

      // save workbook
      XLSX.writeFile(wb, `Reporte-${getDateYYYMMDD()}.xlsx`);
    };

    // #region onMounted
    onMounted(async () => {
      await mtd_asyncGetCampus();
      await mtd_asyncGetMarcadores();
    });
    // #endregion

    return {
      filter,
      columnsEmpleado,
      optionsState,
      filterSlcCampus,
      filterName,
      filterDocument,
      optionsCampus,
      optionsPosition,
      filterInicio,
      filterFin,
      mtd_searchEmployeeAssistence,
      optionsMarcador,
      filterSlcMarcador,
      opcionTareo
    };
  },
});
</script>

<style lang="scss" scoped>
@import url('./FormReportAssistanceTareoEmployee.scss');
</style>
