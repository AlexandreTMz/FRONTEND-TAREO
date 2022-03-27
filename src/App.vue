<template>
  <teleport to="#portal-loading">
    <loading />
  </teleport>
  <router-view />
</template>
<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import Loading from 'components/atoms/Loading';
import Scrollbar from 'smooth-scrollbar';

export default defineComponent({
  name: 'App',
  components: {
    Loading,
  },
  setup() {
    onMounted(() => {
      Scrollbar.initAll();
    });

    return {};
  },
});
</script>
