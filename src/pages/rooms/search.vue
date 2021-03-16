<template>
  <section class="py-4">
    <h1 class="h3">Hasil Pencarian</h1>
    <p v-if="rooms.length" class="mb-4">Ditemukan {{ rooms.length }} room.</p>
    <loading-indicator v-if="$fetchState.pending" />
    <div class="text-center" v-else-if="$fetchState.error">
      <p>Gagal mengambil data room.</p>
      <b-button variant="info" @click="$fetch">Cari Ulang</b-button>
    </div>
    <template v-else>
      <p v-if="!rooms.length" class="text-center">Room tidak ditemukan.</p>
      <b-row v-else>
        <b-col md="6" lg="4" v-for="(room, index) in rooms" :key="room.id">
          <room-block
            @save="saveRoom(index, room.id, room.code, room.hasPassword)"
            @enter="enterRoom(index, room.id, room.code, room.hasPassword)"
            :room="room"
            :current-user="currentUser"
            :is-saved-room="isRoomSaved(room.id)"
            :is-recently-saved="room.isRecentlySaved"
            :is-saving="room.isSaving"
            :is-closed="room.isClosed"
          ></room-block>
        </b-col>
      </b-row>
    </template>
    <b-modal
      id="type-password"
      hide-header
      hide-footer
      centered
      body-bg-variant="dark"
      body-text-variant="light"
    >
      <p class="text-uppercase">Ketik password</p>
      <b-form @submit.prevent="enterPassword">
        <b-form-group
          :state="isCorrectPassword"
          invalid-feedback="Kata sandi salah"
        >
          <b-form-input v-model="password"></b-form-input>
        </b-form-group>
        <b-button variant="primary" type="submit" :disabled="isCheckingPassword"
          >Masuk Room</b-button
        >
      </b-form>
    </b-modal>
  </section>
</template>

<script>
import concat from 'lodash/concat';
import uniqWith from 'lodash/uniqWith';
import isEqual from 'lodash/isEqual';
import { BForm, BFormInput } from 'bootstrap-vue';
import {
  setUserSavedRoom,
  fetchRoomsByCode,
  fetchRoomsByName,
  fetchRoomsByHostName,
  fetchRoomPassword
} from '@/api/rooms';
import globalToast from '@/helpers/global-toast.js';

export default {
  name: 'searchRoom',
  components: {
    BForm,
    BFormInput
  },
  data() {
    return {
      rooms: [],
      isFetchingRooms: false,
      password: '',
      selectedRoomIndex: null,
      selectedRoomId: '',
      selectedRoomCode: '',
      isSavingRoom: false,
      isEnteringRoom: false,
      isCorrectPassword: null,
      isCheckingPassword: false
    };
  },
  computed: {
    roomCode() {
      return this.$route.query.code;
    },
    searchQuery() {
      return this.$route.query.query;
    },
    currentUser() {
      return this.$store.getters['getUserInfo'];
    },
    savedRooms() {
      return this.$store.getters['savedRooms'];
    },
    unlockedRooms() {
      return this.$store.getters['unlockedRooms'];
    }
  },
  async fetch() {
    try {
      if (!this.$route.query) return;
      if (this.roomCode) {
        this.rooms = await fetchRoomsByCode(this.$fireStore, this.roomCode);
      }
      if (this.searchQuery) {
        const [roomsByName, roomsByHostName] = await Promise.all([
          fetchRoomsByName(this.$fireStore, this.searchQuery),
          fetchRoomsByHostName(this.$fireStore, this.searchQuery)
        ]);
        const combinedRooms = concat(roomsByName, roomsByHostName);
        this.rooms = uniqWith(combinedRooms, isEqual);
      }
    } catch (error) {
      console.error('failed to fetch rooms: ', error);
    }
  },
  methods: {
    async saveRoom(index, roomId, roomCode, hasPassword) {
      if (!hasPassword || this.isRoomUnlocked(roomCode)) {
        await this.savingRoom(index, roomId);
        return;
      }
      this.selectedRoomIndex = index;
      this.selectedRoomId = roomId;
      this.selectedRoomCode = roomCode;
      this.isSavingRoom = true;
      this.$bvModal.show('type-password');
    },
    enterRoom(index, roomId, roomCode, hasPassword) {
      if (!hasPassword || this.isRoomUnlocked(roomCode)) {
        this.$router.push(roomCode);
        return;
      }
      this.selectedRoomIndex = index;
      this.selectedRoomId = roomId;
      this.selectedRoomCode = roomCode;
      this.isEnteringRoom = true;
      this.$bvModal.show('type-password');
    },
    async savingRoom(index, roomId) {
      try {
        this.rooms[index].isSaving = true;
        await setUserSavedRoom(this.$fireStore, this.$fireStoreObj, {
          isSaving: true,
          roomId,
          userId: this.currentUser.id
        });
        this.$store.commit('ADD_SAVED_ROOM', roomId);
        this.rooms[index].isRecentlySaved = true;
        globalToast(
          this.$bvToast,
          'Berhasil mendaftarkan kehadiran',
          'success'
        );
      } catch (error) {
        console.error('failed to save room: ', error);
      } finally {
        this.rooms[index].isSaving = false;
      }
    },
    async enterPassword() {
      try {
        this.isCheckingPassword = true;
        const roomId = this.selectedRoomId;
        const password = await fetchRoomPassword(this.$fireStore, roomId);
        if (password.text !== this.password) {
          this.isCorrectPassword = false;
          return;
        }
        this.isCorrectPassword = true;
        if (this.isSavingRoom) {
          await savingRoom(this.selectedRoomIndex, this.selectedRoomId);
        }
        if (this.isEnteringRoom) {
          this.$router.push(`/rooms/${this.selectedRoomCode}`);
        }
        this.$store.commit('ADD_UNLOCKED_ROOM', this.selectedRoomCode);
        this.clearEnterPasswordState();
      } catch (error) {
        console.error('failed to enter password: ', error);
      } finally {
        this.isCheckingPassword = false;
      }
    },
    clearEnterPasswordState() {
      this.isSavingRoom = false;
      this.isEnteringRoom = false;
      this.selectedRoomCode = '';
      this.selectedRoomIndex = null;
      this.selectedRoomId = '';
      this.$bvModal.hide('type-password');
    },
    isRoomSaved(roomId) {
      const savedRooms = this.$store.getters['savedRooms'];
      return savedRooms.includes(roomId);
    },
    isRoomUnlocked(code) {
      return this.unlockedRooms.includes(code);
    }
  },
  watch: {
    '$route.query': '$fetch'
  }
};
</script>
