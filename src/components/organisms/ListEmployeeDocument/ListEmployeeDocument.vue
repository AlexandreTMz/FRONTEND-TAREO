<template>
  <div class="o-listEmployeeDocument">
    <q-form class="o-listEmployeeDocument__form" @submit.prevent="handleForm">
      <div class="o-listEmployeeDocument__form__header">
        <h2 class="o-listEmployeeDocument__form__header__title">Documentos</h2>
      </div>

      <div class="o-listEmployeeDocument__form__body">
        <div class="o-listEmployeeDocument__form__body__box">
          <q-select
            :options="[
              { label: 'DNI', value: '3' },
              { label: 'Nombres', value: '2' },
              { label: 'Sedes', value: '1' },
            ]"
            v-model="optionSelect"
            outlined
            filled
            dense
          />
          <q-input
            v-if="optionSelect.value !== '1'"
            :label="optionSelect.value == '3' ? 'DNI' : 'Nombres'"
            outlined
            filled
            dense
            v-model="nameOrDocument"
          >
            <template v-slot:prepend>
              <q-icon
                :name="
                  optionSelect.value == '3'
                    ? 'fas fa-id-card'
                    : 'fas fa-user-alt'
                "
              />
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

        <div class="o-listEmployeeDocument__form__body__box">
          <q-toggle
            class="o-listEmployeeDocument__form__body__box__hasDocument"
            checked-icon="check"
            color="red"
            :label="isHasDocument ? 'Con documento' : 'Sin documento'"
            unchecked-icon="clear"
            v-model="isHasDocument"
          />

          <q-select
            outlined
            filled
            multiple
            :options="documentsOptions"
            v-model="optionSelectDocument"
            use-chips
            dense
          >
            <template v-slot:prepend>
              <q-icon name="fas fa-id-card" /> </template
          ></q-select>

          <q-btn
            v-if="rows.length > 0"
            class="o-listEmployeeDocument__form__footer__button"
            label="Exportar"
            color="primary"
            icon="fas fa-download"
            @click="handleExportFile"
          />
        </div>
      </div>
      <div class="o-listEmployeeDocument__form__footer">
        <q-btn
          class="o-listEmployeeDocument__form__footer__button"
          label="Buscar"
          type="submit"
          color="green"
        />
      </div>
    </q-form>

    <div>
      <q-table
        flat
        :columns="columns"
        :rows="rows"
        no-data-label="No hay registros"
        :rows-per-page-options="[25, 50]"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="name" :props="props">
              <span class="o-listEmployeeDocument__table__name">
                {{ props.row.name }}</span
              >
            </q-td>
            <q-td key="document" :props="props">
              {{ props.row.document }}
            </q-td>
            <q-td
              v-for="item in props.row.files"
              :key="item.id_documento"
              :props="props"
            >
              <q-icon
                v-if="String(item.isPossesihng).toLowerCase() == 'si'"
                name="fas fa-check-circle"
                size="30px"
                color="green"
              />
              <q-icon
                v-if="String(item.isPossesihng).toLowerCase() == 'no'"
                name="fas fa-times-circle"
                size="25px"
                color="negative"
              />
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
import { defineComponent, ref, PropType, onMounted } from 'vue';

interface IRowEmployeeDocument {
  files: IDatosEmployeeDocument[];
  document: string;
  name: string;
}

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
  name: 'OListEmployeeDocument',
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
      type: Array as PropType<IRowEmployeeDocument[]>,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const documentsOptions = ref<IFormOption[]>();
    const isHasDocument = ref(false);
    const optionSelect = ref<IFormOption>({ label: 'DNI', value: '3' });
    const optionSelectDocument = ref<IFormOption[]>([]);
    const sedesOptions = ref<IFormOption[]>();
    const optionSelectSede = ref<IFormOption | null>(null);
    const nameOrDocument = ref<string>('');

    const handleForm = () => {
      if (optionSelectDocument.value?.length === 0) {
        MessageError({ title: 'Debe seleccionar al menos un documento' });
        return;
      }

      if (optionSelect.value.value == '1' && optionSelectSede.value === null) {
        MessageError({ title: 'Debe seleccionar una sede' });
        return;
      }

      emit('select-filter', {
        optionSelect: optionSelect.value,
        sede: optionSelectSede.value,
        nameOrDocument: nameOrDocument.value,
        document: optionSelectDocument.value,
        hasDocument: isHasDocument.value,
      });
    };

    const handleExportFile = async () => {
      if (optionSelect.value.value == '1' && optionSelectSede.value === null) {
        MessageError({ title: 'Debe seleccionar una sede' });
        return;
      }

      if (optionSelectDocument.value?.length === 0) {
        MessageError({ title: 'Debe seleccionar al menos un documento' });
        return;
      }

      let body = {
        opcion: optionSelect.value.value,
        id_sede: '',
        nombre: '',
        documento: '',
        tp_documento: '',
        conSin: Number(isHasDocument.value),
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

      body.tp_documento = `${optionSelectDocument.value
        .map((item) => item.value)
        .join(',')},`;

      const fetchDownload = (await fetchRequestFileAPI({
        url: '/adm/persona/empleado/documentos/reporte/descargar',
        method: 'POST',
        body: JSON.stringify(body),
        responseType: 'blob',
      })) as boolean | Blob;

      if (!fetchDownload) {
        MessageError({ title: 'Ocurrió un error al exportar los documentos' });
        return;
      }

      try {
        const jsonText = await (fetchDownload as Blob).text();

        const jsonParse = JSON.parse(jsonText) as { msg: string };

        if (jsonParse.hasOwnProperty('msg')) {
          MessageError({ title: 'No hay documentos subidos' });
          return;
        }
      } catch (error) {
        downloadFileBlob(
          fetchDownload as Blob,
          `documentos-${getDateYYYMMDD()}`,
          'zip'
        );
      }
    };

    onMounted(() => {
      sedesOptions.value = props.sedes.map((sede) => ({
        label: sede.datos,
        value: sede.id_sede,
      }));

      documentsOptions.value = props.documents.map((item) => ({
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
    };
  },
});
</script>
<style lang="scss" scoped>
@import './ListEmployeeDocument.scss';
</style>
