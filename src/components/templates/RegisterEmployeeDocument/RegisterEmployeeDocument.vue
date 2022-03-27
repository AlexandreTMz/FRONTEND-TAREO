<template>
  <o-form-register-employee-document
    :rowsDocumentsEmployee="rowsDocumentsEmployee"
    @handDocumentEmployee="handlerDocumentsEmployee"
  ></o-form-register-employee-document>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import OFormRegisterEmployeeDocument from 'components/organisms/FormRegisterEmployeeDocument';
import { IDocumentEmployee, IResponseFetch } from 'src/types';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';
import { MessageSuccess } from 'src/utils/swal';
import {
  MESSAGE_EDITAR,
  MESSAGE_ERROR,
  MESSAGE_REGISTRO,
} from 'src/utils/messages';

export default defineComponent({
  name: 'TRegisterEmployeeDocument',
  components: {
    OFormRegisterEmployeeDocument,
  },
  setup() {
    const rowsDocumentsEmployee = ref<IDocumentEmployee[]>([]);

    const handlerDocumentsEmployee = async (
      documentEmployee: IDocumentEmployee
    ) => {
      const documentEmployeeRegister = await fetchRequestAPI({
        url: '/adm/documentos-empleado',
        method: 'POST',
        body: JSON.stringify(documentEmployee),
      });

      if (
        readErrorFetch({
          responseFetch: documentEmployeeRegister,
          message: MESSAGE_ERROR(),
        })
      ) {
        return;
      }

      MessageSuccess({
        title: documentEmployee.id_emdocumento
          ? MESSAGE_EDITAR('el documento')
          : MESSAGE_REGISTRO('el documento'),
      });
      await asyncGetDocumentsEmployee();
    };

    const asyncGetDocumentsEmployee = async () => {
      const documentsEmployee = await fetchRequestAPI({
        url: '/adm/documentos-empleado',
        method: 'GET',
      });

      if (
        readErrorFetch({
          responseFetch: documentsEmployee,
          message: MESSAGE_ERROR(),
        })
      ) {
        return;
      }

      rowsDocumentsEmployee.value =
        ((documentsEmployee as IResponseFetch).data as IDocumentEmployee[]) ||
        [];
    };

    onMounted(async () => {
      await asyncGetDocumentsEmployee();
    });

    return { rowsDocumentsEmployee, handlerDocumentsEmployee };
  },
});
</script>
