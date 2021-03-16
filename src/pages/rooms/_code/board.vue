<template>
  <section class="py-4">
    <div class="mb-4 text-center">
      <p>Room ini akan berakhir dalam:</p>
      <span class="h1 mb-0">
        {{ timerDisplay }}
      </span>
    </div>
    <div v-if="youtubeLiveUrl" class="mb-4">
      <iframe
        width="560"
        height="315"
        :src="`https://www.youtube.com/embed/${youtubeLiveId}`"
        frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        class="w-100"
      ></iframe>
    </div>
    <b-card no-body class="mb-4 bg-dark rounded-lg border-dark">
      <b-tabs
        card
        nav-wrapper-class="bg-body"
        nav-class="px-3"
        active-nav-item-class="bg-dark text-white border-dark"
      >
        <b-tab
          no-body
          title="Pertanyaan"
          active
          title-link-class="text-white px-5"
        >
          <b-card-body body-bg-variant="dark" body-text-variant="light">
            <b-form>
              <b-form-group :state="inputQuestion.length > 0">
                <b-form-textarea
                  placeholder="Kirim pertanyaanmu disini"
                  rows="3"
                  max-rows="3"
                  no-resize
                  class="border-dark"
                  v-model="inputQuestion"
                ></b-form-textarea>
              </b-form-group>
              <div class="text-right">
                <b-button
                  variant="dark"
                  class="bg-body"
                  :disabled="!enableSendQuestion"
                  @click="sendQuestion"
                >
                  <template v-if="!isSendingQuestion">
                    <span>Kirim</span>
                  </template>
                  <template v-else>
                    <fa-icon :icon="faSpinner" spin class="mr-1"></fa-icon>
                    <span>Sedang mengirim...</span>
                  </template>
                </b-button>
              </div>
            </b-form>
          </b-card-body>
        </b-tab>
        <b-tab
          no-body
          :title="`Peserta (${attendantsCounter})`"
          title-link-class="text-white px-5"
          class="bg-dark"
        >
          <div class="p-2 text-right">
            <b-button variant="primary" @click="getAttendants(true)">
              <fa-icon :icon="faSync" class="mr-2"></fa-icon>
              <span>Refresh</span>
            </b-button>
          </div>
          <b-list-group flush v-if="attendants.length">
            <b-list-group-item
              v-for="attendant in attendants"
              :key="attendant.id"
            >
              <h5 class="mb-0">{{ attendant.name }}</h5>
              <p class="mb-0 text-secondary" v-if="attendant.email">
                {{ attendant.email }}
              </p>
            </b-list-group-item>
          </b-list-group>
          <p
            v-if="!attendants.length && !isLoadingAttendants"
            class="py-2 mb-0 lead text-center"
          >
            Belum ada peserta.
          </p>
          <loading-indicator v-if="isLoadingAttendants"></loading-indicator>
        </b-tab>
      </b-tabs>
    </b-card>
    <b-card no-body class="mb-4 rounded-lg border-dark">
      <b-card-body class="p-0 bg-body" body-text-variant="light">
        <div class="p-3">
          <b-row>
            <b-col>
              <h2 class="mb-2 h4">Daftar Pertanyaan</h2>
            </b-col>
            <b-col cols="12" md="auto">
              <b-button
                variant="primary"
                :to="`/rooms/${roomCode}/present`"
                class="mr-2"
                >Mode Presentasi</b-button
              >
              <b-button variant="primary" @click="getQuestions(true)">
                <fa-icon :icon="faSync" class="mr-2"></fa-icon>
                <span>Refresh</span>
              </b-button>
            </b-col>
          </b-row>
        </div>
        <div class="p-3 pb-0 bg-dark">
          <template v-if="questions.length">
            <div
              class="p-3 mb-3 bg-body text-white rounded-lg"
              v-for="(question, index) in questions"
              :key="question.id"
            >
              <blockquote class="mb-1">{{ question.message }}</blockquote>
              <b-row class="justify-content-end">
                <b-col cols="auto">
                  <b-button
                    v-if="isHost"
                    @click="deleteQuestion(question.id)"
                    :disabled="question.isDeletingQuestion"
                    size="sm"
                    variant="danger"
                    class="mr-2"
                    >Hapus</b-button
                  >
                  <b-button
                    v-if="!question.hasRead"
                    @click="likeQuestion(index, !question.hasLiked)"
                    :disabled="question.isLikingQuestion"
                    size="sm"
                    variant="primary"
                  >
                    <fa-icon :icon="faThumbsUp" class="mr-1"></fa-icon>
                    <span
                      >{{ question.hasLiked ? 'Unlike' : 'Like' }} ({{
                        question.likesCounter
                      }})</span
                    >
                  </b-button>
                </b-col>
              </b-row>
            </div>
          </template>
          <p
            v-if="!questions.length && !isLoadingQuestions"
            class="py-2 mb-3 lead text-center"
          >
            Belum ada pertanyaan.
          </p>
          <loading-indicator v-if="isLoadingQuestions"></loading-indicator>
        </div>
      </b-card-body>
    </b-card>
    <b-button variant="primary" :to="`/rooms/${roomCode}`"
      >Kembali ke Detail Room</b-button
    >
    <b-modal
      id="room-closed"
      centered
      hide-header
      ok-only
      ok-title="Keluar Sekarang"
      ok-variant="danger"
      no-close-on-esc
      no-close-on-backdrop
      @ok="$router.push('/rooms')"
      >Room telah ditutup.</b-modal
    >
  </section>
