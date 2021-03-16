<template>
  <div>
    <blockquote class="mb-1">{{ text }}</blockquote>
    <b-row class="justify-content-end">
      <b-col cols="auto">
        <b-button
          size="sm"
          :variant="hasLiked ? 'success' : 'primary'"
          @click="likeQuestion"
        >
          <fa-icon :icon="faThumbsUp" class="mr-1"></fa-icon>
          <span>{{ likes }}</span>
        </b-button>
        <b-button
          size="sm"
          variant="success"
          class="ml-2"
          v-if="!hasRead"
          @click="readQuestion"
        >
          <fa-icon :icon="faCheckDouble" class="mr-1"></fa-icon>
          <span>Mark as Read</span>
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons/faThumbsUp';
import { faCheckDouble } from '@fortawesome/free-solid-svg-icons/faCheckDouble';

export default {
  name: 'QuestionBlock',
  props: {
    text: {
      type: String
    },
    id: {
      type: String,
      default: ''
    },
    hasLiked: {
      type: Boolean,
      default: false
    },
    hasRead: {
      type: Boolean,
      default: false
    },
    likedBy: {
      type: Array,
      default: []
    }
  },
  computed: {
    likes() {
      const likedBy = this.question.likedBy;
      const likeLabel = 'like' + (likedBy.length > 1 ? 's' : '');
      return likedBy.length ? `${likedBy.length} ${likeLabel}` : 'Like';
    },
    faThumbsUp() {
      return faThumbsUp;
    },
    faCheckDouble() {
      return faCheckDouble;
    }
  },
  methods: {
    likeQuestion(event) {
      this.$emit('like', event);
    },
    readQuestion(event) {
      this.$emit('read', event);
    }
  }
};
</script>
