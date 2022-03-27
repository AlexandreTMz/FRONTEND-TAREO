<template>
  <div>
    <div class="o-formAssignPermissionProfileUser">
      <div
        class="o-formAssignPermissionProfileUser__wraper o-formAssignPermissionProfileUser__wraper--center o-formAssignPermissionProfileUser__wraper--sm o-formAssignPermissionProfileUser__wraper--marginTop"
      >
        <div class="o-formAssignPermissionProfileUser__header">
          Asignar permisos
        </div>
        <div class="o-formAssignPermissionProfileUser__box">
          <strong>Permisos</strong>
          <p>Registre los permisos que tendra el perfil de usuario.</p>
          <br />
          <div v-for="(item, index) in dataArray" :key="item.name">
            <m-accordion-permission-profile
              :permission="{ ...item, index: index + 1 }"
              :idTpUsuario="idTpUsuario"
              @handListPermission="handleUpdatePermission"
            ></m-accordion-permission-profile>
          </div>

          <br />
          <q-btn
            color="green"
            label="Registrar permisos"
            @click="mtd_registrarPermisos"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import MAccordionPermissionProfile from 'components/molecules/AccordionPermissionProfile';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';
import { IResponseFetch } from 'src/types';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'src/store';
import { MessageSuccess } from 'src/utils/swal';
import { MESSAGE_ASIGNAR, MESSAGE_ERROR } from 'src/utils/messages';
import { getCreateUserTrack } from 'src/utils/userTrack';

interface IPermission {
  id_spermiso: number;
  sp_nombre: string;
  id_mpermiso: string;
  hasPermission: boolean;
  hasPermissionGui: boolean;
  hasEditing: boolean;
}
interface IDataPermission {
  name: string;
  permission: Array<IPermission>;
}

export default defineComponent({
  name: 'OFormAssignPermissionProfileUser',
  components: {
    MAccordionPermissionProfile,
  },
  setup() {
    const dataArray = ref<IDataPermission[]>([]);
    const route = useRoute();
    const router = useRouter();
    // const mtd_asyncGetPermissionModules = ref();
    const { commit } = useStore();
    const idTpUsuario = ref();
    const userTrack = getCreateUserTrack();
    // #region onMounted

    const mtd_asyncGetPermissionModules = async (idUser: string) => {
      commit('commitLoading', true);
      const resPermissioModules = await fetchRequestAPI({
        url: `/adm/api/permisos/perfiles/usuario/${String(idUser)}`,
        method: 'GET',
      });

      if (
        readErrorFetch({
          responseFetch: resPermissioModules,
          message: MESSAGE_ERROR(),
        })
      ) {
        commit('commitLoading', false);
        return;
      }
      commit('commitLoading', false);

      dataArray.value =
        ((resPermissioModules as IResponseFetch).data as IDataPermission[]) ||
        [];
    };

    const handleUpdatePermission = async () => {
      await mtd_asyncGetPermissionModules(String(idTpUsuario.value));
    };

    const mtd_registrarPermisos = async () => {
      const objL_tempPermission = dataArray.value as IDataPermission[];
      let objL_arrayAwait: Array<Promise<false | IResponseFetch>> = [];
      objL_tempPermission.forEach((item: IDataPermission) => {
        item.permission.forEach((permission: IPermission) => {
          if (!permission.hasEditing) return;
          objL_arrayAwait = [
            ...objL_arrayAwait,
            fetchRequestAPI({
              url: '/adm/api/permisos/perfiles/usuario',
              method: 'POST',
              body: JSON.stringify({
                ...permission,
                id_tpusuario: String(idTpUsuario.value),
                ...userTrack,
              }),
            }),
          ];
        });
      });

      //void Promise.all(objL_arrayAwait);

      try {
        await Promise.all(objL_arrayAwait);
        MessageSuccess({
          title: MESSAGE_ASIGNAR('los permisos al perfil de usuario'),
        });
        void handleUpdatePermission();
      } catch (error) {
        error; // rejectReason of any first rejected promise
      }
    };

    onMounted(async () => {
      const idTpUser = route.query.id;
      idTpUsuario.value = idTpUser;
      if (!idTpUser) {
        void router.push({ name: 'Dashboard' });
      }

      await mtd_asyncGetPermissionModules(String(idTpUser));
    });
    // #endregion

    return {
      dataArray,
      handleUpdatePermission,
      idTpUsuario,
      mtd_registrarPermisos,
    };
  },
});
</script>

<style lang="scss" scoped>
@import url('./FormAssignPermissionProfileUser.scss');
</style>
