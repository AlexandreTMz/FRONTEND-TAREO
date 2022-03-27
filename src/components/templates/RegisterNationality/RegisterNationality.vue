<template>
  <o-form-register-nationality
    :rowsNationality="rowsNationality"
    @handNationality="mtd_handleNationality"
  ></o-form-register-nationality>
</template>

<script lang="ts">
import OFormRegisterNationality from 'components/organisms/FormRegisterNationality';
import { defineComponent, ref, onMounted } from 'vue';
import { INacionalidad, IResponseFetch } from 'src/types';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';
import { MessageSuccess } from 'src/utils/swal';
import {
  MESSAGE_EDITAR,
  MESSAGE_ERROR,
  MESSAGE_REGISTRO,
} from 'src/utils/messages';

export default defineComponent({
  name: 'TRegisterNationality',
  components: {
    OFormRegisterNationality,
  },
  setup() {
    // #region declares
    const rowsNationality = ref<INacionalidad[]>([]);
    // #endregion

    // #region methods
    const mtd_handleNationality = async (nationality: INacionalidad) => {
      const nationalityRegister = await fetchRequestAPI({
        url: '/adm/api/nacionalidad',
        method: 'POST',
        body: JSON.stringify(nationality),
      });

      if (
        readErrorFetch({
          responseFetch: nationalityRegister,
          message: MESSAGE_ERROR(),
        })
      ) {
        return;
      }

      MessageSuccess({
        title: nationality.id_nacionalidad
          ? MESSAGE_EDITAR('la nacionalidad')
          : MESSAGE_REGISTRO('la nacionalidad'),
      });

      await mtd_asyncGetNationality();
    };

    const mtd_asyncGetNationality = async () => {
      const resNacionality = await fetchRequestAPI({
        url: '/adm/api/nacionalidad',
        method: 'GET',
      });

      if (
        readErrorFetch({
          responseFetch: resNacionality,
          message: MESSAGE_ERROR(),
        })
      ) {
        return;
      }

      rowsNationality.value =
        ((resNacionality as IResponseFetch).data as INacionalidad[]) || [];
    };
    // #endregion

    // #region onMounted
    onMounted(async () => {
      await mtd_asyncGetNationality();
    });
    // #endregion

    return { rowsNationality, mtd_handleNationality };
  },
});
</script>
