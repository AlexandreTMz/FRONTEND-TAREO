<template>
  <q-dialog :model-value="isOpenModal" persistent>
    <q-card class="m-modalListBlackEmployee">
      <div class="m-modalListBlackEmployee__header">
        <h2 class="m-modalListBlackEmployee__header__title">
          Eliminar de lista negra
        </h2>
      </div>
      <div class="m-modalListBlackEmployee__body">
        <q-form
          class="m-modalListBlackEmployee__body__form"
          @submit.prevent="mtd_quitarListaNegra"
        >
          <a-form-label label="Empleado" :isStrong="true">
            {{ idListBlack.datos }}
          </a-form-label>

          <a-form-label label="Fecha:" :isStrong="true">
            {{ idListBlack.fechaCreacion.substring(0, 10) }}
          </a-form-label>
          <a-form-label label="Motivo de la anulación" :isStrong="true">
            <q-input
              type="textarea"
              filled
              dense
              v-model="reasonListBlack"
            ></q-input>
          </a-form-label>
          <a-form-label label="Ingrese contraseña" :isStrong="true">
            <q-input type="text" filled dense v-model="contrasenia"></q-input>
          </a-form-label>

          <div class="m-modalListBlackEmployee__body__form__actions">
            <q-btn
              class="m-modalListBlackEmployee__body__form__actions__button"
              label="Eliminar de lista"
              color="primary"
              type="submit"
            />
            <q-btn
              class="m-modalListBlackEmployee__body__form__actions__button"
              label="Cancelar"
              color="negative"
              @click="handleCloseModal"
            />
          </div>
        </q-form>
      </div>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue';
import AFormLabel from 'components/atoms/FormLabel';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';
import { MessageSuccess } from 'src/utils/swal';
import { IListaNegra } from 'src/types';
import { MESSAGE_ERROR, MESSAGE_LISTANEGRA_ANULADO } from 'src/utils/messages';
import { getCreateUserTrack } from 'src/utils/userTrack';

interface IFormListBlack {
  contrasenia: string;
  id_lista: string;
  ls_motivo: string;
}

export default defineComponent({
  name: 'MModalCeseEmployee',
  components: {
    AFormLabel,
  },
  props: {
    idListBlack: {
      type: Object as PropType<IListaNegra>,
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
  setup(props, { emit }) {
    const contrasenia = ref('');
    const reasonListBlack = ref('');
    const userTrack = getCreateUserTrack();

    const mtd_quitarListaNegra = async () => {
      const dataListBlack: IFormListBlack = {
        id_lista: props.idListBlack.id_lista,
        contrasenia: contrasenia.value,
        ls_motivo: reasonListBlack.value,
      };

      const resListBlack = await fetchRequestAPI({
        url: '/adm/quitar/lista-negra',
        method: 'POST',
        body: JSON.stringify({ ...dataListBlack, ...userTrack }),
      });

      if (
        readErrorFetch({
          responseFetch: resListBlack,
          message: MESSAGE_ERROR(),
        })
      ) {
        return;
      }

      emit('close-modal');
      contrasenia.value = '';
      reasonListBlack.value = '';
      MessageSuccess({
        title: MESSAGE_LISTANEGRA_ANULADO('al empleado'),
      });

      await props.handleForm();
    };

    const handleCloseModal = () => {
      emit('close-modal');
    };

    return {
      contrasenia,
      mtd_quitarListaNegra,
      handleCloseModal,
      reasonListBlack,
    };
  },
});
</script>
<style lang="scss" scoped>
@import './ModalListBlackEmployee.scss';
</style>
