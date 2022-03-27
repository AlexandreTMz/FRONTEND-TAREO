<template>
  <t-assign-permission-profile-user></t-assign-permission-profile-user>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TAssignPermissionProfileUser from 'components/templates/AssignPermissionProfileUser';
export default defineComponent({
  components: {
    TAssignPermissionProfileUser,
  },
  setup() {
    return {};
  },
});
</script>
