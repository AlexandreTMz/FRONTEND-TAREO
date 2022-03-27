<template>
  <o-form-list-profile-permission-user
    :rowsProfilesUsers="rowsProfilesUsers"
    @mtd_handleProfileUser="mtd_handleProfileUser"
  ></o-form-list-profile-permission-user>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import OFormListProfilePermissionUser from 'components/organisms/FormListProfilePermissionUser';
import { MessageSuccess } from 'src/utils/swal';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';
import { IResponseFetch, IProfileUserPermission } from 'src/types';
import { useStore } from 'src/store';
import { MESSAGE_EDITAR, MESSAGE_ERROR, MESSAGE_REGISTRO } from 'src/utils/messages';

export default defineComponent({
  name: 'TListProfilePermissionUser',
  components: {
    OFormListProfilePermissionUser,
  },
  setup() {
    // #region declares
    const rowsProfilesUsers = ref<IProfileUserPermission[]>([]);
    const { commit } = useStore();
    // #endregion

    // #region methods
    const mtd_handleProfileUser = async (userForm: IProfileUserPermission) => {
      commit('commitLoading', true);
      const userRegister = await fetchRequestAPI({
        url: '/adm/api/perfiles',
        method: 'POST',
        body: JSON.stringify(userForm),
      });

      if (
        readErrorFetch({
          responseFetch: userRegister,
          message: 'Ocurrió un error',
        })
      ) {
        commit('commitLoading', false);
        return;
      }
      commit('commitLoading', false);

      MessageSuccess({
        title: userForm.id_tpusuario === null ? MESSAGE_REGISTRO('el perfil de usuario') : MESSAGE_EDITAR('el perfil de usuario'),
      });
      await mtd_asyncGetProfileUserPermission();
    };

    const mtd_asyncGetProfileUserPermission = async () => {
      commit('commitLoading', true);
      const resUsers = await fetchRequestAPI({
        url: '/adm/api/perfiles',
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
      rowsProfilesUsers.value =
        ((resUsers as IResponseFetch).data as IProfileUserPermission[]) || [];
    };
    // #endregion

    // #region onMounted
    onMounted(async () => {
      await mtd_asyncGetProfileUserPermission();
    });
    // #endregion
    return { rowsProfilesUsers, mtd_handleProfileUser };
  },
});
</script>
