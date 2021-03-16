<template>
  <div class="d-flex flex-column vh-100">
    <app-navbar></app-navbar>
    <div class="d-flex flex-grow-1 align-items-center">
      <nuxt />
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'auth',
  created() {
    const routeQuery = this.$route.query;
    if (routeQuery && routeQuery.room) {
      this.$router.push({ path: `/rooms/${routeQuery.room}` });
    }
  }
};
</script>
