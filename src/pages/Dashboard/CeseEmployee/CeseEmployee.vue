<template>
  <div class="p-ceseEmployee">
    <t-cese-employee />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TCeseEmployee from 'components/templates/CeseEmployee';

export default defineComponent({
  name: 'PCeseEmployee',
  components: {
    TCeseEmployee,
  },
  setup() {
    return {};
  },
});
</script>
