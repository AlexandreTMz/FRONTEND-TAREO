<template>
  <div class="o-formChangePassword">
    <div
      class="o-formChangePassword__wraper o-formChangePassword__wraper--center o-formChangePassword__wraper--smm"
    >
      <div class="o-formChangePassword__header">Cambio de contraseña</div>
      <q-form
        class="o-formChangePassword__form"
        ref="form"
        @submit.prevent="mtd_cambiarContrasenia"
      >
        <div class="o-formChangePassword__box">
          <div class="o-formChangePassword__inputGroups">
            <a-form-label :isStrong="false" label="Contraseña actual">
              <q-input filled dense v-model="contraseniaActual" type="password">
                <template v-slot:prepend>
                  <q-icon color="primary" name="fas fa-lock"></q-icon>
                </template>
              </q-input>
            </a-form-label>
          </div>

          <div class="o-formChangePassword__inputGroups">
            <a-form-label :isStrong="false" label="Nueva contraseña">
              <q-input
                filled
                dense
                v-model="contraseniaFirst"
                type="password"
                error-message="'La contraseña no coincide"
                :error="isValid"
                @update:model-value="mtd_validarContrasenia(1)"
              >
                <template v-slot:prepend>
                  <q-icon color="primary" name="fas fa-lock"></q-icon>
                </template>
              </q-input>
            </a-form-label>
          </div>

          <div class="o-formChangePassword__inputGroups">
            <a-form-label :isStrong="false" label="Nueva contraseña">
              <q-input
                filled
                dense
                v-model="contraseniaSecond"
                type="password"
                error-message="'La contraseña no coincide"
                :error="isValid2"
                @update:model-value="mtd_validarContrasenia(2)"
              >
                <template v-slot:prepend>
                  <q-icon color="primary" name="fas fa-lock"></q-icon>
                </template>
              </q-input>
            </a-form-label>
          </div>

          <div class="o-formChangePassword__inputGroups">
            <q-btn
              label="Cambiar contraseña"
              color="green"
              type="submit"
            ></q-btn>
          </div>
        </div>
      </q-form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import AFormLabel from 'src/components/atoms/FormLabel';
import { QForm } from 'quasar';
import { IUser } from 'src/types';
import { useStore } from 'src/store';
import { fetchRequestAPI, readErrorFetch } from 'src/utils/axios';
import { MessageError, MessageSuccess } from 'src/utils/swal';
import { MESSAGE_EDITAR, MESSAGE_ERROR } from 'src/utils/messages';
import { getCreateUserTrack } from 'src/utils/userTrack';

export default defineComponent({
  name: 'OFormChangePassword',
  components: {
    AFormLabel,
  },
  setup() {
    const store = useStore();

    const contraseniaActual = ref<string>('');
    const contraseniaFirst = ref<string>('');
    const contraseniaSecond = ref<string>('');
    const form = ref<QForm>();
    const isValid = ref<boolean>(false);
    const isValid2 = ref<boolean>(false);
    const userTrack = getCreateUserTrack();

    const mtd_validarContrasenia = (type: number) => {
      if (type === 1) {
        isValid.value =
          contraseniaSecond.value.length == 0
            ? false
            : contraseniaFirst.value !== contraseniaSecond.value;
            if(!isValid.value) isValid2.value = false
      } else if (type === 2){
        isValid2.value =
          contraseniaFirst.value === ''
            ? false
            : contraseniaFirst.value !== contraseniaSecond.value;
            if(!isValid2.value) isValid.value = false
      }
    };

    const fn_validarAmbos = () => {
      isValid.value = contraseniaFirst.value === contraseniaSecond.value;
    };

    const user = computed(
      () => (store.getters as { [key: string]: unknown })['AuthModule/getUser']
    );

    const mtd_cambiarContrasenia = async () => {
      if (contraseniaFirst.value !== contraseniaSecond.value) {
        MessageError({
          title: 'Mensaje del sistema',
          text: 'Las contraseñas ingresadas no coinciden',
        });
        return;
      }

      const formCambioContrasenia = {
        usuario: (user.value as IUser).us_usuario,
        pass_new: contraseniaSecond.value,
        pass_old: contraseniaActual.value,
        userCreacion: userTrack.userCreacion
      };

      const resCambiarContrasenia = await fetchRequestAPI({
        url: '/adm/usuario/cambiar-contrasenia',
        method: 'POST',
        body: JSON.stringify(formCambioContrasenia),
      });

      if (
        readErrorFetch({
          responseFetch: resCambiarContrasenia,
          message: MESSAGE_ERROR(),
        })
      ) {
        return;
      }

      MessageSuccess({
        title: MESSAGE_EDITAR('su contraseña'),
      });

      contraseniaActual.value = '';
      contraseniaFirst.value = '';
      contraseniaSecond.value = '';
      (form.value as QForm).reset();
    };

    return {
      contraseniaActual,
      contraseniaFirst,
      contraseniaSecond,
      mtd_validarContrasenia,
      form,
      user: user.value as IUser,
      mtd_cambiarContrasenia,
      isValid,
      isValid2,
      fn_validarAmbos,
    };
  },
});
</script>

<style lang="scss">
@import url('./FormChangePassword.scss');
</style>
