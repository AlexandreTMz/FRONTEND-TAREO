<template>
  <div class="o-formListUserWebMovil">
    <div
      class="o-formListUserWebMovil__wraper o-formListUserWebMovil__wraper--center o-formListUserWebMovil__wraper--sm"
    >
      <div class="o-formListUserWebMovil__header">Datos requeridos</div>
      <q-form
        class="o-formListUserWebMovil__form"
        ref="form"
        @submit.prevent="mtd_handleEditUser"
      >
        <div class="o-formListUserWebMovil__box">
          <div class="o-formListUserWebMovil__inputGroups">
            <a-form-label label="Usuario" :isStrong="true">
              <q-input
                label="Usuario"
                outlined
                type="text"
                dense
                v-model="user"
              >
                <template v-slot:prepend>
                  <q-icon color="primary" name="fas fa-address-card" />
                </template>
              </q-input>
            </a-form-label>

            <a-form-label label="Contraseña" :isStrong="true">
              <div class="sdasdads row">
                <q-checkbox v-model="chbModificar"></q-checkbox>
                <q-input
                  outlined
                  type="password"
                  dense
                  v-model="password"
                  label="Contraseña"
                  :disable="!chbModificar"
                  :rules="[
                    (val) =>
                      (val && val.length > 0 && chbModificar) ||
                      'Ingrese una contraseña',
                  ]"
                >
                  <template v-slot:prepend>
                    <q-icon color="primary" name="fas fa-address-card" />
                  </template>
                </q-input>
              </div>
            </a-form-label>
          </div>
          <div class="o-formListUserWebMovil__inputGroups">
            <q-select
              label="Estado"
              filled
              dense
              v-model="state"
              :options="optionsState"
            >
              <template color="primary" v-slot:prepend>
                <q-icon color="primary" name="fas fa-clipboard-check"></q-icon>
              </template>
            </q-select>
          </div>
          <div class="o-formListUserWebMovil__inputGroups">
            <q-btn
              label="Grabar"
              color="green"
              type="submit"
              :disable="!can('Editar', 'Usuarios')"
            ></q-btn>

            <q-btn
              label="Limpiar"
              color="primary"
              @click="mtd_handleResetDataUser"
            ></q-btn>
          </div>
        </div>
      </q-form>
    </div>

    <div
      class="o-formListUserWebMovil__wraper o-formListUserWebMovil__wraper--center o-formListUserWebMovil__wraper--lg o-formListUserWebMovil__wraper--marginTop"
    >
      <div class="o-formListUserWebMovil__header">
        Lista de usuarios creados
      </div>
      <div class="o-formListUserWebMovil__box">
        <q-table
          flat
          :columns="columnsUsers"
          :rows="rows"
          no-data-label="No hay registros"
          :rows-per-page-options="[50, 100]"
        >
          <template v-slot:top-right>
            <q-input
              label="Buscar"
              color="priamry"
              dense
              outlined
              v-model="search"
            >
              <template v-slot:prepend>
                <q-icon color="green" name="search"></q-icon>
              </template>
            </q-input>
          </template>

          <template v-slot:body-cell-control="props">
            <q-td :props="props">
              <q-btn
                icon="fas fa-edit"
                fab-mini
                flat
                color="green"
                :disable="!can('Editar', 'Usuarios')"
                @click="mtd_editUser(props.row)"
              />
              <q-btn
                icon="settings"
                flat
                fab-mini
                color="red"
                v-if="Number(props.row.id_usuario) === 1 ? false : true"
                :disable="
                  props.row.estado !== 'INACTIVO'
                    ? can('Asignar permisos', 'Usuarios')
                      ? false
                      : true
                    : true
                "
                @click="handleAssignPermission(props.row.id_usuario)"
              ></q-btn>

              <q-btn
                icon="fas fa-book"
                fab-mini
                flat
                color="blue"
                @click="mtd_slcRowTableLog(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </div>
  <m-modal-log-table
    v-if="isOpenModalLog"
    :isOpenModalLog="isOpenModalLog"
    @mtd_closeModalLog="mtd_closeModalLog"
    :ILogTable="LogUsuario"
  ></m-modal-log-table>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  PropType,
  computed,
  toRefs,
} from 'vue';
import { can } from 'src/utils/permission';
import { QForm } from 'quasar';
import { IUser } from 'src/types';
import { useRouter } from 'vue-router';
import AFormLabel from 'components/atoms/FormLabel';
import { getCreateUserTrack } from 'src/utils/userTrack';
import MModalLogTable from 'src/components/molecules/ModalLogTables';

