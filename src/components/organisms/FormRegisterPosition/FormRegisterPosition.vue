<template>
  <div class="o-formRegisterPosition">
    <div
      class="o-formRegisterPosition__wraper o-formRegisterPosition__wraper--center o-formRegisterPosition__wraper--sm"
    >
      <div class="o-formRegisterPosition__header">Registro de cargo</div>
      <q-form
        class="o-formRegisterPosition__form"
        ref="form"
        @submit.prevent="mtd_handleRegisterPosition"
      >
        <div class="o-formRegisterPosition__box">
          <div class="o-formRegisterPosition__inputGroups">
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
                <q-icon color="primary" name="fas fa-text-height" />
              </template>
            </q-input>
            <q-input
              label="Abreviatura"
              filled
              dense
              v-model="abbreviation"
              :rules="[
                (val) =>
                  (val !== null && val.length > 0) ||
                  'La abreviatura es requerida',
                (val) =>
                  isValidAbbreviation(val) ||
                  'La abreviatura solo puede contener letras',
              ]"
              @update:model-value="handleAbrevitation"
            >
              <template v-slot:prepend>
                <q-icon color="primary" name="fas fa-spell-check" />
              </template>
            </q-input>
          </div>
          <div class="o-formRegisterPosition__inputGroups">
            <q-select
              label="Tipo de perfil de usuario"
              filled
              dense
              v-model="id_tpusuario"
              :options="optionTypeUsuer"
            >
              <template color="primary" v-slot:prepend>
                <q-icon color="primary" name="fas fa-mobile-alt"></q-icon>
              </template>
            </q-select>
          </div>
          <div class="o-formRegisterPosition__inputGroups">
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
          <div class="o-formRegisterPosition__inputGroups">
            <q-btn
              :label="id_postion === null ? 'Registrar' : 'Grabar'"
              color="green"
              type="submit"
              :disable="!can('Registrar', 'Cargo') && !can('Editar', 'Cargo')"
              v-if="can('Registrar', 'Cargo') && can('Editar', 'Cargo')"
            />

            <q-btn
              label="Registrar"
              v-else-if="can('Registrar', 'Cargo')"
              color="green"
              type="submit"
            />

            <q-btn
              label="Grabar"
              v-else-if="can('Editar', 'Cargo')"
              color="green"
              type="submit"
            />

            <q-btn v-else label="Registrar " color="green" disable />

            <q-btn
              label="Limpiar"
              color="primary"
              @click="mtd_handleResetDataPosition"
            />
          </div>
        </div>
      </q-form>
    </div>

    <div
      class="o-formRegisterPosition__wraper o-formRegisterPosition__wraper--center o-formRegisterPosition__wraper--lg o-formRegisterPosition__wraper--marginTop"
    >
      <div class="o-formRegisterPosition__header">Lista de cargos</div>
      <div class="o-formRegisterPosition__box">
        <q-table
          flat
          :columns="columnsPosition"
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
                @click="mtd_editPosition(props.row)"
                :disable="!can('Editar', 'Cargo')"
              />

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
    :ILogTable="LogCargo"
  ></m-modal-log-table>
</template>

<script lang="ts">
import { QForm } from 'quasar';
import { ICargo, IPosition, IResponseFetch } from 'src/types';
import {
  defineComponent,
  ref,
  reactive,
  PropType,
  computed,
  toRefs,
  onMounted,
} from 'vue';
import { can } from 'src/utils/permission';

import { isValidAbbreviation } from 'src/utils/regEx';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';
import MModalLogTable from 'src/components/molecules/ModalLogTables';
import { getCreateUserTrack } from 'src/utils/userTrack';

// #region interface
interface IPositionForm {
  name: string;
  state: string;
  id_postion: string | null;
  abbreviation: string;
  typemovil: string;
  id_tpusuario: ISelectForm | null;
}

interface ITypeUserRol {
  id_tpusuario: string;
  tpu_descripcion: string;
}

interface ISelectForm {
  value: string;
  label: string;
}

// #endregion

