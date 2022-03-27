<template>
  <div class="p-registerBank">
    <t-register-bank />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import TRegisterBank from 'components/templates/RegisterBank';

export default defineComponent({
  name: 'PRegisterBank',
  components: {
    TRegisterBank,
  },
  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
@import url('./RegisterBank.scss');
</style>
