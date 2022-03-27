<template>
  <q-dialog :model-value="isOpenModalLog" persistent>
    <q-card class="m-modalListBlackEmployee">
      <div class="m-modalListBlackEmployee__header">
        <h2 class="m-modalListBlackEmployee__header__title">Auditoria</h2>
      </div>
      <div class="m-modalListBlackEmployee__body">
        <a-form-label label="Usuario creacion" :isStrong="true">
          {{ ILogTable.userCreacion }}
        </a-form-label>
        <a-form-label label="Fecha de creacion" :isStrong="true">
          {{ ILogTable.fechaCreacion }}
        </a-form-label>
        <a-form-label label="Usuario modificacion" :isStrong="true">
          {{ ILogTable.userModificacion }}
        </a-form-label>
        <a-form-label label="Fecha Modificacion" :isStrong="true">
          {{ ILogTable.fechaModificacion }}
        </a-form-label>

        <br />
        <div class="m-modalListBlackEmployee__body__form__actions">
          <q-btn
            class="m-modalListBlackEmployee__body__form__actions__button"
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
import { defineComponent } from 'vue';
import AFormLabel from 'components/atoms/FormLabel';

export default defineComponent({
  name: 'MModalLogTable',
  components: {
    AFormLabel,
  },
  props: {
    isOpenModalLog: {
      type: Boolean,
      default: false,
    },
    ILogTable: {
      type: Object,
      default: null,
    },
  },
  setup(props, { emit }) {
    const handleCloseModal = () => { 
      emit('mtd_closeModalLog');
    };
    return {
      handleCloseModal,
    };
  },
});
</script>
<style lang="scss" scoped>
@import './ModalLogTables.scss';
</style>
