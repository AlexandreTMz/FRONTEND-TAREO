<template>
  <div class="p-editSubstitute">
    <t-edit-substitute />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import TEditSubstitute from 'src/components/templates/EditSubstitute';

export default defineComponent({
  name: 'PEditSubstitute',
  components: {
    TEditSubstitute,
  },
  setup() {
    return {};
  },
});
</script>
<style lang="scss" scoped>
@import url('./EditSubstitute.scss');
</style>
