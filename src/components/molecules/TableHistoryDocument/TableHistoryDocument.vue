<template>
  <div class="m-tableHistoryDocument">
    <q-table
      title="Históricos de documentos"
      flat
      :columns="columns"
      :rows="rows"
      no-data-label="No hay registros"
      :rows-per-page-options="[25, 50]"
    >
      <template v-slot:body-cell-options="props">
        <q-td :props="props">
          <div class="m-tableHistoryDocument__table__actions">
            <q-btn
              icon="far fa-eye"
              flat
              fab-mini
              color="primary"
              v-if="props.row.state === 1"
              @click="handleViewDocument(props.row)"
            />
            <q-btn
              icon="add"
              flat
              fab-mini
              color="green"
              :disable="
                !can('Acceso Documentos', 'Empleado', 'Editar') ||
                props.row.state === 1
              "
              @click="selectFileDocument(props.row.id_emdocumento)"
            />
            <q-btn
              :disable="
                !can('Acceso Documentos', 'Empleado', 'Editar') ||
                props.row.state === 0
              "
              icon="delete"
              flat
              fab-mini
              color="negative"
              @click="handleDeleteDocument(props.row.id_emdocumento)"
            />
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-name="props">
        <q-td :props="props">
          <div class="ellipsis" style="max-width: 300px; text-align: center">
            {{ props.row.name }}
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-state="props">
        <q-td :props="props">
          <q-badge :color="props.row.state === 0 ? 'orange' : 'success'">
            {{ props.row.state === 0 ? 'PENDIENTE' : 'SUBIDO' }}
          </q-badge>
        </q-td>
      </template>

      <template v-slot:body-cell-dateIssue="props">
        <q-td :props="props">
          <q-input
            type="date"
            v-model="props.row.dateIssue"
            @input="selectDateDocument($event, 0, props.row.id_emdocumento)"
            @keypress.enter="
              handleUpdateDateDocument(props.row.id_emdocumento, 0)
            "
            :disable="!can('Acceso Documentos', 'Empleado', 'Editar')"
          />
          <!-- :disable="!can('Modificar', 'Empleado')" -->
        </q-td>
      </template>

      <template v-slot:body-cell-dateValidity="props">
        <q-td :props="props">
          <q-input
            type="date"
            v-model="props.row.dateValidity"
            @input="selectDateDocument($event, 1, props.row.id_emdocumento)"
            @keypress.enter="
              handleUpdateDateDocument(props.row.id_emdocumento, 1)
            "
            :disable="!can('Acceso Documentos', 'Empleado', 'Editar')"
          />
          <!-- :disable="!can('Modificar', 'Empleado')" -->
        </q-td>
      </template>
    </q-table>

    <div>
      <strong>Leyenda:</strong> Actualizar las fechas de Emisión/Vigencia -
      Teclado: <kbd>Enter</kbd>
    </div>
  </div>
</template>

<script lang="ts">
import { IDocument, IEmployeeDocument, IResponseFetch } from 'src/types';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';
import { selectFile } from 'src/utils/selectClickFile';
import { getServerFileDocument } from 'src/utils/staticFiles';
import { defineComponent, ref, onMounted, PropType } from 'vue';
import { useStore } from 'src/store';
import { getFileSize } from 'src/utils/file';
import {
  MessageConfirmation,
  MessageError,
  MessageSuccess,
} from 'src/utils/swal';
import { can } from 'src/utils/permission';
import { DATE_EMPTY } from 'src/constant';
import { getCreateUserTrack } from 'src/utils/userTrack';

interface IDocumentRowTable extends IDocument {
  file: null | File;
  size: string;
  dateIssue: null | string;
  dateValidity: null | string;
  state: number;
  name: string;
  id_docemp: string;
}

