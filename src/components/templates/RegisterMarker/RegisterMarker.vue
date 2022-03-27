<template>
  <o-form-register-marker
    :rowsMarker="rowsMarker"
    @handMarker="mtd_handleMarker"
  ></o-form-register-marker>
</template>

<script lang="ts">
import OFormRegisterMarker from 'components/organisms/FormRegisterMarker';
import { defineComponent, ref, onMounted } from 'vue';
import { IMarcador, IResponseFetch } from 'src/types';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';
import { MessageSuccess } from 'src/utils/swal';

export default defineComponent({
  name: 'TRegisterMarker',
  components: {
    OFormRegisterMarker,
  },
  setup() {
    // #region declares
    const rowsMarker = ref<IMarcador[]>([]);
    // #endregion

    // #region methods
    const mtd_handleMarker = async (marker: IMarcador) => {
      const markerRegister = await fetchRequestAPI({
        url: '/adm/api/marcador',
        method: 'POST',
        body: JSON.stringify(marker),
      });

      if (
        readErrorFetch({
          responseFetch: markerRegister,
          message: 'Ocurrió un error',
        })
      ) {
        return;
      }

      MessageSuccess({
        title: marker.id_marcador
          ? 'Marcador actualizado'
          : 'Marcador registrado',
      });
      await mtd_asyncGetMarker();
    };

    const mtd_asyncGetMarker = async () => {
      const resMarker = await fetchRequestAPI({
        url: '/adm/api/marcador/1',
        method: 'GET',
      });

      if (
        readErrorFetch({
          responseFetch: resMarker,
          message: 'Ocurrió un error',
        })
      ) {
      }
      rowsMarker.value =
        ((resMarker as IResponseFetch).data as IMarcador[]) || [];
    };
    // #endregion

    // #region onMounted
    onMounted(async () => {
      await mtd_asyncGetMarker();
    });
    // #endregion

    return { rowsMarker, mtd_handleMarker };
  },
});
</script>
