<template>
  <div>
    <q-dialog :model-value="isOpenModal" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Editar tareo</div>
        </q-card-section>
        <q-separator></q-separator>

        <q-card-section style="max-height: 50vh" class="scroll">
          <div class="o-formEditTareoEmployee">
            <div
              class="o-formEditTareoEmployee__wraper o-formEditTareoEmployee__wraper--center o-formEditTareoEmployee__wraper--sm"
            >
              <q-form
                class="o-formEditTareoEmployee__form"
                ref="form"
                @submit.prevent="handleForm"
              >
                <div class="o-formEditTareoEmployee__box">
                  <div class="o-formEditTareoEmployee__inputGroups">
                    <q-input
                      label="Empleado"
                      filled
                      dense
                      type="text"
                      v-model="employeeData.datos"
                      disable
                    >
                      <template v-slot:prepend>
                        <q-icon color="primary" name="fas fa-map-signs" />
                      </template>
                    </q-input>
                  </div>
                  <div class="o-formEditTareoEmployee__inputGroups">
                    <q-input
                      label="Fecha de ingreso"
                      filled
                      dense
                      type="date"
                      disable
                      v-model="employeeData.fecha_ingreso"
                    >
                      <template v-slot:prepend>
                        <q-icon color="primary" name="fas fa-map-signs" />
                      </template>
                    </q-input>
                    <q-input
                      label="Hora de ingreso"
                      filled
                      dense
                      type="text"
                      disable
                      v-model="employeeData.hora_ingreso"
                    >
                      <template v-slot:prepend>
                        <q-icon color="primary" name="fas fa-map-signs" />
                      </template>
                    </q-input>
                  </div>
                  <div class="o-formEditTareoEmployee__inputGroups">
                    <q-select
                      label="Estado"
                      filled
                      dense
                      v-model="state"
                      :options="optionsState"
                    >
                      <template color="primary" v-slot:prepend>
                        <q-icon
                          color="primary"
                          name="fas fa-clipboard-check"
                        ></q-icon>
                      </template>
                    </q-select>
                  </div>
                  <div class="o-formEditTareoEmployee__inputGroups">
                    <q-btn
                      label="Guardar cambios"
                      color="green"
                      type="submit"
                      :disable="!can('Editar', 'Tareo')"
                    ></q-btn>
                    <q-btn
                      label="Eliminar"
                      color="red"
                      type="submit"
                      :disable="!can('Eliminar', 'Tareo')"
                      @click.prevent="mtd_eliminarTareo"
                    ></q-btn>
                    <q-btn
                      label="Cerrar"
                      @click="mtd_close"
                      color="primary"
                    ></q-btn>
                  </div>
                </div>
              </q-form>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { ITareoEmpleado } from 'src/types';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';
import {
  MESSAGE_EDITAR,
  MESSAGE_ELIMINAR,
  MESSAGE_ERROR,
} from 'src/utils/messages';
import { MessageSuccess } from 'src/utils/swal';
import { defineComponent, ref, PropType, computed, onMounted } from 'vue';
import { can } from 'src/utils/permission';
import { getCreateUserTrack } from 'src/utils/userTrack';

export default defineComponent({
  props: {
    isOpenModal: {
      type: Boolean,
      default: false,
    },
    employeeEdit: {
      type: Object as PropType<ITareoEmpleado>,
      default: null,
    },
    mtd_handleSearchTareoEmployee: {
      type: Function,
      default: () => null,
    },
  },
  name: 'MEditTareoEmployee',
  setup(props, { emit }) {
    const optionsState = ['ACTIVO', 'INACTIVO'];
    const state = ref<string>(props.employeeEdit.estado2);
    const userTrack = getCreateUserTrack();
    const employeeData = computed(() => props.employeeEdit);

    const mtd_close = () => {
      emit('close-modal');
    };

    const mtd_eliminarTareo = async () => {
      const formData = {
        id_tareo: props.employeeEdit.id_tareo,
      };
      const employeeTareo = await fetchRequestAPI({
        url: '/adm/tareo/eliminar',
        method: 'POST',
        body: JSON.stringify({ ...formData, ...userTrack }),
      });

      if (
        readErrorFetch({
          responseFetch: employeeTareo,
          message: MESSAGE_ERROR(),
        })
      ) {
        return;
      }

      MessageSuccess({
        title: MESSAGE_ELIMINAR('el tareo'),
      });

      emit('mtd_handleSearchTareoEmployee');
      emit('close-modal');
    };

    const handleForm = async () => {
      const formData = {
        id_tareo: props.employeeEdit.id_tareo,
        ta_estado: state.value === 'ACTIVO' ? 1 : 0,
      };
      const employeeTareo = await fetchRequestAPI({
        url: '/adm/tareo/estado',
        method: 'POST',
        body: JSON.stringify({ ...formData, ...userTrack }),
      });

      if (
        readErrorFetch({
          responseFetch: employeeTareo,
          message: MESSAGE_ERROR(),
        })
      ) {
        return;
      }

      MessageSuccess({
        title: MESSAGE_EDITAR('el tareo'),
      });

      emit('mtd_handleSearchTareoEmployee');
      emit('close-modal');
    };

    onMounted(() => {
      console.log(props.employeeEdit, props.employeeEdit, employeeData);
    });

    return {
      mtd_close,
      handleForm,
      optionsState,
      state,
      employeeData,
      mtd_eliminarTareo,
      can,
    };
  },
});
</script>

<style lang="scss" scoped>
@import url('./EditTareoEmployee.scss');
</style>
