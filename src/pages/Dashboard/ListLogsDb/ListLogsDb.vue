<template>
  <t-list-logs-db></t-list-logs-db>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TListLogsDb from 'src/components/templates/ListLogsDb';
export default defineComponent({
  components: {
    TListLogsDb,
  },
  setup() {
    return {};
  },
});
</script>