interface IUsuarioForm {
  id_usuario: string;
  user: string;
  password: string;
  ConfirmPassword: string;
  state: string;
  option: string;
}

export default defineComponent({
  name: 'OFormListUserWebMovil',
  props: {
    rowsUsers: {
      type: Array as PropType<IUser[]>,
      default: () => [],
    },
  },
  components: {
    AFormLabel,
    MModalLogTable,
  },
  emits: ['handUser'],
  setup(props, { emit }) {
    // #region declares
    const columnsUsers = [
      {
        label: 'Persona',
        field: 'datos',
        sortable: true,
        align: 'left',
        name: 'datos',
      },
      {
        label: 'Usuario',
        field: 'us_usuario',
        sortable: true,
        align: 'left',
        name: 'us_usuario',
      },
      {
        label: 'Perfil de usuario',
        field: 'pe_perfil',
        sortable: true,
        align: 'left',
        name: 'pe_perfil',
      },
      {
        label: 'Estado',
        field: 'estado',
        sortable: true,
        align: 'left',
        name: 'estado',
      },
      {
        label: 'Control',
        field: 'control',
        sortable: true,
        align: 'left',
        name: 'control',
      },
    ];
    const optionsState = ['ACTIVO', 'INACTIVO'];
    const search = ref('');
    const form = ref<QForm>();
    const router = useRouter();
    const chbModificar = ref(false);
    const userForm = reactive<IUsuarioForm>({
      id_usuario: '',
      user: '',
      password: '',
      ConfirmPassword: '',
      state: 'ACTIVO',
      option: !chbModificar.value ? '0' : '1',
    });
    const userTrack = getCreateUserTrack();
    const isOpenModalLog = ref(false);
    const LogUsuario = ref<IUser>();
    // #endregion

    const mtd_closeModalLog = () => {
      isOpenModalLog.value = false;
    };

    const mtd_slcRowTableLog = (logTable: IUser) => {
      LogUsuario.value = logTable;
      isOpenModalLog.value = true;
    };

    const handleAssignPermission = (idUsuario: string) => {
      void router.push({
        name: 'AssignPermissionUser',
        query: { id: idUsuario },
      });
    };

    const mtd_handleResetDataUser = () => {
      userForm.id_usuario = '';
      userForm.user = '';
      userForm.state = 'ACTIVO';
      userForm.password = '';
      chbModificar.value = false;
    };

    const mtd_handleEditUser = () => {
      const sendUserForm = {
        id_usuario: userForm.id_usuario,
        us_usuario: userForm.user,
        us_contrasenia: userForm.password,
        us_estado: userForm.state === 'ACTIVO' ? 1 : 0,
        option: !chbModificar.value ? '0' : '1',
      };

      if (sendUserForm.id_usuario !== '') {
        emit('handUser', { ...sendUserForm, ...userTrack });
      }
      mtd_handleResetDataUser();
    };

    const mtd_editUser = (userEdit: IUser) => {
      userForm.id_usuario = userEdit.id_usuario;
      userForm.user = userEdit.us_usuario;
      userForm.state = String(userEdit.estado);
      userForm.password = '';
    };

    const userResFilter = computed(() => {
      return props.rowsUsers.filter((item) => {
        const joinData = `${item.us_usuario} ${item.datos}`;
        return (
          joinData.toLowerCase().indexOf(search.value.toLowerCase()) !== -1
        );
      });
    });

    return {
      ...toRefs(userForm),
      userForm,
      form,
      search,
      optionsState,
      columnsUsers,
      mtd_handleResetDataUser,
      mtd_handleEditUser,
      mtd_editUser,
      rows: userResFilter,
      handleAssignPermission,
      can,
      chbModificar,
      mtd_closeModalLog,
      isOpenModalLog,
      mtd_slcRowTableLog,
      LogUsuario,
    };
  },
});
</script>

<style lang="scss" scoped>
@import url('./FormListUserWebMovil.scss');
</style>
