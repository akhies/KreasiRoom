<template>
  <section class="py-4">
    <b-row>
      <b-col lg="8">
        <section class="mb-3">
          <div
            class="d-flex justify-content-between align-items-center p-2 bg-dark rounded"
          >
            <span class="d-inline-block h5 mb-0 text-white"
              >Kode Room: {{ roomCode }}</span
            >
            <b-button variant="dark" @click="copyToClipboard">Copy</b-button>
          </div>
          <input type="hidden" id="room-code" :value="roomCode" />
        </section>

        <section class="mb-4">
          <b-img
            v-if="coverImageUrl"
            :src="coverImageUrl"
            fluid-grow
            class="mb-3"
          ></b-img>
          <h1 class="mb-0">{{ name }}</h1>
        </section>
        <section v-if="description" class="mb-5">
          <h2 class="h5 mb-3">Tentang Room</h2>
          <div v-html="description"></div>
        </section>
        <section class="mb-5">
          <h2 class="h5 mb-3">Bagikan ke Teman</h2>
          <div class="d-flex align-items-center">
            <b-link :href="shareFacebookLink" target="_blank" class="mr-3">
              <b-img src="@/assets/images/share-facebook.png"></b-img>
            </b-link>
            <b-link :href="shareLinkedinLink" target="_blank" class="mr-3">
              <b-img src="@/assets/images/share-linkedin.png"></b-img>
            </b-link>
            <b-link :href="shareTwitterLink" target="_blank" class="mr-3">
              <b-img src="@/assets/images/share-twitter.png"></b-img>
            </b-link>
            <b-link :href="shareMailLink" target="_blank">
              <b-img src="@/assets/images/share-mail.png"></b-img>
            </b-link>
          </div>
        </section>

        <div class="mb-5">
          <b-link
            v-if="currentUser.id === hostId"
            :to="`/rooms/${roomCode}/edit`"
            >Edit Room</b-link
          >
        </div>
      </b-col>
      <b-col lg="4">
        <b-card bg-variant="dark" text-variant="white" class="mb-3">
          <h3 class="h5">{{ hostName }}</h3>
          <div class="d-flex align-items-center mb-2">
            <fa-icon :icon="faMapMarkerAlt" fixed-width class="mr-2"></fa-icon>
            <span>{{ locationName }}</span>
          </div>
          <div class="d-flex align-items-center mb-2">
            <fa-icon :icon="faDoorOpen" fixed-width class="mr-2"></fa-icon>
            <span>{{ checkInDatetime }}</span>
          </div>
          <div class="d-flex align-items-center mb-3">
            <fa-icon :icon="faDoorClosed" fixed-width class="mr-2"></fa-icon>
            <span>{{ checkOutDatetime }}</span>
          </div>
          <b-button variant="primary" :href="googleCalendarLink" target="_blank"
            >Tambah ke Kalender</b-button
          >
        </b-card>
        <b-button
          v-if="videoCallUrl"
          :href="videoCallUrl"
          target="_blank"
          variant="dark"
          block
          class="mb-3"
          >Video Call App</b-button
        >
        <b-button
          v-if="youtubeLiveUrl"
          :href="youtubeLiveUrl"
          target="_blank"
          variant="dark"
          block
          class="mb-3"
          >Youtube Live</b-button
        >
        <b-button
          v-if="facebookLiveUrl"
          :href="facebookLiveUrl"
          target="_blank"
          variant="dark"
          block
          class="mb-3"
          >Facebook/Instagram Live</b-button
        >
        <b-button
          v-if="(hasSaved || isHost) && isOpen"
          :to="`/rooms/${roomCode}/board`"
          variant="success"
          block
          class="mb-3"
          >Ketik Pertanyaan</b-button
        >
        <template v-if="currentUser.id !== hostId">
          <b-button
            v-if="!hasSaved"
            @click="saveRoom"
            variant="success"
            block
            :disabled="isSaving"
          >
            <fa-icon
              :icon="faSpinner"
              spin
              v-show="isSaving"
              class="mr-1"
            ></fa-icon>
            <span>Hadir</span></b-button
          >
          <b-button
            v-else
            @click="leaveRoom"
            variant="danger"
            block
            :disabled="isLeaving"
            ><fa-icon
              :icon="faSpinner"
              spin
              v-show="isLeaving"
              class="mr-1"
            ></fa-icon
            ><span>Batal Hadir</span></b-button
          >
        </template>
      </b-col>
    </b-row>
  </section>
</template>

