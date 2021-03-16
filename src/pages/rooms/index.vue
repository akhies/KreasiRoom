<template>
  <b-form @submit.prevent="searchRoom" class="mx-auto">
    <h1 class="mb-4 text-white text-uppercase">Bergabung ke Room</h1>
    <b-form-group
      :state="!isInputError"
      invalid-feedback="Kode room wajib diisi"
    >
      <b-form-input
        placeholder="Input kode room"
        class="text-center"
        v-model="roomCode"
      ></b-form-input>
    </b-form-group>
    <div class="text-center">
      <b-button variant="primary" size="lg" type="submit">GABUNG</b-button>
    </div>
  </b-form>
</template>

<script>
import { BForm, BFormInput } from 'bootstrap-vue';

export default {
  layout: 'home',
  components: {
    BForm,
    BFormInput
  },
  data() {
    return {
      roomCode: '',
      isInputError: false
    };
  },
  mounted() {
    if (this.$route.query.incomplete) {
      this.$bvToast.toast(
        'Lengkapi profil Anda terlebih dahulu sebelum masuk ke dalam room',
        {
          title: 'Error',
          variant: 'danger'
        }
      );
    }
  },
  methods: {
    searchRoom() {
      if (!this.roomCode) {
        this.isInputError = true;
        return;
      }
      this.$router.push({
        path: '/rooms/search',
        query: {
          code: this.roomCode
        }
      });
    }
  }
};
</script>
