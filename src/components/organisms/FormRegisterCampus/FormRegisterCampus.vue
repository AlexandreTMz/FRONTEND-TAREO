<template>
  <div class="o-formRegisterCampus">
    <div
      class="o-formRegisterCampus__wraper o-formRegisterCampus__wraper--center o-formRegisterCampus__wraper--sm"
    >
      <div class="o-formRegisterCampus__header">Registro de sede</div>
      <q-form
        class="o-formRegisterCampus__form"
        ref="form"
        @submit.prevent="mtd_handleRegisterCampus"
      >
        <div class="o-formRegisterCampus__box">
          <div class="o-formRegisterCampus__inputGroups">
            <q-input
              label="Lugar"
              filled
              dense
              v-model="place"
              :rules="[
                (val) => (val && val.length > 0) || 'El nombre es obligatorio',
              ]"
            >
              <template v-slot:prepend>
                <q-icon color="primary" name="fas fa-map-signs" />
              </template>
            </q-input>
            <q-select
              label="Estado"
              filled
              dense
              v-model="state"
              :options="optionsState"
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Debe seleccionar un estado ',
              ]"
            >
              <template color="primary" v-slot:prepend>
                <q-icon color="primary" name="fas fa-clipboard-check"></q-icon>
              </template>
            </q-select>
          </div>
          <div class="o-formRegisterCampus__inputGroups">
            <q-input label="Descripcion" filled dense v-model="description">
              <template color="primary" v-slot:prepend>
                <q-icon color="primary" name="fas fa-paragraph"></q-icon>
              </template>
            </q-input>
          </div>
          <div class="o-formRegisterCampus__inputGroups">
            <q-btn
              :label="
                id_campus === '' || id_campus === null ? 'Registrar' : 'Grabar'
              "
              color="green"
              type="submit"
              :disable="!can('Registrar', 'Sede') && !can('Editar', 'Sede')"
              v-if="can('Registrar', 'Sede') && can('Editar', 'Sede')"
            />
            <q-btn
              v-else-if="can('Registrar', 'Sede')"
              label="Registrar"
              color="green"
              type="submit"
            />
            <q-btn
              v-else-if="can('Editar', 'Sede')"
              label="Grabar "
              color="green"
              type="submit"
              :disable="id_campus === null"
            />
            <q-btn v-else label="Registrar " color="green" disable />

            <q-btn
              label="Limpiar"
              color="primary"
              @click="mtd_handleResetDataCampus"
            />
          </div>
        </div>
      </q-form>
    </div>

    <div
      class="o-formRegisterCampus__wraper o-formRegisterCampus__wraper--center o-formRegisterCampus__wraper--lg o-formRegisterCampus__wraper--marginTop"
    >
      <div class="o-formRegisterCampus__header">Lista de sedes</div>
      <div class="o-formRegisterCampus__box">
        <q-table
          flat
          :columns="columnsCampus"
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
              <q-btn
                icon="fas fa-edit"
                fab-mini
                flat
                color="green"
                @click="mtd_editCampus(props.row)"
                :disable="!can('Editar', 'Sede')"
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
    :ILogTable="LogSede"
  ></m-modal-log-table>
</template>

<script lang="ts">
import { QForm } from 'quasar';
import { ISede } from 'src/types';
import { can } from 'src/utils/permission';
import {
  defineComponent,
  ref,
  reactive,
  PropType,
  computed,
  toRefs,
} from 'vue';
import { getCreateUserTrack } from 'src/utils/userTrack';
import MModalLogTable from 'src/components/molecules/ModalLogTables';

// #region interface
interface ICampusForm {
  place: string;
  state: string;
  id_campus: string | null;
  description: string;
}
// #endregion

export default defineComponent({
  name: 'ORegisterCampus',
  components: {
    MModalLogTable,
  },
  props: {
    rowsCampus: {
      type: Array as PropType<ISede[]>,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    // #region declares
    const columnsCampus = [
      {
        label: 'Lugar',
        field: 'se_lugar',
        sortable: true,
        align: 'left',
        name: 'se_lugar',
      },
      {
        label: 'Descripcion',
        field: 'se_descripcion',
        sortable: true,
        align: true,
        name: 'se_descripcion',
      },
      {
        label: 'Estado',
        field: 'estado',
        sortable: true,
        align: 'left',
        name: 'estado',
      },
      {
        label: 'Control',
        field: 'control',
        sortable: true,
        align: 'left',
        name: 'control',
      },
    ];
    const optionsState = ['ACTIVO', 'INACTIVO'];
    const search = ref('');
    const form = ref<QForm>();

    const campus = reactive<ICampusForm>({
      place: '',
      state: 'ACTIVO',
      id_campus: null,
      description: '',
    });

    const userTrack = getCreateUserTrack();
    const isOpenModalLog = ref(false);
    const LogSede = ref<ISede>();
    // #endregion

    // #region methods
    const mtd_closeModalLog = () => {
      isOpenModalLog.value = false;
    };

    const mtd_slcRowTableLog = (logTable: ISede) => {
      LogSede.value = logTable;
      isOpenModalLog.value = true;
    };
    const mtd_editCampus = (sedeEdit: ISede) => {
      campus.place = sedeEdit.se_lugar;
      campus.state = sedeEdit.estado;
      campus.description = sedeEdit.se_descripcion;
      campus.id_campus = sedeEdit.id_sede;
    };

    const mtd_handleResetDataCampus = () => {
      campus.place = '';
      campus.state = 'ACTIVO';
      campus.description = '';
      campus.id_campus = null;
      (form.value as QForm).reset();
    };

    const mtd_handleRegisterCampus = () => {
      const campusForm = {
        se_descripcion: campus.description,
        se_lugar: campus.place,
        se_cantidad: 99,
        se_estado: campus.state === 'ACTIVO' ? 1 : 0,
      };

      if (campus.id_campus === '' || campus.id_campus === null) {
        emit('handCampus', {
          ...campusForm,
          id_sede: null,
          ...userTrack,
        });
      } else {
        emit('handCampus', {
          ...campusForm,
          id_sede: campus.id_campus,
          ...userTrack,
        });
      }
      mtd_handleResetDataCampus();
    };

    const campusResFilter = computed(() => {
      return props.rowsCampus.filter((item) => {
        const joinData = `${item.datos} ${item.se_descripcion} ${item.se_lugar} ${item.se_estado}`;
        return (
          joinData.toLowerCase().indexOf(search.value.toLowerCase()) !== -1
        );
      });
    });
    // #endregion

    return {
      columnsCampus,
      rows: campusResFilter,
      optionsState,
      search,
      mtd_handleRegisterCampus,
      mtd_editCampus,
      mtd_handleResetDataCampus,
      ...toRefs(campus),
      campus,
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
@import url('./FormRegisterCampus.scss');
</style>
