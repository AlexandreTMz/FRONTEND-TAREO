<template>
  <t-list-profile-permission-user></t-list-profile-permission-user>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TListProfilePermissionUser from 'components/templates/ListProfilePermissionUser';
export default defineComponent({
  components: {
    TListProfilePermissionUser,
  },
  setup() {
    return {};
  },
});
</script>