</template>

<script>
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
import { faChalkboard } from '@fortawesome/free-solid-svg-icons/faChalkboard';
import { faBell } from '@fortawesome/free-solid-svg-icons/faBell';
import { faCalendar } from '@fortawesome/free-solid-svg-icons/faCalendar';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons/faPaperPlane';
import { faSync } from '@fortawesome/free-solid-svg-icons/faSync';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons/faThumbsUp';
import {
  BForm,
  BCard,
  BCardBody,
  BFormTextarea,
  BTabs,
  BTab,
  BListGroup,
  BListGroupItem
} from 'bootstrap-vue';
import {
  validateActiveRoomCode,
  fetchRoomInfoByCode,
  fetchRoomDetail
} from '@/api/rooms';
import {
  fetchAllQuestions,
  addQuestion,
  likeQuestion,
  deleteQuestion
} from '@/api/questions';
import { fetchAllAttendants } from '@/api/attendants';
import globalToast from '@/helpers/global-toast';
import requestQuestionNotification from '@/helpers/notifications/question';
import { dateToISO } from '@/helpers/format-date';
import getParameters from '@/helpers/get-parameters';

const getTimeRemaining = endtime => {
  const timeRemaining = endtime - Date.parse(new Date());
  const seconds = Math.floor((timeRemaining / 1000) % 60);
  const minutes = Math.floor((timeRemaining / 1000 / 60) % 60);
  const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));

  return {
    timeRemaining,
    days,
    hours,
    minutes,
    seconds
  };
};

const showLeadingZeros = number => {
  return ('0' + number).slice(-2);
};

