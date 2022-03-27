<template>
  <o-form-change-password></o-form-change-password>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import OFormChangePassword from 'src/components/organisms/FormChangePassword'
export default defineComponent({
  name: 'TChangePassword',
  components:{
      OFormChangePassword
  },
  setup() {
    return {};
  },
});
</script>
