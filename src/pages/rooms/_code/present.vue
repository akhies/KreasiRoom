<template>
  <b-container>
    <section class="py-4">
      <b-button class="mb-3" variant="primary" :to="`/rooms/${roomCode}/board`"
        >Kembali ke Room</b-button
      >
      <b-row class="mb-3">
        <b-col>
          <h1 class="mb-0">Pertanyaan</h1>
        </b-col>
        <b-col cols="auto">
          <b-button variant="dark" @click="$fetch">
            <fa-icon :icon="faSync" class="mr-2"></fa-icon>
            <span>Refresh</span>
          </b-button>
        </b-col>
      </b-row>
      <template v-if="questions.length">
        <template v-for="question in questions">
          <question-block-readonly
            :sender-id="question.senderId"
            :sender-name="question.senderName"
            :message="question.message"
            :liked-by="question.likedBy"
            :likes-counter="question.likesCounter"
            :key="question.id"
          />
        </template>
      </template>
      <p
        v-if="!questions.length && !isLoadingQuestions"
        class="py-3 text-center"
      >
        No question available.
      </p>
      <p class="py-3 text-center" v-if="$fetchState.error">
        Error while loading questions.<br />Try refresh questions.
      </p>
      <loading-indicator v-if="$fetchState.pending"></loading-indicator>
    </section>
  </b-container>
</template>

<script>
import { faSync } from '@fortawesome/free-solid-svg-icons/faSync';
import { validateActiveRoomCode, fetchRoomInfoByCode } from '@/api/rooms';
import globalToast from '@/helpers/global-toast';
import requestQuestionNotification from '@/helpers/notifications/question';
import { fetchAllQuestions } from '@/api/questions';

export default {
  layout: 'room',
  async validate({ $fireStore, params }) {
    return await validateActiveRoomCode($fireStore, params.code);
  },
  async asyncData({ $fireStore, params }) {
    try {
      const room = await fetchRoomInfoByCode($fireStore, params.code);
      return room;
    } catch (error) {
      console.error(error);
    }
  },
  data() {
    return {
      isLoadingQuestions: false,
      isNotificationActive: false,
      isCheckingToken: true,
      questions: []
    };
  },
  head() {
    return {
      title: this.name || ''
    };
  },
  computed: {
    faSync() {
      return faSync;
    },
    roomCode() {
      return this.$route.params.code;
    }
  },
  async fetch() {
    try {
      this.isLoadingQuestions = true;
      this.questions.length = 0;
      const questions = await fetchAllQuestions(this.$fireStore, {
        roomId: this.id
      });
      this.questions = questions;
    } catch (error) {
      console.error(error);
    } finally {
      this.isLoadingQuestions = false;
    }
  },
  async mounted() {
    try {
      const user = this.$store.getters['getUserInfo'];
      if (user.id === this.hostId) {
        await this.checkFCMToken();
        this.showNotification();
      } else {
        this.isNotificationActive = true;
      }
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    async checkFCMToken() {
      try {
        const currentToken = await this.$fireMess.getToken();
        if (currentToken) {
          this.$store.commit('SET_FCM_TOKEN', currentToken);
          this.isNotificationActive = true;
        } else {
          // Show permission request.
          this.showNotificationPermission;
        }
      } catch (error) {
        console.log('An error occurred while retrieving token. ', error);
      } finally {
        this.isCheckingToken = false;
      }
    },
    async showNotificationPermission() {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          throw new Error('Unable to get permission to notify.');
        }
        this.isNotificationActive = true;
      } catch (error) {
        console.error(error);
      }
    },
    async showNotification() {
      try {
        // set user on question topic
        const fcmToken = this.$store.state.fcmToken;
        await requestQuestionNotification(fcmToken, this.currentRoomId);
      } catch (error) {
        console.error(error);
      }

      this.$fireMess.onMessage(payload => {
        this.$bvToast.toast(payload.body, {
          title: payload.title,
          variant: 'info'
        });
      });

      this.$fireMess.onTokenRefresh(async function() {
        try {
          const refreshedToken = await this.$fireMess.getToken();
          this.$store.commit('SET_FCM_TOKEN', refreshedToken);
        } catch (error) {
          console.error(error);
        }
      });
    }
  }
};
</script>
