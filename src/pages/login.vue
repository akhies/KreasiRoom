<template>
  <div>
    <section class="py-5" style="max-width: 45rem">
      <h1 class="h2 mb-5 font-weight-normal">
        Temukan event yang sedang populer di kotamu dan<br />gunakan fitur tanya
        jawab secara virtual. Masuk sekarang:
      </h1>
      <b-row align-h="center">
        <b-col lg="5" class="mb-4">
          <b-form @submit.prevent="loginWithEmailAndPassword" class="mb-4">
            <b-form-group :state="!$v.form.email.$error">
              <b-form-input
                type="email"
                id="email-address"
                size="lg"
                class="border-left-0 border-right-0 border-top-0 rounded-0 form-email"
                v-model="$v.form.email.$model"
              ></b-form-input>

              <div slot="invalid-feedback">
                <div v-if="!$v.form.email.required">
                  Alamat email wajib diisi
                </div>
                <div v-if="!$v.form.email.email">
                  Format alamat email salah
                </div>
              </div>
            </b-form-group>
            <b-form-group
              :state="!$v.form.password.$error"
              invalid-feedback="Kata sandi wajib diisi"
            >
              <b-form-input
                type="password"
                id="password"
                size="lg"
                class="border-left-0 border-right-0 border-top-0 rounded-0 form-password"
                :style="{
                  'background-image': '~assets/images/icon-password.png'
                }"
                v-model="$v.form.password.$model"
              ></b-form-input>

              <nuxt-link to="/reset-password" style="text-decoration: underline"
                >Lupa Kata Sandi?</nuxt-link
              >
            </b-form-group>
            <b-button
              block
              size="lg"
              variant="dark"
              type="submit"
              :disabled="isLoggingIn"
            >
              <template v-if="!isLoggingInWithEmailAndPassword">
                <span>Masuk</span>
              </template>
              <template v-else>
                <fa-icon :icon="faSpinner" spin class="mr-2"></fa-icon>
                <span>Sedang masuk...</span>
              </template>
            </b-button>
          </b-form>
          <p>Belum bergabung?</p>
          <b-button to="/register" size="lg" variant="dark" block
            >Daftar Akun</b-button
          >
        </b-col>
        <b-col lg="5" offset-lg="2">
          <p class="mb-3">
            Atau masuk menggunakan akun media sosial:
          </p>
          <b-button
            variant="dark"
            class="mb-3"
            size="lg"
            @click="loginWithGoogle"
            :disabled="isLoggingIn"
          >
            <b-img
              src="@/assets/images/logo-google-white.png"
              class="mr-2"
              height="24"
            ></b-img>
            <span v-if="!isLoggingInWithGoogle">Masuk dengan Google</span>
            <span v-else>Logging in...</span>
          </b-button>
          <br />
          <b-button
            variant="dark"
            size="lg"
            @click="loginWithFacebook"
            :disabled="isLoggingIn"
          >
            <b-img
              src="@/assets/images/logo-facebook-white.png"
              class="mr-2"
              height="24"
            ></b-img>
            <span v-if="!isLoggingInWithFacebook">Masuk dengan Facebook</span>
            <span v-else>Logging in...</span>
          </b-button>
        </b-col>
      </b-row>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.form {
  &-email,
  &-password {
    padding-left: 3rem;
    background: {
      size: 1.5rem auto;
      position: left center;
      repeat: no-repeat;
    }
  }
  &-email {
    background-image: url('~assets/images/icon-email.png');
  }
  &-password {
    background-image: url('~assets/images/icon-password.png');
  }
}
</style>

<script>
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons/faSignInAlt';
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
import { BForm, BFormInput } from 'bootstrap-vue';
import { required, email } from 'vuelidate/lib/validators';
import { addNewUser, getUserInfo } from '@/api/users';
import { addErrorLog } from '@/api/errors';
import globalToast from '@/helpers/global-toast';

export default {
  layout: 'auth',
  components: {
    BForm,
    BFormInput
  },
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      isLoggingIn: false,
      isLoggingInWithEmailAndPassword: false,
      isLoggingInWithFacebook: false,
      isLoggingInWithGoogle: false
    };
  },
  computed: {
    faSignInAlt() {
      return faSignInAlt;
    },
    faSpinner() {
      return faSpinner;
    }
  },
  validations: {
    form: {
      email: {
        required,
        email
      },
      password: {
        required
      }
    }
  },
  methods: {
    async loginWithGoogle() {
      try {
        this.isLoggingIn = true;
        this.isLoggingInWithGoogle = true;
        const provider = new this.$fireAuthObj.GoogleAuthProvider();
        const userCredential = await this.$fireAuth.signInWithPopup(provider);
        await this.createUserAfterLogin(userCredential);
      } catch (error) {
        this.isLoggingIn = false;
        this.isLoggingInWithGoogle = false;
        addErrorLog(this.$fireStore, {
          code: error.code,
          message: error.message
        });
      }
    },
    async loginWithFacebook() {
      try {
        this.isLoggingIn = true;
        this.isLoggingInWithFacebook = true;
        const provider = new this.$fireAuthObj.FacebookAuthProvider();
        const userCredential = await this.$fireAuth.signInWithPopup(provider);
        await this.createUserAfterLogin(userCredential);
      } catch (error) {
        this.isLoggingIn = false;
        this.isLoggingInWithFacebook = false;
        addErrorLog(this.$fireStore, {
          code: error.code,
          message: error.message
        });
      }
    },
    async createUserAfterLogin(userCredential) {
      if (userCredential.additionalUserInfo.isNewUser) {
        await addNewUser(this.$fireStore, {
          userId: userCredential.user.uid,
          userInfo: {
            name: userCredential.user.displayName,
            email: userCredential.user.email,
            picture: userCredential.user.photoURL,
            phoneNumber: userCredential.user.phoneNumber,
            loginWith: userCredential.additionalUserInfo.providerId,
            registeredAt: this.$fireStoreObj.FieldValue.serverTimestamp(),
            emailUpdatedAt: this.$fireStoreObj.FieldValue.serverTimestamp()
          }
        });
      }
      this.redirectAfterLogin();
    },
    async loginWithEmailAndPassword() {
      try {
        this.isLoggingIn = true;
        this.$v.$touch();
        if (this.$v.$invalid)
          throw new Error('Complete the form before submit');
        await this.$fireAuth.signInWithEmailAndPassword(
          this.form.email,
          this.form.password
        );
        this.redirectAfterLogin();
      } catch (error) {
        console.error('login with email password error: ', error);
        this.isLoggingIn = false;
      }
    },
    redirectAfterLogin() {
      const routeQuery = this.$route.query;
      const nextPath =
        routeQuery && routeQuery.room ? `/${routeQuery.room}` : '';
      this.$router.push({
        path: '/rooms' + nextPath
      });
    }
  }
};
</script>
