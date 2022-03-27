<template>
  <t-list-black-employee></t-list-black-employee>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TListBlackEmployee from 'components/templates/ListBlackEmployee';
export default defineComponent({
  components: {
    TListBlackEmployee,
  },
  setup() {
    return {};
  },
});
</script>
