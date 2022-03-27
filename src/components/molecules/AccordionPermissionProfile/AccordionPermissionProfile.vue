<template>
  <div class="o-boxPermission">
    <div
      :class="`o-boxPermission__header ${isOpen ? 'active' : ''}`"
      @click="mtd_toggleAccordion"
      :id="`collapse${permission?.name}`"
    >
      <div class="o-boxPermission__header__items">
        {{ permission?.index }}
      </div>
      Modulo: {{ permission?.name }}
      <div class="o-boxPermission__header__row">
        <i class="o-iconRow"></i>
      </div>
    </div>
    <div :class="`o-boxPermission__wraper content${permission?.name}`">
      <p
        v-for="lpermission in permission.permission"
        :key="lpermission.id_spermiso"
      >
        <q-checkbox
          v-model="lpermission.hasPermissionGui"
          :label="lpermission.sp_nombre"
          @update:model-value="lpermission.hasEditing = true"
          checked-icon="swipe_left"
          unchecked-icon="swipe_right"
          color="green"
          keep-color
          @click="mtd_registerPemrissionModule(lpermission)"
        />
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';
import { MessageSuccess } from 'src/utils/swal';
import { defineComponent, ref, PropType } from 'vue';

interface IPermission {
  id_spermiso: number;
  sp_nombre: string;
  id_mpermiso: string;
  hasPermission: boolean;
  hasPermissionGui: boolean;
  hasEditing: boolean;
}
interface IDataPermission {
  name: string;
  permission: Array<IPermission>;
}
export default defineComponent({
  name: 'MAccordionPermissionProfile',
  props: {
    permission: {
      type: Object as PropType<IDataPermission>,
      default: null,
    },
    idUsersPrs: {
      type: String,
      default: '',
    },
  },
  setup(props, { emit }) {
    const isOpen = ref<boolean>(false);

    const mtd_toggleAccordion = (e: { target: HTMLInputElement }) => {
      if (isOpen.value) mtd_setHeigthAuto(e);
      isOpen.value = !isOpen.value;
    };

    const mtd_setHeigthAuto = (e: { target: HTMLInputElement }) => {
      const parent = e.target.closest('.o-boxPermission');
      const boxElement = parent?.querySelector<HTMLElement>(
        'div[id^="collapse"].active ~ div[class*=" content"]'
      ) as HTMLElement;
      const { height } = boxElement.getBoundingClientRect();
      boxElement.style.maxHeight = `${height}px`;
    };

    const mtd_registerPemrissionModule = async (permision: IPermission) => {
      permision.hasEditing = true;

      return;
      const resRegisterPermission = await fetchRequestAPI({
        url: '/adm/api/permisos/usuario',
        method: 'POST',
        body: JSON.stringify({ ...permision, id_usuario: props.idUsersPrs }),
      });

      if (
        readErrorFetch({
          responseFetch: resRegisterPermission,
          message: 'Ocurrió un error',
        })
      ) {
        return;
      }

      MessageSuccess({
        title: 'Se completó la operación',
      });

      emit('handListPermission');
    };

    return {
      isOpen,
      mtd_toggleAccordion,
      mtd_setHeigthAuto,
      mtd_registerPemrissionModule,
    };
  },
});
</script>

<style lang="scss" scoped>
@import url('./AccordionPermissionProfile.scss');
</style>
