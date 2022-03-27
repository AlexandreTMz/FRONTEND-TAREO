<template>
  <div class="p-listEmployeeDocument">
    <t-list-employee-document />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

import TListEmployeeDocument from 'components/templates/ListEmployeeDocument';

export default defineComponent({
  name: 'PListEmployeeDocument',
  components: {
    TListEmployeeDocument,
  },
  setup() {
    return {};
  },
});
</script>
