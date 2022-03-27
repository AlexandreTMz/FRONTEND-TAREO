import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('src/layouts/Dashboard/index.vue'),
    redirect: () => {
      return { name: 'Home' };
    },

    children: [
      {
        path: '#',
        name: 'Home',
        component: () => import('pages/Dashboard/Home'),
      },
      {
        path: 'register-substitute',
        name: 'RegisterSubstitute',
        component: () => import('pages/Dashboard/RegisterSubstitute'),
      },
      {
        path: 'register-bank',
        name: 'RegisterBank',
        component: () => import('pages/Dashboard/RegisterBank'),
      },
      {
        path: 'list-substitute',
        name: 'ListSubstitute',
        component: () => import('pages/Dashboard/ListPersonSubstitute'),
      },
      {
        path: 'edit-substitute',
        name: 'EditSubstitute',
        component: () => import('pages/Dashboard/EditSubstitute'),
      },
      {
        path: 'register-tpdocument',
        name: 'RegisterTpDocument',
        component: () => import('pages/Dashboard/RegisterTpDocument'),
      },
      {
        path: 'register-employee',
        name: 'RegisterEmployee',
        component: () => import('pages/Dashboard/RegisterEmployee'),
      },
      {
        path: 'register-employee-document',
        name: 'RegisterEmployeeDocument',
        component: () => import('pages/Dashboard/RegisterEmployeeDocument'),
      },
      {
        path: 'register-campus',
        name: 'RegisterCampus',
        component: () => import('pages/Dashboard/RegisterCampus'),
      },
      {
        path: 'register-holidays',
        name: 'RegisterHoliDays',
        component: () => import('src/pages/Dashboard/RegisterHoliDays'),
      },
      {
        path: 'register-permission',
        name: 'RegisterPermission',
        component: () => import('src/pages/Dashboard/RegisterPermission'),
      },
      {
        path: 'register-position',
        name: 'RegisterPosition',
        component: () => import('src/pages/Dashboard/RegisterPosition'),
      },
      {
        path: 'register-marker',
        name: 'RegisterMarker',
        component: () => import('src/pages/Dashboard/RegisterMarker'),
      },
      {
        path: 'register-nationality',
        name: 'RegisterNationality',
        component: () => import('src/pages/Dashboard/RegisterNationality'),
      },
      {
        path: 'list-employee',
        name: 'ListEmployee',
        component: () => import('src/pages/Dashboard/ListEmployee'),
      },
      {
        path: 'approve-employee',
        name: 'ApproveEmployee',
        component: () => import('src/pages/Dashboard/ApproveEmployee'),
      },
      {
        path: 'edit-employee',
        name: 'EditEmployee',
        component: () => import('src/pages/Dashboard/EditEmployee'),
      },
      {
        path: 'process-planilla',
        name: 'ProcessPlanilla',
        component: () => import('src/pages/Dashboard/ProcessPlanilla'),
      },
      {
        path: 'report-planilla',
        name: 'ReportPlanilla',
        component: () => import('src/pages/Dashboard/ReportPlanilla'),
      },
      {
        path: 'list-tareo',
        name: 'ListTareoEmployee',
        component: () => import('src/pages/Dashboard/ListTareoEmployee'),
      },
      {
        path: 'list-employee-document',
        name: 'ListEmployeeDocument',
        component: () => import('pages/Dashboard/ListEmployeeDocument'),
      },
      {
        path: 'list-tareo-permission',
        name: 'ListPermissionTareoEmployee',
        component: () =>
          import('src/pages/Dashboard/ListPermissionTareoEmployee'),
      },
      {
        path: 'planilla-massive',
        name: 'PlanillaMassive',
        component: () => import('src/pages/Dashboard/PlanillaMassive'),
      },
      {
        path: 'cese-employee',
        name: 'CeseEmployee',
        component: () => import('src/pages/Dashboard/CeseEmployee'),
      },
      {
        path: 'list-black',
        name: 'ListBlackEmployee',
        component: () => import('src/pages/Dashboard/ListBlackEmployee'),
      },
      {
        path: 'assign-permission',
        name: 'AssignPermissionUser',
        component: () => import('src/pages/Dashboard/AssignPermissionUser'),
      },
      {
        path: 'list-user',
        name: 'ListUserWebMovil',
        component: () => import('src/pages/Dashboard/ListUserWebMovil'),
      },
      {
        path: 'profile-permission',
        name: 'ListProfilePermissionUser',
        component: () =>
          import('src/pages/Dashboard/ListProfilePermissionUser'),
      },
      {
        path: 'assign-profile-permission',
        name: 'AssignPermissionProfileUser',
        component: () =>
          import('src/pages/Dashboard/AssignPermissionProfileUser'),
      },
      {
        path: 'report-assistance',
        name: 'ReportAssistanceTareoEmployee',
        component: () =>
          import('src/pages/Dashboard/ReportAssistanceTareoEmployee'),
      },
      {
        path: 'change-password',
        name: 'ChangePassword',
        component: () => import('src/pages/Dashboard/ChangePassword'),
      },
      {
        path: 'state-document-employee',
        name: 'ReportStateDocumentEmployee',
        component: () =>
          import('src/pages/Dashboard/ReportStateDocumentEmployee'),
      },
      {
        path: 'logs-dba',
        name: 'ListLogsDb',
        component: () =>
          import('src/pages/Dashboard/ListLogsDb'),
      },
    ],
  },

  {
    path: '',
    name: 'Login',
    component: () => import('src/pages/Login'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
