<template>
  <o-form-list-black-employee
    v-if="!loading"
    :optionsPosition="optionsPosition"
    :optionsCampus="optionsCampus"
    :rows="rowsEmployee"
    @select-filter="mtd_searchEmployeeApprove"
    @mtd_clearRows="mtd_clearRows"
  ></o-form-list-black-employee>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import OFormListBlackEmployee from 'components/organisms/FormListBlackEmployee';
import { useStore } from 'src/store';
import { ICargo, IListaNegra, IResponseFetch, ISede } from 'src/types';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';

interface ISelectFilter {
  cargo: number;
  documento: string;
  nombres: string;
  opcion: number;
  sede: number;
  estado: string;
}

export default defineComponent({
  name: 'TListBlackEmployee',
  components: {
    OFormListBlackEmployee,
  },
  setup() {
    const rowsEmployee = ref<IListaNegra[]>([]);
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
        url: '/adm/list/lista-negra',
        body: JSON.stringify(searchFilters),
      });

      if (
        readErrorFetch({
          responseFetch: resSearchEmployee,
          message: 'Ocurrió un error',
        })
      ) {
        commit('commitLoading', false);
        return;
      }

      rowsEmployee.value =
        ((resSearchEmployee as IResponseFetch).data as IListaNegra[]) || [];

      // loading.value = false;
      commit('commitLoading', false);
    };

    const mtd_clearRows = () => {
      rowsEmployee.value = [];
    };

    const mtd_asyncGetCampus = async () => {
      const resSede = (await fetchRequestAPI({
        url: '/adm/api/sede',
        method: 'GET',
      })) as boolean | IResponseFetch;

      if (
        readErrorFetch({
          responseFetch: resSede,
          message: '¡Ocurrió un error!',
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
          message: '¡Ocurrió un error!',
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
      mtd_clearRows,
    };
  },
});
</script>
