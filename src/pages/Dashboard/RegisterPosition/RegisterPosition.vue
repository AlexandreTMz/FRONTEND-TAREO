<template>
  <t-register-position></t-register-position>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TRegisterPosition from 'components/templates/RegisterPosition';

export default defineComponent({
  components: {
    TRegisterPosition,
  },
  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
@import url('./RegisterPosition.scss');
</style>
