<template>
  <o-form-process-planilla></o-form-process-planilla>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import OFormProcessPlanilla from 'components/organisms/FormProcessPlanilla';
export default defineComponent({
  name: 'TProcessPlanilla',
  components: {
    OFormProcessPlanilla,
  },
  setup() {
    return {};
  },
});
</script>
