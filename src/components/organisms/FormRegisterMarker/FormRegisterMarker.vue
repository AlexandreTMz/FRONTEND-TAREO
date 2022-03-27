<template>
  <div class="o-formRegisterMarker">
    <div
      class="o-formRegisterMarker__wraper o-formRegisterMarker__wraper--center o-formRegisterMarker__wraper--sm"
    >
      <div class="o-formRegisterMarker__header">Registro de marcador</div>
      <q-form
        class="o-formRegisterMarker__form"
        ref="form"
        @submit.prevent="mtd_handleRegisterMarker"
      >
        <div class="o-formRegisterMarker__box">
          <div class="o-formRegisterMarker__inputGroups">
            <q-input label="Abreviatura" filled dense v-model="abbreviation">
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
                (val) => (val && val.length > 0) || 'Este campo es obligatorio',
              ]"
            >
              <template color="primary" v-slot:prepend>
                <q-icon color="primary" name="fas fa-clipboard-check"></q-icon>
              </template>
            </q-select>
          </div>
          <div class="o-formRegisterMarker__inputGroups">
            <q-input
              label="Descripcion"
              type="textarea"
              filled
              dense
              v-model="description"
            >
              <template color="primary" v-slot:prepend>
                <q-icon color="primary" name="fas fa-paragraph"></q-icon>
              </template>
            </q-input>
          </div>
          <div class="o-formRegisterMarker__inputGroups">
            <q-btn
              :label="id_marker === null ? 'Registrar' : 'Editar'"
              color="green"
              type="submit"
            ></q-btn>
            <q-btn
              label="Limpiar"
              color="primary"
              @click="mtd_handleResetDataMarker"
            ></q-btn>
          </div>
        </div>
      </q-form>
    </div>

    <div
      class="o-formRegisterMarker__wraper o-formRegisterMarker__wraper--center o-formRegisterMarker__wraper--lg o-formRegisterMarker__wraper--marginTop"
    >
      <div class="o-formRegisterMarker__header">Lista de marcadores</div>
      <div class="o-formRegisterMarker__box">
        <q-table
          flat
          :columns="columnsMarker"
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
                @click="mtd_editMarker(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { QForm } from 'quasar';
import { IMarcador } from 'src/types';
import {
  defineComponent,
  ref,
  reactive,
  PropType,
  computed,
  toRefs,
} from 'vue';

// #region interface
interface IMarkerForm {
  abbreviation: string;
  state: string;
  id_marker: number | null;
  description: string;
  ma_tipo: 1;
}
// #endregion
export default defineComponent({
  name: 'OFormRegisterMarker',
  props: {
    rowsMarker: {
      type: Array as PropType<IMarcador[]>,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    // #region declares
    const columnsMarker = [
      {
        label: 'Descripcion',
        field: 'ma_descripcion',
        sortable: true,
        align: 'left',
        name: 'ma_descripcion',
      },
      {
        label: 'Abreviatura',
        field: 'ma_abreviatura',
        sortable: true,
        align: true,
        name: 'ma_abreviatura',
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

    const marker = reactive<IMarkerForm>({
      abbreviation: '',
      state: '',
      id_marker: null,
      description: '',
      ma_tipo: 1,
    });
    // #endregion

    // #region methods
    const mtd_editMarker = (marcadorEdit: IMarcador) => {
      marker.abbreviation = marcadorEdit.ma_abreviatura;
      marker.description = marcadorEdit.ma_descripcion;
      marker.state = marcadorEdit.estado;
      marker.id_marker = Number(marcadorEdit.id_marcador);
    };

    const mtd_handleResetDataMarker = () => {
      marker.description = '';
      marker.state = '';
      marker.abbreviation = '';
      marker.id_marker = null;
      (form.value as QForm).reset();
    };

    const mtd_handleRegisterMarker = () => {
      const markerForm = {
        id_marcador: marker.id_marker,
        ma_descripcion: marker.description,
        ma_abreviatura: marker.abbreviation,
        ma_estado: marker.state === 'ACTIVO' ? 1 : 0,
      };

      if (markerForm.id_marcador === null) {
        emit('handMarker', {
          ...markerForm,
          id_marcador: null,
        });
      } else {
        emit('handMarker', {
          ...markerForm,
          id_marcador: marker.id_marker,
        });
      }
      mtd_handleResetDataMarker();
    };

    const permissionResFilter = computed(() => {
      return props.rowsMarker.filter((item) => {
        const joinData = `${item.ma_descripcion} ${item.ma_abreviatura} ${item.ma_estado}`;
        return (
          joinData.toLowerCase().indexOf(search.value.toLowerCase()) !== -1
        );
      });
    });
    // #endregion

    return {
      columnsMarker,
      rows: permissionResFilter,
      optionsState,
      search,
      mtd_handleRegisterMarker,
      mtd_editMarker,
      mtd_handleResetDataMarker,
      ...toRefs(marker),
      marker,
      form,
    };
  },
});
</script>

<style lang="scss" scoped>
@import url('./FormRegisterMarker.scss');
</style>
