<template>
  <div class="t-ceseEmployee">
    <o-cese-employee
      v-if="!loading"
      :optionsPosition="optionsPosition"
      :optionsCampus="optionsCampus"
      :rows="rowsEmployee"
      @select-filter="mtd_searchEmployeeApprove"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

import OCeseEmployee from 'components/organisms/CeseEmployee';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';
import { ICargo, IEmpleadoCese, IResponseFetch, ISede } from 'src/types';
import { useStore } from 'src/store';
import { MESSAGE_ERROR } from 'src/utils/messages';

interface ISelectFilter {
  cargo: number;
  documento: string;
  nombres: string;
  opcion: number;
  sede: number;
}

export default defineComponent({
  name: 'TCeseEmployee',
  components: {
    OCeseEmployee,
  },
  setup() {
    const rowsEmployee = ref<IEmpleadoCese[]>([]);
    const optionsCampus = ref();
    const optionsPosition = ref();

    const loading = ref(true);

    const { commit } = useStore();

    const mtd_searchEmployeeApprove = async (searchFilters: ISelectFilter) => {
      // loading.value = true;
      rowsEmployee.value = [];
      commit('commitLoading', true);
      const resSearchEmployee = await fetchRequestAPI({
        method: 'POST',
        url: '/adm/api/empleado/cese',
        body: JSON.stringify(searchFilters),
      });

      if (
        readErrorFetch({
          responseFetch: resSearchEmployee,
          message: MESSAGE_ERROR(),
        })
      ) {
        return;
      }

      rowsEmployee.value =
        ((resSearchEmployee as IResponseFetch).data as IEmpleadoCese[]) || [];

      // loading.value = false;
      commit('commitLoading', false);
    };

    const mtd_asyncGetCampus = async () => {
      const resSede = (await fetchRequestAPI({
        url: '/adm/api/sede',
        method: 'GET',
      })) as boolean | IResponseFetch;

      if (
        readErrorFetch({
          responseFetch: resSede,
          message: MESSAGE_ERROR(),
        })
      ) {
        return;
      }
      optionsCampus.value = ((resSede as IResponseFetch).data as ISede[]).map(
        (e: ISede) => ({
          value: Number(e.id_sede),
          label: e.se_descripcion,
        })
      );
    };

    const mtd_asyncGetPosition = async () => {
      const resPosition = (await fetchRequestAPI({
        url: '/adm/api/cargo',
        method: 'GET',
      })) as boolean | IResponseFetch;

      if (
        readErrorFetch({
          responseFetch: resPosition,
          message: MESSAGE_ERROR(),
        })
      ) {
        return;
      }
      optionsPosition.value = (
        (resPosition as IResponseFetch).data as ICargo[]
      ).map((e: ICargo) => ({
        value: Number(e.id_cargo),
        label: e.ca_descripcion,
      }));
    };

    onMounted(async () => {
      await mtd_asyncGetPosition();
      await mtd_asyncGetCampus();

      loading.value = false;
    });

    return {
      mtd_searchEmployeeApprove,
      rowsEmployee,
      optionsCampus,
      optionsPosition,
      loading,
    };
  },
});
</script>
