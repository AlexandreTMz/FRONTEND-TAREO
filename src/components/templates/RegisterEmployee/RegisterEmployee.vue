<template>
  <div class="t-registerEmployee">
    <o-register-employee
      v-if="!loading"
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
import ORegisterEmployee from 'components/organisms/RegisterEmployee';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';
import { MessageError } from 'src/utils/swal';
import {
  IAccountType,
  IBank,
  IDocumentType,
  INationality,
  IPosition,
  IResponseFetch,
  ISede,
} from 'src/types';
import { MESSAGE_ERROR } from 'src/utils/messages';

export default defineComponent({
  name: 'TRegisterEmployee',
  components: {
    ORegisterEmployee,
  },
  setup() {
    const positionOptions = ref();
    const documentTypeOptions = ref();
    const sedeOptions = ref();
    const nationalityOptions = ref();
    const bankOptions = ref();
    const accountTypeOptions = ref();
    const documents = ref();

    const loading = ref(true);

    onMounted(async () => {
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
        MessageError({ title: MESSAGE_ERROR() });
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
    };
  },
});
</script>
<style lang="scss" scoped>
@import './RegisterEmployee.scss';
</style>
