<template>
  <section
    class="d-flex min-vh-100 py-5 justify-content-center align-items-center"
  >
    <div>
      <p class="lead mb-5 text-center">
        Silahkan masukkan email Anda untuk membuat ulang password Anda.
      </p>
      <b-form
        @submit.prevent="register"
        class="mb-4 mx-auto"
        style="max-width: 20rem"
      >
        <b-form-group :state="!$v.form.email.$error">
          <b-form-input
            type="email"
            id="email-address"
            class="border-left-0 border-right-0 border-top-0 rounded-0 form-email"
            v-model="$v.form.email.$model"
          ></b-form-input>
          <div slot="invalid-feedback">
            <div v-if="!$v.form.email.required">
              Email address is required
            </div>
            <div v-if="!$v.form.email.email">
              Wrong email address format
            </div>
          </div>
        </b-form-group>
        <b-button
          block
          size="lg"
          variant="primary"
          type="submit"
          class="mb-2"
          :disabled="isSubmitting"
          >Ubah Password</b-button
        >
        <b-button
          to="/login"
          size="lg"
          block
          variant="danger"
          :disabled="isSubmitting"
          >Batalkan</b-button
        >
      </b-form>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.form {
  &-email {
    padding-left: 3rem;
    background: {
      size: 1.5rem auto;
      position: left center;
      repeat: no-repeat;
    }
    background-image: url('~assets/images/icon-email.png');
  }
}
</style>

<script>
import { required, email } from 'vuelidate/lib/validators';
import { BForm, BFormInput } from 'bootstrap-vue';
import globalToast from '@/helpers/global-toast.js';

export default {
  layout: 'empty',
  components: {
    BForm,
    BFormInput
  },
  data() {
    return {
      form: {
        email: ''
      },
      isSubmitting: false
    };
  },
  validations: {
    form: {
      email: {
        required,
        email
      }
    }
  },
  methods: {
    async register() {
      try {
        this.isSubmitting = true;
        this.$v.$touch();
        if (this.$v.$invalid)
          throw new Error('Complete the form before submit');

        const result = await this.$fireAuth.sendPasswordResetEmail(
          this.form.email,
          {
            url: `${process.env.baseURL}/?reset=true`
          }
        );
        globalToast(
          this.$root.$bvToast,
          'Your request to reset password has been submitted. Please check your inbox or spam to reset your password.',
          'success'
        );
        this.redirectAfterSubmit();
      } catch (error) {
        console.error(error);
        this.isSubmitting = false;
      }
    },
    redirectAfterSubmit() {
      this.$router.push('/');
    }
  }
};
</script>
