<template>
  <div class="o-formListPersonSubstitute">
    <q-form
      class="o-formListPersonSusbtitute__form"
      @submit.prevent="handleFilterSustitute"
    >
      <div
        class="o-formListPersonSubstitute__wraper o-formListPersonSubstitute__wraper--center o-formListPersonSubstitute__wraper--sm"
      >
        <div class="o-formListPersonSubstitute__header">
          Parámetros de búsqueda
        </div>
        <div class="o-formListPersonSubstitute__box">
          <div class="o-formListPersonSubstitute__inputGroups">
            <q-select
              v-model="slcParameter"
              :options="options"
              dense
              filled
              :options-dense="denseOpts"
              label="Seleccione un filtro"
            >
              <template v-slot:prepend>
                <q-icon color="primary" name="badge" />
              </template>
            </q-select>
          </div>
          <div class="o-formListPersonSubstitute__inputGroups">
            <q-input
              filled
              dense
              :label="
                slcParameter && String(slcParameter.id) === '2'
                  ? 'Nombres'
                  : 'Documento'
              "
              v-model="txtParameter"
            >
              <template v-slot:prepend>
                <q-icon color="primary" name="fas fa-keyboard" />
              </template>
            </q-input>
          </div>
          <q-btn
            class="o-formPersonSustitute__form__submit"
            type="submit"
            label="Listar"
            color="green"
          />
        </div>
      </div>

      <div
        class="o-formListPersonSubstitute__wraper o-formListPersonSubstitute__wraper--center o-formListPersonSubstitute__wraper--marginTop o-formListPersonSubstitute__wraper--lg"
      >
        <div class="o-formListPersonSubstitute__header">
          Lista de personas suplentes
        </div>
        <div class="o-formListPersonSubstitute__box">
          <div class="q-pa-md">
            <q-table
              flat
              :columns="columnsPersonSubstitute"
              :rows="listSubstitute"
              no-data-label="No hay registros"
              :rows-per-page-options="[25, 50]"
            >
              <!-- <template v-slot:top-right>
                <q-input
                  dense
                  placeholder="Buscar"
                  debounce="200"
                  v-model="search"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </template> -->
              <template v-slot:body-cell-pe_estado="props">
                <q-td :props="props">
                  <q-badge
                    :color="props.row.pe_estado === '0' ? 'orange' : 'green'"
                  >
                    {{ props.row.pe_estado === '0' ? 'INACTIVO' : 'ACTIVO' }}
                  </q-badge>
                </q-td>
              </template>
              <template v-slot:body-cell-control="props">
                <q-td :props="props">
                  <q-btn
                    icon="fas fa-user-edit"
                    fab-mini
                    flat
                    color="green"
                    :to="{
                      name: 'EditSubstitute',
                      query: { id: String(props.row.id_persona) },
                    }"
                  />

                  <!-- <q-btn icon="fas fa-briefcase" fab-mini flat color="brown" /> -->
                  <q-btn
                    icon="fas fa-minus-circle"
                    fab-mini
                    flat
                    color="red"
                    :disable="
                      String(props.row.pe_estado) !== '0'
                        ? !can('Editar', 'Sustituto')
                          ? true
                          : false
                        : true
                    "
                    @click="handleDisableSustitute(props.row.id_persona)"
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
    </q-form>
  </div>
  <m-modal-log-table
    v-if="isOpenModalLog"
    :isOpenModalLog="isOpenModalLog"
    @mtd_closeModalLog="mtd_closeModalLog"
    :ILogTable="LogSuplente"
  ></m-modal-log-table>
</template>

<script lang="ts">
import { IResponseFetch, ISuplente } from 'src/types';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';
import { MessageSuccess } from 'src/utils/swal';
import { defineComponent, ref } from 'vue';
import { can } from 'src/utils/permission';
import { getCreateUserTrack } from 'src/utils/userTrack';
import MModalLogTable from 'src/components/molecules/ModalLogTables';
import { MESSAGE_ANULAR } from 'src/utils/messages';

