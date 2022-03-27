<template>
  <div class="p-home">
    <t-home />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

import THome from 'components/templates/Home';

export default defineComponent({
  name: 'PHome',
  components: {
    THome,
  },
  setup() {
    return {};
  },
});
</script>
