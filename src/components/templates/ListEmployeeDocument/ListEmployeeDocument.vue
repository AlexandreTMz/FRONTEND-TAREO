<template>
  <div class="t-listEmployeeDocument">
    <o-list-employee-document-v-2
      v-if="!loading"
      :documentsEmployee="documentsEmployee"
      :documents="documents"
      :sedes="sedes"
      :columns="columnsDocument"
      :rows="rows"
      @select-filter="handleSelectFilter"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

import OListEmployeeDocumentV2 from 'components/organisms/ListEmployeeDocumentV2';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';
import {
  IDatosEmployeeDocument,
  IDocument,
  IResponseFetch,
  ISede,
} from 'src/types';
import { useStore } from 'src/store';

interface ISelectFilter {
  optionSelect: IFormOption;
  sede: IFormOption;
  nameOrDocument: string;
  document: IFormOption[];
  hasDocument: boolean;
  conSin: number;
  estadoEmpleado: IFormOption;
  opcionSede: string;
}

interface IFormOption {
  value: string;
  label: string;
}

interface IColumnEmployeeDocument {
  label: string;
  field: string;
  name: string;
  align: string;
}

enum EOptions {
  SEDE = '1',
  NOMBRE = '2',
  DOCUMENTO = '3',
}

export default defineComponent({
  name: 'TListEmployeeDocument',
  components: {
    OListEmployeeDocumentV2,
  },
  setup() {
    const documentsEmployee = ref<IDatosEmployeeDocument[]>();
    const documents = ref<IDocument[]>();
    const sedes = ref<ISede[]>();
    const loading = ref(true);
    const rows = ref();
    const columns = ref<IColumnEmployeeDocument[]>([
      {
        label: 'Código',
        field: 'code',
        name: 'code',
        align: 'left',
      },
      {
        label: 'Tip. Doc',
        field: 'id_tpdocumento',
        align: 'left',
        name: 'id_tpdocumento',
      },
      {
        label: 'Documento',
        field: 'per_documento',
        name: 'per_documento',
        align: 'center',
      },
      {
        label: 'Nombre y apellidos',
        field: 'name',
        name: 'name',
        align: 'left',
      },
      {
        label: 'Sedes',
        field: 'sede',
        name: 'sede',
        align: 'left',
      },
      {
        label: 'Cargo',
        field: 'position',
        name: 'position',
        align: 'left',
      },
      {
        label: 'Documento',
        field: 'document',
        name: 'document',
        align: 'center',
      },
      {
        label: 'Estado',
        field: 'state',
        name: 'state',
        align: 'center',
      },
    ]);

    const { commit } = useStore();

    const handleSelectFilter = async (newFilters: ISelectFilter) => {
      rows.value = [];
      let body = {
        opcion: newFilters.optionSelect.value,
        id_sede: '',
        nombre: '',
        documento: '',
        tp_documento: '',
        conSin: Number(newFilters.hasDocument),
        estadoEmpleado: String(newFilters.estadoEmpleado.value),
        opcionSede: newFilters.opcionSede,
      };

      if (newFilters.optionSelect.value == EOptions.SEDE) {
        body.id_sede = newFilters.sede.value || 'T';
      }

      if (newFilters.optionSelect.value == EOptions.NOMBRE) {
        body.nombre = newFilters.nameOrDocument;
      }
      if (newFilters.optionSelect.value == EOptions.DOCUMENTO) {
        body.documento = newFilters.nameOrDocument;
      }

      body.tp_documento = `${newFilters.document
        .map((item) => item.value)
        .join(',')},`;

      commit('commitLoading', true);

      const documentsEmployeeFetch = (await fetchRequestAPI({
        url: '/adm/persona/empleado/documentos/reporte',
        method: 'POST',
        body: JSON.stringify(body),
      })) as boolean | IResponseFetch;

      if (
        readErrorFetch({
          responseFetch: documentsEmployeeFetch,
          message: 'Ocurrió un error al cargar los documentos',
        })
      ) {
        commit('commitLoading', false);
        return;
      }
      commit('commitLoading', false);

      rows.value = (documentsEmployeeFetch as IResponseFetch).data;
    };

    onMounted(async () => {
      const documentsFetch = (await fetchRequestAPI({
        url: '/adm/api/documentos/empleado',
        method: 'GET',
      })) as boolean | IResponseFetch;

      const sedesFetch = (await fetchRequestAPI({
        url: '/adm/api/sede',
        method: 'GET',
      })) as boolean | IResponseFetch;

      if (
        readErrorFetch({
          message: 'Ocurrió un error al cargar los documentos',
          responseFetch: documentsFetch,
        }) ||
        readErrorFetch({
          responseFetch: sedesFetch,
          message: 'Ocurrió un error al cargar las sedes',
        })
      ) {
        return;
      }

      documents.value = (documentsFetch as IResponseFetch).data as IDocument[];
      sedes.value = (sedesFetch as IResponseFetch).data as ISede[];
      loading.value = false;
    });
    return {
      documentsEmployee,
      loading,
      documents,
      sedes,
      handleSelectFilter,
      columnsDocument: columns,
      rows,
    };
  },
});
</script>
