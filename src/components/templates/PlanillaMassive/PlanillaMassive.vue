<template>
  <o-form-planilla-massive
   @handPlanillaMassive = "handlePlanillaMassive"
  ></o-form-planilla-massive>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import OFormPlanillaMassive from 'components/organisms/FormPlanillaMassive';
import { fetchRequestAPI } from 'src/utils/axios';
import { MessageError, MessageSuccess } from 'src/utils/swal';

interface IPlanillaMassiveForm {
  id_sede: number;
  fecha: string;
}

export default defineComponent({
  name: 'TPlanillaMassive',
  components: {
    OFormPlanillaMassive,
  },
  setup() {
    const handlePlanillaMassive = async (
      planillaMassive: IPlanillaMassiveForm
    ) => {
      const bankRegister = (await fetchRequestAPI({
        url: '/adm/api/sueldo/cambio/masivo',
        method: 'POST',
        body: JSON.stringify(planillaMassive),
      })) as boolean | IPlanillaMassiveForm[];

      if (!bankRegister) {
        MessageError({ title: 'Ocurrió un error' });
      }

      MessageSuccess({
        title: 'Cambio masivo realizado!',
      });
    };
    return {
      handlePlanillaMassive
    };
  },
});
</script>
