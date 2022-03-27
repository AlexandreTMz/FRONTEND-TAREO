<template>
  <o-form-report-planilla></o-form-report-planilla>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import OFormReportPlanilla from 'components/organisms/FormReportPlanilla';
export default defineComponent({
  name: 'TReportPlanilla',
  components: {
    OFormReportPlanilla,
  },
  setup() {
    return {};
  },
});
</script>