export default defineComponent({
  name: 'MTableHistorySalary',
  props: {
    idEmployee: {
      type: String,
      default: '',
    },
    documentEmployee: {
      type: String,
      default: '',
    },
    documents: {
      type: Array as PropType<IDocument[]>,
      default: () => [],
    },
  },
  setup(props) {
    const columns = [
      {
        label: 'Tipo de documento',
        name: 'de_nombre',
        field: 'de_nombre',
        align: 'left',
      },
      {
        label: 'Peso',
        name: 'size',
        field: 'size',
        align: 'center',
      },
      {
        label: 'Fecha de Emisión',
        name: 'dateIssue',
        field: 'dateIssue',
        align: 'center',
      },
      {
        label: 'Fecha de vencimiento',
        name: 'dateValidity',
        field: 'dateValidity',
        align: 'center',
      },
      {
        label: 'Estado',
        name: 'state',
        field: 'state',
        align: 'center',
      },
      {
        label: 'Opciones',
        name: 'options',
        field: 'options',
        align: 'center',
      },
    ];

    const rows = ref<IDocumentRowTable[]>([]);
    const { commit } = useStore();

    const userTrack = getCreateUserTrack();

    const selectFileDocument = async (idDocument: string) => {
      const document = rows.value.find(
        (item) => item.id_emdocumento === idDocument
      );

      if (!document) {
        MessageError({ title: 'Ocurrió un error' });
        return;
      }

      if (!document?.dateIssue || !document?.dateValidity) {
        const message = `${!document?.dateIssue ? 'Emisión' : ''} ${
          !document?.dateIssue && !document?.dateValidity ? 'y' : ''
        } ${!document?.dateValidity ? 'Vigencia' : ''}`;

        const result = await MessageConfirmation({
          title: '¿Seguro que desea continuar?',
          text: `La fecha de ${message} no ha sido modificada`,
          showCancelButton: true,
        });

        if (result?.isDismissed) {
          return;
        }
      }

      if (
        document?.dateValidity &&
        new Date(String(document?.dateIssue)) > new Date(document?.dateValidity)
      ) {
        MessageError({
          title:
            'La fecha de emisión debe ser menor o igual que la Fecha de vencimiento.',
        });
        return;
      }

      const file =
        ((await selectFile('application/pdf', false)) as File) || null;

      if (file) {
        commit('commitLoading', true);
        const itemFile = rows.value.find(
          (item) => item.id_emdocumento === idDocument
        );

        const formData = new FormData();
        formData.append('documento', props.documentEmployee);
        formData.append('file_documents', file);
        formData.append('id_emdocumento', idDocument);
        formData.append('emd_nombrefile', file.name);
        formData.append('emd_pesofile', String(file.size));
        formData.append(
          'emd_emision',
          !itemFile?.dateIssue ? DATE_EMPTY : String(itemFile?.dateIssue)
        );
        formData.append(
          'emd_vigencia',
          !itemFile?.dateValidity ? DATE_EMPTY : String(itemFile?.dateValidity)
        );

        formData.append('userCreacion', userTrack.userCreacion); 

        const uploadFile = await fetchRequestAPI({
          url: '/adm/api/documentos/empleado',
          method: 'POST',
          body: formData,
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (
          readErrorFetch({
            responseFetch: uploadFile,
            message: 'Ocurrió un error inténtelo de nuevo',
          })
        ) {
          commit('commitLoading', false);
          return;
        }

        await getAsyncDocumentsEmployee();
        commit('commitLoading', false);
      }
    };

    const handleDeleteDocument = async (idDocument: string) => {
      commit('commitLoading', true);
      const itemFile = rows.value.find(
        (item) => item.id_emdocumento === idDocument
      );

      const uploadFile = await fetchRequestAPI({
        url: '/adm/api/documentos/empleado/eliminar',
        method: 'POST',
        body: JSON.stringify({
          id_docemp: itemFile?.id_docemp,
          documento: props.documentEmployee,
          archivo: itemFile?.name,
          ...userTrack,
        }),
      });
      if (
        readErrorFetch({
          responseFetch: uploadFile,
          message: 'Ocurrió un error inténtelo de nuevo',
        })
      ) {
        commit('commitLoading', false);

        return;
      }

      await getAsyncDocumentsEmployee();
      commit('commitLoading', false);
    };

    const getAsyncDocumentsEmployee = async () => {
      const documentFetch = await fetchRequestAPI({
        url: `/adm/api/documentos/empleado/${props.idEmployee}`,
        method: 'GET',
      });

      if (
        readErrorFetch({
          responseFetch: documentFetch,
          message: 'Ocurrió un error, al mostrar los documentos',
        })
      ) {
        return;
      }
      rows.value = [...props.documents].map((item) => {
        const itemAux: IDocumentRowTable = {
          ...item,
          file: null,
          size: '',
          dateIssue: null,
          dateValidity: null,
          state: 0,
          name: '',
          id_docemp: '',
        };
        const existFileDocument = (
          (documentFetch as IResponseFetch).data as IEmployeeDocument[]
        ).find(
          (employeeDocument) =>
            employeeDocument.id_documento === item.id_emdocumento &&
            employeeDocument.do_ruta !== null
        );

        /*console.log('Items ',item)
        console.log('Props ',props.documents)
        console.log('Exists ',existFileDocument)
        console.log('Auxi ',itemAux)*/

        if (existFileDocument) {
          itemAux.size = getFileSize(Number(existFileDocument.do_peso));

          itemAux.name = existFileDocument.do_ruta;
          itemAux.dateIssue =
            existFileDocument.do_emision === DATE_EMPTY
              ? ''
              : existFileDocument.do_emision;
          itemAux.dateValidity =
            existFileDocument.do_vigencia === DATE_EMPTY
              ? ''
              : existFileDocument.do_vigencia;
          itemAux.state = 1;
          itemAux.id_docemp = existFileDocument.id_docemp;
        }
        console.log('Rows ',rows.value)
        return itemAux;
      });
    };

    const selectDateDocument = (
      date: string,
      type: number,
      idDocument: string
    ) => {
      rows.value = (rows.value as IDocumentRowTable[]).map((item) => {
        if (item.id_emdocumento === idDocument) {
          //0 Fecha de emision
          if (type === 0) {
            item.dateIssue = date;
          }
          //1 Fecha de vencimiento
          if (type === 1) {
            item.dateValidity = date;
          }
        }
        return item;
      });
    };

    const handleViewDocument = (rowParam: IDocumentRowTable) => {
      const pathFileDocument = getServerFileDocument(
        props.documentEmployee,
        rowParam.name
      );

      window.open(pathFileDocument, '_blank');
    };

    const handleUpdateDateDocument = async (
      idDocument: string,
      option: number
    ) => {
      const document = rows.value.find(
        (item) => item.id_emdocumento === idDocument
      );

      if (!document) {
        MessageError({ title: 'Ocurrió un error' });
        return;
      }

      if (document.state === 0) {
        return;
      }

      if (
        document?.dateValidity !== null &&
        new Date(String(document?.dateIssue)) >
          new Date(
            document?.dateValidity === null
              ? DATE_EMPTY
              : document?.dateValidity
          )
      ) {
        MessageError({
          title:
            'La fecha de emisión debe ser menor o igual que la Fecha de vencimiento.',
        });
        return;
      }

      const dateIssue = document.dateIssue ? document.dateIssue : DATE_EMPTY;
      const dateValidity = document.dateValidity
        ? document.dateValidity
        : DATE_EMPTY;

      const documentFetch = await fetchRequestAPI({
        url: 'adm/documentos-empleado/fechas',
        body: JSON.stringify({
          id_docemp: document.id_docemp,
          opcion: option,
          fecha_emision: dateIssue,
          fecha_vigencia: dateValidity,
          ...userTrack,
        }),
        method: 'POST',
      });

      if (
        readErrorFetch({
          responseFetch: documentFetch,
          message: 'Ocurrió un error al actualizar la fecha',
        })
      ) {
        return;
      }

      MessageSuccess({
        title: `La fecha de ${
          option == 0 ? 'Emisión' : 'Vigencia'
        } ha sido actualizada`,
      });
      await getAsyncDocumentsEmployee();
    };

    onMounted(async () => {
      await getAsyncDocumentsEmployee();
    });
    return {
      columns,
      rows,
      selectFileDocument,
      handleDeleteDocument,
      selectDateDocument,
      handleViewDocument,
      handleUpdateDateDocument,
      can,
    };
  },
});
</script>

<style lang="scss" scoped>
@import './TableHistoryDocument.scss';
</style>
