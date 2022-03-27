// Mocks all files ending in `.vue` showing them as plain Vue instances
/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module '@j-t-mcc/vue3-chartjs';

declare module '*.jpg' {
  const src: string;
  export default src;
}
