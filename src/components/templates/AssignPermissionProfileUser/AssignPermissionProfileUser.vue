<template>
  <o-form-assign-permission-profile-user></o-form-assign-permission-profile-user>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import OFormAssignPermissionProfileUser from 'components/organisms/FormAssignPermissionProfileUser';
export default defineComponent({
  name: 'TAssignPermissionProfileUser',
  components: {
    OFormAssignPermissionProfileUser,
  },
  setup() {
    return {};
  },
});
</script>
