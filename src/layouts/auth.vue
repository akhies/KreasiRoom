<template>
  <div class="min-vh-100">
    <auth-navbar></auth-navbar>
    <main>
      <b-container fluid="xl">
        <nuxt />
      </b-container>
    </main>
  </div>
</template>

<script>
export default {
  middleware: ({ $fireAuth, redirect }) => {
    if ($fireAuth.currentUser) return redirect('/rooms');
  }
};
</script>
