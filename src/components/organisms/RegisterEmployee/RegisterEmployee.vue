<template>
  <div class="o-registerEmployee">
    <q-form
      class="o-registerEmployee__form"
      ref="form"
      @submit.prevent="handleForm"
    >
      <div class="o-registerEmployee__form__card">
        <div class="o-registerEmployee__form__card__header">
          <h2 class="o-registerEmployee__form__card__header__title">
            Datos personales
          </h2>
        </div>

        <div class="o-registerEmployee__form__card__body">
          <div class="o-registerEmployee__form__card__body__inputGroup">
            <q-input
              label="Nombres"
              dense
              filled
              v-model="name"
              :rules="[
                (val) => (val && val.length > 0) || 'El nombre es obligatorio',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="fas fa-address-card" color="primary" />
              </template>
            </q-input>
            <q-input
              label="Apellido paterno"
              dense
              filled
              v-model="lastName"
              :rules="[
                (val) =>
                  (val && val.length > 0) ||
                  'El apellido paterno es obligatorio',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="fas fa-address-card" color="primary" />
              </template>
            </q-input>
            <q-input
              label="Apellido materno"
              dense
              filled
              v-model="motherLastName"
              :rules="[
                (val) =>
                  (val && val.length > 0) ||
                  'El apellido materno es obligatorio',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="fas fa-address-card" color="primary" />
              </template>
            </q-input>
            <q-select
              label="Sexo"
              :options="SEX_OPTIONS"
              dense
              filled
              v-model="sex"
              :rules="[
                (val) =>
                  (val && val.value.length > 0) || 'Debe seleccionar el sexo',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="fas fa-venus-mars" color="primary" />
              </template>
            </q-select>
          </div>
          <div class="o-registerEmployee__form__card__body__inputGroup">
            <q-select
              label="Nacionalidad"
              :options="nationalityOptions"
              dense
              filled
              v-model="nationality"
              :rules="[
                (val) =>
                  (val && val.id_nacionalidad.length > 0) ||
                  'Debe seleccionar una nacionalidad',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="fas fa-globe-americas" color="primary" />
              </template>
            </q-select>
            <q-select
              label="Tipo de documento"
              dense
              filled
              :options="documentTypeOptions"
              v-model="documentType"
              :rules="[
                (val) =>
                  (val && val.id_tpdocumento.length > 0) ||
                  'Debe seleccionar un tipo de documento',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="fas fa-passport" color="primary" />
              </template>
            </q-select>
            <q-input
              label="Número documento"
              dense
              filled
              v-model="documentNumber"
              type="text"
              :rules="[
                (val) =>
                  (val && val.length > 0) ||
                  'EL número de documento es obligatorio',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="fas fa-sort-numeric-up" color="primary" />
              </template>
            </q-input>

            <q-input
              label="Fecha de nacimiento"
              stack-label
              type="date"
              dense
              filled
              v-model="birthDate"
              :rules="[
                (val) =>
                  (val && val.length > 0) ||
                  'Debe seleccionar una fecha valida',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="fas fa-calendar-alt" color="primary" />
              </template>
            </q-input>
          </div>

          <div class="o-registerEmployee__form__card__body__inputGroup">
            <q-input label="Direccion" dense filled v-model="direction">
              <template v-slot:prepend>
                <q-icon name="fas fa-map-marked-alt" color="primary" />
              </template>
            </q-input>
            <q-input
              label="Celular"
              dense
              filled
              v-model="cellPhone"
              type="number"
            >
              <template v-slot:prepend>
                <q-icon name="fas fa-phone-square-alt" color="primary" />
              </template>
            </q-input>
            <q-input label="Correo" dense filled>
              <template v-slot:prepend>
                <q-icon name="fas fa-envelope-square" color="primary" />
              </template>
            </q-input>
            <div class="o-registerEmployee__form__card__body__empty"></div>
          </div>

          <div
            :class="[
              'o-registerEmployee__form__card__body__profile',
              { '--drag': isDragPhotoProfile },
            ]"
            @dragover.prevent
            @drop.prevent="dragPhotoProfile"
            @dragenter="isDragPhotoProfile = true"
            @dragleave="isDragPhotoProfile = false"
            @click="handleClickSelectImage"
          >
            <div class="o-registerEmployee__form__card__body__profile__photo">
              <q-icon
                class="o-registerEmployee__form__card__body__profile__photo__iconPlus"
                name="fas fa-plus-circle"
                color="orange"
                size="1.5rem"
                v-if="!filePhotoProfile"
              />
              <q-icon
                class="o-registerEmployee__form__card__body__profile__photo__icon"
                name="fas fa-camera"
                size="3rem"
                color="primary"
                v-if="!filePhotoProfile"
              />
              <img
                v-if="filePhotoProfile"
                class="o-registerEmployee__form__card__body__profile__photo__preview"
                :src="imageProfilePreview"
              />
            </div>
            <div class="o-registerEmployee__form__card__body__profile__text">
              <h3
                class="o-registerEmployee__form__card__body__profile__text__title"
              >
                Sube una foto de perfil
              </h3>

              <!-- <p>Arrastre aqui la imagen que desea subir</p> -->
            </div>
          </div>
        </div>
      </div>

      <div class="o-registerEmployee__form__card" v-if="tabsOptions.length > 0">
        <div class="o-registerEmployee__form__card__header -tab">
          <q-tabs indicator-color="primary" align="left" v-model="tabSelect">
            <q-tab
              v-for="item in tabsOptions"
              :key="item.name"
              :label="item.label"
              :name="item.name"
            />
          </q-tabs>
        </div>

        <q-tab-panels infinite ref="tabPanels" v-model="tabSelect">
          <q-tab-panel name="personal-information">
            <div class="o-registerEmployee__form__card__body">
              <div class="o-registerEmployee__form__card__body__inputGroup">
                <q-select
                  label="Cargo"
                  :options="positionOptions"
                  dense
                  filled
                  v-model="position"
                  :rules="[
                    (val) =>
                      (val && val.id_cargo.length > 0) ||
                      'Debe seleccionar un cargo',
                  ]"
                >
                  <template v-slot:prepend>
                    <q-icon name="fas fa-clinic-medical" color="primary" />
                  </template>
                </q-select>
                <q-select
                  label="Sede"
                  dense
                  filled
                  :options="sedeOptions"
                  v-model="sede"
                  :rules="[
                    (val) =>
                      (val && val.id_sede.length > 0) ||
                      'Debe seleccionar una sede',
                  ]"
                >
                  <template v-slot:prepend>
                    <q-icon name="fas fa-clinic-medical" color="primary" />
                  </template>
                </q-select>
                <q-input
                  type="date"
                  stack-label
                  label="Fecha de ingreso"
                  dense
                  filled
                  v-model="dateAdimission"
                  :rules="[
                    (val) =>
                      (val && val.length > 0) || 'Seleccione una fecha valida',
                  ]"
                >
                  <template v-slot:prepend>
                    <q-icon name="fas fa-calendar-alt" color="primary" />
                  </template>
                </q-input>
                <div class="o-registerEmployee__form__card__body__empty"></div>
              </div>

              <div class="o-registerEmployee__form__card__body__separator">
                <h3
                  class="o-registerEmployee__form__card__body__separator__title"
                >
                  Sueldo
                </h3>
                <q-separator />
              </div>
              <div class="o-registerEmployee__form__card__body__inputGroup">
                <q-input
                  type="date"
                  stack-label
                  label="Fecha de vencimiento"
                  dense
                  filled
                  v-model="dateEffective"
                  :rules="[
                    (val) =>
                      (val && val.length > 0) || 'Seleccione una fecha valida',
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
                <div class="o-registerEmployee__form__card__body__empty"></div>
                <div class="o-registerEmployee__form__card__body__empty"></div>
              </div>

              <div class="o-registerEmployee__form__card__body__inputGroup">
                <q-input
                  label="Sueldo basico"
                  dense
                  filled
                  :model-value="minimumWage"
                  @update:model-value="handleChangeMinimumWage"
                >
                  <template v-slot:prepend>
                    <q-icon name="fas fa-dollar-sign" color="primary" />
                  </template>
                </q-input>
                <q-input
                  label="Asignacion familiar"
                  dense
                  filled
                  :model-value="householdAllowance"
                  @update:model-value="handleChangeHouseholdAllowance"
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
                  @update:model-value="handleChangeBonus"
                >
                  <template v-slot:prepend>
                    <q-icon name="fas fa-dollar-sign" color="primary" />
                  </template>
                </q-input>
                <div class="o-registerEmployee__form__card__body__empty"></div>
              </div>

              <div class="o-registerEmployee__form__card__body__inputGroup">
                <q-input
                  label="Movilidad"
                  dense
                  filled
                  :model-value="mobility"
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
                  @update:model-value="handleChangeFood"
                >
                  <template v-slot:prepend>
                    <q-icon name="fas fa-dollar-sign" color="primary" />
                  </template>
                </q-input>
                <div class="o-registerEmployee__form__card__body__empty"></div>
                <div class="o-registerEmployee__form__card__body__empty"></div>
              </div>

              <div class="o-registerEmployee__form__card__body__inputGroup">
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
                <div class="o-registerEmployee__form__card__body__empty"></div>
                <div class="o-registerEmployee__form__card__body__empty"></div>
                <div class="o-registerEmployee__form__card__body__empty"></div>
              </div>

              <div class="o-registerEmployee__form__card__body__separator">
                <h3
                  class="o-registerEmployee__form__card__body__separator__title"
                >
                  Descanso referencial (Informativo)
                </h3>
                <q-separator />
              </div>

              <div class="o-registerEmployee__form__card__body__inputGroup">
                <q-select
                  label="Descanso referencial"
                  dense
                  filled
                  :options="BREAK_OPTIONS"
                  v-model="dayBreak"
                  clearable
                >
                  <template v-slot:prepend>
                    <q-icon name="fas fa-address-card" color="primary" />
                  </template>
                </q-select>
                <div class="o-registerEmployee__form__card__body__empty"></div>
                <div class="o-registerEmployee__form__card__body__empty"></div>
                <div class="o-registerEmployee__form__card__body__empty"></div>
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="payment-methods">
            <div class="o-registerEmployee__form__card__body">
              <div class="o-registerEmployee__form__card__body__switch">
                <q-toggle
                  checked-icon="check"
                  color="primary"
                  unchecked-icon="clear"
                  v-model="switchHeadline"
                />
                <h3 class="o-registerEmployee__form__card__body__switch__title">
                  {{ switchHeadline ? 'Es titular' : 'No es titular' }}
                </h3>
              </div>

              <div v-if="switchHeadline">
                <div
                  class="o-registerEmployee__form__card__body__inputGroup -tab"
                >
                  <q-select
                    label="Banco"
                    dense
                    filled
                    v-model="bank"
                    clearable
                    :options="bankOptions"
                    @update:model-value="handleResetValidationBank"
                  >
                    <template v-slot:prepend>
                      <q-icon name="fas fa-university" color="primary" />
                    </template>
                  </q-select>
                  <q-select
                    label="Tipo de cuenta"
                    dense
                    filled
                    :options="accountTypeOptions"
                    v-model="accountType"
                    :rules="[handleValidationAccountType]"
                    clearable
                    reactive-rules
                  >
                    <template v-slot:prepend>
                      <q-icon name="fas fa-university" color="primary" />
                    </template>
                  </q-select>
                  <div
                    class="o-registerEmployee__form__card__body__empty"
                  ></div>
                  <div
                    class="o-registerEmployee__form__card__body__empty"
                  ></div>
                </div>

                <div
                  class="o-registerEmployee__form__card__body__inputGroup -tab"
                >
                  <q-input label="Numero" dense filled v-model="bankNumber">
                    <template v-slot:prepend>
                      <q-icon name="fab fa-cc-visa" color="primary" />
                    </template>
                  </q-input>

                  <div
                    class="o-registerEmployee__form__card__body__empty"
                  ></div>
                </div>
                <div
                  class="o-registerEmployee__form__card__body__inputGroup -tab"
                >
                  <q-input label="CCI" dense filled v-model="bankCCI">
                    <template v-slot:prepend>
                      <q-icon name="fab fa-cc-visa" color="primary" />
                    </template>
                  </q-input>

                  <div
                    class="o-registerEmployee__form__card__body__empty"
                  ></div>
                </div>
              </div>

              <div v-else>
                <div class="o-registerEmployee__form__card__body__document">
                  <q-input
                    class="o-registerEmployee__form__card__body__document__input"
                    label="Documento/Nombres"
                    dense
                    filled
                    v-model="employeeSearch"
                  />

                  <q-btn
                    class="o-registerEmployee__form__card__body__document__button"
                    label="Buscar"
                    color="primary"
                    dense
                    @click="handleSearchEmployee"
                  />
                  <q-btn
                    class="o-registerEmployee__form__card__body__document__button"
                    label="Agregar Pesona"
                    color="green"
                    dense
                  />
                </div>

                <q-list class="o-registerEmployee__form__listSustitute">
                  <q-item
                    v-for="item in employessSearch"
                    :key="item.id_persona"
                    :class="{
                      'o-registerEmployee__active':
                        employeeSelect &&
                        item.id_persona === employeeSelect.id_persona,
                    }"
                  >
                    <q-item-section top avatar>
                      <q-avatar rounded>
                        <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
                      </q-avatar>
                    </q-item-section>

                    <q-item-section>
                      <q-item-label>{{ item.datos }}</q-item-label>
                      <q-item-label caption>
                        <div
                          class="o-registerEmployee__form__listSustitute__information"
                        >
                          <div><strong>Banco :</strong> {{ item.banco }}</div>
                          <div>
                            <strong>Tipo cuenta :</strong>
                            {{ item.tpc_descripcion }}
                          </div>
                          <div>
                            <strong>Cuenta : </strong>{{ item.phb_cuenta }}
                          </div>
                          <div><strong>CCI : </strong>{{ item.phb_cci }}</div>
                        </div>
                      </q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label caption>
                        <q-btn
                          label="Seleccionar"
                          color="green"
                          size="sm"
                          @click="handleSelectSustitute(item)"
                        />
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="documents">
            <q-table
              flat
              :columns="columnDocument"
              :rows="documentsRow"
              no-data-label="No hay registros"
              :rows-per-page-options="[25, 50]"
            >
              <template v-slot:body-cell-options="props">
                <q-td :props="props">
                  <div
                    class="o-registerEmployee__form__card__body__table__actions"
                  >
                    <q-btn
                      icon="add"
                      flat
                      fab-mini
                      color="green"
                      @click="selectFileDocument(props.row.id_emdocumento)"
                    />
                    <q-btn
                      :disable="props.row.file === null"
                      icon="delete"
                      flat
                      fab-mini
                      color="negative"
                      @click="handleDeleteDocument(props.row.id_emdocumento)"
                    />
                  </div>
                </q-td>
              </template>

              <template v-slot:body-cell-name="props">
                <q-td :props="props">
                  <div
                    class="ellipsis"
                    style="max-width: 300px; text-align: center"
                  >
                    {{ props.row.name }}
                  </div>
                </q-td>
              </template>

              <template v-slot:body-cell-state="props">
                <q-td :props="props">
                  <q-badge
                    :color="props.row.state === 0 ? 'orange' : 'secondary'"
                  >
                    {{
                      props.row.state === 0
                        ? 'PENDIENTE'
                        : 'PENDIENTE POR SUBIR'
                    }}
                  </q-badge>
                </q-td>
              </template>

              <template v-slot:body-cell-dateIssue="props">
                <q-td :props="props">
                  <q-input
                    type="date"
                    v-model="props.row.dateIssue"
                    @input="
                      selectDateDocument($event, 0, props.row.id_emdocumento)
                    "
                    :disable="props.row.state === 1"
                  />
                </q-td>
              </template>

              <template v-slot:body-cell-dateValidity="props">
                <q-td :props="props">
                  <q-input
                    type="date"
                    v-model="props.row.dateValidity"
                    @input="
                      selectDateDocument($event, 1, props.row.id_emdocumento)
                    "
                    :disable="props.row.state === 1"
                  />
                </q-td>
              </template>
            </q-table>
          </q-tab-panel>
        </q-tab-panels>
      </div>

      <div>
        <q-btn
          :disable="!can('Registrar', 'Empleado')"
          label="Registrar"
          color="green"
          type="submit"
        />
      </div>
    </q-form>
  </div>
