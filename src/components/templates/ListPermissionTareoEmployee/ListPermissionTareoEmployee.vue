<template>
  <o-form-list-permission-tareo-employee
    :rowsPermissionEmployeeTareo="rowsPermissionEmployeeTareo"
    @handTareoPermissionEmployee="handleEmployeeSearchPermissionTareo"
  ></o-form-list-permission-tareo-employee>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import OFormListPermissionTareoEmployee from 'components/organisms/FormListPermissionTareoEmployee';
import { IPermissionTareoEmpleado, IResponseFetch } from 'src/types';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';

interface ITareoPermissionEmployeeForm {
  id_sede: number;
  id_permiso: string;
  pagado: number;
  inicio: string;
  fin: string;
}

export default defineComponent({
  name: 'TListPermissionTareoEmployee',
  components: {
    OFormListPermissionTareoEmployee,
  },
  setup() {
    const rowsPermissionEmployeeTareo = ref<IPermissionTareoEmpleado[]>([]);

    const handleEmployeeSearchPermissionTareo = async (
      employee: ITareoPermissionEmployeeForm
    ) => {
      const EmployeeSearch = (await fetchRequestAPI({
        url: '/adm/administrador/permisos',
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
      rowsPermissionEmployeeTareo.value =
        ((EmployeeSearch as IResponseFetch)
          .data as IPermissionTareoEmpleado[]) || [];
    };

    return {
      rowsPermissionEmployeeTareo,
      handleEmployeeSearchPermissionTareo,
    };
  },
});
</script>
