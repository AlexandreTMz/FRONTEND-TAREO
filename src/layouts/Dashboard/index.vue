<template>
  <q-layout view="lHh Lpr lFf">
    <navbar @change-menu-sidebar="handleChangeSidebar" />

    <sidebar
      @change-sidebar="leftDrawerOpen = $event"
      @change-mini-sidebar="miniDrawer = $event"
      :mini="miniDrawer"
      :open="leftDrawerOpen"
    />

    <q-page-container
      style="background-color: #f4f6f9; min-height: 100vh; overflow: auto"
      data-scrollbar
    >
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import Navbar from 'layouts/Dashboard/Navbar';
import Sidebar from 'layouts/Dashboard/Sidebar';
import { useQuasar } from 'quasar';

import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'DashBoardLayout',

  components: {
    Navbar,
    Sidebar,
  },

  setup() {
    const $q = useQuasar();
    const leftDrawerOpen = ref(false);
    const miniDrawer = ref(false);

    const handleChangeSidebar = () => {
      if ($q.screen.width >= 700 && $q.screen.width <= 1000) {
        leftDrawerOpen.value = !leftDrawerOpen.value;
        miniDrawer.value = false;
      } else if ($q.screen.width > 700) {
        miniDrawer.value = !miniDrawer.value;
      } else {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      }
    };

    return {
      leftDrawerOpen,
      miniDrawer,
      handleChangeSidebar,
    };
  },
});
</script>
