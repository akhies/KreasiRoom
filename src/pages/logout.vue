<template>
  <div class="d-flex vh-100 w-full justify-content-center align-items-center">
    <p class="mb-0 lead text-center">Keluar dari akun...</p>
  </div>
</template>

<script>
export default {
  layout: 'empty',
  async mounted() {
    await this.$store.dispatch('logout');
    this.$router.push('/login');
  }
};
</script>
