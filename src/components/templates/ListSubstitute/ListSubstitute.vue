<template>
  <div class="t-listSubstitute">
    <o-form-list-person-substitute></o-form-list-person-substitute>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import OFormListPersonSubstitute from 'components/organisms/FormListPersonSubstitute';

export default defineComponent({
  components: {
    OFormListPersonSubstitute,
  },
  setup() {
    return {
      name: 'xd',
    };
  },
});
</script>
