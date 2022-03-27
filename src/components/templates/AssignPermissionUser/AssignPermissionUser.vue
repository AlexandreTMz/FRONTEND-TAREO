<template>
  <o-form-assign-permission-user></o-form-assign-permission-user>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import OFormAssignPermissionUser from 'components/organisms/FormAssignPermissionUser';
export default defineComponent({
  name: 'TAssignPermissionUser',
  components: {
    OFormAssignPermissionUser,
  },
  setup() {
    return {};
  },
});
</script>
