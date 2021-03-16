<template>
  <div>
    <app-navbar></app-navbar>
    <main>
      <b-container fluid="xl">
        <nuxt />
      </b-container>
    </main>
  </div>
</template>

<script>
export default {
  middleware: 'auth'
};
</script>
