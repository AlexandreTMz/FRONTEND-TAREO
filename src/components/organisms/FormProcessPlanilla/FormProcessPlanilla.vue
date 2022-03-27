<template>
  <div class="o-formProcessPlanilla">
    <div
      class="o-formProcessPlanilla__wraper o-formProcessPlanilla__wraper--center o-formProcessPlanilla__wraper--sm"
    >
      <div class="o-formProcessPlanilla__header">Registro de sede</div>
      <q-form
        class="o-formProcessPlanilla__form"
        ref="form"
        @submit.prevent="mtd_processPlanilla"
      >
        <div class="o-formProcessPlanilla__box">
          <div class="o-formProcessPlanilla__inputGroups">
            <q-select
              label="Sede"
              filled
              dense
              v-model="filterSlcCampus"
              :options="optionsCampus"
            >
              <template color="primary" v-slot:prepend>
                <q-icon color="primary" name="fas fa-clipboard-check"></q-icon>
              </template>
            </q-select>
            <q-select
              label="Mes"
              filled
              dense
              v-model="filterSlcMonth"
              :options="optionsMonth"
            >
              <template color="primary" v-slot:prepend>
                <q-icon color="primary" name="fas fa-clipboard-check"></q-icon>
              </template>
            </q-select>
            <q-select
              label="Año"
              filled
              dense
              v-model="filterSlcYear"
              :options="optionsYear"
            >
              <template color="primary" v-slot:prepend>
                <q-icon color="primary" name="fas fa-clipboard-check"></q-icon>
              </template>
            </q-select>
            <q-select
              label="Periodo"
              filled
              dense
              v-model="filterSlcPerido"
              :options="optionsPeriodo"
            >
              <template color="primary" v-slot:prepend>
                <q-icon color="primary" name="fas fa-clipboard-check"></q-icon>
              </template>
            </q-select>
          </div>
          <div class="o-formProcessPlanilla__inputGroups">
            <q-select
              label="Re-procesar"
              filled
              dense
              v-model="filterSlcReProcess"
              :options="optionsReproceso"
            >
              <template color="primary" v-slot:prepend>
                <q-icon color="primary" name="fas fa-clipboard-check"></q-icon>
              </template>
            </q-select>
          </div>
          <div class="o-formProcessPlanilla__inputGroups">
            <q-btn
              label="Procesar planilla"
              color="green"
              type="submit"
            ></q-btn>
          </div>
        </div>
      </q-form>
    </div>
  </div>
</template>

<script lang="ts">
import { QForm } from 'quasar';
import { ISede } from 'src/types';
import { fetchRequestAPI } from 'src/utils/axios';
import { MessageError } from 'src/utils/swal';
import { defineComponent, ref, onMounted } from 'vue';

// #region interface
interface IProcessPlanillaForm {
  mes: string;
  anio: string;
  sede: number;
  periodo: number;
  reproceso: number;
}
interface ISelecetForm {
  value: string;
  label: string;
}
interface IResponseMessage {
  msg: string;
}
// #endregion

export default defineComponent({
  name: 'OFormProcessPlanilla',
  setup() {
    // #region declares
    const optionsMonth = [
      { label: 'Enero', value: '01' },
      { label: 'Febrero', value: '02' },
      { label: 'Marzo', value: '03' },
      { label: 'Abril', value: '04' },
      { label: 'Mayo', value: '05' },
      { label: 'Junio', value: '06' },
      { label: 'Julio', value: '07' },
      { label: 'Agosto', value: '08' },
      { label: 'Setiembre', value: '09' },
      { label: 'Octubre', value: '10' },
      { label: 'Noviembre', value: '11' },
      { label: 'Diciembre', value: '12' },
    ];
    const optionsYear = [
      { label: '2021', value: '2020' },
      { label: '2022', value: '2022' },
      { label: '2023', value: '2023' },
    ];
    const optionsPeriodo = [
      { label: '1 Quincena', value: 1 },
      { label: '2 Quincena', value: 2 },
    ];
    const optionsReproceso = [
      { label: 'No', value: 1 },
      { label: 'Si', value: 2 },
    ];
    const filterSlcCampus = ref<ISelecetForm>();
    const filterSlcMonth = ref<ISelecetForm>();
    const filterSlcYear = ref<ISelecetForm>({ label: '2022', value: '2022' });
    const filterSlcPerido = ref<ISelecetForm>({
      label: '1 Quincena',
      value: '1',
    });
    const filterSlcReProcess = ref<ISelecetForm>({ label: 'No', value: '1' });
    const optionsCampus = ref<ISelecetForm[]>([]);
    const form = ref<QForm>();
    // #endregion

    // #region methods
    const mtd_asyncGetCampus = async () => {
      const resSede = (await fetchRequestAPI({
        url: '/adm/api/sede',
        method: 'GET',
      })) as boolean | ISede[];

      if (!resSede) {
        MessageError({ title: 'Ocurrió un error' });
      }
      optionsCampus.value = (resSede as ISede[]).map((e: ISede) => ({
        value: e.id_sede,
        label: e.se_descripcion,
      }));
      filterSlcCampus.value = optionsCampus?.value[0];
    };

    const mtd_processPlanilla = async () => {
      try {
        const processPlanillaForm: IProcessPlanillaForm = {
          mes: String(filterSlcMonth.value?.value),
          anio: String(filterSlcYear.value?.value),
          sede: Number(filterSlcCampus.value?.value),
          periodo: Number(filterSlcPerido.value?.value),
          reproceso: Number(filterSlcReProcess.value?.value),
        };

        const processPlanilla = (await fetchRequestAPI({
          url: '/adm/procesar/planilla/api',
          method: 'POST',
          body: JSON.stringify(processPlanillaForm),
        })) as boolean | IResponseMessage;

        if (!processPlanilla) {
          MessageError({ title: 'Ocurrió un error' });
        }
      } catch (e: IResponseMessage | unknown) {}
    };
    // #endregion

    onMounted(async () => {
      await mtd_asyncGetCampus();
    });

    return {
      optionsCampus,
      optionsMonth,
      optionsYear,
      optionsPeriodo,
      optionsReproceso,
      filterSlcCampus,
      filterSlcMonth,
      filterSlcYear,
      filterSlcPerido,
      filterSlcReProcess,
      mtd_processPlanilla,
      form,
    };
  },
});
</script>

<style lang="scss" scoped>
@import url('./FormProcessPlanilla.scss');
</style>
