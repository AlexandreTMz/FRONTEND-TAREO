<template>
  <o-form-register-tp-document
    :rowsTpDocument="rowsTpDocument"
    @tpDocument="mtd_handleTpDocument"
  ></o-form-register-tp-document>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import OFormRegisterTpDocument from 'components/organisms/FormRegisterTpDocument';
import { IResponseFetch, ITpDocument } from 'src/types';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';
import { MessageSuccess } from 'src/utils/swal';
import {
  MESSAGE_EDITAR,
  MESSAGE_ERROR,
  MESSAGE_REGISTRO,
} from 'src/utils/messages';
import { getCreateUserTrack } from 'src/utils/userTrack';

export default defineComponent({
  components: {
    OFormRegisterTpDocument,
  },
  setup() {
    // #region declares
    const rowsTpDocument = ref<ITpDocument[]>([]);
    const userTrack = getCreateUserTrack();
    // #endregion

    // #region methods
    const mtd_handleTpDocument = async (tpDocument: ITpDocument) => {
      const tpDocumentRegister = await fetchRequestAPI({
        url: '/adm/api/tipo_documento',
        method: 'POST',
        body: JSON.stringify({ ...tpDocument, ...userTrack }),
      });

      if (
        readErrorFetch({
          responseFetch: tpDocumentRegister,
          message: 'Ocurrió un error',
        })
      ) {
        return;
      }
 
      MessageSuccess({
        title:
          tpDocument?.action === 1
            ? MESSAGE_EDITAR('el tipo de documento')
            : MESSAGE_REGISTRO('el tipo de documento'),
      });
      await mtd_asyncGetTpDocuments();
    };

    const mtd_asyncGetTpDocuments = async () => {
      const tpDocuments = await fetchRequestAPI({
        url: '/adm/api/tipo_documento',
        method: 'GET',
      });

      if (
        readErrorFetch({
          responseFetch: tpDocuments,
          message: MESSAGE_ERROR(),
        })
      ) {
        return;
      }

      rowsTpDocument.value = (tpDocuments as IResponseFetch)
        .data as ITpDocument[];
    };
    // #endregion

    // #region onMounted
    onMounted(async () => {
      await mtd_asyncGetTpDocuments();
    });
    // #endregion

    return { rowsTpDocument, mtd_handleTpDocument };
  },
});
</script>
<style lang="scss" scoped>
@import url('./RegisterTpDocument.scss');
</style>
