<template>
  <div class="o-formListProfilePermissionUser">
    <div
      class="o-formListProfilePermissionUser__wraper o-formListProfilePermissionUser__wraper--center o-formListProfilePermissionUser__wraper--sm"
    >
      <div class="o-formListProfilePermissionUser__header">
        Registrar Perfiles de usuario
      </div>
      <q-form
        class="o-formListProfilePermissionUser__form"
        ref="form"
        @submit.prevent="mtd_registerProfilePermission"
      >
        <div class="o-formListProfilePermissionUser__box">
          <div class="o-formListProfilePermissionUser__inputGroups">
            <q-input
              label="Nombre"
              filled
              dense
              v-model="name"
              :rules="[
                (val) => (val && val.length > 0) || 'El nombre es obligatorio',
              ]"
            >
              <template v-slot:prepend>
                <q-icon color="primary" name="fas fa-map-signs" />
              </template>
            </q-input>

            <q-input
              v-model="abbreviation"
              hint="Los nombres son requeridos"
              filled
              dense
              label="Abreviatura"
              :rules="[
                (val) =>
                  (val !== null && val.length > 0) ||
                  'La abreviatura es requerida',
              ]"
            >
              <template v-slot:prepend>
                <q-icon color="primary" name="fas fa-keyboard" />
              </template>
            </q-input>
          </div>
          <div class="o-formListProfilePermissionUser__inputGroups">
            <q-select
              label="Estado"
              filled
              dense
              v-model="state"
              :options="optionsState"
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Debe seleccionar un estado ',
              ]"
            >
              <template color="primary" v-slot:prepend>
                <q-icon color="primary" name="fas fa-clipboard-check"></q-icon>
              </template>
            </q-select>
          </div>
          <div class="o-formListProfilePermissionUser__inputGroups">
            <q-btn
              :label="
                id_tpusuario === '' || id_tpusuario === null
                  ? 'Registrar'
                  : 'Grabar'
              "
              color="green"
              type="submit"
              :disable="!can('Registrar', 'Sede') && !can('Editar', 'Sede')"
              v-if="can('Registrar', 'Sede') && can('Editar', 'Sede')"
            />
            <q-btn
              v-else-if="can('Registrar', 'Sede')"
              label="Registrar"
              color="green"
              type="submit"
            />
            <q-btn
              v-else-if="can('Editar', 'Sede')"
              label="Grabar "
              color="green"
              type="submit"
              :disable="id_tpusuario === null"
            />
            <q-btn v-else label="Registrar " color="green" disable />

            <q-btn
              label="Limpiar"
              color="primary"
              @click="mtd_handleResetDataProfilePermission"
            />
          </div>
        </div>
      </q-form>
    </div>

    <div
      class="o-formListProfilePermissionUser__wraper o-formListProfilePermissionUser__wraper--center o-formListProfilePermissionUser__wraper--lg o-formListProfilePermissionUser__wraper--marginTop"
    >
      <div class="o-formListProfilePermissionUser__header">
        Lista de perfiles de usuario
      </div>
      <div class="o-formListProfilePermissionUser__box">
        <q-table
          flat
          :columns="columnsProfileUser"
          :rows="rows"
          no-data-label="No hay registros"
          :rows-per-page-options="[25, 50]"
        >
          <template v-slot:top-rigth>
            <q-input label="Buscar" color="priamry">
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
                @click="mtd_editProfilePermission(props.row)"
                :disable="!can('Editar', 'Sede')"
              />
              <q-btn
                icon="settings"
                flat
                fab-mini
                color="red"
                :disable="
                  props.row.estado !== 'INACTIVO'
                    ? can('Asignar permisos', 'Usuarios')
                      ? false
                      : true
                    : true
                "
                @click="handleAssignPermissionProfile(props.row.id_tpusuario)"
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
    :ILogTable="LogProfileUser"
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
import { IProfileUserPermission } from 'src/types';
import { useRouter } from 'vue-router';
import { getCreateUserTrack } from 'src/utils/userTrack';
import MModalLogTable from 'src/components/molecules/ModalLogTables';

interface IProfileUserPermissionForm {
  id_tpusuario: string;
  name: string;
  abbreviation: string;
  state: string;
}

