<template>
  <div class="t-editSubstitute">
    <o-edit-form-person-sustitute
      v-if="!loading"
      :bankOptions="bankOptions"
      :documentTypeOptions="documentTypeOptions"
      :nationalityOptions="nationalityOptions"
      :accountTypeOptions="accountTypeOptions"
      :sustitute="sustitute"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

import OEditFormPersonSustitute from 'components/organisms/EditFormPersonSustitute';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';
import {
  IAccountType,
  IBank,
  IDocumentType,
  INationality,
  IResponseFetch,
} from 'src/types';

import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  name: 'TEditSubstitute',
  components: {
    OEditFormPersonSustitute,
  },
  setup() {
    const documentTypeOptions = ref();
    const nationalityOptions = ref();
    const bankOptions = ref();
    const accountTypeOptions = ref();
    const loading = ref(true);

    const sustitute = ref();

    const route = useRoute();
    const router = useRouter();

    onMounted(async () => {
      const idSustitute = route.query.id;

      if (!idSustitute) {
        void router.push({ name: 'Dashboard' });
      }

      const sustituteFetch = (await fetchRequestAPI({
        url: `/adm/persona/datos/${String(idSustitute)}`,
        method: 'GET',
      })) as boolean | IResponseFetch;

      if (
        readErrorFetch({
          responseFetch: sustituteFetch,
          message: 'Ocurrió un Error, inténtelo de nuevo',
        })
      ) {
        void router.push({ name: 'Dashboard' });
        return;
      }

      sustitute.value = (sustituteFetch as IResponseFetch).data;

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

      loading.value = false;
    });
    return {
      documentTypeOptions,
      nationalityOptions,
      bankOptions,
      accountTypeOptions,
      sustitute,
      loading,
    };
  },
});
</script>
