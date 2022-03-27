<template>
  <div class="o-formListPermissionTareoEmployee">
    <q-form
      class="o-formListPermissionTareoEmployee__form"
      @submit.prevent="mtd_handleSearchPermissionTareoEmployee"
    >
      <div
        class="o-formListPermissionTareoEmployee__wraper o-formListPermissionTareoEmployee__wraper--center o-formListPermissionTareoEmployee__wraper--sm"
      >
        <div class="o-formListPermissionTareoEmployee__header">
          Parámetros de búsqueda
        </div>
        <div class="o-formListPermissionTareoEmployee__box">
          <div class="o-formListPermissionTareoEmployee__inputGroups">
            <q-select
              v-model="filterSlcCampus"
              :options="optionsCampus"
              dense
              filled
              label="Sede"
            >
              <template v-slot:prepend>
                <q-icon color="primary" name="badge" />
              </template>
            </q-select>
            <q-select
              v-model="filterSlcPermiso"
              :options="optionsPermiso"
              dense
              filled
              label="Permiso"
            >
              <template v-slot:prepend>
                <q-icon color="primary" name="badge" />
              </template>
            </q-select>
            <q-select
              v-model="filterSlcTpPermiso"
              :options="tpPermission"
              dense
              filled
              label="Tipo de permiso"
            >
              <template v-slot:prepend>
                <q-icon color="primary" name="badge" />
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
          <q-btn
            class="o-formPersonSustitute__form__submit"
            type="submit"
            label="Listar"
            color="green"
          />
        </div>
      </div>

      <div
        class="o-formListPermissionTareoEmployee__wraper o-formListPermissionTareoEmployee__wraper--center o-formListPermissionTareoEmployee__wraper--marginTop o-formListPermissionTareoEmployee__wraper--lg"
      >
        <div class="o-formListPermissionTareoEmployee__header">
          Lista de permisos
        </div>
        <div class="o-formListPermissionTareoEmployee__box">
          <div class="q-pa-md">
            <q-table
              flat
              :columns="columnsPermissionTareoEmpleado"
              :rows="rowsPermissionEmployeeTareo"
              no-data-label="No hay registros"
              :rows-per-page-options="[50, 100, 200]"
            >
            </q-table>
          </div>
        </div>
      </div>
    </q-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, PropType } from 'vue';
import { QForm } from 'quasar';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';
import {
  IPermiso,
  IPermissionTareoEmpleado,
  IResponseFetch,
  ISede,
} from 'src/types';
import { getDateYYYMMDD } from 'src/utils/date';

interface ISelecetForm {
  value: string;
  label: string;
}

interface ITareoPermissionEmployeeForm {
  id_sede: number;
  id_permiso: string;
  pagado: number;
  inicio: string;
  fin: string;
}

export default defineComponent({
  name: 'OFormListPermissionTareoEmployee',
  props: {
    rowsPermissionEmployeeTareo: {
      type: Array as PropType<IPermissionTareoEmpleado[]>,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    // #region declares
    const columnsPermissionTareoEmpleado = [
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
        label: 'Fech. Ingreso',
        field: 'fecha_ingreso',
        sortable: true,
        align: 'left',
        name: 'fecha_ingreso',
      },
      {
        label: 'Permiso',
        field: 'permiso',
        sortable: true,
        align: 'left',
        name: 'permiso',
      },
      {
        label: 'Tipo de permiso',
        field: 'tipo_permiso',
        sortable: true,
        align: 'left',
        name: 'tipo_permiso',
      },
    ];
    const filterSlcCampus = ref<ISelecetForm>();
    const filterSlcPermiso = ref<ISelecetForm>();
    const filterSlcTpPermiso = ref<ISelecetForm>();
    const filterInicio = ref<string>(getDateYYYMMDD());
    const filterFin = ref<string>(getDateYYYMMDD());

    const optionsCampus = ref<ISelecetForm[]>([]);
    const optionsPermiso = ref<ISelecetForm[]>([]);
    //const optionsTpPermiso = ref<ISelecetForm[]>([]);
    const search = ref('');
    const form = ref<QForm>();
    // #endregion

    // #region methods
    const tpPermission: ISelecetForm[] = [
      {
        value: String(3),
        label: 'Todos',
      },
      {
        value: String(1),
        label: 'Pagados',
      },
      {
        value: String(0),
        label: 'No pagados',
      },
    ];

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

    const mtd_asyncGetPermission = async () => {
      const resPermission = (await fetchRequestAPI({
        url: '/adm/api/permiso',
        method: 'GET',
      })) as boolean | IResponseFetch;

      if (
        readErrorFetch({
          responseFetch: resPermission,
          message: '¡Ocurrió un error!',
        })
      ) {
        return;
      }
      optionsPermiso.value = (
        (resPermission as IResponseFetch).data as IPermiso[]
      ).map((e: IPermiso) => ({
        value: String(e.id_permiso),
        label: e.pe_descripcion,
      }));
      filterSlcPermiso.value = optionsPermiso?.value[0];
    };

    filterSlcTpPermiso.value = tpPermission[0];

    const mtd_handleSearchPermissionTareoEmployee = () => {
      const employeeTareoForm: ITareoPermissionEmployeeForm = {
        id_sede: Number(filterSlcCampus.value?.value),
        id_permiso: String(filterSlcPermiso.value?.value),
        inicio: String(filterInicio.value),
        fin: String(filterFin.value),
        pagado: Number(filterSlcTpPermiso.value?.value),
      };

      emit('handTareoPermissionEmployee', employeeTareoForm);
    };

    // #endregion

    onMounted(async () => {
      await mtd_asyncGetCampus();
      await mtd_asyncGetPermission();
    });

    return {
      filterSlcCampus,
      filterSlcTpPermiso,
      filterSlcPermiso,
      optionsCampus,
      optionsPermiso,
      tpPermission,
      search,
      form,
      filterInicio,
      filterFin,
      columnsPermissionTareoEmpleado,
      mtd_handleSearchPermissionTareoEmployee,
    };
  },
});
</script>

<style lang="scss" scoped>
@import url('./FormListPermissionTareoEmployee.scss');
</style>
