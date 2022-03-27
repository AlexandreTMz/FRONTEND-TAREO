<template>
  <o-register-campus
    :rowsCampus="rowsCampus"
    @handCampus="mtd_handleCampus"
  ></o-register-campus>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';

import ORegisterCampus from 'components/organisms/FormRegisterCampus';
import { IResponseFetch, ISede } from 'src/types';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';
import { MessageSuccess } from 'src/utils/swal';
import { MESSAGE_EDITAR, MESSAGE_REGISTRO } from 'src/utils/messages';

export default defineComponent({
  name: 'TRegisterCampus',
  components: {
    ORegisterCampus,
  },
  setup() {
    // #region declares
    const rowsCampus = ref<ISede[]>([]);
    // #endregion

    // #region methods
    const mtd_handleCampus = async (campus: ISede) => {
      const campusRegister = await fetchRequestAPI({
        url: '/adm/api/sede',
        method: 'POST',
        body: JSON.stringify(campus),
      });

      if (
        readErrorFetch({
          responseFetch: campusRegister,
          message: 'Ocurrió un error',
        })
      ) {
        return;
      }

      MessageSuccess({
        title: campus.id_sede
          ? MESSAGE_EDITAR('la sede')
          : MESSAGE_REGISTRO('la sede'),
      });

      await mtd_asyncGetCampus();
    };

    const mtd_asyncGetCampus = async () => {
      const resCampus = await fetchRequestAPI({
        url: '/adm/api/sede',
        method: 'GET',
      });

      if (
        readErrorFetch({
          responseFetch: resCampus,
          message: 'Ocurrió un error',
        })
      ) {
        return;
      }

      rowsCampus.value = ((resCampus as IResponseFetch).data as ISede[]) || [];
    };
    // #endregion

    // #region onMounted
    onMounted(async () => {
      await mtd_asyncGetCampus();
    });
    // #endregion

    return { rowsCampus, mtd_handleCampus };
  },
});
</script>
