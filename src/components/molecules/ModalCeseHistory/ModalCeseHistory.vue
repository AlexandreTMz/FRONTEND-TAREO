<template>
  <q-dialog :model-value="isOpenModal" persistent>
    <q-card class="m-modalCeseHistoy">
      <div class="m-modalCeseHistoy__header">
        <h2 class="m-modalCeseHistoy__header__title">Historial de ceses</h2>
      </div>
      <div class="m-modalCeseHistoy__body">
        <a-form-label label="Empleado" :isStrong="true">
          {{ CeseEmployeeCancel.datos }}
        </a-form-label>
        <br />
        <q-table
          :rows="rowsCeseHistory"
          :columns="columnsHistoryCese"
          row-key="name"
          :rows-per-page-options="[25, 50]"
        >
          <template v-slot:body-cell-ce_motivo="props">
            <q-td :props="props" class="m-modalCeseHistoy__tdCese">
              {{ props.row.ce_motivo }}
            </q-td>
            <q-tooltip
              anchor="center middle"
              self="center middle"
              max-width="10rem"
            >
              <div style="max-width: 150px">
                {{ props.row.ce_fecha_cese }}<br />
                {{ props.row.ce_motivo }}
              </div>
            </q-tooltip>
          </template>
        </q-table>
        <br />
        <div class="m-modalCeseHistoy__body__form__actions">
          <q-btn
            class="m-modalCeseHistoy__body__form__actions__button"
            label="Cerrar"
            color="green"
            @click="handleCloseModal"
          />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, onMounted } from 'vue';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';
import { ICeseEmployee, IHistoryCese, IResponseFetch } from 'src/types';
import AFormLabel from 'components/atoms/FormLabel';

interface ISelectForm {
  label: string;
  value: number;
}

export default defineComponent({
  name: 'MModalCeseHistory',
  props: {
    CeseEmployeeCancel: {
      type: Object as PropType<ICeseEmployee>,
      default: null,
    },
    isOpenModal: {
      type: Boolean,
      default: false,
    },
    handleForm: {
      type: Function,
      default: null,
    },
  },
  components: {
    AFormLabel,
  },
  setup(props, { emit }) {
    const columnsHistoryCese = [
      {
        label: 'Fecha de cese',
        field: 'ce_fecha_cese',
        sortable: true,
        align: 'left',
        name: 'ce_fecha_cese',
      },
      {
        label: 'Tipo de cese',
        field: 'mo_nombre',
        sortable: true,
        align: true,
        name: 'mo_nombre',
      },
      {
        label: 'Motivo de cese',
        field: 'ce_motivo',
        sortable: true,
        align: 'left',
        name: 'ce_motivo',
        style: 'max-witdh: 200px',
      },
      {
        label: 'Lista negra',
        field: 'ls_negra',
        sortable: true,
        align: 'left',
        name: 'ls_negra',
      },
    ];

    const rowsCeseHistory = ref<IHistoryCese[]>([]);

    const slcOptiosRows: ISelectForm[] = [
      { label: 'Despido arbitrario', value: 1 },
      { label: 'Renuncia voluntaria', value: 2 },
    ];

    const handleCloseModal = () => {
      emit('close-modal');
    };

    const mtd_asyncGetHistoryCese = async () => {
      const resHistoryCese = (await fetchRequestAPI({
        url: `/adm/api/empleado/cese/historial/${props.CeseEmployeeCancel?.id_persona}`,
        method: 'GET',
      })) as boolean | IResponseFetch;

      if (
        readErrorFetch({
          responseFetch: resHistoryCese,
          message: 'Ocurrió un error',
        })
      ) {
        return;
      }

      rowsCeseHistory.value =
        ((resHistoryCese as IResponseFetch).data as IHistoryCese[]) || [];
    };

    onMounted(async () => {
      if (props.CeseEmployeeCancel) {
        await mtd_asyncGetHistoryCese();
      }
    });

    return {
      handleCloseModal,
      slcOptiosRows,
      columnsHistoryCese,
      rowsCeseHistory,
    };
  },
});
</script>
<style lang="scss" scoped>
@import './ModalCeseHistory.scss';
</style>
