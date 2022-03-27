<template>
  <t-list-employee></t-list-employee>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import TListEmployee from 'components/templates/ListEmployee';
export default defineComponent({
  components: {
    TListEmployee,
  },
  setup() {
    return {};
  },
});
</script>