</template>

<script lang="ts">
import {
  IAccountType,
  IBank,
  IDocument,
  IDocumentType,
  INationality,
  IPosition,
  IResponseFetch,
  ISede,
  ISuplente,
} from 'src/types';
import {
  defineComponent,
  ref,
  PropType,
  reactive,
  toRefs,
  computed,
  onMounted,
  nextTick,
} from 'vue';
import { SEX_OPTIONS, BREAK_OPTIONS, DATE_EMPTY } from 'src/constant';
import { QForm, QTabPanels } from 'quasar';
import {
  MessageConfirmation,
  MessageError,
  MessageSuccess,
} from 'src/utils/swal';
import { selectFile } from 'src/utils/selectClickFile';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';
import { getDateYYYMMDD } from 'src/utils/date';
import { getFileSize } from 'src/utils/file';
import { useStore } from 'src/store';
import { can } from 'src/utils/permission';
import { isValidNumber } from 'src/utils/numbers';
import { getCreateUserTrack } from 'src/utils/userTrack';
import { removeAccents } from 'src/utils/regEx';

import { MESSAGE_REGISTRO, MESSAGE_ERROR } from 'src/utils/messages';

interface IOptionForm {
  value: string;
  label: string;
}
interface ITabs {
  name: string;
  permission: string;
  label: string;
}

