<template>
  <div class="m-homeCard" :style="{ background, width }">
    <div class="m-homeCard__header">
      <h2 class="m-homeCard__header__title">{{ title }}</h2>
      <p class="m-homeCard__header__text">{{ text }}</p>
      <q-icon class="m-homeCard__header__icon" size="75px" :name="icon" />
    </div>

    <router-link class="m-homeCard__footer" :to="to">
      <span>Ver más</span>
      <q-icon name="fas fa-arrow-circle-right" />
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MHomeCard',
  props: {
    background: {
      type: String,
      default: 'tomato',
    },
    title: {
      type: String,
      default: 'Titulo',
    },
    text: {
      type: String,
      default: '',
    },
    to: {
      type: [Object, String],
      default: '#',
    },
    icon: {
      type: String,
      default: 'fas fa-user-plus',
    },
    width: {
      type: String,
      default: '100%',
    },
  },
  setup() {
    return {};
  },
});
</script>
<style lang="scss" scoped>
@import './HomeCard.scss';
</style>
