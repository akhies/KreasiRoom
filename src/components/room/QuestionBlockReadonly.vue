<template>
  <div class="p-3 mb-3 bg-dark h1 text-white rounded-lg">
    <b-row>
      <b-col>
        <p v-if="!!senderId" class="mb-1">
          {{ senderName }}
        </p>
        <blockquote class="mb-0">{{ message }}</blockquote>
      </b-col>
      <b-col cols="auto">
        <span class="inline-block">
          <fa-icon :icon="faThumbsUp" class="mr-1"></fa-icon>
          <span>{{ likesCounter }}</span>
        </span>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons/faThumbsUp';
import { BCard } from 'bootstrap-vue';

export default {
  components: {
    BCard
  },
  props: {
    senderId: {
      type: String,
      default: ''
    },
    senderName: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: ''
    },
    likedBy: {
      type: Array,
      default: []
    },
    likesCounter: {
      type: Number,
      default: 0
    }
  },
  computed: {
    faThumbsUp() {
      return faThumbsUp;
    }
  }
};
</script>
