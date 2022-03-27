<template>
  <div class="m-tableHistorySalary">
    <q-form
      ref="formTableHistorySalary"
      class="m-tableHistorySalary__form"
      @submit.prevent="handleForm"
    >
      <div class="m-tableHistorySalary__form__separator">
        <h3 class="m-tableHistorySalary__form__separator__title">Sueldo</h3>
        <q-separator />
      </div>
      <div class="m-tableHistorySalary__form__inputGroup">
        <q-input
          type="date"
          stack-label
          label="Fecha de vigencia"
          v-model="dateEffective"
          dense
          filled
          :rules="[
            (val) => (val && val.length > 0) || 'Seleccione una fecha válida',
          ]"
        >
          <template v-slot:prepend>
            <q-icon name="fas fa-calendar-alt" color="primary" />
          </template>
        </q-input>
        <q-input
          type="date"
          stack-label
          label="Final de vigencia"
          dense
          filled
          v-model="dateEndEffective"
        >
          <template v-slot:prepend>
            <q-icon name="fas fa-calendar-alt" color="primary" />
          </template>
        </q-input>
        <div class="m-tableHistorySalary__form__empty"></div>
        <div class="m-tableHistorySalary__form__empty"></div>
      </div>

      <div class="m-tableHistorySalary__form__inputGroup">
        <q-input
          label="Sueldo basico"
          dense
          filled
          :model-value="minimumWage"
          :rules="[(val) => (val && val > 0) || 'El sueldo es obligatorio ']"
          @update:model-value="handleChangeMinimumWage"
        >
          <template v-slot:prepend>
            <q-icon name="fas fa-dollar-sign" color="primary" />
          </template>
        </q-input>
        <q-input
          label="Asignación familiar"
          dense
          filled
          :model-value="householdAllowance"
          :rules="[
            (val) =>
              val >= 0 ||
              'La asignación familiar no puede quedar vacío y deben ser igual o mayor a 0',
          ]"
          @update:model-value="handleChanghouseholdAllowance"
        >
          <template v-slot:prepend>
            <q-icon name="fas fa-dollar-sign" color="primary" />
          </template>
        </q-input>
        <q-input
          label="Bonificacion"
          dense
          filled
          :model-value="bonus"
          :rules="[
            (val) =>
              val >= 0 ||
              'La bonificación no puede quedar vacío y deben ser igual o mayor a 0',
            ,
          ]"
          @update:model-value="handleChangeBonus"
        >
          <template v-slot:prepend>
            <q-icon name="fas fa-dollar-sign" color="primary" />
          </template>
        </q-input>
        <div class="m-tableHistorySalary__form__empty"></div>
      </div>

      <div class="m-tableHistorySalary__form__inputGroup">
        <q-input
          label="Movilidad"
          dense
          filled
          :model-value="mobility"
          :rules="[
            (val) =>
              val >= 0 ||
              'La movilidad no puede quedar vacío y deben ser igual o mayor a 0',
            ,
          ]"
          @update:model-value="handleChangeMobility"
        >
          <template v-slot:prepend>
            <q-icon name="fas fa-dollar-sign" color="primary" />
          </template>
        </q-input>
        <q-input
          label="Alimentos"
          dense
          filled
          :model-value="food"
          :rules="[
            (val) =>
              val >= 0 ||
              'El bono de alimento no puede quedar vacío y deben ser igual o mayor a 0',
            ,
          ]"
          @update:model-value="handleChangeFood"
        >
          <template v-slot:prepend>
            <q-icon name="fas fa-dollar-sign" color="primary" />
          </template>
        </q-input>
        <div class="m-tableHistorySalary__form__empty"></div>
        <div class="m-tableHistorySalary__form__empty"></div>
      </div>

      <div class="m-tableHistorySalary__form__inputGroup">
        <q-input
          label="Sueldo total"
          dense
          filled
          disable
          v-model="totalSalary"
        >
          <template v-slot:prepend>
            <q-icon name="fas fa-poll" color="primary" />
          </template>
        </q-input>
        <div class="m-tableHistorySalary__form__empty"></div>
        <div class="m-tableHistorySalary__form__empty"></div>
        <div class="m-tableHistorySalary__form__empty"></div>
      </div>

      <div class="m-tableHistorySalary__form__actions">
        <q-btn
          :label="id === null ? 'Registrar' : 'Actualizar'"
          type="submit"
          color="green"
          :disable="!can('Acceso Sueldo', 'Empleado', 'Editar')"
        />
        <q-btn label="Limpiar" color="primary" @click="resetFormData" />
      </div>
    </q-form>

    <q-table
      class="m-tableHistorySalary__table"
      flat
      :columns="columns"
      title="Históricos de sueldo"
      :rows="rows"
      no-data-label="No hay registros"
      :rows-per-page-options="[25, 50]"
    >
      <template v-slot:body-cell-options="props">
        <q-td :props="props">
          <div class="m-tableHistorySalary__table__actions">
            <q-btn
              icon="edit"
              flat
              fab-mini
              color="green"
              :disable="!can('Acceso Sueldo', 'Empleado', 'Editar')"
              @click="handleEdit(props.row)"
            />
            <q-btn
              icon="fas fa-minus-circle"
              flat
              fab-mini
              color="negative"
              :disable="
                !can('Acceso Sueldo', 'Empleado', 'Editar') ||
                props.row.ta_estado == 0
              "
              @click="handleDeleteSalary(props.row)"
            />
            <q-btn
              icon="fas fa-book"
              fab-mini
              flat
              color="blue"
              @click="mtd_slcRowTableLog(props.row)"
            />
          </div>
        </q-td>
      </template>
    </q-table>
  </div>
  <m-modal-log-table
    v-if="isOpenModalLog"
    :isOpenModalLog="isOpenModalLog"
    @mtd_closeModalLog="mtd_closeModalLog"
    :ILogTable="LogSalary"
  ></m-modal-log-table>
