<template>
  <b-navbar type="light" variant="light" fixed="top" class="admin-navbar">
    <b-navbar-nav>
      <b-button variant="link" @click="$emit('toggle')" size="lg">
        <fa-icon :icon="faBars"></fa-icon>
      </b-button>
    </b-navbar-nav>

    <!-- Right aligned nav items -->
    <b-navbar-nav class="ml-auto">
      <b-button variant="danger" size="sm" class="mr-3" to="/rooms">
        <fa-icon :icon="faSignOutAlt" class="mr-1"></fa-icon>
        <span>Back to Rooms</span>
      </b-button>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt';
import { BNavbar, BNavbarNav } from 'bootstrap-vue';

import globalToast from '@/helpers/global-toast.js';

export default {
  name: 'AdminNavbar',
  components: {
    BNavbar,
    BNavbarNav
  },
  computed: {
    faBars() {
      return faBars;
    },
    faSignOutAlt() {
      return faSignOutAlt;
    }
  },
  methods: {
    async logout() {
      try {
        await this.$store.dispatch('logout');
        this.$router.push({
          path: '/auth/login'
        });
      } catch (error) {
        globalToast(this.$bvToast, 'Gagal keluar dari akun', 'error');
      }
    }
  }
};
</script>

<style lang="scss">
.admin-navbar {
  height: $navbar-height;
  padding: 0;
  box-shadow: 0 2px 2px 0 rgba(60, 75, 100, 0.14),
    0 3px 1px -2px rgba(60, 75, 100, 0.12), 0 1px 5px 0 rgba(60, 75, 100, 0.2);
  clip-path: inset(0 0 -1000px 0);
  transition: margin-left 0.2s ease-out;
}
</style>