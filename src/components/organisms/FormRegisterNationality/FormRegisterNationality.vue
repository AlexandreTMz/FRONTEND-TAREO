<template>
  <div class="o-formRegisterNationality">
    <div
      class="o-formRegisterNationality__wraper o-formRegisterNationality__wraper--center o-formRegisterNationality__wraper--sm"
    >
      <div class="o-formRegisterNationality__header">
        Registro de nacionalidad
      </div>
      <q-form
        class="o-formRegisterNationality__form"
        ref="form"
        @submit.prevent="mtd_handleRegisterNationality"
      >
        <div class="o-formRegisterNationality__box">
          <div class="o-formRegisterNationality__inputGroups">
            <q-input
              label="Abreviatura"
              filled
              dense
              v-model="abbreviation"
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'La Abreviatura es obligatorio',
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
                  (val && val.length > 0) || 'Debe seleccionar un estado',
              ]"
            >
              <template color="primary" v-slot:prepend>
                <q-icon color="primary" name="fas fa-clipboard-check"></q-icon>
              </template>
            </q-select>
          </div>
          <div class="o-formRegisterNationality__inputGroups">
            <q-input label="Descripcion" filled dense v-model="description">
              <template color="primary" v-slot:prepend>
                <q-icon color="primary" name="fas fa-paragraph"></q-icon>
              </template>
            </q-input>
          </div>
          <div class="o-formRegisterNationality__inputGroups">
            <q-btn
              :label="
                id_nationality === '' || id_nationality === null
                  ? 'Registrar'
                  : 'Grabar'
              "
              :disable="
                !can('Registrar', 'Nacionalidad') &&
                !can('Editar', 'Nacionalidad')
              "
              v-if="
                can('Registrar', 'Nacionalidad') &&
                can('Editar', 'Nacionalidad')
              "
              color="green"
              type="submit"
            ></q-btn>

            <q-btn
              label="Registrar"
              v-else-if="can('Registrar', 'Nacionalidad')"
              color="green"
              type="submit"
            />

            <q-btn
              label="Grabar"
              v-else-if="can('Editar', 'Nacionalidad')"
              color="green"
              type="submit"
            />

            <q-btn v-else label="Registrar " color="green" disable />

            <q-btn
              label="Limpiar"
              color="primary"
              @click="mtd_handleResetDataNationality"
            ></q-btn>
          </div>
        </div>
      </q-form>
    </div>

    <div
      class="o-formRegisterNationality__wraper o-formRegisterNationality__wraper--center o-formRegisterNationality__wraper--lg o-formRegisterNationality__wraper--marginTop"
    >
      <div class="o-formRegisterNationality__header">
        Lista de nacionalidades
      </div>
      <div class="o-formRegisterNationality__box">
        <q-table
          flat
          :columns="columnsNationality"
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
                :disable="!can('Editar', 'Nacionalidad')"
                @click="mtd_editNationality(props.row)"
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
    :ILogTable="LogNacionalidad"
  ></m-modal-log-table>
</template>

<script lang="ts">
import { QForm } from 'quasar';
import { INacionalidad } from 'src/types';
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
interface INationalityForm {
  abbreviation: string;
  state: string;
  id_nationality: string | null;
  description: string;
}
// #endregion
export default defineComponent({
  name: 'OFormRegisterNationality',
  components: {
    MModalLogTable,
  },
  props: {
    rowsNationality: {
      type: Array as PropType<INacionalidad[]>,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    // #region declares
    const columnsNationality = [
      {
        label: 'Descripcion',
        field: 'na_descripcion',
        sortable: true,
        align: 'left',
        name: 'na_descripcion',
      },
      {
        label: 'Abreviatura',
        field: 'na_abreviatura',
        sortable: true,
        align: true,
        name: 'na_abreviatura',
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

    const nationality = reactive<INationalityForm>({
      abbreviation: '',
      state: 'ACTIVO',
      id_nationality: null,
      description: '',
    });

    const userTrack = getCreateUserTrack();

    const isOpenModalLog = ref(false);
    const LogNacionalidad = ref<INacionalidad>(); 
    // #endregion

    // #region methods
    const mtd_closeModalLog = () => {
      isOpenModalLog.value = false;
    };

    const mtd_slcRowTableLog = (logTable: INacionalidad) => {
      LogNacionalidad.value = logTable;
      isOpenModalLog.value = true;
    };

    const mtd_editNationality = (nacionalidadEdit: INacionalidad) => {
      nationality.abbreviation = nacionalidadEdit.na_abreviatura;
      nationality.description = nacionalidadEdit.na_descripcion;
      nationality.state = nacionalidadEdit.estado;
      nationality.id_nationality = String(nacionalidadEdit.id_nacionalidad);
    };

    const mtd_handleResetDataNationality = () => {
      nationality.description = '';
      nationality.state = 'ACTIVO';
      nationality.abbreviation = '';
      nationality.id_nationality = '';
      (form.value as QForm).reset();
    };

    const mtd_handleRegisterNationality = () => { 
      const nationalityForm = {
        id_nacionalidad: nationality.id_nationality,
        na_descripcion: nationality.description,
        na_abreviatura: nationality.abbreviation,
        na_estado: nationality.state === 'ACTIVO' ? 1 : 0,
      };

      if (
        nationalityForm.id_nacionalidad === '' ||
        nationalityForm.id_nacionalidad === null
      ) {
        emit('handNationality', {
          ...nationalityForm,
          id_nacionalidad: null,
          ...userTrack,
        });
      } else {
        emit('handNationality', {
          ...nationalityForm,
          id_nacionalidad: nationality.id_nationality,
          ...userTrack,
        });
      }
      mtd_handleResetDataNationality();
    };

    const nationalityResFilter = computed(() => {
      return props.rowsNationality.filter((item) => {
        const joinData = `${item.na_descripcion} ${item.na_abreviatura} ${item.na_estado}`;
        return (
          joinData.toLowerCase().indexOf(search.value.toLowerCase()) !== -1
        );
      });
    });
    // #endregion
    return {
      columnsNationality,
      rows: nationalityResFilter,
      optionsState,
      search,
      mtd_handleRegisterNationality,
      mtd_editNationality,
      mtd_handleResetDataNationality,
      ...toRefs(nationality),
      nationality,
      form,
      can,
      mtd_closeModalLog,
      isOpenModalLog,
      mtd_slcRowTableLog,
      LogNacionalidad,
    };
  },
});
</script>

<style lang="scss" scoped>
@import url('./FormRegisterNationality.scss');
</style>
