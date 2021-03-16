<template>
  <b-card
    no-body
    bg-variant="dark"
    tag="article"
    class="mb-3 rounded-lg border-dark"
  >
    <b-card-header class="bg-body">
      <h4 class="h5">HOST</h4>
      <p class="mb-0">{{ room.hostName }}</p>
    </b-card-header>
    <b-card-body>
      <h4 style="height: 3.25rem; overflow: hidden">{{ room.name }}</h4>
      <small class="font-weight-bold">Lokasi</small>
      <p>{{ room.locationName }}</p>
      <small class="font-weight-bold">Check In</small>
      <p>{{ room.checkInDatetime }}</p>
      <div class="d-flex align-items-center" v-if="!isClosed">
        <b-button
          variant="dark"
          class="mr-2 bg-body border-body"
          @click="enterRoom"
          >Lihat Detail Room</b-button
        >
        <template v-if="room.hostId !== currentUser.id">
          <b-button
            variant="primary"
            @click="saveRoom"
            v-if="!isSavedRoom && !isRecentlySaved"
            class="mr-3"
            :disabled="isSaving"
          >
            <fa-icon
              :icon="faSpinner"
              spin
              v-show="isSaving"
              class="mr-1"
            ></fa-icon>
            <span>Simpan</span>
          </b-button>
          <span class="d-inline-block text-success" v-if="isRecentlySaved">
            <fa-icon :icon="faCheck" class="mr-1"></fa-icon>
            <span>Hadir</span>
          </span>
        </template>
      </div>
      <span class="text-danger" v-if="isClosed">Event Selesai</span>
    </b-card-body>
  </b-card>
</template>

<script>
import {
  BCard,
  BCardHeader,
  BCardBody,
  BIcon,
  BIconBookmark,
  BIconBookmarkFill,
} from 'bootstrap-vue';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';

export default {
  name: 'RoomBlock',
  components: {
    BCard,
    BCardHeader,
    BCardBody,
    BIcon,
    BIconBookmark,
    BIconBookmarkFill,
  },
  props: {
    room: {
      type: Object,
      required: true,
    },
    currentUser: {
      type: Object,
      required: true,
    },
    isSavedRoom: {
      type: Boolean,
      default: true,
    },
    isRecentlySaved: {
      type: Boolean,
      default: false,
    },
    isSaving: {
      type: Boolean,
      default: false,
    },
    isClosed: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    faCheck() {
      return faCheck;
    },
    faSpinner() {
      return faSpinner;
    },
  },
  methods: {
    saveRoom() {
      this.$emit('save');
    },
    enterRoom() {
      this.$emit('enter');
    },
  },
};
</script>
