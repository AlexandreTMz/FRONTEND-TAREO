<template>
  <div class="o-formRegisterTpDocument">
    <div
      class="o-formRegisterTpDocument__wraper o-formRegisterTpDocument__wraper--center o-formRegisterTpDocument__wraper--sm"
    >
      <div class="o-formRegisterTpDocument__header">Datos necesarios</div>

      <q-form
        ref="form"
        class="o-formRegisterTpDocument__form"
        @submit.prevent="mtd_handleRegisterTpDocument"
      >
        <div class="o-formRegisterTpDocument__box">
          <div class="o-formRegisterTpDocument__inputGroups">
            <q-input
              v-model="abbreviation"
              hint="Los nombres son requeridos"
              filled
              dense
              label="Abreviatura"
              :rules="[
                (val) =>
                  (val !== null && val.length > 0) ||
                  'La abreviatura es requerida',
                (val) =>
                  isValidAbbreviation(val) ||
                  'La abreviatura solo puede contener letras',
              ]"
              @update:model-value="handleAbrevitation"
            >
              <template v-slot:prepend>
                <q-icon color="primary" name="fas fa-keyboard" />
              </template>
            </q-input>
            <q-input
              hint="Los nombres son requeridos"
              filled
              dense
              label="Longitud"
              type="number"
              :rules="[
                (val) =>
                  (val !== null && val > 0) || 'La longitud no es válido',
              ]"
              v-model="length"
            >
              <template v-slot:prepend>
                <q-icon color="primary" name="fas fa-sort-numeric-up-alt" />
              </template>
            </q-input>
          </div>
          <div class="o-formRegisterTpDocument__inputGroups">
            <q-select
              v-model="state"
              :options="options"
              dense
              filled
              label="Seleccione un filtro"
            >
              <template v-slot:prepend>
                <q-icon color="primary" name="fas fa-satellite-dish" />
              </template>
            </q-select>
          </div>
          <div class="o-formRegisterTpDocument__inputGroups">
            <q-input v-model="description" filled dense label="Descripcion">
              <template v-slot:prepend>
                <q-icon color="primary" name="fas fa-file-alt" />
              </template>
            </q-input>
          </div>
          <div class="o-formRegisterTpDocument__inputGroups">
            <q-btn
              :label="id_tpdocumento === '' ? 'Registrar' : 'Grabar'"
              :disable="
                !can('Registrar', 'Documentos Identidad') &&
                !can('Editar', 'Documentos Identidad')
              "
              v-if="
                can('Registrar', 'Documentos Identidad') &&
                can('Editar', 'Documentos Identidad')
              "
              color="green"
              type="submit"
            />

            <q-btn
              label="Registrar"
              v-else-if="can('Registrar', 'Documentos Identidad')"
              color="green"
              type="submit"
            />

            <q-btn
              label="Grabar"
              v-else-if="can('Editar', 'Documentos Identidad')"
              color="green"
              type="submit"
            />

            <q-btn v-else label="Registrar " color="green" disable />

            <q-btn
              label="Limpiar"
              color="blue"
              @click="mtd_handleResetDataTpDocument"
            />
          </div>
        </div>
      </q-form>
    </div>

    <div
      class="o-formRegisterTpDocument__wraper o-formRegisterTpDocument__wraper--center o-formRegisterTpDocument__wraper--marginTop o-formRegisterTpDocument__wraper--lg"
    >
      <div class="o-formRegisterTpDocument__header">
        Lista de tipos de documentos de identidad
      </div>
      <div class="o-formRegisterTpDocument__box">
        <div class="q-pa-md">
          <q-table
            flat
            :columns="columnsTpDocument"
            :rows="rows"
            no-data-label="No hay registros"
            :rows-per-page-options="[25, 50]"
          >
            <template v-slot:top-right>
              <q-input
                dense
                placeholder="Buscar"
                debounce="200"
                v-model="search"
              >
                <template v-slot:append>
                  <q-icon name="search" />
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
                  :disable="!can('Editar', 'Documentos Identidad')"
                  @click="mtd_editTpDocument(props.row)"
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
  </div>
  <m-modal-log-table
    v-if="isOpenModalLog"
    :isOpenModalLog="isOpenModalLog"
    @mtd_closeModalLog="mtd_closeModalLog"
    :ILogTable="LogTpDocumento"
  ></m-modal-log-table>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  toRefs,
  computed,
  PropType,
} from 'vue';
import { ITpDocument } from 'src/types';
import { QForm } from 'quasar';
import { can } from 'src/utils/permission';
import { isValidAbbreviation } from 'src/utils/regEx';
import MModalLogTable from 'src/components/molecules/ModalLogTables';

