<template>
  <div class="o-formRegisterPermission">
    <div
      class="o-formRegisterPermission__wraper o-formRegisterPermission__wraper--center o-formRegisterPermission__wraper--sm"
    >
      <div class="o-formRegisterPermission__header">Registro de permisos</div>
      <q-form
        class="o-formRegisterPermission__form"
        ref="form"
        @submit.prevent="mtd_handleRegisterPermission"
      >
        <div class="o-formRegisterPermission__box">
          <div class="o-formRegisterPermission__inputGroups">
            <q-input
              label="Nombre"
              filled
              dense
              v-model="name"
              :rules="[
                (val) => (val && val.length > 0) || 'Es obligatorio este campo',
              ]"
            >
              <template v-slot:prepend>
                <q-icon color="primary" name="fas fa-map-signs" />
              </template>
            </q-input>
            <q-select
              label="Estado"
              filled
              dense
              v-model="state"
              :options="optionsState"
              :rules="[
                (val) => (val && val.length > 0) || 'Es obligatorio este campo',
              ]"
            >
              <template color="primary" v-slot:prepend>
                <q-icon color="primary" name="fas fa-clipboard-check"></q-icon>
              </template>
            </q-select>
          </div>
          <div class="o-formRegisterPermission__inputGroups">
            <q-input
              label="Descripción"
              type="textarea"
              filled
              dense
              v-model="description"
            >
              <template color="primary" v-slot:prepend>
                <q-icon color="primary" name="fas fa-paragraph"></q-icon>
              </template>
            </q-input>
          </div>
          <div class="o-formRegisterPermission__inputGroups">
            <q-btn
              :label="id_permission === 0 ? 'Registrar' : 'Editar'"
              color="green"
              type="submit"
            ></q-btn>
            <q-btn
              label="Limpiar"
              color="primary"
              @click="mtd_handleResetDataPermission"
            ></q-btn>
          </div>
        </div>
      </q-form>
    </div>

    <div
      class="o-formRegisterPermission__wraper o-formRegisterPermission__wraper--center o-formRegisterPermission__wraper--lg o-formRegisterPermission__wraper--marginTop"
    >
      <div class="o-formRegisterPermission__header">Lista de permisos</div>
      <div class="o-formRegisterPermission__box">
        <q-table
          flat
          :columns="columnsPermission"
          :rows="rows"
          no-data-label="No hay registros"
          :rows-per-page-options="[25, 50]"
        >
          <template v-slot:top-rigth>
            <q-input label="Buscar" color="priamry" v-model="search">
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
                @click="mtd_editPermission(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { QForm } from 'quasar';
import { IPermiso } from 'src/types';
import {
  defineComponent,
  ref,
  reactive,
  PropType,
  computed,
  toRefs,
} from 'vue';

// #region interface
interface IPermissionForm {
  name: string;
  state: string;
  id_permission: number;
  description: string;
}
// #endregion
export default defineComponent({
  name: 'OFormRegisterPermission',
  props: {
    rowsPermission: {
      type: Array as PropType<IPermiso[]>,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    // #region declares
    const columnsPermission = [
      {
        label: 'Nombre',
        field: 'pe_nombre',
        sortable: true,
        align: 'left',
        name: 'pe_nombre',
      },
      {
        label: 'Descripcion',
        field: 'pe_descripcion',
        sortable: true,
        align: true,
        name: 'pe_descripcion',
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

    const permission = reactive<IPermissionForm>({
      name: '',
      state: '',
      id_permission: 0,
      description: '',
    });
    // #endregion

    // #region methods
    const mtd_editPermission = (permisoEdit: IPermiso) => {
      permission.name = permisoEdit.pe_nombre;
      permission.state = permisoEdit.estado;
      permission.description = permisoEdit.pe_descripcion;
      permission.id_permission = Number(permisoEdit.id_permiso);
    };

    const mtd_handleResetDataPermission = () => {
      permission.name = '';
      permission.state = '';
      permission.description = '';
      permission.id_permission = 0;
      (form.value as QForm).reset();
    };

    const mtd_handleRegisterPermission = () => {
      const permissionForm = {
        id_permiso: permission.id_permission,
        pe_descripcion: permission.description,
        pe_nombre: permission.name,
        pe_estado: permission.state === 'ACTIVO' ? 1 : 0,
      };

      if (permissionForm.id_permiso === 0) {
        emit('handPermission', {
          ...permissionForm,
          id_permiso: 0,
        });
      } else {
        emit('handPermission', {
          ...permissionForm,
          id_permiso: permission.id_permission,
        });
      }
      mtd_handleResetDataPermission();
    };

    const permissionResFilter = computed(() => {
      return props.rowsPermission.filter((item) => {
        const joinData = `${item.pe_descripcion} ${item.pe_nombre} ${item.pe_estado}`;
        return (
          joinData.toLowerCase().indexOf(search.value.toLowerCase()) !== -1
        );
      });
    });
    // #endregion
    return {
      columnsPermission,
      rows: permissionResFilter,
      optionsState,
      search,
      mtd_handleRegisterPermission,
      mtd_editPermission,
      mtd_handleResetDataPermission,
      ...toRefs(permission),
      permission,
      form,
    };
  },
});
</script>

<style lang="scss" scoped>
@import url('./FormRegisterPermission.scss');
</style>