interface IEmployeeForm {
  name: string | null;
  motherLastName: string | null;
  lastName: string | null;
  sex: null | IOptionForm;
  nationality: INationality | null;
  documentType: IDocumentType | null;
  documentNumber: string | null;
  birthDate: string | null;
  direction: string | null;
  cellPhone: number | null;
  mail: string | null;
  position: IPosition | null;
  sede: ISede | null;
  dateAdimission: string | null;
  dateEffective: string | null;
  dateEndEffective: string | null;
  minimumWage: number;
  householdAllowance: number;
  bonus: number;
  mobility: number;
  food: number;
  dayBreak: IOptionForm | null;
  bank: IBank | null;
  accountType: IAccountType | null;
  bankNumber: string | null;
  bankCCI: string | null;
}
interface IDocumentRowTable extends IDocument {
  file: null | File;
  size: string;
  dateIssue: string;
  dateValidity: string;
  state: number;
  name: string;
}

export default defineComponent({
  name: 'ORegisterEmployee',
  props: {
    positionOptions: {
      type: Array as PropType<IPosition[]>,
      default: () => [],
    },
    documentTypeOptions: {
      type: Array as PropType<IDocumentType[]>,
      default: () => [],
    },
    sedeOptions: {
      type: Array as PropType<ISede[]>,
      default: () => [],
    },
    nationalityOptions: {
      type: Array as PropType<INationality[]>,
      default: () => [],
    },
    bankOptions: {
      type: Array as PropType<IBank[]>,
      default: () => [],
    },
    accountTypeOptions: {
      type: Array as PropType<IAccountType[]>,
      default: () => [],
    },
    documents: {
      type: Array as PropType<IDocument[]>,
      default: () => [],
    },
  },
  setup(props, {}) {
    const tabSelect = ref('personal-information');
    const switchHeadline = ref(true);
    const form = ref<QForm>();
    const isDragPhotoProfile = ref(false);
    const filePhotoProfile = ref();
    const imageProfilePreview = ref();
    const employeeSearch = ref();
    const employessSearch = ref<ISuplente[]>([]);
    const employeeSelect = ref<ISuplente>();
    const columnDocument = [
      {
        label: 'Tipo de documento',
        name: 'de_nombre',
        field: 'de_nombre',
        align: 'left',
      },
      {
        label: 'Nombre',
        name: 'name',
        field: 'name',
        align: 'center',
      },
      {
        label: 'Peso',
        name: 'size',
        field: 'size',
        align: 'center',
      },
      {
        label: 'Fecha de Emision',
        name: 'dateIssue',
        field: 'dateIssue',
        align: 'center',
      },
      {
        label: 'Fecha de vencimiento',
        name: 'dateValidity',
        field: 'dateValidity',
        align: 'center',
      },
      {
        label: 'Estado',
        name: 'state',
        field: 'state',
        align: 'center',
      },
      {
        label: 'Opciones',
        name: 'options',
        field: 'options',
        align: 'center',
      },
    ];
    const tabPanels = ref<QTabPanels>();
    let tabsOptions = ref<ITabs[]>([
      {
        label: 'DATOS LABORALES',
        name: 'personal-information',
        permission: 'Acceso Cargo',
      },
      {
        label: 'FORMAS DE PAGO',
        name: 'payment-methods',
        permission: 'Acceso Forma de pago',
      },
      {
        label: 'DOCUMENTOS',
        name: 'documents',
        permission: 'Acceso Documentos',
      },
    ]);

    const { commit } = useStore();

    const userTrack = getCreateUserTrack();

    // 0 -> PENDIENTE, 1 -> SUBIDO

    const documentsRow = ref<IDocumentRowTable[]>([]);

    const employee = reactive<IEmployeeForm>({
      name: null,
      motherLastName: null,
      lastName: null,
      sex: {
        label: 'MASCULINO',
        value: '2',
      },
      nationality: null,
      documentType: null,
      documentNumber: null,
      birthDate: getDateYYYMMDD(),
      direction: null,
      cellPhone: null,
      mail: null,
      position: null,
      sede: null,
      dateAdimission: getDateYYYMMDD(),
      dateEffective: getDateYYYMMDD(),
      dateEndEffective: null,
      minimumWage: 0,
      householdAllowance: 0,
      bonus: 0,
      mobility: 0,
      food: 0,
      dayBreak: null,
      bank: null,
      accountType: null,
      bankNumber: null,
      bankCCI: null,
    });

    const totalSalary = computed(() => {
      const { minimumWage, householdAllowance, bonus, mobility, food } =
        employee;

      const totalSum =
        Number(minimumWage || 0) +
        Number(householdAllowance || 0) +
        Number(bonus || 0) +
        Number(mobility || 0) +
        Number(food || 0);

      return totalSum.toFixed(2);
    });

    const dragPhotoProfile = (e: DragEvent) => {
      const files = (e.dataTransfer as DataTransfer).files;
      handleSetImage(files);
    };

    const handleClickSelectImage = async () => {
      const files = (await selectFile('image/*', false)) as File;
      handleSetImage([files] as unknown as FileList);
    };

    const handleSetImage = (files: FileList) => {
      isDragPhotoProfile.value = false;
      if (files.length === 1 && files[0].type.indexOf('image') !== -1) {
        filePhotoProfile.value = files[0];
        imageProfilePreview.value = URL.createObjectURL(files[0]);

        let reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onloadend = function () {
          imageProfilePreview.value = reader.result;
        };
      } else {
        MessageError({ title: 'Escoja una imagen válida' });
      }
    };

    const handleForm = () => {
      commit('commitLoading', true);

      const auxValidation = tabsOptions.value.filter(
        (item) => item.name != 'documents'
      );

      if (auxValidation.length > 1) {
        tabSelect.value =
          tabSelect.value === 'personal-information'
            ? 'payment-methods'
            : 'personal-information';
      }

      // eslint-disable-next-line
      setTimeout(async () => {
        const isFormValidate = (await form.value?.validate()) as boolean;
        if (isFormValidate) {
          if (
            Boolean(switchHeadline.value) &&
            !employee.bankNumber &&
            !employee.bankCCI &&
            employee.bank !== null
          ) {
            commit('commitLoading', false);
            MessageError({
              title: 'Es necesaria el número de cuenta o el código CCI',
            });
            tabSelect.value = 'payment-methods';
            return;
          }

          const dateAdmission = new Date(
            String(employee.dateAdimission).split('-').join('/')
          );
          const dateValidation = new Date(
            getDateYYYMMDD().split('-').join('/')
          );
          const lastDayOfMonth = new Date(
            dateValidation.getFullYear(),
            dateValidation.getMonth() + 1 + 1,
            0
          );

          if (dateAdmission > lastDayOfMonth) {
            MessageError({
              text: 'La fecha ingresada debe ser menor o igual, que el fin del siguiente mes de la fecha actual.',
            });
            tabSelect.value =
              tabsOptions.value.length > 0 ? tabsOptions.value[0].name : '';
            commit('commitLoading', false);
            return;
          }

          let payAux = Boolean(switchHeadline.value)
            ? {
                tipo: 1,
                banco: employee.bank === null ? 0 : employee.bank?.id_banco,
                tipo_cuenta: employee.accountType?.id_tpcuenta,
                cuenta: employee.bankNumber,
                cci: employee.bankCCI,
              }
            : {
                tipo: 0,
                documento: employeeSelect.value?.per_documento,
                tipo_cuenta: null,
                cuenta: '',
              };

          const bodyEmployee = {
            nombres: employee.name,
            apellido_paterno: employee.lastName,
            apellido_materno: employee.motherLastName,
            sexo: employee.sex?.value,
            nacionalidad: employee.nationality?.id_nacionalidad,
            tipo_documento: employee.documentType?.id_tpdocumento,
            documento: employee.documentNumber,
            fecha_nacimiento: employee.birthDate,
            direccion: employee.direction,
            celular: employee.cellPhone,
            correo: employee.mail,
            titular: switchHeadline.value ? 1 : 0,
            estado: 1,
            fecha_ingreso: employee.dateAdimission,
            usuario: 1,
            empleado: [
              {
                cargo: employee.position?.id_cargo,
                sede: employee.sede?.id_sede,
                fecha_ingreso: employee.dateAdimission,
                sueldo_basico: employee.minimumWage,
                asignacion_familiar: employee.householdAllowance,
                bonificacion: employee.bonus,
                movilidad: employee.mobility,
                alimentos: employee.food,
                sueldo_total: totalSalary.value,
                descanso: '2022-12-12',
                descansoReferencia:
                  employee.dayBreak === null
                    ? 'NONE'
                    : employee.dayBreak?.label,
                costo_dia: 0,
                ta_vigenciaInicio: employee.dateEffective,
                ta_vigenciaFin: employee.dateEndEffective
                  ? employee.dateEndEffective
                  : DATE_EMPTY,
              },
            ],
            pago: [payAux],
            ...userTrack,
          };

          const employeeFetch = await fetchRequestAPI({
            url: '/adm/api/registro/empleado',
            method: 'POST',
            body: JSON.stringify(bodyEmployee),
          });

          if (
            readErrorFetch({
              responseFetch: employeeFetch,
              message: MESSAGE_ERROR(),
            })
          ) {
            commit('commitLoading', false);

            return;
          }

          if (filePhotoProfile.value) {
            const formData = new FormData();

            formData.append('image', filePhotoProfile.value);
            formData.append('documento', String(employee.documentNumber));
            formData.append('userCreacion', userTrack.userCreacion);

            const uploadPhotoProfile = await fetchRequestAPI({
              url: '/adm/api/imegen/empleado',
              method: 'POST',
              body: formData,
              headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (
              readErrorFetch({
                responseFetch: uploadPhotoProfile,
                message: MESSAGE_ERROR(),
              })
            ) {
              commit('commitLoading', false);

              return;
            }
          }
          // eslint-disable-next-line
          documentsRow.value.forEach(async (item) => {
            if (item.file) {
              const formData = new FormData();
              formData.append('documento', String(employee.documentNumber));
              formData.append('file_documents', item.file);
              formData.append('id_emdocumento', item.id_emdocumento);
              formData.append('emd_nombrefile', item.name);
              formData.append('emd_pesofile', item.size);
              formData.append(
                'emd_emision',
                !item.dateIssue ? DATE_EMPTY : item.dateIssue
              );
              formData.append(
                'emd_vigencia',
                !item.dateValidity ? DATE_EMPTY : item.dateValidity
              );
              formData.append('userCreacion', userTrack.userCreacion);

              const uploadFile = await fetchRequestAPI({
                url: '/adm/api/documentos/empleado',
                method: 'POST',
                body: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
              });
              if (
                readErrorFetch({
                  responseFetch: uploadFile,
                  message: MESSAGE_ERROR(),
                })
              ) {
                commit('commitLoading', false);

                return;
              }
            }
          });

          commit('commitLoading', false);
          MessageSuccess({
            title: MESSAGE_REGISTRO('al empleado'),
            text: !filePhotoProfile.value
              ? 'La foto se podrá subir en cualquier momento'
              : '',
          });
          resetFormData();
        }
        commit('commitLoading', false);
      }, 200);
    };

    const selectDateDocument = (
      date: string,
      type: number,
      idDocument: string
    ) => {
      documentsRow.value = (documentsRow.value as IDocumentRowTable[]).map(
        (item) => {
          if (item.id_emdocumento === idDocument) {
            //0 Fecha de emision
            if (type === 0) {
              item.dateIssue = date;
            }
            //1 Fecha de vencimiento
            if (type === 1) {
              item.dateValidity = date;
            }
          }
          return item;
        }
      );
    };

    const selectFileDocument = async (idDocument: string) => {
      const document = documentsRow.value.find(
        (item) => item.id_emdocumento === idDocument
      );

      if (!document?.dateIssue || !document?.dateValidity) {
        const message = `${!document?.dateIssue ? 'Emisión' : ''} ${
          !document?.dateIssue && !document?.dateValidity ? 'y' : ''
        } ${!document?.dateValidity ? 'Vigencia' : ''}`;

        const result = await MessageConfirmation({
          title: '¿Seguro que desea continuar?',
          text: `La fecha de ${message} no ha sido modificada`,
          showCancelButton: true,
        });

        if (result?.isDismissed) {
          return;
        }
      }

      if (
        document?.dateValidity &&
        new Date(String(document?.dateIssue)) > new Date(document?.dateValidity)
      ) {
        MessageError({
          title:
            'La fecha de emisión debe ser menor o igual que la Fecha de vencimiento.',
        });
        return;
      }

      const file =
        ((await selectFile('application/pdf', false)) as File) || null;

      if (file) {
        documentsRow.value = (documentsRow.value as IDocumentRowTable[]).map(
          (item) => {
            if (item.id_emdocumento === idDocument) {
              item.file = file;
              item.name = file.name;
              item.size = getFileSize(file.size);
              item.state = 1;
            }
            return item;
          }
        );
      }
    };

    const handleDeleteDocument = (idDocument: string) => {
      documentsRow.value = (documentsRow.value as IDocumentRowTable[]).map(
        (item) => {
          if (item.id_emdocumento === idDocument) {
            item.file = null;
            item.name = '';
            item.size = '';
            item.state = 0;
            item.dateIssue = '';
            item.dateValidity = '';
          }
          return item;
        }
      );
    };

    const handleSearchEmployee = async () => {
      commit('commitLoading', true);

      const employeeFetch = await fetchRequestAPI({
        url: `adm/persona/suplente/tareo/${String(
          removeAccents(employeeSearch.value) || ''
        )}`,
        method: 'GET',
      });

      if (
        !readErrorFetch({
          responseFetch: employeeFetch,
          message: MESSAGE_ERROR(),
        })
      ) {
        employessSearch.value = (employeeFetch as IResponseFetch)
          .data as ISuplente[];
      }
      commit('commitLoading', false);
    };

    const resetFormData = () => {
      employee.name = null;
      employee.motherLastName = null;
      employee.lastName = null;
      employee.sex = {
        label: 'MASCULINO',
        value: '2',
      };
      employee.nationality = null;
      employee.documentType = null;
      employee.documentNumber = null;
      employee.birthDate = getDateYYYMMDD();
      employee.direction = null;
      employee.cellPhone = null;
      employee.mail = null;
      employee.position = null;
      employee.sede = null;
      employee.dateAdimission = getDateYYYMMDD();
      employee.dateEffective = getDateYYYMMDD();
      employee.dateEndEffective = null;
      employee.minimumWage = 0;
      employee.householdAllowance = 0;
      employee.bonus = 0;
      employee.mobility = 0;
      employee.food = 0;
      employee.dayBreak = null;
      employee.bank = null;
      employee.accountType = null;
      employee.bankNumber = null;
      employee.bankCCI = null;

      filePhotoProfile.value = null;
      imageProfilePreview.value = null;

      documentsRow.value = documentsRow.value.map((item) => ({
        ...item,
        file: null,
        size: '',
        dateIssue: '',
        dateValidity: '',
        state: 0,
        name: '',
      }));

      form.value?.reset();
      tabSelect.value =
        tabsOptions.value.length > 0 ? tabsOptions.value[0].name : '';
    };

    const handleSelectSustitute = (sustitute: ISuplente) => {
      employeeSelect.value = sustitute;
      employessSearch.value = employessSearch.value.filter(
        (item) => item.id_persona === sustitute.id_persona
      );
    };

    const handleValidationAccountType = (val: IAccountType | null) => {
      if (employee.bank === null) {
        return true;
      }

      return (
        (val && val.id_tpcuenta.length > 0) ||
        'El tipo de cuenta es obligatorio  '
      );
    };

    const handleResetValidationBank = async (bank: IBank | null) => {
      await nextTick();
      if (bank === null) {
        form.value?.resetValidation();
      }
    };

    const handleChangeMinimumWage = (value: number) => {
      if (isValidNumber(value)) {
        employee.minimumWage = !value
          ? value
          : Number(Number(value).toFixed(2));
      }
    };
    const handleChangeHouseholdAllowance = (value: number) => {
      if (isValidNumber(value)) {
        employee.householdAllowance = !value
          ? value
          : Number(Number(value).toFixed(2));
      }
    };
    const handleChangeBonus = (value: number) => {
      if (isValidNumber(value)) {
        employee.bonus = !value ? value : Number(Number(value).toFixed(2));
      }
    };
    const handleChangeMobility = (value: number) => {
      if (isValidNumber(value)) {
        employee.mobility = !value ? value : Number(Number(value).toFixed(2));
      }
    };
    const handleChangeFood = (value: number) => {
      if (isValidNumber(value)) {
        employee.food = !value ? value : Number(Number(value).toFixed(2));
      }
    };

    onMounted(() => {
      documentsRow.value = [...props.documents].map((item) => ({
        ...item,
        file: null,
        size: '',
        dateIssue: '',
        dateValidity: '',
        state: 0,
        name: '',
      }));

      tabsOptions.value = tabsOptions.value.filter((item) =>
        can(item.permission, 'Empleado', 'Registrar')
      );

      tabSelect.value =
        tabsOptions.value.length > 0 ? tabsOptions.value[0].name : '';
    });

    return {
      handleChangeMinimumWage,
      handleChangeHouseholdAllowance,
      handleChangeBonus,
      handleChangeMobility,
      handleChangeFood,
      handleResetValidationBank,
      handleValidationAccountType,
      tabSelect,
      switchHeadline,
      handleForm,
      SEX_OPTIONS,
      BREAK_OPTIONS,
      form,
      dragPhotoProfile,
      filePhotoProfile,
      isDragPhotoProfile,
      imageProfilePreview,
      handleClickSelectImage,
      totalSalary,
      columnDocument,
      documentsRow,
      selectFileDocument,
      selectDateDocument,
      handleDeleteDocument,
      employeeSearch,
      handleSearchEmployee,
      employessSearch,
      employeeSelect,
      handleSelectSustitute,
      tabPanels,
      tabsOptions,
      can,
      ...toRefs(employee),
    };
  },
});
</script>
<style lang="scss" scoped>
@import './RegisterEmployee.scss';
</style>
