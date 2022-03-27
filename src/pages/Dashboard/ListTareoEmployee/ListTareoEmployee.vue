<template>
  <t-list-tareo-employee></t-list-tareo-employee>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TListTareoEmployee from 'components/templates/ListTareoEmployee';

export default defineComponent({
  components: {
    TListTareoEmployee,
  },
  setup() {
    return {};
  },
});
</script>
