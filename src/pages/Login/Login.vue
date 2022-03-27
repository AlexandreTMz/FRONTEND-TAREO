<template>
  <div class="p-login">
    <q-card class="p-login__card">
      <q-card-section class="p-login__box-info">
        <div style="width: 100%; text-align: center">
          <img src="https://i.postimg.cc/HxxC7w0f/logo.jpg" />
        </div>
        <div class="p-login__boxItems">
          <p class="p-login__cita">
            Trabajando de manera competente, con calidad, aplicando normas y
            procedimientos
          </p>
        </div>
      </q-card-section>

      <q-card-section>
        <q-form class="p-login__card__form" @submit.prevent="handleSubmitLogin">
          <q-input
            outlined
            label="Usuario"
            v-model="user"
            hint="Ingrese su usuario"
            :rules="[
              (val) =>
                (val && val.length > 0) || 'El usuario no puede estar vacio',
            ]"
          >
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>

          <q-input
            outlined
            label="Contraseña"
            v-model="password"
            type="password"
            hint="Ingrese su contraseña"
            :rules="[
              (val) =>
                (val && val.length > 0) || 'La contraseña no puede estar vacia',
            ]"
          >
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
          </q-input>

          <q-btn
            class="p-login__card__form__submit"
            label="Iniciar sesión"
            type="submit"
            color="primary"
          ></q-btn>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
import { MessageError } from 'src/utils/swal';
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'src/store';

export default defineComponent({
  setup() {
    const user = ref('');
    const password = ref('');
    const router = useRouter();
    const store = useStore();

    const handleSubmitLogin = async () => {
      const loginFetch = (await (
        await fetch(`${String(process.env.API_URL)}adm/api/login/wusuario`, {
          method: 'POST',
          body: JSON.stringify({
            usuario: user.value,
            contrasenia: password.value,
          }),
        })
      ).json()) as unknown as { msg: string };

      if (loginFetch.hasOwnProperty('msg')) {
        MessageError({ title: loginFetch.msg });
      } else {
        store.commit('AuthModule/setUser', loginFetch);
        const dataToBase64 = btoa(JSON.stringify(loginFetch));
        window.localStorage.setItem('user', dataToBase64);
        void router.push({ name: 'Dashboard' });
      }
    };

    onMounted(() => {
      const isLogin = (store.getters as unknown as { [key: string]: string })[
        'AuthModule/getIsLogin'
      ];

      if (isLogin) {
        void router.push({ name: 'Dashboard' });
      }
    });

    return { handleSubmitLogin, user, password };
  },
});
</script>

<style lang="scss" scoped>
@import './Login.scss';
</style>
