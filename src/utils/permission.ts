import { useStore } from 'src/store';
import { IPermissionsModules } from 'src/types';

export function can(action: string, subjet: string, parent = '') {
  const store = useStore();

  const permission = (store.getters as { [key: string]: unknown })[
    'AuthModule/getPermission'
  ] as IPermissionsModules[];

  if (permission.length === 0) {
    return false;
  }

  let isPermission = false;
  let isParentPermission = false;

  permission.forEach((itermPermission) => {
    if (itermPermission.name === subjet) {
      itermPermission.permission.forEach((itemAction) => {
        if (itemAction.sp_nombre === parent && itemAction.hasPermission) {
          isParentPermission = true;
        }

        if (itemAction.hasPermission && itemAction.sp_nombre === action) {
          isPermission = true;
        }
      });
    }
  });

  return parent ? isPermission && isParentPermission : isPermission;
}
