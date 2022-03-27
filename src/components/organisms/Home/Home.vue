<template>
  <div class="o-home">
    <div class="o-home__cards">
      <m-home-card
        v-for="(item, index) in cards"
        :key="index"
        :title="item.title"
        :text="item.text"
        :icon="item.icon"
        :background="item.background"
      />
    </div>

    <div class="o-home__chart">
      <div class="o-home__chart__header">
        <h2 class="o-home__chart__header__title">Tareos registrados</h2>
      </div>

      <div class="o-home__chart__body">
        <div class="o-home__chart__body__filters">
          <q-select
            v-model="optionSede"
            outlined
            :options="[{ label: 'TODAS', id_sede: 'T' }, ...sedes]"
            dense
            class="ellipsis"
          />
          <q-input outlined type="date" dense v-model="dateTo">
            <template #appent>
              <q-icon name="date" />
            </template>
          </q-input>
          <q-input outlined type="date" dense v-model="dateFrom">
            <template #appent>
              <q-icon name="date" />
            </template>
          </q-input>
          <q-btn label="Generar" color="green" @click="handleSelectTareos" />
        </div>

        <div class="o-home__chart__body__graphic">
          <Vue3ChartJs
            ref="refChartTareo"
            height="300px"
            :id="tareoChart.id"
            :type="tareoChart.type"
            :data="tareoChart.data"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, PropType } from 'vue';
import MHomeCard from 'components/molecules/HomeCard';
import Vue3ChartJs from '@j-t-mcc/vue3-chartjs';
import { IResponseFetch, ISede, ITareo } from 'src/types';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';

/* #region Interfaces */
interface ICardBank {
  title: string;
  icon: string;
  text: string;
  background: string;
  to: string;
}

interface IChartVue {
  update: () => void;
}
/* #endregion */

export default defineComponent({
  name: 'OHome',
  components: {
    MHomeCard,
    // eslint-disable-next-line
    Vue3ChartJs,
  },
  props: {
    cards: {
      type: Array as PropType<ICardBank[]>,
      default: () => [],
    },
    sedes: {
      type: Array as PropType<ISede[]>,
      default: () => [],
    },
  },
  setup() {
    const optionSede = ref({ label: 'TODAS', id_sede: 'T' });
    const dateTo = ref<string>('');
    const dateFrom = ref<string>('');
    const refChartTareo = ref<IChartVue | null>(null);

    const tareoChart = ref({
      id: 'line-chart',
      type: 'line',
      data: {
        labels: [] as string[],
        datasets: [
          {
            data: [] as string[],
            label: 'Cantidad de Tareos',
          },
        ],
      },
    });

    const handleSelectTareos = async () => {
      const tareos = await fetchRequestAPI({
        method: 'POST',
        url: 'adm/api/dashboard/linea-tareo',
        body: JSON.stringify({
          fechaFin: dateFrom.value || 'T',

          fechaInicio: dateTo.value || 'T',
          sede: optionSede.value ? optionSede.value.id_sede : 'T',
        }),
      });

      if (
        readErrorFetch({ responseFetch: tareos, message: 'Ocurrio un error!' })
      ) {
        return;
      }
      const counts = ((tareos as IResponseFetch).data as ITareo[]).map(
        (tareo) => tareo.CANTIDAD
      );
      const dates = ((tareos as IResponseFetch).data as ITareo[]).map(
        (tareo) => tareo.FECHA
      );

      tareoChart.value.data.labels = dates || [];
      tareoChart.value.data.datasets[0].data = counts || [];
      (refChartTareo.value as IChartVue).update();
    };

    return {
      optionSede,
      tareoChart,
      dateTo,
      dateFrom,
      refChartTareo,
      handleSelectTareos,
    };
  },
});
</script>

<style lang="scss" scoped>
@import './Home.scss';
</style>
