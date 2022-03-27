<template>
  <div>
    <list-substitute></list-substitute>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import listSubstitute from 'src/components/templates/ListSubstitute';

export default defineComponent({
  components: {
    listSubstitute,
  },
  setup() {
    return {
      name: 'xdd',
    };
  },
});
</script>