// #region declares
interface ITpDocumentForm {
  id_tpdocumento: string;
  state: string;
  description: string;
  abbreviation: string;
  length: number;
  action: number;
}
// #endregion

export default defineComponent({
  props: {
    rowsTpDocument: {
      type: Array as PropType<ITpDocument[]>,
      default: () => [],
    },
  },
  components: {
    MModalLogTable,
  },
  setup(props, { emit }) {
    // #region declares
    const columnsTpDocument = [
      {
        label: 'Descripcion',
        field: 'tpd_descripcion',
        sortable: true,
        align: 'left',
        name: 'tpd_descripcion',
      },
      {
        label: 'Abreviatura',
        field: 'tpd_abreviatura',
        sortable: true,
        align: 'left',
        name: 'tpd_abreviatura',
      },
      {
        label: 'Longitud',
        field: 'tpd_longitud',
        sortable: true,
        align: 'left',
        name: 'tpd_longitud',
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
        align: 'center',
        name: 'control',
      },
    ];
    const options = ['ACTIVO', 'INACTIVO'];
    const search = ref('');
    const form = ref<QForm>();
    const tpDocument = reactive<ITpDocumentForm>({
      id_tpdocumento: '',
      state: 'ACTIVO',
      description: '',
      abbreviation: '',
      length: 0,
      action: 0,
    });
    const isOpenModalLog = ref(false);
    const LogTpDocumento = ref<ITpDocument>();
    // #endregion

    // #region methods
    const mtd_closeModalLog = () => {
      isOpenModalLog.value = false;
    };

    const mtd_slcRowTableLog = (logTable: ITpDocument) => {
      LogTpDocumento.value = logTable;
      isOpenModalLog.value = true;
    };
    const mtd_editTpDocument = (tpDocmentEdit: ITpDocument) => {
      tpDocument.description = tpDocmentEdit.tpd_descripcion;
      tpDocument.state = tpDocmentEdit.estado;
      tpDocument.abbreviation = tpDocmentEdit.tpd_abreviatura;
      tpDocument.length = tpDocmentEdit.tpd_longitud;
      tpDocument.id_tpdocumento = tpDocmentEdit.id_tpdocumento;
      tpDocument.action = 1;
    };

    const mtd_handleResetDataTpDocument = () => {
      tpDocument.state = 'ACTIVO';
      tpDocument.description = '';
      tpDocument.abbreviation = '';
      tpDocument.length = 0;
      tpDocument.id_tpdocumento = '';
      tpDocument.action = 0;
      (form.value as QForm).reset();
    };

    const mtd_handleRegisterTpDocument = () => {
      const tpDocumentForm = {
        tpd_longitud: tpDocument.length,
        tpd_abreviatura: tpDocument.abbreviation,
        tpd_descripcion: tpDocument.description,
        tpd_estado: tpDocument.state === 'ACTIVO' ? 1 : 0,
        action: tpDocument.action,
      };

      if (tpDocument.id_tpdocumento === '') {
        emit('tpDocument', {
          ...tpDocumentForm,
          id_tpdocumento: tpDocument.abbreviation,
        });
      } else {
        emit('tpDocument', {
          ...tpDocumentForm,
          id_tpdocumento: tpDocument.id_tpdocumento,
        });
      }
      mtd_handleResetDataTpDocument();
    };

    const handleAbrevitation = (newValue: string) => {
      tpDocument.abbreviation = newValue.replace(' ', '-').toUpperCase();
    };

    const tpdocuments = computed(() => {
      return props.rowsTpDocument.filter((item) => {
        const joinData = `${item.tpd_descripcion} ${item.tpd_abreviatura} ${item.tpd_longitud} ${item.tpd_estado}`;
        return (
          joinData.toLowerCase().indexOf(search.value.toLowerCase()) !== -1
        );
      });
    });
    // #endregion

    return {
      options: options,
      columnsTpDocument,
      mtd_editTpDocument,
      tpDocument,
      ...toRefs(tpDocument),
      search,
      rows: tpdocuments,
      mtd_handleRegisterTpDocument,
      mtd_handleResetDataTpDocument,
      isValidAbbreviation,
      form,
      handleAbrevitation,
      can,
      mtd_closeModalLog,
      isOpenModalLog,
      mtd_slcRowTableLog,
      LogTpDocumento,
    };
  },
});
</script>

<style lang="scss" scoped>
@import url('./FormRegisterTpDocument.scss');
</style>
