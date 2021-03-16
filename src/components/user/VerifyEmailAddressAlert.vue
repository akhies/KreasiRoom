<template>
  <b-alert
    :show="showEmailVerificationAlert"
    fade
    :dismissible="emailVerificationSent"
    variant="warning"
  >
    <b-row align-v="center" v-if="!emailVerificationSent">
      <b-col
        ><p class="mb-lg-0">
          You have not verified your email address. Check your inbox or spam to
          verify your email address.
        </p></b-col
      >
      <b-col cols="12" lg="auto">
        <b-button
          @click="sendEmailVerification"
          variant="primary"
          :disabled="isSendingEmailVerification"
          >Send email verification</b-button
        >
      </b-col>
    </b-row>
    <span v-else class="text-muted">Email verification has been sent.</span>
  </b-alert>
</template>

<script>
import { BAlert } from 'bootstrap-vue';
import { sendEmailVerification } from '@/helpers/send-email';
import globalToast from '@/helpers/global-toast.js';

export default {
  name: 'VerifyEmailAddressAlert',
  components: {
    BAlert
  },
  data() {
    return {
      isSendingEmailVerification: false,
      emailVerificationSent: false,
      showEmailVerificationAlert: true
    };
  },
  methods: {
    async sendEmailVerification() {
      this.isSendingEmailVerification = true;
      try {
        await sendEmailVerification(
          this.$fireAuth.currentUser,
          process.env.BASE_URL
        );
        this.emailVerificationSent = true;
      } catch (error) {
        console.error(error);
        globalToast(this.$bvToast, error.message, 'error');
      } finally {
        this.isSendingEmailVerification = false;
      }
    }
  }
};
</script>
