import { boot } from 'quasar/wrappers';
import { IUser } from 'src/types';

export default boot(async ({ store, router }) => {
  console.log(
    '%cCierra esta ventana, solo es uso para desarrolladores!!!',
    'color: red;font-size:2rem;font-weight:bold;text-align:center;'
  );
  console.log(
    '%cApp Version 0.0',
    'color: green;font-size:1rem;font-weight:bold;'
  );

  const user = window.localStorage.getItem('user');

  if (user) {
    try {
      const userParse = JSON.parse(String(atob(String(user)))) as IUser;

      const loginFetch = (await (
        await fetch(`${String(process.env.API_URL)}adm/api/login/wusuario`, {
          method: 'POST',
          body: JSON.stringify({
            usuario: userParse.us_usuario,
            contrasenia: userParse.us_contrasenia,
          }),
        })
      ).json()) as unknown as { msg: string };

      if (!loginFetch.hasOwnProperty('msg')) {
        store.commit('AuthModule/setUser', loginFetch);
      }
      void router.replace({ name: 'Login' });
    } catch (_) {
      void router.replace({ name: 'Login' });
    }
  }

  router.beforeEach((to, _, next) => {
    if (to.name === 'Login') {
      next();
    } else {
      const isLogin = (store.getters as { [key: string]: unknown })[
        'AuthModule/getIsLogin'
      ];

      if (!isLogin) {
        next({ name: 'Login' });
      }

      next();
    }
  });
});