export default defineComponent({
  name: 'OFormListPersonSubstitute',
  components: {
    MModalLogTable,
  },
  setup() {
    const search = ref('');
    const txtParameter = ref('');
    const isOpenModalLog = ref(false);
    const LogSuplente = ref<ISuplente>();

    const slcParameter = ref<{ id: string; label: string }>({
      label: 'Documento',
      id: '1',
    });
    let listSubstitute = ref<ISuplente[]>([]);

    const columnsPersonSubstitute = [
      {
        label: 'TP Documento',
        field: 'per_documento',
        sortable: true,
        align: 'left',
        name: 'per_documento',
      },
      {
        label: 'Nombres',
        field: 'datos',
        sortable: true,
        align: 'left',
        name: 'datos',
      },
      {
        label: 'Documento',
        field: 'per_documento',
        sortable: true,
        align: 'left',
        name: 'per_documento',
      },
      {
        label: 'Nacionalidad',
        field: 'na_descripcion',
        sortable: true,
        align: 'left',
        name: 'na_descripcion',
      },
      {
        label: 'Estado',
        field: 'pe_estado',
        sortable: true,
        align: 'left',
        name: 'pe_estado',
      },
      {
        label: 'Control',
        field: 'control',
        sortable: true,
        align: 'center',
        name: 'control',
      },
    ];

    const options = [
      { label: 'Documento', id: 1 },
      { label: 'Nombre', id: 2 },
    ];
    const userTrack = getCreateUserTrack();
    // const substitutes = computed(() => {
    //   return listSubstitute.value.filter((item) => {
    //     const joinData = `${item.per_nombre} ${item.per_apellido_paterno} ${item.per_apellido_materno} ${item.datos}`;
    //     return (
    //       joinData.toLowerCase().indexOf(search.value.toLowerCase()) !== -1
    //     );
    //   });
    // });

    const mtd_closeModalLog = () => {
      isOpenModalLog.value = false;
    };

    const mtd_slcRowTableLog = (logTable: ISuplente) => {
      LogSuplente.value = logTable;
      isOpenModalLog.value = true;
    };

    const handleFilterSustitute = async () => {
      listSubstitute.value = [];
      const listTpDocuments = await fetchRequestAPI({
        method: 'POST',
        url: '/adm/suplente/personas',
        body: JSON.stringify({
          opcion: slcParameter.value?.id,
          nombres: txtParameter.value,
          documento: txtParameter.value,
        }),
      });

      if (
        readErrorFetch({
          responseFetch: listTpDocuments,
          message: 'Ocurrió un error',
        })
      ) {
        return;
      }
      listSubstitute.value =
        ((listTpDocuments as IResponseFetch).data as ISuplente[]) || [];
    };

    const handleDisableSustitute = async (idPersona: string) => {
      listSubstitute.value = [];
      const listTpDocuments = await fetchRequestAPI({
        method: 'PUT',
        url: '/adm/suplente/persona',
        body: JSON.stringify({ id_persona: idPersona, ...userTrack }),
      });

      if (
        readErrorFetch({
          responseFetch: listTpDocuments,
          message: 'Ocurrió un error',
        })
      ) {
        return;
      }

      MessageSuccess({ title: MESSAGE_ANULAR('a la persona sustituto') });
      await handleFilterSustitute();
    };

    // onMounted(async () => {

    // });

    return {
      options: options,
      dense: ref(false),
      denseOpts: ref(false),
      // rows: substitutes,
      columnsPersonSubstitute,
      search,
      txtParameter,
      slcParameter,
      listSubstitute,
      handleFilterSustitute,
      handleDisableSustitute,
      can,
      mtd_closeModalLog,
      isOpenModalLog,
      mtd_slcRowTableLog,
      LogSuplente,
    };
  },
});
</script>

<style lang="scss" scoped>
@import './FormListPersonSubstitute.scss';
</style>