export default defineComponent({
  name: 'OFormListProfilePermissionUser',
  components: {
    MModalLogTable,
  },
  props: {
    rowsProfilesUsers: {
      type: Array as PropType<IProfileUserPermission[]>,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const columnsProfileUser = [
      {
        label: 'Nombre',
        field: 'tpu_descripcion',
        sortable: true,
        align: 'left',
        name: 'tpu_descripcion',
      },
      {
        label: 'Abreviatura',
        field: 'tpu_abreviatura',
        sortable: true,
        align: 'left',
        name: 'tpu_abreviatura',
      },
      {
        label: 'Canitdad de permisos',
        field: 'cantidad',
        sortable: true,
        align: 'center',
        name: 'cantidad',
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
        align: 'center',
        name: 'control',
      },
    ];
    const optionsState = ['ACTIVO', 'INACTIVO'];
    const form = ref<QForm>();
    const router = useRouter();
    const search = ref('');
    const userTrack = getCreateUserTrack();
    const isOpenModalLog = ref(false);
    const LogProfileUser = ref<IProfileUserPermission>();

    const profilePermissionForm = reactive<IProfileUserPermissionForm>({
      id_tpusuario: '',
      name: '',
      abbreviation: '',
      state: 'ACTIVO',
    });

    const mtd_closeModalLog = () => {
      isOpenModalLog.value = false;
    };

    const mtd_slcRowTableLog = (logTable: IProfileUserPermission) => {
      LogProfileUser.value = logTable;
      isOpenModalLog.value = true;
    };

    const mtd_editProfilePermission = (
      profilePermission: IProfileUserPermission
    ) => {
      profilePermissionForm.id_tpusuario = profilePermission.id_tpusuario;
      profilePermissionForm.name = profilePermission.tpu_descripcion;
      profilePermissionForm.abbreviation = profilePermission.tpu_abreviatura;
      profilePermissionForm.state = String(profilePermission.estado);
    };

    const handleAssignPermissionProfile = (idProfile: string) => {
      void router.push({
        name: 'AssignPermissionProfileUser',
        query: { id: idProfile },
      });
    };

    const mtd_registerProfilePermission = () => {
      const profileUserForm = {
        tpu_descripcion: profilePermissionForm.name,
        tpu_abreviatura: profilePermissionForm.abbreviation,
        tpu_estado: profilePermissionForm.state === 'ACTIVO' ? '1' : '0',
      };

      if (
        profilePermissionForm.id_tpusuario === '' ||
        profilePermissionForm.id_tpusuario === null
      ) {
        emit('mtd_handleProfileUser', {
          ...profileUserForm,
          id_tpusuario: null,
          ...userTrack,
        });
      } else {
        emit('mtd_handleProfileUser', {
          ...profileUserForm,
          id_tpusuario: profilePermissionForm.id_tpusuario,
          ...userTrack,
        });
      }
      mtd_handleResetDataProfilePermission();
    };

    const mtd_handleResetDataProfilePermission = () => {
      profilePermissionForm.id_tpusuario = '';
      profilePermissionForm.name = '';
      profilePermissionForm.state = 'ACTIVO';
      profilePermissionForm.abbreviation = '';
      form.value?.reset();
    };

    const profilesPermissionResFilter = computed(() => {
      return props.rowsProfilesUsers.filter((item) => {
        const joinData = `${item.tpu_descripcion} ${item.datos}`;
        return (
          joinData.toLowerCase().indexOf(search.value.toLowerCase()) !== -1
        );
      });
    });

    return {
      columnsProfileUser,
      optionsState,
      can,
      form,
      handleAssignPermissionProfile,
      rows: profilesPermissionResFilter,
      mtd_editProfilePermission,
      ...toRefs(profilePermissionForm),
      mtd_registerProfilePermission,
      mtd_handleResetDataProfilePermission,
      mtd_closeModalLog,
      isOpenModalLog,
      mtd_slcRowTableLog,
      LogProfileUser,
    };
  },
});
</script>

<style lang="scss" scoped>
@import url('./FormListProfilePermissionUser.scss');
</style>