</template>

<script lang="ts">
import { QForm } from 'quasar';
import { IResponseFetch, ISalary } from 'src/types';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';
import { getDateYYYMMDD } from 'src/utils/date';
import { MessageSuccess } from 'src/utils/swal';
import { isValidNumber } from 'src/utils/numbers';
import {
  defineComponent,
  ref,
  reactive,
  toRefs,
  onMounted,
  computed,
} from 'vue';
import { can } from 'src/utils/permission';
import { DATE_EMPTY } from 'src/constant';
import { getCreateUserTrack } from 'src/utils/userTrack';
import MModalLogTable from 'src/components/molecules/ModalLogTables';

interface IFormRow extends ISalary {
  dateEffective: string;
  dateEndEffective: string;
  minimumWage: string;
  householdAllowance: string;
  mobility: string;
  food: string;
  bonus: string;
  total: string;
}

interface IFormSalary {
  dateEffective: string;
  dateEndEffective: string | null;
  minimumWage: number;
  householdAllowance: number;
  bonus: number;
  mobility: number;
  food: number;
  id: null | string;
  csdia: string;
}

export default defineComponent({
  name: 'MTableHistorySalary',
  components: {
    MModalLogTable,
  },
  props: {
    idEmployee: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const columns = [
      {
        label: 'Fecha de vigencia Inicio',
        field: 'dateEffective',
        name: 'dateEffective',
        align: 'center',
      },
      {
        label: 'Fecha de vigencia de fin',
        field: 'dateEndEffective',
        name: 'dateEndEffective',
        align: 'center',
      },
      {
        label: 'Sueldo básico',
        field: 'minimumWage',
        name: 'minimumWage',
        align: 'center',
      },
      {
        label: 'Asignación familiar',
        field: 'householdAllowance',
        name: 'householdAllowance',
        align: 'center',
      },
      {
        label: 'Movilidad',
        field: 'mobility',
        name: 'mobility',
        align: 'center',
      },
      {
        label: 'Alimentos',
        field: 'food',
        name: 'food',
        align: 'center',
      },
      {
        label: 'Bonificación',
        field: 'bonus',
        name: 'bonus',
        align: 'center',
      },
      {
        label: 'Total',
        field: 'total',
        name: 'total',
        align: 'center',
      },
      {
        label: 'Opciones',
        field: 'options',
        name: 'options',
        align: 'center',
      },
    ];

    const salary = reactive<IFormSalary>({
      dateEffective: getDateYYYMMDD(),
      dateEndEffective: null,
      minimumWage: 0,
      householdAllowance: 0,
      bonus: 0,
      mobility: 0,
      food: 0,
      id: null,
      csdia: '',
    });

    const userTrack = getCreateUserTrack();
    const isOpenModalLog = ref(false);
    const LogSalary = ref<ISalary>();

    const totalSalary = computed(() => {
      const { minimumWage, householdAllowance, bonus, mobility, food } = salary;

      const totalSum =
        Number(minimumWage || 0) +
        Number(householdAllowance || 0) +
        Number(bonus || 0) +
        Number(mobility || 0) +
        Number(food || 0);

      return totalSum.toFixed(2);
    });

    const rows = ref<IFormRow[]>([]);

    const formTableHistorySalary = ref<QForm>();

    const mtd_closeModalLog = () => {
      isOpenModalLog.value = false;
    };

    const mtd_slcRowTableLog = (logTable: ISalary) => {
      LogSalary.value = logTable;
      isOpenModalLog.value = true;
    };
    const handleEdit = (salaryParam: IFormRow) => {
      salary.dateEffective = salaryParam.dateEffective;
      salary.dateEndEffective = salaryParam.dateEndEffective;
      salary.minimumWage = Number(salaryParam.minimumWage);
      (salary.householdAllowance = Number(salaryParam.householdAllowance)),
        (salary.bonus = Number(salaryParam.bonus));
      salary.mobility = Number(salaryParam.mobility);
      salary.food = Number(salaryParam.food);
      salary.id = salaryParam.id_sueldo;
    };
    const handleForm = async () => {
      let body = {
        id_persona: props.idEmployee,
        ta_basico: salary.minimumWage,
        ta_estado: 1,
        ta_observacion: '',
        ta_csdia: salary.csdia,
        ta_asignacion_familiar: salary.householdAllowance,
        ta_bonificacion: salary.bonus,
        ta_movilidad: salary.mobility,
        ta_alimentos: salary.food,
        ta_total: totalSalary.value,
        ta_vigenciaInicio: salary.dateEffective,
        ta_vigenciaFin:
          salary.dateEndEffective === null
            ? DATE_EMPTY
            : salary.dateEndEffective,
        id_sueldo: salary.id === null ? 0 : salary.id,
      };

      const salaryFetch = await fetchRequestAPI({
        url: '/adm/persona/empleado/other/sueldo',
        body: JSON.stringify({ ...body, ...userTrack }),
        method: 'POST',
      });

      if (
        readErrorFetch({
          responseFetch: salaryFetch,
          message:
            salary.id === null
              ? 'El sueldo no se pudo registrar'
              : 'El sueldo no se ha podido actualizar',
        })
      ) {
        return;
      }

      MessageSuccess({
        title:
          salary.id === null
            ? 'El sueldo se ha registrado'
            : 'El sueldo se actualizó',
      });
      resetFormData();
      await getAsyncData();
    };
    const handleDeleteSalary = async (salaryParam: IFormRow) => {
      const salaryFetch = await fetchRequestAPI({
        url: '/adm/persona/empleado/other/sueldo',
        method: 'PUT',
        body: JSON.stringify({
          id_sueldo: salaryParam.id_sueldo,
          ...userTrack,
        }),
      });

      if (
        readErrorFetch({
          responseFetch: salaryFetch,
          message: 'Ocurrió un error al borrar el Sueldo',
        })
      ) {
        return;
      }

      MessageSuccess({
        title: 'Sueldo deshabilitado satisfactoriamente',
      });

      await getAsyncData();
    };

    const resetFormData = () => {
      salary.id = null;
      salary.dateEffective = getDateYYYMMDD();
      salary.dateEndEffective = null;
      salary.minimumWage = 0;
      salary.householdAllowance = 0;
      salary.bonus = 0;
      salary.food = 0;
      salary.csdia = '';
      salary.mobility = 0;

      formTableHistorySalary.value?.reset();
    };

    const getAsyncData = async () => {
      const salaryFetch = await fetchRequestAPI({
        url: `/adm/persona/empleado/sueldo/${props.idEmployee}`,
        method: 'GET',
      });

      if (
        readErrorFetch({
          responseFetch: salaryFetch,
          message: 'Ocurrió un error al mostrar los Sueldos',
        })
      ) {
        return;
      }

      rows.value = ((salaryFetch as IResponseFetch).data as ISalary[]).map(
        (item) => ({
          ...item,
          dateEffective: item.ta_vigenciaInicio,
          dateEndEffective: item.ta_vigenciaFin,
          minimumWage: item.ta_basico,
          householdAllowance: item.ta_asignacion_familiar,
          mobility: item.ta_movilidad,
          food: item.ta_alimentos,
          bonus: item.ta_bonificacion,
          total: item.ta_total,
        })
      );
    };

    const handleChangeMinimumWage = (value: number) => {
      if (isValidNumber(value)) {
        salary.minimumWage = !value ? value : Number(Number(value).toFixed(2));
      }
    };
    const handleChanghouseholdAllowance = (value: number) => {
      if (isValidNumber(value)) {
        salary.householdAllowance = !value
          ? value
          : Number(Number(value).toFixed(2));
      }
    };
    const handleChangeBonus = (value: number) => {
      if (isValidNumber(value)) {
        salary.bonus = !value ? value : Number(Number(value).toFixed(2));
      }
    };
    const handleChangeMobility = (value: number) => {
      if (isValidNumber(value)) {
        salary.mobility = !value ? value : Number(Number(value).toFixed(2));
      }
    };
    const handleChangeFood = (value: number) => {
      if (isValidNumber(value)) {
        salary.food = !value ? value : Number(Number(value).toFixed(2));
      }
    };

    onMounted(async () => {
      await getAsyncData();
    });
    return {
      columns,
      rows,
      totalSalary,
      handleEdit,
      handleForm,
      ...toRefs(salary),
      formTableHistorySalary,
      handleDeleteSalary,
      resetFormData,
      can,
      handleChangeMinimumWage,
      handleChanghouseholdAllowance,
      handleChangeBonus,
      handleChangeMobility,
      handleChangeFood,
      mtd_closeModalLog,
      isOpenModalLog,
      mtd_slcRowTableLog,
      LogSalary,
    };
  },
});
</script>

<style lang="scss" scoped>
@import './TableHistorySalary.scss';
</style>
