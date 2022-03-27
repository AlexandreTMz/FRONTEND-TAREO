<template>
  <o-form-list-tareo-employee
    :rowsTareoEmployee="rowsEmployeeTareo"
    @handTareoEmployee="handleEmployeeSearchTareo"
  ></o-form-list-tareo-employee>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import OFormListTareoEmployee from 'components/organisms/FormListTareoEmployee';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';
import { IResponseFetch, ITareoEmpleado } from 'src/types/index';
import { useStore } from 'src/store';

interface ITareoEmployeeForm {
  id_sede: number;
  inicio: string;
  fin: string;
  documento: string;
  marcador: string;
}

export default defineComponent({
  nem: 'TListTareoEmployee',
  components: {
    OFormListTareoEmployee,
  },
  setup() {
    const rowsEmployeeTareo = ref<ITareoEmpleado[]>([]);
    const { commit } = useStore();
    const handleEmployeeSearchTareo = async (employee: ITareoEmployeeForm) => {
      const formData = new FormData();
      formData.append('id_sede', String(employee.id_sede));
      formData.append('inicio', String(employee.inicio));
      formData.append('fin', String(employee.fin));
      formData.append('documento', String(employee.documento));
      formData.append('marcador', String(employee.marcador));
      commit('commitLoading', true);

      const resUsers = await fetchRequestAPI({
        url: '/adm/administrador/tareo',
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (
        readErrorFetch({
          responseFetch: resUsers,
          message: 'Ocurrió un error',
        })
      ) {
        commit('commitLoading', false);

        return;
      }
      commit('commitLoading', false);
      rowsEmployeeTareo.value =
        ((resUsers as IResponseFetch).data as ITareoEmpleado[]) || [];
    };

    return {
      rowsEmployeeTareo,
      handleEmployeeSearchTareo,
    };
  },
});
</script>
