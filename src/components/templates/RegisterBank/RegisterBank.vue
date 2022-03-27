<template>
  <div class="t-registerBank">
    <o-register-bank :rowsBank="rowsBank" @bank="handleBank" />
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

import ORegisterBank from 'components/organisms/RegisterBank';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';
import { IBank, IResponseFetch } from 'src/types';

import { MessageSuccess } from 'src/utils/swal';
import {
  MESSAGE_EDITAR,
  MESSAGE_ERROR,
  MESSAGE_REGISTRO,
} from 'src/utils/messages';
import { getCreateUserTrack } from 'src/utils/userTrack';

export default defineComponent({
  name: 'TRegisterBank',
  components: {
    ORegisterBank,
  },
  setup() {
    const rowsBank = ref<IBank[]>([]);

    const userTrack = getCreateUserTrack();

    const handleBank = async (bank: IBank) => {
      const bankRegister = await fetchRequestAPI({
        url: '/adm/api/banco',
        method: 'POST',
        body: JSON.stringify({ ...bank, ...userTrack }),
      });

      if (
        readErrorFetch({
          responseFetch: bankRegister,
          message: MESSAGE_ERROR(),
        })
      ) {
        return;
      }

      MessageSuccess({
        title: bank.id_banco
          ? MESSAGE_EDITAR('el banco')
          : MESSAGE_REGISTRO('el banco'),
      });
      await asyncGetBanks();
    };

    const asyncGetBanks = async () => {
      const banks = await fetchRequestAPI({
        url: '/adm/api/banco',
        method: 'GET',
      });

      if (readErrorFetch({ responseFetch: banks, message: MESSAGE_ERROR() })) {
        return;
      }

      rowsBank.value = ((banks as IResponseFetch).data as IBank[]) || [];
    };

    onMounted(async () => {
      await asyncGetBanks();
    });

    return { rowsBank, handleBank };
  },
});
</script>

<style lang="scss" scoped>
@import url('./RegisterBank.scss');
</style>
