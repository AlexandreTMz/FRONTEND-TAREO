<template>
  <div class="t-registerSubstitute">
    <o-form-person-sustitute
      :bankOptions="bankOptions"
      :documentTypeOptions="documentTypeOptions"
      :nationalityOptions="nationalityOptions"
      :accountTypeOptions="accountTypeOptions"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import OFormPersonSustitute from 'components/organisms/FormPersonSustitute';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';
import {
  IAccountType,
  IBank,
  IDocumentType,
  INationality,
  IResponseFetch,
} from 'src/types';

export default defineComponent({
  name: 'TRegisterSubstitute',
  components: {
    OFormPersonSustitute,
  },
  setup() {
    const documentTypeOptions = ref();
    const nationalityOptions = ref();
    const bankOptions = ref();
    const accountTypeOptions = ref();

    onMounted(async () => {
      const documentType = await fetchRequestAPI({
        url: '/adm/api/tipo_documento',
        method: 'GET',
      });

      const nationality = await fetchRequestAPI({
        url: '/adm/api/nacionalidad',
        method: 'GET',
      });

      const bank = await fetchRequestAPI({
        url: '/adm/api/banco',
        method: 'GET',
      });

      const accountType = await fetchRequestAPI({
        url: '/adm/api/tipo_cuenta',
        method: 'GET',
      });

      const message = 'Ocurrió un error';
      if (
        readErrorFetch({ responseFetch: documentType, message }) ||
        readErrorFetch({ responseFetch: bank, message }) ||
        readErrorFetch({ responseFetch: nationality, message }) ||
        readErrorFetch({ responseFetch: accountType, message })
      ) {
        return;
      }

      documentTypeOptions.value =
        ((documentType as IResponseFetch).data as IDocumentType[]).map(
          (item) => ({
            ...item,
            label: item.datos,
          })
        ) || [];

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
    });
    return {
      documentTypeOptions,
      nationalityOptions,
      bankOptions,
      accountTypeOptions,
    };
  },
});
</script>
