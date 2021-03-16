<template>
  <div class="py-4">
    <b-container fluid>
      <h1 class="h5 mb-3">Selamat datang, {{ user.name }}</h1>
      <!-- <b-row>
        <b-col sm="6" lg="3">
          <b-card bg-variant="primary" text-variant="light" class="mb-3">
            <div class="h1">5</div>
            <p class="mb-0">active rooms</p>
          </b-card>
        </b-col>
        <b-col sm="6" lg="3">
          <b-card bg-variant="primary" text-variant="light">
            <div class="h1">10</div>
            <p class="mb-0">bookings</p>
          </b-card>
        </b-col>
      </b-row> -->
    </b-container>
  </div>
</template>

<script>
export default {
  layout: 'admin',
  computed: {
    user() {
      return this.$store.getters.getUserInfo;
    }
  }
};
</script>