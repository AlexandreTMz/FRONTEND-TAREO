<template>
  <o-form-list-employee
    :rowsEmployee="rowsEmployee"
    @handEmployee="handleEmployeeSearch"
  ></o-form-list-employee>
</template>

<script lang="ts">
import OFormListEmployee from 'components/organisms/FormListEmployee';
import { defineComponent, ref } from 'vue';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';
import { IEmpleado, IResponseFetch } from 'src/types';

export default defineComponent({
  name: 'TListEmployee',
  components: {
    OFormListEmployee,
  },
  setup() {
    const rowsEmployee = ref<IEmpleado[]>([]);

    const handleEmployeeSearch = async (employee: IEmpleado) => {
      const EmployeeSearch = (await fetchRequestAPI({
        url: '/adm/api/empleado',
        method: 'POST',
        body: JSON.stringify(employee),
      })) as boolean | IResponseFetch;

      if (
        readErrorFetch({
          responseFetch: EmployeeSearch,
          message: '¡Ocurrió un error!',
        })
      ) {
        return;
      }

      rowsEmployee.value = (EmployeeSearch as IResponseFetch)
        .data as IEmpleado[];
    };

    return {
      rowsEmployee,
      handleEmployeeSearch,
    };
  },
});
</script>
