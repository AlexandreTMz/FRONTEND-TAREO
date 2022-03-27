<template>
  <t-change-password></t-change-password>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TChangePassword from 'src/components/templates/ChangePassword';
export default defineComponent({
  components: {
    TChangePassword,
  },
  setup() {
    return {};
  },
});
</script>
