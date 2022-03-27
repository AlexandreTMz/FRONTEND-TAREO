<template>
  <q-dialog :model-value="isOpenModal" persistent>
    <q-card class="m-modalCeseCancel">
      <div class="m-modalCeseCancel__header">
        <h2 class="m-modalCeseCancel__header__title">Anular Cese</h2>
      </div>
      <div class="m-modalCeseCancel__body">
        <q-form
          class="m-modalCeseCancel__body__form"
          @submit.prevent="mtd_postAnularCese"
        >
          <a-form-label label="Empleado" :isStrong="true">
            {{ CeseEmployeeCancel.datos }}
          </a-form-label>

          <a-form-label label="Tipo de cese" :isStrong="true">
            {{ CeseEmployeeCancel?.mo_nombre }}
          </a-form-label>

          <a-form-label
            label="Motivo del cese"
            :isStrong="true"
            v-if="CeseEmployeeCancel?.ce_motivo !== ''"
          >
            {{ CeseEmployeeCancel?.ce_motivo }}
          </a-form-label>

          <a-form-label label="Fecha de cese" :isStrong="true">
            {{ CeseEmployeeCancel?.ce_fecha_cese }}
          </a-form-label>

          <div class="m-modalCeseCancel__body__form__actions">
            <q-btn
              class="m-modalCeseCancel__body__form__actions__button"
              label="Anular Cese"
              color="primary"
              type="submit"
            />
            <q-btn
              class="m-modalCeseCancel__body__form__actions__button"
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
import { ICeseEmployee } from 'src/types';
import { MESSAGE_ANULAR, MESSAGE_ERROR } from 'src/utils/messages';
import { getCreateUserTrack } from 'src/utils/userTrack';

interface ISelectForm {
  label: string;
  value: number;
}

export default defineComponent({
  name: 'MModalCeseCancel',
  components: {
    AFormLabel,
  },
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
  setup(props, { emit }) {
    const userTrack = getCreateUserTrack();
    const slcOptionCese = ref<ISelectForm>({
      label: 'Despido arbitrario',
      value: 1,
    });

    const slcOptiosRows: ISelectForm[] = [
      { label: 'Despido arbitrario', value: 1 },
      { label: 'Renuncia voluntaria', value: 2 },
    ];

    const handleCloseModal = () => {
      emit('close-modal');
    };

    const mtd_postAnularCese = async () => {
      const resAnular = await fetchRequestAPI({
        method: 'POST',
        url: '/adm/api/empleado/cese/anular',
        body: JSON.stringify({
          id_cese: props.CeseEmployeeCancel.id_cese,
          ...userTrack,
        }),
      });

      if (
        readErrorFetch({
          responseFetch: resAnular,
          message: MESSAGE_ERROR(),
        })
      ) {
        return;
      }

      MessageSuccess({
        title: MESSAGE_ANULAR('el cese del empleado'),
      });

      emit('close-modal');
      props.handleForm();
    };

    return {
      mtd_postAnularCese,
      handleCloseModal,
      slcOptionCese,
      slcOptiosRows,
    };
  },
});
</script>
<style lang="scss" scoped>
@import './ModalCeseCancel.scss';
</style>
