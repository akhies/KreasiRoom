<template>
  <div class="p-4 text-center">
    <fa-icon :icon="faSpinner" spin size="lg"></fa-icon>
  </div>
</template>

<script>
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';

export default {
  name: 'LoadingIndicator',
  computed: {
    faSpinner() {
      return faSpinner;
    }
  }
};
</script>
