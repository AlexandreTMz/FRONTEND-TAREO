<template>
  <div class="o-formRegisterHoliDays">
    <div
      class="o-formRegisterHoliDays__wraper o-formRegisterHoliDays__wraper--center o-formRegisterHoliDays__wraper--sm"
    >
      <div class="o-formRegisterHoliDays__header">Registro de feriados</div>
      <q-form
        class="o-formRegisterHoliDays__form"
        ref="form"
        @submit.prevent="mtd_handleRegisterHoliDays"
      >
        <div class="o-formRegisterHoliDays__box">
          <div class="o-formRegisterHoliDays__inputGroups">
            <q-input outlined type="date" dense v-model="date">
              <template v-slot:prepend>
                <q-icon color="primary" name="fas fa-calendar-alt" />
              </template>
            </q-input>
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
          <div class="o-formRegisterHoliDays__inputGroups">
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
          <div class="o-formRegisterHoliDays__inputGroups">
            <q-btn
              :label="id_holidays === 0 ? 'Registrar' : 'Editar'"
              color="green"
              type="submit"
            ></q-btn>
            <q-btn
              label="Limpiar"
              color="primary"
              @click="mtd_handleResetDataHoliDays"
            ></q-btn>
          </div>
        </div>
      </q-form>
    </div>

    <div
      class="o-formRegisterHoliDays__wraper o-formRegisterHoliDays__wraper--center o-formRegisterHoliDays__wraper--lg o-formRegisterHoliDays__wraper--marginTop"
    >
      <div class="o-formRegisterHoliDays__header">Lista de feriados</div>
      <div class="o-formRegisterHoliDays__box">
        <q-table
          flat
          :columns="columnsHoliDays"
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
                @click="mtd_editHoliDays(props.row)"
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
import { IFeriado } from 'src/types';
import {
  defineComponent,
  ref,
  reactive,
  PropType,
  computed,
  toRefs,
} from 'vue';

// #region interface
interface IHoliDaysForm {
  date: string;
  state: string;
  id_holidays: number;
  description: string;
}
// #endregion
export default defineComponent({
  name: 'OFormHoliDays',
  props: {
    rowsHoliDays: {
      type: Array as PropType<IFeriado[]>,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    // #region declares
    const columnsHoliDays = [
      {
        label: 'Descripcion',
        field: 'fe_descripcion',
        sortable: true,
        align: 'left',
        name: 'fe_descripcion',
      },
      {
        label: 'Dia',
        field: 'fe_dia',
        sortable: true,
        align: true,
        name: 'fe_dia',
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

    const holiDays = reactive<IHoliDaysForm>({
      date: '',
      state: '',
      id_holidays: 0,
      description: '',
    });
    // #endregion

    // #region methods
    const mtd_editHoliDays = (sedeEdit: IFeriado) => {
      holiDays.date = sedeEdit.fe_dia;
      holiDays.state = sedeEdit.estado;
      holiDays.description = sedeEdit.fe_descripcion;
      holiDays.id_holidays = Number(sedeEdit.id_feriado);
    };

    const mtd_handleResetDataHoliDays = () => {
      holiDays.date = '';
      holiDays.state = '';
      holiDays.description = '';
      holiDays.id_holidays = 0;
      (form.value as QForm).reset();
    };

    const mtd_handleRegisterHoliDays = () => {
      const holiDaysForm = {
        id_feriado: holiDays.id_holidays,
        fe_descripcion: holiDays.description,
        fe_dia: holiDays.date,
        fe_estado: holiDays.state === 'ACTIVO' ? 1 : 0,
      };

      if (holiDaysForm.id_feriado === 0) {
        emit('handHoliDays', {
          ...holiDaysForm,
          id_feriado: 0,
        });
      } else {
        emit('handHoliDays', {
          ...holiDaysForm,
          id_feriado: holiDays.id_holidays,
        });
      }
      mtd_handleResetDataHoliDays();
    };

    const holiDaysResFilter = computed(() => {
      return props.rowsHoliDays.filter((item) => {
        const joinData = `${item.fe_dia} ${item.fe_descripcion} ${item.fe_estado}`;
        return (
          joinData.toLowerCase().indexOf(search.value.toLowerCase()) !== -1
        );
      });
    });
    // #endregion
    return {
      columnsHoliDays,
      rows: holiDaysResFilter,
      optionsState,
      search,
      mtd_handleRegisterHoliDays,
      mtd_editHoliDays,
      mtd_handleResetDataHoliDays,
      ...toRefs(holiDays),
      holiDays,
      form,
    };
  },
});
</script>

<style lang="scss" scoped>
@import url('./FormRegisterHoliDays.scss');
</style>
