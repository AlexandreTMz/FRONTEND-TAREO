<template>
  <div class="p-registerEmployee">
    <t-register-employee />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import TRegisterEmployee from 'src/components/templates/RegisterEmployee';

export default defineComponent({
  name: 'RegisterEmployee',
  components: {
    TRegisterEmployee,
  },
  setup() {
    return {};
  },
});
</script>
<style lang="scss" scoped>
@import './RegisterEmployee.scss';
</style>
