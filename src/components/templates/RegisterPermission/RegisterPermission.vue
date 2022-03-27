<template>
  <o-form-register-permission
    :rowsPermission="rowsPermission"
    @handPermission="mtd_handlePermission"
  ></o-form-register-permission>
</template>

<script lang="ts">
import OFormRegisterPermission from 'components/organisms/FormRegisterPermission';
import { defineComponent, ref, onMounted } from 'vue';
import { IPermiso, IResponseFetch } from 'src/types';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';
import { MessageSuccess } from 'src/utils/swal';

export default defineComponent({
  name: 'TRegisterPermission',
  components: {
    OFormRegisterPermission,
  },
  setup() {
    // #region declares
    const rowsPermission = ref<IPermiso[]>([]);
    // #endregion

    // #region methods
    const mtd_handlePermission = async (permission: IPermiso) => {
      const permissionRegister = await fetchRequestAPI({
        url: '/adm/api/permiso',
        method: 'POST',
        body: JSON.stringify(permission),
      });

      if (
        readErrorFetch({
          responseFetch: permissionRegister,
          message: 'Ocurrió un error',
        })
      ) {
        return;
      }

      MessageSuccess({
        title: permission.id_permiso
          ? 'Permiso actualizado'
          : 'Permiso registrado',
      });
      await mtd_asyncGetPermission();
    };

    const mtd_asyncGetPermission = async () => {
      const resPermission = await fetchRequestAPI({
        url: '/adm/api/permiso',
        method: 'GET',
      });

      if (
        readErrorFetch({
          responseFetch: resPermission,
          message: 'Ocurrió un error',
        })
      ) {
        return;
      }

      rowsPermission.value =
        ((resPermission as IResponseFetch).data as IPermiso[]) || [];
    };
    // #endregion

    // #region onMounted
    onMounted(async () => {
      await mtd_asyncGetPermission();
    });
    // #endregion
    return { rowsPermission, mtd_handlePermission };
  },
});
</script>
