<template>
  <t-assign-permission-user></t-assign-permission-user>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TAssignPermissionUser from 'components/templates/AssignPermissionUser';
export default defineComponent({
  components: {
    TAssignPermissionUser,
  },
  setup() {
    return {};
  },
});
</script>
