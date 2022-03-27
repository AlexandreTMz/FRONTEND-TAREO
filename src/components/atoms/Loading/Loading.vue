<template>
  <div v-if="isShowLoading" class="a-loading">
    <div class="a-loading__wrapper">
      <q-spinner-dots color="blue" size="4rem" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'src/store';

export default defineComponent({
  name: 'ALoading',
  setup() {
    const store = useStore();

    const isShowLoading = computed(
      () =>
        (store.getters as { [key: string]: unknown })['getLoading'] as boolean
    );

    return {
      isShowLoading,
    };
  },
});
</script>
<style lang="scss" scoped>
@import './Loading.scss';
</style>
