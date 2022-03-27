<template>
  <q-dialog :model-value="isOpenModal" persistent>
    <q-card class="m-modalCeseEmployee">
      <div class="m-modalCeseEmployee__header">
        <h2 class="m-modalCeseEmployee__header__title">Generar Cese</h2>
      </div>
      <div class="m-modalCeseEmployee__body">
        <q-form
          class="m-modalCeseEmployee__body__form"
          @submit.prevent="mtd_RegisterCese"
        >
          <a-form-label label="Empleado" :isStrong="true">
            {{ idEmployee.datos }}
          </a-form-label>

          <a-form-label label="Motivo del cese" :isStrong="true">
            <q-select
              v-model="slcOptionTypeCese"
              :options="slcOptionsTypesCese"
              option-label="mo_nombre"
              option-value="id_motivo"
            ></q-select>
          </a-form-label>

          <a-form-label label="Motivo del cese" :isStrong="true">
            <q-input
              type="textarea"
              filled
              dense
              v-model="reasonCese"
            ></q-input>
          </a-form-label>

          <a-form-label label="Fecha de cese" :isStrong="true">
            <q-input type="date" dense filled v-model="dateCese"></q-input>
          </a-form-label>

          <q-toggle
            v-model="addListBlack"
            label="¿Añadir a la lista negra?"
          ></q-toggle>

          <div class="m-modalCeseEmployee__body__form__actions">
            <q-btn
              class="m-modalCeseEmployee__body__form__actions__button"
              label="Generar Cese"
              color="primary"
              type="submit"
            />
            <q-btn
              class="m-modalCeseEmployee__body__form__actions__button"
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
import { defineComponent, ref, onMounted, PropType } from 'vue';
import AFormLabel from 'components/atoms/FormLabel';
import { getDateYYYMMDD } from 'src/utils/date';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';
import {
  MessageConfirmation,
  MessageError,
  MessageSuccess,
} from 'src/utils/swal';
import { ICeseEmployee, IResponseFetch, ITiposMotivo } from 'src/types';
import { useStore } from 'src/store';
import { MESSAGE_ERROR, MESSAGE_REGISTRO } from 'src/utils/messages';
import { getCreateUserTrack } from 'src/utils/userTrack';

interface IFormCese {
  id_persona: string;
  id_motivo: string;
  fecha_cese: string;
  motivoCese: string;
  listaNegra: number;
}

export default defineComponent({
  name: 'MModalCeseEmployee',
  components: {
    AFormLabel,
  },
  props: {
    idEmployee: {
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
  setup(props, { emit }) {
    const addListBlack = ref(false);
    const dateCese = ref(getDateYYYMMDD());
    const reasonCese = ref('');
    const slcOptionTypeCese = ref<ITiposMotivo>();
    const userTrack = getCreateUserTrack();
    const { commit } = useStore();

    const slcOptionsTypesCese = ref<ITiposMotivo[]>([]);

    const mtd_ValidarRegistroCese = async () => {
      if (String(slcOptionTypeCese?.value?.id_motivo) === '3') {
        if (Number(props.idEmployee.ce_cantidad) > 0) {
          MessageError({
            text: '¡Esta persona ya cuenta con un historial de cese, esta acción no puede ser realizada!',
          });
          return;
        } else {
          const objL_msgConfirmacion = await MessageConfirmation({
            text: '¿Esta seguro de realizar este cese con este motivo?, luego no podra vizualisar al empleado en este modulo',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'cancel',
            showCancelButton: true,
          });

          if (objL_msgConfirmacion.isConfirmed) {
            //return;
            void mtd_RegisterCese();
          }
        }
      }

      void mtd_RegisterCese();
    };

    const mtd_RegisterCese = async () => {
      commit('commitLoading', true);

      const dateAdmission = new Date(
        String(dateCese.value).split('-').join('/')
      );
      const dateValidation = new Date(getDateYYYMMDD().split('-').join('/'));
      const lastDayOfMonth = new Date(
        dateValidation.getFullYear(),
        dateValidation.getMonth() + 1 + 1,
        0
      );

      if (dateAdmission > lastDayOfMonth) {
        MessageError({
          text: 'La fecha ingresada debe ser menor o igual, que el fin del siguiente mes de la fecha actual.',
        });
        commit('commitLoading', false);
        return;
      }

      const dataCese: IFormCese = {
        id_persona: props.idEmployee.id_persona,
        fecha_cese: dateCese.value,
        id_motivo: String(slcOptionTypeCese?.value?.id_motivo),
        motivoCese: reasonCese.value,
        listaNegra: addListBlack.value ? 1 : 0,
      };

      const registerCese = await fetchRequestAPI({
        url: '/adm/api/cese',
        method: 'POST',
        body: JSON.stringify({ ...dataCese, ...userTrack }),
      });

      if (
        readErrorFetch({
          responseFetch: registerCese,
          message: MESSAGE_ERROR(),
        })
      ) {
        commit('commitLoading', false);
        return;
      }

      emit('close-modal');
      addListBlack.value = false;
      reasonCese.value = '';
      dateCese.value = getDateYYYMMDD();
      //slcOptionTypeCese.value = slcOptionsTypesCese[0] as ITiposMotivo;

      MessageSuccess({
        title: MESSAGE_REGISTRO('el cese del empleado'),
      });
      props.handleForm();
      commit('commitLoading', false);
    };

    const mtd_GetListOptiosCese = async () => {
      const resOptionsCese = await fetchRequestAPI({
        method: 'GET',
        url: '/adm/api/motivos-cese',
      });

      if (
        readErrorFetch({
          responseFetch: resOptionsCese,
          message: MESSAGE_ERROR(),
        })
      ) {
        return;
      }

      slcOptionsTypesCese.value = (resOptionsCese as IResponseFetch)
        .data as ITiposMotivo[];
      slcOptionTypeCese.value = slcOptionsTypesCese.value[0];
    };

    const handleCloseModal = () => {
      emit('close-modal');
    };

    onMounted(async () => {
      await mtd_GetListOptiosCese();
    });

    return {
      addListBlack,
      dateCese,
      reasonCese,
      mtd_RegisterCese,
      handleCloseModal,
      slcOptionTypeCese,
      slcOptionsTypesCese,
      mtd_ValidarRegistroCese,
    };
  },
});
</script>
<style lang="scss" scoped>
@import './ModalCeseEmployee.scss';
</style>
