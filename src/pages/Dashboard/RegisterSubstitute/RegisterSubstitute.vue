<template>
  <div class="p-registerSubstitute">
    <t-register-substitute />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import TRegisterSubstitute from 'src/components/templates/RegisterSubstitute';

export default defineComponent({
  name: 'PRegisterSubstitute',
  components: {
    TRegisterSubstitute,
  },
  setup() {
    return {};
  },
});
</script>
<style lang="scss" scoped>
@import url('./RegisterSubstitute.scss');
</style>
