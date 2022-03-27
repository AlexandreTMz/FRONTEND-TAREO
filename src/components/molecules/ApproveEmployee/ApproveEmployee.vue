<template>
  <div>
    <q-dialog :model-value="isOpenModal" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Registrar su sueldo!</div>
        </q-card-section>
        <q-separator></q-separator>

        <q-card-section style="max-height: 50vh" class="scroll">
          <div class="o-formRegisterApproveEmployee">
            <div
              class="o-formRegisterApproveEmployee__wraper o-formRegisterApproveEmployee__wraper--center o-formRegisterApproveEmployee__wraper--sm"
            >
              <q-form
                class="o-formRegisterApproveEmployee__form"
                ref="form"
                @submit.prevent="handleForm"
              >
                <div class="o-formRegisterApproveEmployee__box">
                  <div class="o-formRegisterApproveEmployee__inputGroups">
                    <q-input
                      label="Sueldo básico"
                      filled
                      dense
                      type="number"
                      v-model="basicSalary"
                      :rules="[
                        (val) =>
                          (val && val > 0) || 'El sueldo es obligatorio ',
                      ]"
                      @update:model-value="handleChangeMinimumWage"
                    >
                      <template v-slot:prepend>
                        <q-icon color="primary" name="fas fa-map-signs" />
                      </template>
                    </q-input>
                    <q-input
                      label="Asignación familiar"
                      filled
                      dense
                      type="number"
                      v-model="householdAllowance"
                      @update:model-value="handleChanghouseholdAllowance"
                    >
                      <template v-slot:prepend>
                        <q-icon color="primary" name="fas fa-map-signs" />
                      </template>
                    </q-input>
                  </div>
                  <div class="o-formRegisterApproveEmployee__inputGroups">
                    <q-input
                      label="Bonificación"
                      filled
                      dense
                      type="number"
                      v-model="bonus"
                      @update:model-value="handleChangeBonus"
                    >
                      <template v-slot:prepend>
                        <q-icon color="primary" name="fas fa-map-signs" />
                      </template>
                    </q-input>
                    <q-input
                      label="Movilidad"
                      filled
                      dense
                      type="number"
                      v-model="mobility"
                      @update:model-value="handleChangeMobility"
                    >
                      <template v-slot:prepend>
                        <q-icon color="primary" name="fas fa-map-signs" />
                      </template>
                    </q-input>
                  </div>
                  <div class="o-formRegisterApproveEmployee__inputGroups">
                    <q-input
                      label="Alimentos"
                      filled
                      dense
                      type="number"
                      v-model="food"
                      @update:model-value="handleChangeFood"
                    >
                      <template v-slot:prepend>
                        <q-icon color="primary" name="fas fa-map-signs" />
                      </template>
                    </q-input>
                    <q-input
                      label="Sueldo total"
                      filled
                      dense
                      :disable="true"
                      type="number"
                      v-model="totalSalary"
                    >
                      <template v-slot:prepend>
                        <q-icon color="primary" name="fas fa-map-signs" />
                      </template>
                    </q-input>
                  </div>
                  <div class="o-formRegisterApproveEmployee__inputGroups">
                    <q-btn label="Agregar" color="green" type="submit"></q-btn>
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
import { IEmployeeApprove } from 'src/types';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';
import { isValidNumber } from 'src/utils/numbers';
import { MessageSuccess } from 'src/utils/swal';
import { defineComponent, reactive, toRefs, computed, PropType } from 'vue';

interface IFormSalary {
  householdAllowance: number;
  bonus: number;
  mobility: number;
  food: number;
  id_sueldo: null | string;
  basicSalary: number;
  ta_total: string;
  id_persona: string;
}

export default defineComponent({
  props: {
    isOpenModal: {
      type: Boolean,
      default: false,
    },
    employeeEdit: {
      type: Object as PropType<IEmployeeApprove>,
      default: null,
    },
    mtd_searchAproveEmployee: {
      type: Function,
    },
  },
  name: 'MApproveEmployee',
  setup(props, { emit }) {
    const formApproveEmployee = reactive<IFormSalary>({
      basicSalary: 0,
      householdAllowance: 0,
      bonus: 0,
      mobility: 0,
      food: 0,
      id_sueldo: '0',
      id_persona: '0',
      ta_total: '0',
    });

    const mtd_close = () => {
      emit('close-modal');
    };

    const totalSalary = computed(() => {
      const { basicSalary, householdAllowance, bonus, mobility, food } =
        formApproveEmployee;

      const totalSum =
        Number(basicSalary || 0) +
        Number(householdAllowance || 0) +
        Number(bonus || 0) +
        Number(mobility || 0) +
        Number(food || 0);

      return totalSum.toFixed(2);
    });

    const handleForm = async () => {
      const employeeApprove = await fetchRequestAPI({
        url: '/adm/api/empleado/sueldo',
        method: 'POST',
        body: JSON.stringify({
          ...formApproveEmployee,
          ...{
            id_sueldo: props.employeeEdit.id_sueldo,
            ta_total: String(totalSalary.value),
            id_persona: props.employeeEdit.id_persona,
          },
        }),
      });

      if (
        readErrorFetch({
          responseFetch: employeeApprove,
          message: 'Ocurrió un error',
        })
      ) {
        return;
      }

      MessageSuccess({
        title: 'Empleado ha sido aprobado',
      });

      emit('mtd_searchAproveEmployee');
      emit('close-modal');
      //await mtd_asyncGetCampus();
    };

    const handleChangeMinimumWage = (value: number) => {
      if (isValidNumber(value)) {
        formApproveEmployee.basicSalary = !value
          ? value
          : Number(Number(value).toFixed(2));
      }
    };
    const handleChanghouseholdAllowance = (value: number) => {
      if (isValidNumber(value)) {
        formApproveEmployee.householdAllowance = !value
          ? value
          : Number(Number(value).toFixed(2));
      }
    };
    const handleChangeBonus = (value: number) => {
      if (isValidNumber(value)) {
        formApproveEmployee.bonus = !value
          ? value
          : Number(Number(value).toFixed(2));
      }
    };
    const handleChangeMobility = (value: number) => {
      if (isValidNumber(value)) {
        formApproveEmployee.mobility = !value
          ? value
          : Number(Number(value).toFixed(2));
      }
    };
    const handleChangeFood = (value: number) => {
      if (isValidNumber(value)) {
        formApproveEmployee.food = !value
          ? value
          : Number(Number(value).toFixed(2));
      }
    };

    return {
      mtd_close,
      ...toRefs(formApproveEmployee),
      handleForm,
      totalSalary,
      handleChangeMinimumWage,
      handleChanghouseholdAllowance,
      handleChangeBonus,
      handleChangeMobility,
      handleChangeFood,
    };
  },
});
</script>

<style lang="scss" scoped>
@import url('./ApproveEmployee.scss');
</style>
