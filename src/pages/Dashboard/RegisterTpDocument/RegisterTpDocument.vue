<template>
  <t-register-tp-document></t-register-tp-document>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TRegisterTpDocument from 'components/templates/RegisterTpDocument';
export default defineComponent({
  name: 'PRegisterTpDocument',
  components: {
    TRegisterTpDocument,
  },
  setup() {
    return {};
  },
});
</script>
<style lang="scss" scoped>
@import url('./RegisterTpDocument.scss');
</style>
