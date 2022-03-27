<template>
  <div class="o-formRegisterEmployeeDocument">
    <div
      class="o-formRegisterEmployeeDocument__wraper o-formRegisterEmployeeDocument__wraper--center o-formRegisterEmployeeDocument__wraper--sm"
    >
      <div class="o-formRegisterEmployeeDocument__header">
        Registro de documentos del empleado
      </div>
      <q-form
        class="o-formRegisterEmployeeDocument__form"
        ref="form"
        @submit.prevent="mtd_handleRegisterDocumentsEmployee"
      >
        <div class="o-formRegisterEmployeeDocument__box">
          <div class="o-formRegisterEmployeeDocument__inputGroups">
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
            <q-select
              label="Estado"
              filled
              dense
              v-model="state"
              :options="optionsState"
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Debe seleccionar un estado',
              ]"
            >
              <template color="primary" v-slot:prepend>
                <q-icon color="primary" name="fas fa-clipboard-check"></q-icon>
              </template>
            </q-select>
          </div>
          <div class="o-formRegisterEmployeeDocument__inputGroups">
            <q-input label="Descripción" filled dense v-model="description">
              <template color="primary" v-slot:prepend>
                <q-icon color="primary" name="fas fa-paragraph"></q-icon>
              </template>
            </q-input>
          </div>
          <div class="o-formRegisterEmployeeDocument__inputGroups">
            <q-btn
              :label="
                id_documents === '' || id_documents === null
                  ? 'Registrar'
                  : 'Grabar'
              "
              :disable="
                !can('Registrar', 'Documentos Empleado') &&
                !can('Editar', 'Documentos Empleado')
              "
              v-if="
                can('Registrar', 'Documentos Empleado') &&
                can('Editar', 'Documentos Empleado')
              "
              color="green"
              type="submit"
            ></q-btn>

            <q-btn
              label="Registrar"
              v-else-if="can('Registrar', 'Documentos Empleado')"
              color="green"
              type="submit"
            />

            <q-btn
              label="Grabar"
              v-else-if="can('Editar', 'Documentos Empleado')"
              color="green"
              type="submit"
            />

            <q-btn v-else label="Registrar " color="green" disable />

            <q-btn
              label="Limpiar"
              color="primary"
              @click="mtd_handleResetDataDocumentsEmployee"
            ></q-btn>
          </div>
        </div>
      </q-form>
    </div>

    <div
      class="o-formRegisterEmployeeDocument__wraper o-formRegisterEmployeeDocument__wraper--center o-formRegisterEmployeeDocument__wraper--lg o-formRegisterEmployeeDocument__wraper--marginTop"
    >
      <div class="o-formRegisterEmployeeDocument__header">
        Lista de documentos empleados
      </div>
      <div class="o-formRegisterEmployeeDocument__box">
        <q-table
          flat
          :columns="columnsEmployeeDocuments"
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
                :disable="!can('Editar', 'Documentos Empleado')"
                @click="mtd_editDocumentEmployee(props.row)"
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
    :ILogTable="LogDocumentoEmpleado"
  ></m-modal-log-table>
</template>

<script lang="ts">
import { QForm } from 'quasar';
import { IDocumentEmployee } from 'src/types';
import { can } from 'src/utils/permission';
import {
  defineComponent,
  ref,
  reactive,
  PropType,
  computed,
  toRefs,
} from 'vue';
import { getCreateUserTrack } from 'src/utils/userTrack';
import MModalLogTable from 'src/components/molecules/ModalLogTables';

// #region interface
interface IDocumentsForm {
  id_documents: string | null;
  name: string;
  description: string;
  state: string;
  userCreation: string;
}
// #endregion

export default defineComponent({
  name: 'OFormRegisterEmployeeDocument',
  components: {
    MModalLogTable,
  },
  props: {
    rowsDocumentsEmployee: {
      type: Array as PropType<IDocumentEmployee[]>,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    // #region declares
    const columnsEmployeeDocuments = [
      {
        label: 'Nombre',
        field: 'de_nombre',
        sortable: true,
        align: 'left',
        name: 'de_nombre',
      },
      {
        label: 'Descripcion',
        field: 'de_descripcion',
        sortable: true,
        align: true,
        name: 'de_descripcion',
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

    const userTrack = getCreateUserTrack();
    const isOpenModalLog = ref(false);
    const LogDocumentoEmpleado = ref<IDocumentEmployee>();

    const documentsEmployee = reactive<IDocumentsForm>({
      id_documents: null,
      name: '',
      description: '',
      state: 'ACTIVO',
      userCreation: userTrack.userCreacion,
    });
    // #endregion

    // #region methods
    const mtd_closeModalLog = () => {
      isOpenModalLog.value = false;
    };

    const mtd_slcRowTableLog = (logTable: IDocumentEmployee) => {
      LogDocumentoEmpleado.value = logTable;
      isOpenModalLog.value = true;
    };
    const mtd_editDocumentEmployee = (
      editDocumentsEmployee: IDocumentEmployee
    ) => {
      documentsEmployee.id_documents = String(
        editDocumentsEmployee.id_emdocumento
      );
      documentsEmployee.name = editDocumentsEmployee.de_nombre;
      documentsEmployee.description = editDocumentsEmployee.de_descripcion;
      documentsEmployee.state = editDocumentsEmployee.estado;
      documentsEmployee.userCreation = editDocumentsEmployee.userCreation;
    };

    const mtd_handleResetDataDocumentsEmployee = () => {
      documentsEmployee.id_documents = null;
      documentsEmployee.name = '';
      documentsEmployee.description = '';
      documentsEmployee.state = 'ACTIVO';
      documentsEmployee.userCreation = userTrack.userCreacion;
      (form.value as QForm).reset();
    };

    const mtd_handleRegisterDocumentsEmployee = () => {
      const documentsEmployeeForm = {
        de_nombre: documentsEmployee.name,
        de_descripcion: documentsEmployee.description,
        userCreacion: userTrack.userCreacion,
        flEliminado: documentsEmployee.state === 'ACTIVO' ? 1 : 0,
      };

      if (
        documentsEmployee.id_documents === '' ||
        documentsEmployee.id_documents === null
      ) {
        emit('handDocumentEmployee', {
          ...documentsEmployeeForm,
          id_emdocumento: null,
        });
      } else {
        emit('handDocumentEmployee', {
          ...documentsEmployeeForm,
          id_emdocumento: documentsEmployee.id_documents,
        });
      }
      mtd_handleResetDataDocumentsEmployee();
    };

    const documentsEmployeeResFilter = computed(() => {
      return props.rowsDocumentsEmployee.filter((item) => {
        const joinData = `${item.de_nombre} ${item.de_descripcion} ${item.estado}`;
        return (
          joinData.toLowerCase().indexOf(search.value.toLowerCase()) !== -1
        );
      });
    });

    // #endregion

    return {
      columnsEmployeeDocuments,
      rows: documentsEmployeeResFilter,
      optionsState,
      search,
      mtd_handleRegisterDocumentsEmployee,
      mtd_editDocumentEmployee,
      mtd_handleResetDataDocumentsEmployee,
      ...toRefs(documentsEmployee),
      documentsEmployee,
      form,
      can,
      mtd_closeModalLog,
      isOpenModalLog,
      mtd_slcRowTableLog,
      LogDocumentoEmpleado,
    };
  },
});
</script>

<style lang="scss" scoped>
@import url('./FormRegisterEmployeeDocument.scss');
</style>
