<template>
  <p class="mb-0 text-center">
    Copyright &copy; {{ copyrightYear }} Kreasi Room. All rights reserved.
  </p>
</template>

<script>
export default {
  computed: {
    copyrightYear() {
      const today = new Date();
      return today.getFullYear();
    }
  }
};
</script>
