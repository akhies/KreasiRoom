<template>
  <div class="d-flex justify-content-center align-items-center min-vh-100">
    <div class="text-center">
      <div class="mb-4">
        <b-img src="~/assets/images/logo.png" block center></b-img>
      </div>
      <h1 class="h3 text-center" v-if="error.statusCode === 404">
        Halaman tidak ditemukan.
      </h1>
      <h1 class="h3 text-center" v-else>Terjadi kesalahan pada aplikasi.</h1>
      <p class="text-center">
        <nuxt-link to="/" class="text-info">Klik disini</nuxt-link>
        <span>untuk kembali ke halaman utama.</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: ['error'],
  layout: 'empty'
};
</script>
