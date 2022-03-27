<template>
  <o-form-list-user-web-movil
    :rowsUsers="rowsUsers"
    @handUser="mtd_handleUser"
  ></o-form-list-user-web-movil>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import OFormListUserWebMovil from 'components/organisms/FormListUserWebMovil';
import { IResponseFetch, IUser } from 'src/types';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';
import { MessageSuccess } from 'src/utils/swal';
import { useStore } from 'src/store';
import { MESSAGE_EDITAR, MESSAGE_ERROR } from 'src/utils/messages';
export default defineComponent({
  name: 'TListUserWebMovil',
  components: {
    OFormListUserWebMovil,
  },
  setup() {
    // #region declares
    const rowsUsers = ref<IUser[]>([]);
    const { commit } = useStore();
    // #endregion

    // #region methods
    const mtd_handleUser = async (userForm: IUser) => {
      commit('commitLoading', true);
      const userRegister = await fetchRequestAPI({
        url: '/adm/usuarios/sistema',
        method: 'POST',
        body: JSON.stringify(userForm),
      });

      if (
        readErrorFetch({
          responseFetch: userRegister,
          message: MESSAGE_ERROR(),
        })
      ) {
        commit('commitLoading', false);

        return;
      }
      commit('commitLoading', false);

      MessageSuccess({
        title: MESSAGE_EDITAR('el usuario'),
      });
      await mtd_asyncGetListUsers();
    };

    const mtd_asyncGetListUsers = async () => {
      commit('commitLoading', true);
      const resUsers = await fetchRequestAPI({
        url: '/adm/usuarios/sistema',
        method: 'GET',
      });

      if (
        readErrorFetch({
          responseFetch: resUsers,
          message: MESSAGE_ERROR(),
        })
      ) {
        commit('commitLoading', false);

        return;
      }
      commit('commitLoading', false);
      rowsUsers.value = ((resUsers as IResponseFetch).data as IUser[]) || [];
    };
    // #endregion

    // #region onMounted
    onMounted(async () => {
      await mtd_asyncGetListUsers();
    });
    // #endregion
    return { rowsUsers, mtd_handleUser };
  },
});
</script>
