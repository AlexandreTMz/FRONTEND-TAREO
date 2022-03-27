<template>
  <q-drawer
    class="l-sidebar"
    show-if-above
    bordered
    v-model="openSidebar"
    :mini="miniSidebar"
    @mouseover="handleMouseOver"
    @mouseout="handleMouseout"
  >
    <div class="l-sidebar__header">
      <router-link
        :class="['l-sidebar__header__link', { '-mini': miniSidebar }]"
        :to="{ name: 'Dashboard' }"
      >
        <q-avatar size="40px"
          ><img
            :src="
              user.phc_foto_perfil !== null
                ? getServerFilePhoto(user.phc_foto_perfil, user.phc_foto_perfil)
                : ImagePlaceHolder
            "
        /></q-avatar>
        <span
          class="l-sidebar__header__link__name"
          v-if="!miniSidebar || $q.screen.width < 700"
        >
         {{user.datos}}
        </span>
      </router-link>
    </div>

    <q-separator color="grey" />

    <q-list class="l-sidebar__list">
      <div
        class="l-sidebar__list__title"
        v-if="!miniSidebar || $q.screen.width < 700"
      >
        MANTENIMIENTO
      </div>

      <q-item
        class="l-sidebar__list__item"
        clickable
        v-ripple
        :to="{ name: 'Home' }"
      >
        <q-item-section avatar>
          <q-icon name="fas fa-home" />
        </q-item-section>
        <q-item-section> INICIO </q-item-section>
      </q-item>
      <q-expansion-item icon="fas fa-toolbox" label="MAESTROS">
        <template v-for="item in sidebarItem.teachers" :key="item.link">
          <q-item
            v-if="item.enable"
            class="l-sidebar__list__item -subItem"
            clickable
            v-ripple
            :to="{ name: item.name }"
          >
            <q-item-section avatar>
              <q-icon :name="item.icon" />
            </q-item-section>
            <q-item-section>
              {{ item.label }}
            </q-item-section>
          </q-item>
        </template>
      </q-expansion-item>

      <q-expansion-item icon="fas fa-sitemap" label="EMPLEADOS">
        <template v-for="item in sidebarItem.employess" :key="item.link">
          <q-item
            v-if="item.enable"
            class="l-sidebar__list__item -subItem"
            clickable
            v-ripple
            :to="{ name: item.name }"
          >
            <q-item-section avatar>
              <q-icon :name="item.icon" />
            </q-item-section>
            <q-item-section>
              {{ item.label }}
            </q-item-section>
          </q-item>
        </template>
      </q-expansion-item>

      <q-expansion-item icon="fas fa-calendar-alt" label="TAREOS" v-if="true">
        <template v-for="item in sidebarItem.tareos" :key="item.link">
          <q-item
            v-if="item.enable"
            class="l-sidebar__list__item -subItem"
            clickable
            v-ripple
            :to="{ name: item.name }"
          >
            <q-item-section avatar>
              <q-icon :name="item.icon" />
            </q-item-section>
            <q-item-section>
              {{ item.label }}
            </q-item-section>
          </q-item>
        </template>
      </q-expansion-item>

      <q-expansion-item icon="fas fa-user-cog" label="SEGURIDAD" v-if="true">
        <template v-for="item in sidebarItem.users" :key="item.link">
          <q-item
            v-if="item.enable"
            class="l-sidebar__list__item -subItem"
            clickable
            v-ripple
            :to="{ name: item.name }"
          >
            <q-item-section avatar>
              <q-icon :name="item.icon" />
            </q-item-section>
            <q-item-section>
              {{ item.label }}
            </q-item-section>
          </q-item>
        </template>
      </q-expansion-item>
    </q-list>
  </q-drawer>
</template>

<script lang="ts">
import { useStore } from 'src/store';
import { defineComponent, computed, ref } from 'vue';
import { getServerFilePhoto } from 'src/utils/staticFiles';
import { IUser } from 'src/types';
import ImagePlaceHolder from 'src/assets/Profile/ProfilePlaceHolder.jpg';

