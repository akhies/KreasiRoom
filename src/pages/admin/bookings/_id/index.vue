<template>
  <div class="py-4">
    <b-container fluid>
      <div class="mb-3">
        <b-button to="/admin/bookings">Back to List</b-button>
      </div>
      <b-card class="mb-3" no-body header="Room Info">
        <b-card-body>
          <div v-if="!isLoadingRoomInfo && roomInfo">
            <b-form-row class="mb-2">
              <b-col md="3"><span class="text-muted">Room Name</span></b-col>
              <b-col md="9">{{ roomInfo.name }}</b-col>
            </b-form-row>
            <b-form-row class="mb-2">
              <b-col md="3"><span class="text-muted">Event Name</span></b-col>
              <b-col md="9">{{ roomInfo.eventName }}</b-col>
            </b-form-row>
            <b-form-row class="mb-2">
              <b-col md="3"><span class="text-muted">Host Name</span></b-col>
              <b-col md="9">{{ roomInfo.hostName }}</b-col>
            </b-form-row>
            <b-form-row class="mb-2">
              <b-col md="3"><span class="text-muted">Check in</span></b-col>
              <b-col md="9">{{ formatDate(roomInfo.checkIn.seconds) }}</b-col>
            </b-form-row>
            <b-form-row class="mb-2">
              <b-col md="3"><span class="text-muted">Check out</span></b-col>
              <b-col md="9">{{ formatDate(roomInfo.checkOut.seconds) }}</b-col>
            </b-form-row>
          </div>
          <loading-indicator v-else></loading-indicator>
        </b-card-body>
      </b-card>
      <b-row>
        <b-col md="6">
          <b-card class="mb-3" no-body header="Attendants List">
            <b-table
              :fields="attendantFields"
              :busy="isLoadingAttendants"
              hover
              :items="attendants"
              ref="table"
              head-variant="light"
              class="mb-0"
              show-empty
              empty-text="Tidak ada data."
            >
              <template v-slot:table-busy>
                <loading-indicator></loading-indicator>
              </template>
              <template v-slot:cell(index)="data">{{
                data.index + 1
              }}</template>
            </b-table>
          </b-card>
        </b-col>
        <b-col md="6">
          <b-card class="mb-3" no-body header="Questions List">
            <b-table
              :fields="questionFields"
              :busy="isLoadingQuestions"
              hover
              :items="questions"
              ref="table"
              head-variant="light"
              class="mb-0"
              show-empty
              empty-text="Tidak ada data."
            >
              <template v-slot:table-busy>
                <loading-indicator></loading-indicator>
              </template>
              <template v-slot:cell(index)="data">{{
                data.index + 1
              }}</template>
            </b-table>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { BCard, BCardBody, BTable } from 'bootstrap-vue';
import { DateTime } from 'luxon';
import globalToast from '@/helpers/global-toast.js';
import { fetchRoomDetail } from '@/api/rooms.js';
import { fetchAllAttendants } from '@/api/attendants.js';
import { fetchAllQuestions } from '@/api/questions.js';

export default {
  layout: 'admin',
  components: {
    BCard,
    BCardBody,
    BTable
  },
  data() {
    return {
      roomInfo: null,
      attendants: [],
      attendantFields: [
        {
          key: 'index',
          label: 'No.'
        },
        {
          key: 'name',
          label: 'Name'
        }
      ],
      questions: [],
      questionFields: [
        {
          key: 'index',
          label: 'No.'
        },
        {
          key: 'text',
          label: 'Question'
        }
      ],
      isLoadingRoomInfo: false,
      isLoadingAttendants: false,
      isLoadingQuestions: false
    };
  },
  computed: {
    roomId() {
      return this.$route.params.id;
    }
  },
  created() {
    this.fetchRoom();
    this.fetchAttendants();
    this.fetchQuestions();
  },
  methods: {
    async fetchRoom() {
      this.isLoadingRoomInfo = true;
      try {
        const roomInfo = await fetchRoomDetail(this.roomId);
        this.roomInfo = roomInfo;
      } catch (error) {
        console.error(error);
        globalToast(
          this.$bvToast,
          error.message || 'Failed to load room',
          'error'
        );
      } finally {
        this.isLoadingRoomInfo = false;
      }
    },
    async fetchAttendants() {
      this.isLoadingAttendants = true;
      try {
        const attendants = await fetchAllAttendants(this.roomId);
        this.attendants = attendants;
      } catch (error) {
        console.error(error);
        globalToast(
          this.$bvToast,
          error.message || 'Failed to load attendants',
          'error'
        );
      } finally {
        this.isLoadingAttendants = false;
      }
    },
    async fetchQuestions() {
      this.isLoadingQuestions = true;
      try {
        const questions = await fetchAllQuestions(this.roomId);
        this.questions = questions;
      } catch (error) {
        console.error(error);
        globalToast(
          this.$bvToast,
          error.message || 'Failed to load questions',
          'error'
        );
      } finally {
        this.isLoadingQuestions = false;
      }
    },
    formatDate(dateInSeconds) {
      return DateTime.fromSeconds(dateInSeconds)
        .setLocale('id')
        .toFormat('dd MMMM yyyy HH:mm ZZZZ');
    }
  }
};
</script>
