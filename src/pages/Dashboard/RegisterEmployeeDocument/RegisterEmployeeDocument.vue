<template>
  <t-register-employee-document></t-register-employee-document>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TRegisterEmployeeDocument from 'components/templates/RegisterEmployeeDocument';
export default defineComponent({
  components: {
    TRegisterEmployeeDocument,
  },
  setup() {
    return {};
  },
});
</script>