export default defineComponent({
  name: 'Sidebar',
  props: {
    open: {
      type: Boolean,
      default: true,
      required: true,
    },
    mini: {
      type: Boolean,
      default: true,
      required: false,
    },
  },
  setup(props, { emit }) {
    const saveMiniState = ref(props.mini);
    const store = useStore();

    const sidebarItem = {
      teachers: [
        {
          icon: 'person_add',
          label: 'Registro suplentes',
          separator: true,
          link: 'register-substitute',
          name: 'RegisterSubstitute',
          enable: true,
        },
        {
          icon: 'groups',
          label: 'Lista de suplentes',
          separator: false,
          link: 'list-substitute',
          name: 'ListSubstitute',
          enable: true,
        },
        {
          icon: 'account_balance',
          label: 'Registrar Banco',
          separator: false,
          link: 'ListSubstitute',
          name: 'RegisterBank',
          enable: true,
        },
        {
          icon: 'credit_card',
          label: 'Registrar documentos de identidad',
          separator: false,
          link: 'register-tpdocument',
          name: 'RegisterTpDocument',
          enable: true,
        },
        {
          icon: 'inventory',
          label: 'Registrar Marcador',
          separator: false,
          link: 'register-marker',
          name: 'RegisterMarker',
          enable: false,
        },
        {
          icon: 'public',
          label: 'Registrar nacionalidad',
          separator: false,
          link: 'register-nationality',
          name: 'RegisterNationality',
          enable: true,
        },
        {
          icon: 'route',
          label: 'Registrar Sede',
          separator: false,
          link: 'register-campus',
          name: 'RegisterCampus',
          enable: true,
        },
        {
          icon: 'event',
          label: 'Registrar feriado',
          separator: false,
          link: 'register-holidays',
          name: 'RegisterHoliDays',
          enable: false,
        },
        {
          icon: 'push_pin',
          label: 'Registrar permiso',
          separator: false,
          link: 'register-permission',
          name: 'RegisterPermission',
          enable: false,
        },
        {
          icon: 'fas fa-briefcase',
          label: 'Registrar cargo',
          separator: false,
          link: 'register-position',
          name: 'RegisterPosition',
          enable: true,
        },
        {
          icon: 'assignment_ind',
          label: 'Registrar documentos empleado',
          separator: false,
          link: 'register-employee-document',
          name: 'RegisterEmployeeDocument',
          enable: true,
        },
      ],
      employess: [
        {
          icon: 'person_add',
          label: 'Registrar empleado',
          separator: true,
          link: 'register-employee',
          name: 'RegisterEmployee',
          enable: true,
        },
        {
          icon: 'groups',
          label: 'Listar empleados',
          separator: true,
          link: 'list-employee',
          name: 'ListEmployee',
          enable: true,
        },
        {
          icon: 'fas fa-folder',
          label: 'Listar Documentos',
          separator: true,
          link: 'list-employee-document',
          name: 'ListEmployeeDocument',
          enable: true,
        },
        {
          icon: 'fas fa-folder',
          label: 'Estado de Documentos',
          separator: true,
          link: 'state-document-employee',
          name: 'ReportStateDocumentEmployee',
          enable: true,
        },
        {
          icon: 'how_to_reg',
          label: 'Aprobar empleado',
          separator: true,
          link: 'approve-employee',
          name: 'ApproveEmployee',
          enable: true,
        },
        {
          icon: 'event',
          label: 'Registro de permiso',
          separator: true,
          link: 'register-permission',
          name: 'RegisterPermission',
          enable: false,
        },
        {
          icon: 'paid',
          label: 'Sueldo masivo',
          separator: true,
          link: 'planilla-massive',
          name: 'PlanillaMassive',
          enable: false,
        },
        {
          icon: 'groups',
          label: 'Cese Empleado',
          separator: true,
          link: 'cese-employee',
          name: 'CeseEmployee',
          enable: true,
        },
        {
          icon: 'fas fa-user-alt-slash',
          label: 'Lista negra Empleado',
          separator: true,
          link: 'list-black',
          name: 'ListBlackEmployee',
          enable: true,
        },
        {
          icon: 'fas fa-calendar-alt',
          label: 'Reporte de asistencia',
          separator: true,
          link: 'report-assistance',
          name: 'ReportAssistanceTareoEmployee',
          enable: true,
        },
      ],
      tareos: [
        {
          icon: 'groups',
          label: 'Configurar planilla',
          separator: true,
          link: 'RegisterSubstitute',
          name: 'ListSubstitute',
          enable: false,
        },
        {
          icon: 'groups',
          label: 'Procesar planilla',
          separator: true,
          link: 'process-planilla',
          name: 'ProcessPlanilla',
          enable: false,
        },
        {
          icon: 'groups',
          label: 'Reporte planilla',
          separator: true,
          link: 'report-planilla',
          name: 'ReportPlanilla',
          enable: false,
        },
        {
          icon: 'groups',
          label: 'Tareo (Celular)',
          separator: true,
          link: 'list-tareo',
          name: 'ListTareoEmployee',
          enable: true,
        },
        {
          icon: 'groups',
          label: 'Permisos (Celular)',
          separator: true,
          link: 'list-tareo-permission',
          name: 'ListPermissionTareoEmployee',
          enable: true,
        },
      ],
      users: [
        {
          icon: 'contact_page',
          label: 'Usuarios',
          separator: false,
          link: 'list-user',
          name: 'ListUserWebMovil',
          enable: true,
        },
        {
          icon: 'contact_page',
          label: 'Perfiles de usuario',
          separator: false,
          link: 'profile-permission',
          name: 'ListProfilePermissionUser',
          enable: true,
        },
        {
          icon: 'fas fa-cogs',
          label: 'Auditoria',
          separator: false,
          link: 'logs-dba',
          name: 'ListLogsDb',
          enable: true,
        },
      ],
    };

    const user = computed(
      () => (store.getters as { [key: string]: unknown })['AuthModule/getUser']
    );

    const openSidebar = computed({
      get() {
        return props.open;
      },
      set(newValue) {
        emit('change-sidebar', newValue);
      },
    });

    const miniSidebar = computed({
      get() {
        return props.mini;
      },
      set(newValue) {
        emit('change-mini-sidebar', newValue);
      },
    });

    const handleMouseOver = () => {
      saveMiniState.value = miniSidebar.value as boolean;
      if (miniSidebar.value) {
        miniSidebar.value = false;
      }
    };

    const handleMouseout = () => {
      miniSidebar.value = saveMiniState.value;
    };

    return {
      openSidebar,
      sidebarItem,
      miniSidebar,
      handleMouseOver,
      handleMouseout,
      user: user.value as IUser,
      getServerFilePhoto,
      ImagePlaceHolder,
    };
  },
});
</script>

<style lang="scss" scoped>
@import url('./Sidebar.scss');
</style>
