import { useStore } from 'src/store';
import { IUser, IUserTrack } from 'src/types';

export function getCreateUserTrack(): IUserTrack {
  const store = useStore();

  const user = (store.getters as { [key: string]: unknown })[
    'AuthModule/getUser'
  ] as IUser;

  if (user === null) {
    return {
      userCreacion: 'USUARIO INFILTRADO',
      userModificacion: 'USUARIO INFILTRADO',
    };
  }

  return {
    userCreacion: user.us_usuario,
    fechaCreacion: '',
    userModificacion: user.us_usuario,
    fechaModificacion: '',
    flEliminado: '',
  };
}
