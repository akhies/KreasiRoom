<template>
  <b-navbar toggleable="lg" type="dark">
    <b-container fluid="xl">
      <b-navbar-brand to="/">
        <b-img
          src="~/assets/images/logo-white.png"
          alt="Kreasi Room"
          block
          height="24"
        ></b-img>
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto align-items-center">
          <b-nav-item to="/rooms" class="mr-2 text-uppercase"
            >Beranda</b-nav-item
          >
          <b-nav-item to="/profile" class="mr-2 text-uppercase"
            >Profil</b-nav-item
          >
          <b-nav-item class="mr-2">
            <b-button variant="dark" size="sm" to="/rooms/new"
              >Buat Room</b-button>
              
          </b-nav-item>
          

          <b-nav-item class="mr-2 text-uppercase" to="/admin" v-if="isAdmin"
            >Administrator</b-nav-item
          >
          <b-nav-form @submit.prevent="searchRoom">
            <b-input-group size="sm">
              <template #prepend>
                <b-input-group-text class="bg-dark text-white border-dark">
                  <fa-icon :icon="faSearch"></fa-icon>
                </b-input-group-text>
              </template>
              <b-form-input
                placeholder="Cari room (nama host atau nama room)"
                class="bg-dark text-white border-dark"
                style="min-width: 15rem"
                v-model="query"
              ></b-form-input>
            </b-input-group>
          </b-nav-form>
        </b-navbar-nav>
      </b-collapse>
    </b-container>
  </b-navbar>
</template>

<script>
import {
  BNavbar,
  BNavbarBrand,
  BCollapse,
  BNavbarNav,
  BNavbarToggle,
  BNavItem,
  BNavItemDropdown,
  BNavForm,
  BInputGroup,
  BInputGroupPrepend,
  BInputGroupText,
  BFormInput
} from 'bootstrap-vue';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';

export default {
  name: 'AppNavbar',
  components: {
    BNavbar,
    BNavbarBrand,
    BCollapse,
    BNavbarNav,
    BNavbarToggle,
    BNavItem,
    BNavItemDropdown,
    BNavForm,
    BInputGroup,
    BInputGroupPrepend,
    BInputGroupText,
    BFormInput
  },
  data() {
    return {
      query: ''
    };
  },
  computed: {
    userName() {
      const currentUser = this.$store.state.currentUser;
      return !currentUser ? '-' : currentUser.name;
    },
    isAdmin() {
      return this.$store.state.currentUser
        ? this.$store.state.currentUser.isAdmin
        : false;
    },
    faSearch() {
      return faSearch;
    }
  },
  methods: {
    async logout() {
      this.$router.push({
        path: '/'
      });
      await this.$store.dispatch('logout');
    },
    searchRoom() {
      if (!this.query) return;
      this.$router.push({
        path: '/rooms/search',
        query: {
          query: this.query
        }
      });
    }
  }
};
</script>
