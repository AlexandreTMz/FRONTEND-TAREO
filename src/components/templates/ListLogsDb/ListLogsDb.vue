<template>
  <o-form-list-logs-db></o-form-list-logs-db>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import OFormListLogsDb from 'src/components/organisms/FormListLogsDb';
export default defineComponent({
  name: 'TListLogsDb',
  components: { OFormListLogsDb },
  setup() {
    return {};
  },
});
</script>