export default {
  layout: 'room',
  async validate({ $fireStore, params }) {
    return await validateActiveRoomCode($fireStore, params.code);
  },
  components: {
    BForm,
    BCard,
    BCardBody,
    BFormTextarea,
    BTabs,
    BTab,
    BListGroup,
    BListGroupItem
  },
  async asyncData({ $fireStore, params }) {
    try {
      const room = await fetchRoomInfoByCode($fireStore, params.code);
      const roomDetail = await fetchRoomDetail($fireStore, room.id);
      return {
        ...room,
        ...roomDetail
      };
    } catch (error) {
      console.error(error);
    }
  },
  data() {
    return {
      questions: [],
      inputQuestion: '',
      isSendingQuestion: false,
      isLoadingQuestions: false,
      isDeletingQuestion: false,
      attendants: [],
      isLoadingAttendants: false,
      isNotificationActive: false,
      isCheckingToken: true,
      timerInterval: null,
      timer: {
        timeRemaining: 0,
        days: '',
        hours: '',
        minutes: '',
        seconds: ''
      }
    };
  },
  head() {
    return {
      title: this.name || ''
    };
  },
  computed: {
    faSpinner() {
      return faSpinner;
    },
    faChalkboard() {
      return faChalkboard;
    },
    faBell() {
      return faBell;
    },
    faCalendar() {
      return faCalendar;
    },
    faSignOutAlt() {
      return faSignOutAlt;
    },
    faPaperPlane() {
      return faPaperPlane;
    },
    faSync() {
      return faSync;
    },
    faThumbsUp() {
      return faThumbsUp;
    },
    currentUser() {
      return this.$store.getters['getUserInfo'];
    },
    roomCode() {
      return this.$route.params.code;
    },
    isHost() {
      return this.currentUser.id === this.hostId;
    },
    enableSendQuestion() {
      return this.inputQuestion.length && !this.isSendingQuestion;
    },
    timerDisplay() {
      return `${this.timer.days}:${this.timer.hours}:${this.timer.minutes}:${this.timer.seconds}`;
    },
    isRoomClosed() {
      return this.timeRemaining === 0;
    },
    youtubeLiveId() {
      return this.youtubeLiveUrl ? getParameters('v', this.youtubeLiveUrl) : '';
    }
  },
  async mounted() {
    try {
      this.showTimeRemaining();
      this.getQuestions(true);
      this.getAttendants(true);

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
  beforeDestroy() {
    clearInterval(this.timerInterval);
  },
  methods: {
    showTimeRemaining() {
      this.timerInterval = setInterval(this.updateTimeRemaining, 1000);
    },
    updateTimeRemaining() {
      const timer = getTimeRemaining(this.checkOut.seconds * 1000);
      this.timer.timeRemaining = timer.timeRemaining;
      this.timer.days = showLeadingZeros(timer.days);
      this.timer.hours = showLeadingZeros(timer.hours);
      this.timer.minutes = showLeadingZeros(timer.minutes);
      this.timer.seconds = showLeadingZeros(timer.seconds);

      if (timer.timeRemaining <= 0) {
        clearInterval(this.timerInterval);
      }
    },
    showRoomClosedAlert() {
      this.$bvModal.show('room-closed');
    },
    async getQuestions(isRefresh = false) {
      try {
        this.isLoadingQuestions = true;
        this.questions.length = 0;
        const questions = await fetchAllQuestions(this.$fireStore, {
          roomId: this.id,
          userId: this.currentUser.id
        });
        this.questions = questions;
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoadingQuestions = false;
      }
    },
    async sendQuestion() {
      if (this.isRoomClosed) {
        this.showRoomClosedAlert();
        return;
      }
      try {
        this.isSendingQuestion = true;
        await addQuestion(this.$fireStore, this.$fireStoreObj, {
          roomId: this.id,
          message: this.inputQuestion,
          senderId: this.currentUser.id,
          senderName: this.currentUser.name
        });
        this.inputQuestion = '';
        await this.getQuestions(true);
      } catch (error) {
        console.error(error);
      } finally {
        this.isSendingQuestion = false;
      }
    },
    async likeQuestion(questionIndex, isLike = true) {
      const selectedQuestion = this.questions[questionIndex];
      selectedQuestion.isLikingQuestion = true;
      try {
        await likeQuestion(this.$fireStore, this.$fireStoreObj, {
          roomId: this.id,
          userId: this.currentUser.id,
          isLike,
          questionId: selectedQuestion.id
        });
        selectedQuestion.hasLiked = isLike;
        if (!isLike) {
          selectedQuestion.likesCounter -= 1;
          selectedQuestion.likedBy.pop();
          return;
        }
        selectedQuestion.likedBy.push(this.currentUser.id);
        selectedQuestion.likesCounter += 1;
      } catch (error) {
        console.error(error);
      } finally {
        this.questions[questionIndex].isLikingQuestion = false;
      }
    },
    async deleteQuestion(questionId) {
      if (this.isRoomClosed) {
        this.showRoomClosedAlert();
        return;
      }
      if (!confirm('Hapus pertanyaan ini?')) return;
      this.isDeletingQuestion = true;
      try {
        await deleteQuestion(this.$fireStore, { roomId: this.id, questionId });
        globalToast(this.$bvToast, 'Berhasil menghapus pertanyaan.', 'success');
        this.getQuestions(true);
      } catch (error) {
        console.error(error);
      } finally {
        this.isDeletingQuestion = false;
      }
    },
    async getAttendants(isRefresh = false) {
      try {
        this.isLoadingAttendants = true;
        this.attendants.length = 0;
        const attendants = await fetchAllAttendants(this.$fireStore, this.id);
        this.attendants = attendants;
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoadingAttendants = false;
      }
    },
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
        await requestQuestionNotification(fcmToken, this.roomCode);
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
