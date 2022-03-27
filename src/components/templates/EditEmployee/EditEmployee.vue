<template>
  <div class="t-editEmployee">
    <o-edit-employee
      v-if="!loading"
      :employee="employee"
      :positionOptions="positionOptions"
      :documentTypeOptions="documentTypeOptions"
      :sedeOptions="sedeOptions"
      :nationalityOptions="nationalityOptions"
      :bankOptions="bankOptions"
      :accountTypeOptions="accountTypeOptions"
      :documents="documents"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import OEditEmployee from 'components/organisms/EditEmployee';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';
import { MessageError } from 'src/utils/swal';
import {
  IAccountType,
  IBank,
  IDocumentType,
  IEmpleado,
  INationality,
  IPosition,
  IResponseFetch,
  ISede,
} from 'src/types';

import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  name: 'TEditEmployee',
  components: {
    OEditEmployee,
  },
  setup() {
    const positionOptions = ref();
    const documentTypeOptions = ref();
    const sedeOptions = ref();
    const nationalityOptions = ref();
    const bankOptions = ref();
    const accountTypeOptions = ref();
    const documents = ref();
    const employee = ref();
    const loading = ref(true);

    const route = useRoute();
    const router = useRouter();

    onMounted(async () => {
      const idEmployee = route.query.id;

      if (!idEmployee) {
        void router.push({ name: 'Dashboard' });
      }

      const employeeFetch = (await fetchRequestAPI({
        url: `/adm/persona/empleado/datos/${String(idEmployee)}`,
        method: 'GET',
      })) as boolean | IResponseFetch;

      if (
        readErrorFetch({
          responseFetch: employeeFetch,
          message: 'Ocurrió un Error, inténtelo de nuevo',
        })
      ) {
        void router.push({ name: 'Dashboard' });
        return;
      }

      employee.value = (employeeFetch as IResponseFetch).data as IEmpleado;

      const position = (await fetchRequestAPI({
        url: '/adm/api/cargo',
        method: 'GET',
      })) as boolean | IResponseFetch;

      const documentType = (await fetchRequestAPI({
        url: '/adm/api/tipo_documento',
        method: 'GET',
      })) as boolean | IResponseFetch;

      const sede = (await fetchRequestAPI({
        url: '/adm/api/sede',
        method: 'GET',
      })) as boolean | IResponseFetch;

      const nationality = (await fetchRequestAPI({
        url: '/adm/api/nacionalidad',
        method: 'GET',
      })) as boolean | IResponseFetch;

      const bank = (await fetchRequestAPI({
        url: '/adm/api/banco',
        method: 'GET',
      })) as boolean | IResponseFetch;

      const accountType = (await fetchRequestAPI({
        url: '/adm/api/tipo_cuenta',
        method: 'GET',
      })) as boolean | IResponseFetch;

      const documentsFetch = (await fetchRequestAPI({
        url: '/adm/api/documentos/empleado',
        method: 'GET',
      })) as boolean | IResponseFetch;

      const message = 'Ocurrió un error !';

      if (
        readErrorFetch({ responseFetch: documentsFetch, message }) ||
        readErrorFetch({ responseFetch: accountType, message }) ||
        readErrorFetch({ responseFetch: bank, message }) ||
        readErrorFetch({ responseFetch: nationality, message }) ||
        readErrorFetch({ responseFetch: sede, message }) ||
        readErrorFetch({ responseFetch: documentType, message }) ||
        readErrorFetch({ responseFetch: position, message })
      ) {
        MessageError({ title: 'Ocurrió un error' });
      }

      positionOptions.value =
        ((position as IResponseFetch).data as IPosition[]).map((item) => ({
          ...item,
          label: item.datos,
        })) || [];

      documentTypeOptions.value =
        ((documentType as IResponseFetch).data as IDocumentType[]).map(
          (item) => ({
            ...item,
            label: item.datos,
          })
        ) || [];

      sedeOptions.value =
        ((sede as IResponseFetch).data as ISede[]).map((item) => ({
          ...item,
          label: item.datos,
        })) || [];

      nationalityOptions.value =
        ((nationality as IResponseFetch).data as INationality[]).map(
          (item) => ({
            ...item,
            label: item.datos,
          })
        ) || [];

      bankOptions.value =
        ((bank as IResponseFetch).data as IBank[]).map((item) => ({
          ...item,
          label: item.datos,
        })) || [];

      accountTypeOptions.value =
        ((accountType as IResponseFetch).data as IAccountType[]).map(
          (item) => ({
            ...item,
            label: item.datos,
          })
        ) || [];

      documents.value = (documentsFetch as IResponseFetch).data;

      loading.value = false;
    });
    return {
      positionOptions,
      documentTypeOptions,
      sedeOptions,
      nationalityOptions,
      bankOptions,
      accountTypeOptions,
      documents,
      loading,
      employee,
    };
  },
});
</script>
<style lang="scss" scoped>
@import './EditEmployee.scss';
</style>
