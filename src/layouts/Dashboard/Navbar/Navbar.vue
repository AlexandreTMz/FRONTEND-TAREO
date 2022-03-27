<template>
  <q-header bordered class="l-navbar bg-white">
    <q-toolbar>
      <q-btn
        text-color="black"
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        @click="handleEmitMenu"
      />

      <div class="l-navbar__boxMensaje">
        <div class="l-navbar__boxItems">
          <img
            src="https://i.postimg.cc/HxxC7w0f/logo.jpg"
            width="150"
            height="35"
          />
        </div>
        <div class="l-navbar__boxItems">
          <p class="l-navbar__cita">
            Trabajando de manera competente, con calidad, aplicando normas y
            procedimientos
          </p>
        </div>
        <div class="l-navbar__boxItems">
          <img
            src="https://i.postimg.cc/HxxC7w0f/logo.jpg"
            width="150"
            height="35"
          />
        </div>
      </div>

      <q-btn color="grey-8" fab-mini flat icon="notifications">
        <q-tooltip>Notificaciones</q-tooltip>
      </q-btn>
      <q-btn color="grey-8" fab-mini flat icon="account_circle">
        <q-menu
          auto-close
          transition-show="jump-down"
          transition-hide="jump-up"
        >
          <q-list style="min-width: 150px">
            <q-item clickable @click="mtd_cambiarContrasenia">
              <q-item-section>Cambiar contraseña</q-item-section>
            </q-item>
          </q-list>

          <q-list style="min-width: 150px">
            <q-item clickable @click="handleLogout">
              <q-item-section>Cerrar sesión </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-toolbar>
  </q-header>
</template>
<script lang="ts">
import { useStore } from 'src/store';
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'Navbar',
  setup(_, { emit }) {
    const router = useRouter();
    const store = useStore();

    const handleEmitMenu = () => {
      emit('change-menu-sidebar');
    };

    const handleLogout = () => {
      window.localStorage.removeItem('user');
      store.commit('AuthModule/setUser', null);
      void router.push({ name: 'Login' });
    };

    const mtd_cambiarContrasenia = () => {
      void router.push({ name: 'ChangePassword' });
    };

    return { handleEmitMenu, handleLogout, mtd_cambiarContrasenia };
  },
});
</script>
<style lang="scss" scoped>
@import './Navbar.scss';
</style>
