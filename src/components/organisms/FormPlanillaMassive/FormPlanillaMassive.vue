<template>
  <div class="o-formProcessPlanilla">
    <div
      class="o-formProcessPlanilla__wraper o-formProcessPlanilla__wraper--center o-formProcessPlanilla__wraper--sm"
    >
      <div class="o-formProcessPlanilla__header">Cambio Masivo</div>
      <q-form
        class="o-formProcessPlanilla__form"
        ref="form"
        @submit.prevent="mtd_handlePlanillaMassive"
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

            <q-input
              label="Fecha nueva"
              filled
              dense
              v-model="filterFechaFin"
              stack-label
              type="date"
            >
              <template v-slot:prepend>
                <q-icon color="primary" name="fas fa-clipboard-check"></q-icon>
              </template>
            </q-input>
          </div>
          <div class="o-formProcessPlanilla__contentAdditional">
            <strong>Descripcion:</strong>
            <br />
            Este módulo le permite ampliar la fecha de vigencia del sueldo del
            empleado de manera masiva, de esta manera se evitará realizarlo
            persona por persona.
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
import { IResponseFetch, ISede } from 'src/types';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';
import { defineComponent, ref, onMounted } from 'vue';

interface ISelecetForm {
  value: string;
  label: string;
}

interface IPlanillaMassiveForm {
  id_sede: number;
  fecha: string;
}

export default defineComponent({
  name: 'OFormPlanillaMassive',
  setup(props, { emit }) {
    // #region declares
    const filterSlcCampus = ref<ISelecetForm>();
    const optionsCampus = ref<ISelecetForm[]>([]);
    const filterFechaFin = ref<string>();
    // #endregion

    // #region methods
    const mtd_asyncGetCampus = async () => {
      const resSede = await fetchRequestAPI({
        url: '/adm/api/sede',
        method: 'GET',
      });

      if (
        readErrorFetch({
          responseFetch: resSede,
          message: 'Ocurrió un error',
        })
      ) {
        return;
      }

      optionsCampus.value = ((resSede as IResponseFetch).data as ISede[]).map(
        (e: ISede) => ({
          value: e.id_sede,
          label: e.se_descripcion,
        })
      );
      filterSlcCampus.value = optionsCampus?.value[0];
    };

    const mtd_handlePlanillaMassive = () => {
      const planillaMassiveForm: IPlanillaMassiveForm = {
        id_sede: Number(filterSlcCampus.value?.value),
        fecha: String(filterFechaFin.value),
      };
      emit('handPlanillaMassive', planillaMassiveForm);
    };
    // #endregion

    onMounted(async () => {
      await mtd_asyncGetCampus();
    });

    return {
      optionsCampus,
      filterSlcCampus,
      mtd_handlePlanillaMassive,
      filterFechaFin,
    };
  },
});
</script>

<style lang="scss" scoped>
@import url('./FormPlanillaMassive.scss');
</style>
