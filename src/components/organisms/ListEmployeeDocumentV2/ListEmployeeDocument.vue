<template>
  <div class="o-listEmployeeDocument">
    <q-form class="o-listEmployeeDocument__form" @submit.prevent="handleForm">
      <div class="o-listEmployeeDocument__form__header">
        <h2 class="o-listEmployeeDocument__form__header__title">Documentos</h2>
      </div>

      <div class="o-listEmployeeDocument__form__filters">
        <div class="o-listEmployeeDocument__form__filters__row">
          <div class="o-listEmployeeDocument__form__filters__col">
            <a-form-label label="Persona">
              <q-select
                :options="[
                  { label: 'Todos', value: '3' },
                  { label: 'Nombres/Apellidos', value: '2' },
                  { label: 'Sedes', value: '1' },
                ]"
                v-model="optionSelect"
                outlined
                filled
                dense
              />
            </a-form-label>

            <q-input
              v-if="optionSelect.value == '2'"
              label="Nombres"
              outlined
              filled
              dense
              v-model="nameOrDocument"
            >
              <template v-slot:prepend>
                <q-icon name="fas fa-user-alt" />
              </template>
            </q-input>

            <q-select
              v-if="optionSelect.value == '1'"
              :options="sedesOptions"
              filled
              dense
              outlined
              label="Sedes"
              v-model="optionSelectSede"
            ></q-select>
          </div>

          <div class="o-listEmployeeDocument__form__filters__col">
            <a-form-label label="Tiene">
              <q-select
                outlined
                filled
                dense
                :options="[
                  { label: 'Si', value: '1' },
                  { label: 'No', value: '0' },
                ]"
                v-model="isHasDocument"
              >
              </q-select>
            </a-form-label>
          </div>
          <div class="o-listEmployeeDocument__form__filters__col">
            <a-form-label label="Documentos">
              <q-select
                outlined
                filled
                multiple
                :options="documentsOptions"
                v-model="optionSelectDocument"
                use-chips
                dense
                @update:model-value="handleUpdateSelectDocuments"
              >
                <template v-slot:prepend>
                  <q-icon name="fas fa-id-card" /> </template
              ></q-select>
            </a-form-label>
          </div>

          <div class="o-listEmployeeDocument__form__filters__col">
            <a-form-label label="Estado empleado">
              <q-select
                outlined
                filled
                dense
                :options="[
                  { label: 'ACTIVO', value: '1' },
                  { label: 'INACTIVO', value: '0' },
                  { label: 'TODOS', value: 'T' },
                ]"
                v-model="estadoEmpleado"
              >
              </q-select>
            </a-form-label>
          </div>

          <div class="o-listEmployeeDocument__form__filters__col">
            <a-form-label :label="$q.screen.width > 700 ? '&nbsp;' : ''">
              <q-btn
                class="o-listEmployeeDocument__form__filters__button"
                label="Buscar"
                color="green"
                type="submit"
              />
            </a-form-label>
          </div>
        </div>
        <div class="o-formListEmployee__inputGroups">
          <q-checkbox v-model="opcionSede" label="Con sede?" />
          <p v-if="opcionSede">
            Con esta opción se podrá visualizar las sedes de los empleados; sin embargo, la información mostrada podría duplicarse (Solo será visual)
          </p>
        </div>
      </div>
    </q-form>

    <div>
      <q-table
        flat
        :columns="columns"
        :rows="rowsFilter"
        no-data-label="No hay registros"
        title="Documentos"
        :rows-per-page-options="[50, 100]"
      >
        <template v-slot:top-right>
          <div class="o-listEmployeeDocument__table__actions">
            <q-btn
              label="Exportar ZIP"
              icon="fas fa-file-archive"
              no-caps
              :disable="isHasDocument.value == '0'"
              :color="rows.length === 0 ? 'grey' : 'primary'"
              @click="handleExportFile"
            />
            <q-btn
              :color="rows.length === 0 ? 'grey' : 'green'"
              icon-right="archive"
              label="Exportar Excel"
              no-caps
              @click="handleExportData"
              :disable="rows.length === 0"
            />

            <q-input
              borderless
              dense
              debounce="300"
              v-model="filterEmployee"
              placeholder="Buscar"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="code" :props="props">
              <span class="o-listEmployeeDocument__table__name">
                {{ props.row.codigo }}</span
              >
            </q-td>
            <q-td key="id_tpdocumento" :props="props">
              {{ props.row.id_tpdocumento }}
            </q-td>
            <q-td key="per_documento" :props="props">
              {{ props.row.per_documento }}
            </q-td>

            <q-td key="name" :props="props">
              <span class="o-listEmployeeDocument__table__name">
                {{ props.row.datos }}</span
              >
            </q-td>
            <q-td key="sede" :props="props"> {{ props.row.sede }} </q-td>
            <q-td key="position" :props="props">
              {{ props.row.posicion }}
            </q-td>

            <q-td key="document" :props="props">
              {{ props.row.documento }}
            </q-td>

            <q-td key="state" :props="props">
              {{ props.row.isPossesihng }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>
<script lang="ts">
import { IDatosEmployeeDocument, IDocument, ISede } from 'src/types';
import { fetchRequestFileAPI } from 'src/utils/axios';
import { getDateYYYMMDD } from 'src/utils/date';
import { downloadFileBlob } from 'src/utils/file';
import { MessageError } from 'src/utils/swal';
import { defineComponent, ref, PropType, onMounted, computed } from 'vue';
import AFormLabel from 'components/atoms/FormLabel';
import XLSX from 'xlsx';
import { useStore } from 'src/store';
import { MESSAGE_ERROR } from 'src/utils/messages';

interface IColumnEmployeeDocument {
  label: string;
  field: string;
  name: string;
  align: string;
}

interface IFormOption {
  value: string;
  label: string;
}

export default defineComponent({
  name: 'OListEmployeeDocumentV2',
  components: {
    AFormLabel,
  },
  props: {
    documentsEmployee: {
      type: Array as PropType<IDatosEmployeeDocument[]>,
      default: () => [],
    },
    documents: {
      type: Array as PropType<IDocument[]>,
      default: () => [],
    },
    sedes: {
      type: Array as PropType<ISede[]>,
      default: () => [],
    },
    columns: {
      type: Array as PropType<IColumnEmployeeDocument[]>,
      default: () => [],
    },
    rows: {
      type: Array as PropType<IDatosEmployeeDocument[]>,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const documentsOptions = ref<IFormOption[]>();
    const isHasDocument = ref({ label: 'Si', value: '1' });
    const estadoEmpleado = ref({ label: 'ACTIVO', value: '1' });

    const optionSelect = ref<IFormOption>({ label: 'Todos', value: '3' });
    const optionSelectDocument = ref<IFormOption[]>([
      { label: 'Todos', value: 'T' },
    ]);
    const sedesOptions = ref<IFormOption[]>();
    const optionSelectSede = ref<IFormOption | null>(null);
    const nameOrDocument = ref<string>('');
    const filterEmployee = ref('');
    const opcionSede = ref(false);

    const { commit } = useStore();

    const rowsFilter = computed(() =>
      props.rows.filter((item) => {
        const joinAllData = `${item.datos} - ${item.documento} - ${item.sede} - ${item.posicion}`;

        return (
          joinAllData
            .toLowerCase()
            .indexOf(String(filterEmployee.value).toLowerCase()) !== -1
        );
      })
    );

    const handleForm = () => {
      if (optionSelectDocument.value?.length === 0) {
        MessageError({ title: 'Debe seleccionar almenos un documento' });
        return;
      }

      if (optionSelect.value.value == '1' && optionSelectSede.value === null) {
        MessageError({ title: 'Debe seleccionar una sede' });
        return;
      }

      let documentsSelects = [];

      if (optionSelectDocument.value.some((item) => item.value === 'T')) {
        documentsSelects = props.documents.map((item) => ({
          label: item.de_nombre,
          value: item.id_emdocumento,
        }));
      } else {
        documentsSelects = optionSelectDocument.value;
      }

      emit('select-filter', {
        optionSelect: optionSelect.value,
        sede: optionSelectSede.value,
        nameOrDocument: nameOrDocument.value,
        document: documentsSelects,
        hasDocument: isHasDocument.value.value,
        estadoEmpleado: estadoEmpleado.value,
        opcionSede: opcionSede.value ? '1' : '0',
      });
    };

    const handleExportFile = async () => {
      if (optionSelect.value.value == '1' && optionSelectSede.value === null) {
        MessageError({ title: 'Debe seleccionar una sede' });
        return;
      }

      if (optionSelectDocument.value?.length === 0) {
        MessageError({ title: 'Debe seleccionar almenos un documento' });
        return;
      }

      let body = {
        opcion: optionSelect.value.value,
        id_sede: '',
        nombre: '',
        documento: '',
        tp_documento: '',
        conSin: Number(isHasDocument.value.value),
        estadoEmpleado: estadoEmpleado.value.value,
      };

      if (optionSelect.value.value == '1' && optionSelectSede.value) {
        body.id_sede = optionSelectSede.value.value || 'T';
      }

      if (optionSelect.value.value == '2') {
        body.nombre = nameOrDocument.value;
      }

      if (optionSelect.value.value == '3') {
        body.documento = nameOrDocument.value;
      }

      if (optionSelectDocument.value.some((item) => item.value === 'T')) {
        body.tp_documento = `${props.documents
          .map((item) => item.id_emdocumento)
          .join(',')},`;
      } else {
        body.tp_documento = `${optionSelectDocument.value
          .map((item) => item.value)
          .join(',')},`;
      }

      commit('commitLoading', true);

      const fetchDownload = (await fetchRequestFileAPI({
        url: '/adm/persona/empleado/documentos/reporte/descargar',
        method: 'POST',
        body: JSON.stringify(body),
        responseType: 'blob',
      })) as boolean | Blob;

      if (!fetchDownload) {
        MessageError({ title: MESSAGE_ERROR() });
        commit('commitLoading', false);
        return;
      }

      try {
        const jsonText = await (fetchDownload as Blob).text();
        const jsonParse = JSON.parse(jsonText) as { msg: string };
        if (jsonParse.hasOwnProperty('msg')) {
          MessageError({ title: 'No hay documentos subidos' });
          commit('commitLoading', false);
          return;
        }
      } catch (error) {
        commit('commitLoading', false);
        downloadFileBlob(
          fetchDownload as Blob,
          `documentos-${getDateYYYMMDD()}`,
          'zip'
        );
      }
    };

    const handleExportData = () => {
      commit('commitLoading', true);
      const formatDataToExcel = rowsFilter.value.map((item) => ({
        Codigo: String(item.codigo),
        'Doc. Identidad': String(item.per_documento),
        'Nombres y apellidos': item.datos,
        Sede: String(item.sede),
        Posicion: String(item.posicion),
        'Tipo de documento': String(item.documento),
        Estado: item.isPossesihng,
      }));
      var animalWS = XLSX.utils.json_to_sheet(formatDataToExcel);

      var wb = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(wb, animalWS, 'Documentos');
      XLSX.writeFile(wb, `Documentos-${getDateYYYMMDD()}.xlsx`);
      commit('commitLoading', false);
    };

    const handleUpdateSelectDocuments = (
      newValue: {
        value: string;
        label: string;
      }[]
    ) => {
      if (newValue.some((item) => item.value === 'T')) {
        optionSelectDocument.value = [{ label: 'Todos', value: 'T' }];
      }
    };

    onMounted(() => {
      sedesOptions.value = props.sedes.map((sede) => ({
        label: sede.datos,
        value: sede.id_sede,
      }));

      documentsOptions.value = [
        { de_nombre: 'Todos', id_emdocumento: 'T' },
        ...props.documents,
      ].map((item) => ({
        label: item.de_nombre,
        value: item.id_emdocumento,
      }));
    });

    return {
      optionSelect,
      documentsOptions,
      optionSelectDocument,
      isHasDocument,
      sedesOptions,
      handleForm,
      optionSelectSede,
      nameOrDocument,
      handleExportFile,
      handleExportData,
      handleUpdateSelectDocuments,
      filterEmployee,
      rowsFilter,
      estadoEmpleado,
      opcionSede,
    };
  },
});
</script>
<style lang="scss" scoped>
@import './ListEmployeeDocument.scss';
</style>
