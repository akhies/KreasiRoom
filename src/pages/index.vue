<template>
  <div></div>
</template>

<script>
export default {
  layout: 'auth',
  middleware({ redirect, query }) {
    return redirect('/login', query);
  }
};
</script>
