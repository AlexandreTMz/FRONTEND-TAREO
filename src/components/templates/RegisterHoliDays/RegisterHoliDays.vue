<template>
  <o-form-register-holi-days
    :rowsHoliDays="rowsHoliDays"
    @handHoliDays="mtd_handleHoliDays"
  ></o-form-register-holi-days>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import OFormRegisterHoliDays from 'components/organisms/FormRegisterHoliDays';
import { IFeriado, IResponseFetch } from 'src/types';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';
import { MessageSuccess } from 'src/utils/swal';

export default defineComponent({
  components: {
    OFormRegisterHoliDays,
  },
  name: 'TRegisterHoliDays',
  setup() {
    // #region declares
    const rowsHoliDays = ref<IFeriado[]>([]);
    // #endregion

    // #region methods
    const mtd_handleHoliDays = async (holiDays: IFeriado) => {
      const holiDaysRegister = await fetchRequestAPI({
        url: '/adm/api/feriado',
        method: 'POST',
        body: JSON.stringify(holiDays),
      });

      if (
        readErrorFetch({
          responseFetch: holiDaysRegister,
          message: 'Ocurrió un error',
        })
      ) {
        return;
      }

      MessageSuccess({
        title: holiDays.id_feriado
          ? 'Feriado actualizado'
          : 'Feriado registrado',
      });
      await mtd_asyncGetHolyDays();
    };

    const mtd_asyncGetHolyDays = async () => {
      const resHolyDays = await fetchRequestAPI({
        url: '/adm/api/feriado',
        method: 'GET',
      });

      if (
        readErrorFetch({
          responseFetch: resHolyDays,
          message: 'Ocurrió un error',
        })
      ) {
        return;
      }

      rowsHoliDays.value =
        ((resHolyDays as IResponseFetch).data as IFeriado[]) || [];
    };
    // #endregion

    // #region onMounted
    onMounted(async () => {
      await mtd_asyncGetHolyDays();
    });
    // #endregion
    return { rowsHoliDays, mtd_handleHoliDays };
  },
});
</script>