export default defineComponent({
  name: 'OFormRegisterPosition',
  emits: ['handPosition'],
  components: {
    MModalLogTable,
  },
  props: {
    rowsPosition: {
      type: Array as PropType<IPositionForm[]>,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    // #region declares
    const columnsPosition = [
      {
        label: 'Nombre',
        field: 'ca_descripcion',
        sortable: true,
        align: 'left',
        name: 'ca_descripcion',
      },
      {
        label: 'Abreviatura',
        field: 'ca_abreviatura',
        sortable: true,
        align: true,
        name: 'ca_abreviatura',
      },
      {
        label: 'Tipo de perfil de usuario',
        field: 'tpu_descripcion',
        sortable: true,
        align: 'left',
        name: 'tpu_descripcion',
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
    const optionTypeUsuer = ref<ISelectForm[]>();

    const isOpenModalLog = ref(false);
    const LogCargo = ref<IPosition>();
    const userTrack = getCreateUserTrack();

    const position = reactive<IPositionForm>({
      name: '',
      state: 'ACTIVO',
      id_postion: null,
      abbreviation: '',
      typemovil: '',
      id_tpusuario: null,
    });
    // #endregion

    // #region methods

    const mtd_closeModalLog = () => {
      isOpenModalLog.value = false;
    };

    const mtd_slcRowTableLog = (logTable: IPosition) => {
      LogCargo.value = logTable;
      isOpenModalLog.value = true;
    };

    const mtd_getTypesUserMovile = async () => {
      const resTypeUsuer = await fetchRequestAPI({
        method: 'GET',
        url: '/adm/api/tipo-usuario',
      });

      if (
        readErrorFetch({
          responseFetch: resTypeUsuer,
          message: 'Ocurrió un error',
        })
      ) {
        return;
      }

      optionTypeUsuer.value = (
        (resTypeUsuer as IResponseFetch).data as ITypeUserRol[]
      ).map((e: ITypeUserRol) => ({
        value: e.id_tpusuario,
        label: e.tpu_descripcion,
      }));
    };

    const mtd_editPosition = (positionEdit: ICargo) => {
      position.name = positionEdit.ca_descripcion;
      position.state = positionEdit.estado;
      position.abbreviation = positionEdit.ca_abreviatura;
      position.id_postion = String(positionEdit.id_cargo);
      position.id_tpusuario = optionTypeUsuer.value?.find(
        (e: ISelectForm) =>
          String(e.value) === String(positionEdit.id_tpusuario)
      ) as ISelectForm;
    };

    const mtd_handleResetDataPosition = () => {
      position.name = '';
      position.state = 'ACTIVO';
      position.abbreviation = '';
      position.id_postion = null;
      position.id_tpusuario = null;
      (form.value as QForm).reset();
    };

    const mtd_handleRegisterPosition = () => {
      const postionForm = {
        id_cargo: position.id_postion,
        ca_descripcion: position.name,
        ca_abreviatura: position.abbreviation,
        ca_estado: position.state === 'ACTIVO' ? 1 : 0,
        id_tpusuario: position.id_tpusuario?.value,
      };

      if (postionForm.id_cargo === null) {
        emit('handPosition', {
          ...postionForm,
          id_cargo: null,
          ...userTrack,
        });
      } else {
        emit('handPosition', {
          ...postionForm,
          id_cargo: position.id_postion,
          ...userTrack,
        });
      }
      mtd_handleResetDataPosition();
    };

    const postionResFilter = computed(() => {
      return props.rowsPosition.filter((item) => {
        const joinData = `${item.abbreviation} ${item.name} ${item.state}`;
        return (
          joinData.toLowerCase().indexOf(search.value.toLowerCase()) !== -1
        );
      });
    });

    const handleAbrevitation = (newValue: string) => {
      position.abbreviation = newValue.replace(' ', '-').toUpperCase();
    };
    // #endregion

    onMounted(async () => {
      await mtd_getTypesUserMovile();
    });

    return {
      columnsPosition,
      rows: postionResFilter,
      search,
      mtd_handleRegisterPosition,
      mtd_editPosition,
      mtd_handleResetDataPosition,
      ...toRefs(position),
      position,
      form,
      isValidAbbreviation,
      handleAbrevitation,
      optionTypeUsuer,
      //filterSlcTypeUser,
      optionsState,
      can,
      mtd_closeModalLog,
      isOpenModalLog,
      mtd_slcRowTableLog,
      LogCargo,
    };
  },
});
</script>

<style lang="scss" scoped>
@import url('./FormRegisterPosition.scss');
</style>
