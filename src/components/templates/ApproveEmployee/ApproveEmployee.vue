<template>
  <o-form-list-approve-employee
    :rowsEmployee="rowsEmployee"
    @emitSearchEmployee="mtd_searchEmployeeApprove"
  ></o-form-list-approve-employee>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import OFormListApproveEmployee from 'components/organisms/FormListApproveEmployee';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';
import { IEmployeeApprove, IResponseFetch } from 'src/types';

interface IFormSearchApprove {
  opcion: string;
  dato: string;
}

export default defineComponent({
  name: 'TApproveEmployee',
  components: {
    OFormListApproveEmployee,
  },
  setup() {
    const rowsEmployee = ref<IEmployeeApprove[]>([]);

    const mtd_searchEmployeeApprove = async (
      searchFilters: IFormSearchApprove
    ) => {
      const resSearchEmployee = await fetchRequestAPI({
        method: 'POST',
        url: '/adm/api/empleado/sin_aprobar',
        body: JSON.stringify(searchFilters),
      });

      if (
        readErrorFetch({
          responseFetch: resSearchEmployee,
          message: 'Ocurrió un error',
        })
      ) {
        return;
      }

      rowsEmployee.value =
        ((resSearchEmployee as IResponseFetch).data as IEmployeeApprove[]) ||
        [];
    };

    onMounted(async () => {
      await mtd_searchEmployeeApprove({
        opcion: '4',
        dato: '',
      });
    });

    return {
      mtd_searchEmployeeApprove,
      rowsEmployee,
    };
  },
});
</script>
