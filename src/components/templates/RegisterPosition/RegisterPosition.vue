<template>
  <o-form-register-position
    :rowsPosition="rowsPosition"
    @handPosition="mtd_handlePosition"
  ></o-form-register-position>
</template>

<script lang="ts">
import OFormRegisterPosition from 'components/organisms/FormRegisterPosition';
import { defineComponent, ref, onMounted } from 'vue';
import { ICargo, IResponseFetch } from 'src/types';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';
import { MessageSuccess } from 'src/utils/swal';
import {
  MESSAGE_EDITAR,
  MESSAGE_ERROR,
  MESSAGE_REGISTRO,
} from 'src/utils/messages';

export default defineComponent({
  name: 'TRegisterPosition',
  components: {
    OFormRegisterPosition,
  },
  setup() {
    // #region declares
    const rowsPosition = ref<ICargo[]>([]);
    // #endregion

    // #region methods
    const mtd_handlePosition = async (position: ICargo) => {
      const positionRegister = await fetchRequestAPI({
        url: '/adm/api/cargo',
        method: 'POST',
        body: JSON.stringify(position),
      });

      if (
        readErrorFetch({
          responseFetch: positionRegister,
          message: MESSAGE_ERROR(),
        })
      ) {
        return;
      }

      MessageSuccess({
        title: position.id_cargo
          ? MESSAGE_EDITAR('el cargo')
          : MESSAGE_REGISTRO('el cargo'),
      });
      await mtd_asyncGetPosition();
    };

    const mtd_asyncGetPosition = async () => {
      const resCampus = await fetchRequestAPI({
        url: '/adm/api/cargo',
        method: 'GET',
      });

      if (
        readErrorFetch({
          responseFetch: resCampus,
          message: MESSAGE_ERROR(),
        })
      ) {
        return;
      }
      rowsPosition.value =
        ((resCampus as IResponseFetch).data as ICargo[]) || [];
    };
    // #endregion

    // #region onMounted
    onMounted(async () => {
      await mtd_asyncGetPosition();
    });
    // #endregion
    return { rowsPosition, mtd_handlePosition };
  },
});
</script>
