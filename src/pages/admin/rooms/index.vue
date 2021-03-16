<template>
  <div class="py-4">
    <b-container fluid>
      <b-card no-body header="Active Rooms List">
        <b-card-body>
          <b-form inline @submit.prevent="fetchRooms(roomName)">
            <b-form-input
              class="mr-2"
              v-model="roomName"
              placeholder="Type room name"
            ></b-form-input>
            <b-button variant="success" type="submit">Search</b-button>
          </b-form>
        </b-card-body>
        <b-table
          :fields="fields"
          :busy="isTableLoading"
          striped
          hover
          :items="items"
          ref="table"
          head-variant="light"
          class="mb-0 border-bottom"
          show-empty
          empty-text="Tidak ada data."
        >
          <template v-slot:table-busy>
            <loading-indicator></loading-indicator>
          </template>
          <template v-slot:cell(name)="data">
            <b-link
              class="text-primary"
              :to="`${$route.path}/${data.item.id}`"
              >{{ data.item.name }}</b-link
            >
          </template>
        </b-table>
        <b-card-body class="text-right">
          <b-button
            class="mr-2"
            variant="danger"
            v-if="items.length && firstPrevItems.length"
            @click="fetchRooms(firstItemName, 'prev')"
            >Prev</b-button
          >
          <b-button
            variant="primary"
            v-if="items.length"
            @click="fetchRooms(lastItemName, 'next')"
            >Next</b-button
          >
        </b-card-body>
      </b-card>
    </b-container>
  </div>
</template>

<script>
import {
  BTable,
  BCard,
  BCardBody,
  BForm,
  BFormInput,
  BLink
} from 'bootstrap-vue';
import globalToast from '@/helpers/global-toast.js';
import { fetchRooms } from '@/api/rooms.js';

export default {
  layout: 'admin',
  components: {
    BTable,
    BCard,
    BCardBody,
    BForm,
    BFormInput,
    BLink
  },
  data() {
    return {
      roomName: '',
      fields: [
        {
          key: 'name',
          label: 'Name'
        },
        {
          key: 'checkInDate',
          label: 'Check-in Date'
        },
        {
          key: 'checkInTime',
          label: 'Check-in Time'
        },
        {
          key: 'checkOutDate',
          label: 'Check-out Date'
        },
        {
          key: 'checkOutTime',
          label: 'Check-out Time'
        },
        {
          key: 'attendantsCounter',
          label: 'Attendants'
        }
      ],
      items: [],
      firstPrevItems: [],
      isTableLoading: false
    };
  },
  computed: {
    firstItemName() {
      return this.items.length ? this.items[0].name : '';
    },
    lastItemName() {
      return this.items.length ? this.items[this.items.length - 1].name : '';
    }
  },
  async mounted() {
    await this.fetchRooms();
  },
  methods: {
    async fetchRooms(roomName = '', action = 'refresh') {
      this.isTableLoading = true;
      try {
        if (action === 'refresh') {
          this.items.length = 0;
        }
        this.$refs.table.refresh();
        const items = await fetchRooms(this.$fireStore, {
          filterRoomName: roomName,
          firstRoomName: this.firstItemName,
          firstPrevRoomName: this.firstPrevItems[
            this.firstPrevItems.length - 1
          ],
          lastRoomName: this.lastItemName,
          action,
          isActive: true
        });
        if (action === 'next') {
          this.firstPrevItems.push(this.items[0].name);
        }
        if (action === 'prev') {
          this.firstPrevItems.pop();
        }
        this.items = items;
      } catch (error) {
        console.error(error);
        globalToast(
          this.$bvToast,
          error.message || 'Failed to load rooms',
          'error'
        );
      } finally {
        this.isTableLoading = false;
      }
    }
  }
};
</script>
