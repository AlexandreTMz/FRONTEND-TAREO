<template>
  <div class="t-home">
    <o-home :cards="cards" :sedes="sedesOptions" />
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import OHome from 'components/organisms/Home';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';
import { IResponseFetch, ISede } from 'src/types';

interface ICantidad {
  CANTIDAD: string;
}

export default defineComponent({
  name: 'THome',
  components: {
    OHome,
  },
  setup() {
    const cards = ref([
      {
        title: '0',
        icon: 'fas fa-user-plus',
        text: 'Empleados registrados',
        background: '#2780e3',
        to: '#',
      },
      {
        title: '0',
        icon: 'fas fa-pencil-ruler',
        text: 'Tareos registrados',
        background: '#9954bb',
        to: '#',
      },
      {
        title: '0',
        icon: 'fas fa-user-check',
        text: 'Empleados sin aprobar',
        background: '#ff0039',
        to: '#',
      },
      {
        title: '0.0%',
        icon: 'fas fa-chart-bar',
        text: 'Proximamente',
        background: '#3fb618',
        to: '#',
      },
    ]);
    const sedesOptions = ref<ISede[]>([]);

    onMounted(async () => {
      const countEmployess = await fetchRequestAPI({
        method: 'GET',
        url: 'adm/api/dashboard/empleados',
      });

      const countTareos = await fetchRequestAPI({
        method: 'GET',
        url: '/adm/api/dashboard/tareo',
      });

      const countUnapprovedEmployees = await fetchRequestAPI({
        method: 'GET',
        url: '/adm/api/dashboard/por-aprobar',
      });

      const sedes = await fetchRequestAPI({
        method: 'GET',
        url: '/adm/api/sede',
      });

      const message = 'Ocurrio un error!';

      if (
        readErrorFetch({ responseFetch: countEmployess, message }) ||
        readErrorFetch({ responseFetch: countTareos, message }) ||
        readErrorFetch({ responseFetch: countUnapprovedEmployees, message }) ||
        readErrorFetch({ responseFetch: sedes, message })
      ) {
        //AQUI IRA ALGUN MENSAJE DE ERROR PARA EL USUARIO
        return;
      }

      cards.value[0].title = (
        (countEmployess as IResponseFetch).data as ICantidad
      ).CANTIDAD;
      cards.value[1].title = (
        (countTareos as IResponseFetch).data as ICantidad
      ).CANTIDAD;
      cards.value[2].title = (
        (countUnapprovedEmployees as IResponseFetch).data as ICantidad
      ).CANTIDAD;

      sedesOptions.value = ((sedes as IResponseFetch).data as ISede[]).map(
        (sede) => ({
          ...sede,
          label: sede.datos,
        })
      );
    });
    return { cards, sedesOptions };
  },
});
</script>
