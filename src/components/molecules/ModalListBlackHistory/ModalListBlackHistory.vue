<template>
  <q-dialog :model-value="isOpenModalHistory" persistent>
    <q-card class="m-modalCeseHistoy">
      <div class="m-modalCeseHistoy__header">
        <h2 class="m-modalCeseHistoy__header__title">
          Historial de lista negra
        </h2>
      </div>
      <div class="m-modalCeseHistoy__body">
        <a-form-label label="Empleado" :isStrong="true">
          {{ EmployeeListBlack.datos }}
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
import { IListaNegra, IResponseFetch, IHistoryListBlack } from 'src/types';
import AFormLabel from 'components/atoms/FormLabel';

interface ISelectForm {
  label: string;
  value: number;
}

export default defineComponent({
  name: 'MModalListBlackHistory',
  props: {
    EmployeeListBlack: {
      type: Object as PropType<IListaNegra>,
      default: null,
    },
    isOpenModalHistory: {
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
        label: 'Fecha de lista negra',
        field: 'fechaCreacion',
        sortable: true,
        align: 'left',
        name: 'fechaCreacion',
      },
      {
        label: 'Motivo Lista negra',
        field: 'lis_motivo',
        sortable: true,
        align: true,
        name: 'lis_motivo',
      }
    ];

    const rowsCeseHistory = ref<IHistoryListBlack[]>([]);

    const slcOptiosRows: ISelectForm[] = [
      { label: 'Despido arbitrario', value: 1 },
      { label: 'Renuncia voluntaria', value: 2 },
    ];

    const handleCloseModal = () => {
      emit('close-modal-history');
    };

    const mtd_asyncGetHistoryCese = async () => {
      const resHistoryCese = (await fetchRequestAPI({
        url: `/adm/api/empleado/lista-negra/historial/${props.EmployeeListBlack.id_persona}`,
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
        ((resHistoryCese as IResponseFetch).data as IHistoryListBlack[]) || [];
    };

    onMounted(async () => {
      if (props.EmployeeListBlack) {
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
@import './ModalListBlackHistory.scss';
</style>
