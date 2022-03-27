<template>
  <div class="a-formLabel">
    <label :class="!isStrong ? '' : 'a-formLabel--strong'">{{ labelEmpty ? '&nbsp;' : label }}</label>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AFormLabel',
  props: {
    label: {
      type: String,
      default: 'Label',
    },
    labelEmpty: {
      type: Boolean,
      default: false,
    },
    isStrong:{
      type: Boolean,
      default:false
    }
  },
  setup() {
    return {};
  },
});
</script>
<style lang="scss" scoped>
@import './FormLabel.scss';
</style>