<script>
import { BCard, BLink } from 'bootstrap-vue';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons/faMapMarkerAlt';
import { faDoorOpen } from '@fortawesome/free-solid-svg-icons/faDoorOpen';
import { faDoorClosed } from '@fortawesome/free-solid-svg-icons/faDoorClosed';
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
import {
  setUserSavedRoom,
  fetchRoomInfoByCode,
  fetchRoomDetail,
  validateActiveRoomCode,
} from '@/api/rooms';
import globalToast from '@/helpers/global-toast';
import gcalendarized from '@/helpers/gcalendarized';
import {
  shareToFacebook,
  shareToTwitter,
  shareToLinkedin,
  shareToMail,
} from '@/helpers/share-links';

export default {
  layout: 'room',
  components: {
    BCard,
    BLink,
  },
  async validate({ $fireStore, params }) {
    return await validateActiveRoomCode($fireStore, params.code);
  },
  async asyncData({ $fireStore, params }) {
    try {
      const room = await fetchRoomInfoByCode($fireStore, params.code);
      const roomDetail = await fetchRoomDetail($fireStore, room.id);
      return {
        ...room,
        ...roomDetail,
      };
    } catch (error) {
      console.error(error);
    }
  },
  head() {
    return {
      title: this.name || '',
      meta: [{
        property: 'og:image',
        vmid: 'og:image',
        content: this.coverImageUrl || ''
      } ]
    };
  },
  data() {
    return {
      isSaving: false,
      isLeaving: false,
    };
  },
  computed: {
    faMapMarkerAlt() {
      return faMapMarkerAlt;
    },
    faDoorOpen() {
      return faDoorOpen;
    },
    faDoorClosed() {
      return faDoorClosed;
    },
    faSpinner() {
      return faSpinner;
    },
    currentUser() {
      return this.$store.getters['getUserInfo'];
    },
    roomCode() {
      return this.$route.params.code;
    },
    roomLink() {
      return `${process.env.BASE_URL}/rooms/${this.roomCode}`;
    },
    googleCalendarLink() {
      if (!this.name) return '';
      const title = this.name;
      return gcalendarized({
        title,
        startDatetimeInSeconds: this.checkIn.seconds,
        endDatetimeInSeconds: this.checkOut.seconds,
        description: `${this.description}\nLink room: ${this.roomLink}`,
      });
    },
    shareFacebookLink() {
      return shareToFacebook(this.roomLink);
    },
    shareTwitterLink() {
      return shareToTwitter(this.roomLink, this.name, this.description);
    },
    shareLinkedinLink() {
      return shareToLinkedin(this.roomLink, this.name, this.description);
    },
    shareMailLink() {
      return shareToMail(this.roomLink, this.name, this.description);
    },
    isHost() {
      return this.currentUser.id === this.hostId;
    },
    hasSaved() {
      return this.$store.getters['savedRooms'].includes(this.id);
    },
    isOpen() {
      const today = new Date();
      return this.checkInJSDatetime <= today && this.checkOutJSDatetime > today;
    },
  },
  methods: {
    copyToClipboard() {
      let codeToCopy = document.querySelector('#room-code');
      codeToCopy.setAttribute('type', 'text');
      codeToCopy.select();

      try {
        document.execCommand('copy');
        globalToast(this.$bvToast, 'Berhasil mengkopi kode', 'success');
      } catch (err) {
        console.error(err);
      }

      codeToCopy.setAttribute('type', 'hidden');
      window.getSelection().removeAllRanges();
    },
    async saveRoom() {
      try {
        this.isSaving = true;
        await setUserSavedRoom(this.$fireStore, this.$fireStoreObj, {
          isSaving: true,
          roomId: this.id,
          userId: this.currentUser.id,
        });
        this.$store.commit('ADD_SAVED_ROOM', this.id);
        globalToast(
          this.$bvToast,
          'Berhasil mendaftarkan kehadiran',
          'success'
        );
      } catch (error) {
        console.error('failed to save room: ', error);
      } finally {
        this.isSaving = false;
      }
    },
    async leaveRoom() {
      try {
        this.isLeaving = true;
        await setUserSavedRoom(this.$fireStore, this.$fireStoreObj, {
          isSaving: false,
          roomId: this.id,
          userId: this.currentUser.id,
        });
        this.$store.commit('REMOVE_SAVED_ROOM', this.id);
        globalToast(this.$bvToast, 'Berhasil membatalkan kehadiran', 'success');
      } catch (error) {
        console.error('failed to leave room: ', error);
      } finally {
        this.isLeaving = false;
      }
    },
  },
};
</script>
