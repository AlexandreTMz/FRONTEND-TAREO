<template>
  <div class="p-editEmployee">
    <t-edit-employee />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import TEditEmployee from 'src/components/templates/EditEmployee';

export default defineComponent({
  name: 'EditEmployee',
  components: {
    TEditEmployee,
  },
  setup() {
    return {};
  },
});
</script>
<style lang="scss" scoped>
@import './EditEmployee.scss';
</style>
