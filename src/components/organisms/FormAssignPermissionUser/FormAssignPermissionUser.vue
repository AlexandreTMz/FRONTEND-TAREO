<template>
  <div>
    <div class="o-formAssignPermissionUser">
      <div
        class="o-formAssignPermissionUser__wraper o-formAssignPermissionUser__wraper--center o-formAssignPermissionUser__wraper--sm o-formAssignPermissionUser__wraper--marginTop"
      >
        <div class="o-formAssignPermissionUser__header">Asignar permisos</div>
        <div class="o-formAssignPermissionUser__box">
          <strong>Permisos</strong>
          <p>
            Registre los permisos que el usuario poseerá, cuando inicie sesión.
          </p>
          <br />
          <div v-for="(item, index) in dataArray" :key="item.name">
            <m-accordion-permission
              :permission="{ ...item, index: index + 1 }"
              :idUsersPrs="idUsersPrs"
              @handListPermission="handleUpdatePermission"
            ></m-accordion-permission>
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
import MAccordionPermission from 'components/molecules/AccordionPermission';
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
  name: 'OFormAssignPermissionUser',
  components: {
    MAccordionPermission,
  },
  setup() {
    const dataArray = ref<IDataPermission[]>([]);
    const route = useRoute();
    const router = useRouter();
    // const mtd_asyncGetPermissionModules = ref();
    const { commit } = useStore();
    const idUsersPrs = ref();
    const userTrack = getCreateUserTrack();

    // #region onMounted

    const mtd_asyncGetPermissionModules = async (idUser: string) => {
      commit('commitLoading', true);
      const resPermissioModules = await fetchRequestAPI({
        url: `/adm/api/permisos/usuario/${String(idUser)}`,
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
      await mtd_asyncGetPermissionModules(String(idUsersPrs.value));
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
              url: '/adm/api/permisos/usuario',
              method: 'POST',
              body: JSON.stringify({
                ...permission,
                id_usuario: String(idUsersPrs.value),
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
          title: MESSAGE_ASIGNAR('los permisos al usuario'),
        });
        void handleUpdatePermission();
      } catch (error) {
        error; // rejectReason of any first rejected promise
      }
    };

    onMounted(async () => {
      const idUser = route.query.id;
      idUsersPrs.value = idUser;
      if (!idUser) {
        void router.push({ name: 'Dashboard' });
      }

      await mtd_asyncGetPermissionModules(String(idUser));
    });
    // #endregion

    return {
      dataArray,
      handleUpdatePermission,
      idUsersPrs,
      mtd_registrarPermisos,
    };
  },
});
</script>

<style lang="scss" scoped>
@import url('./FormAssignPermissionUser.scss');
</style>
