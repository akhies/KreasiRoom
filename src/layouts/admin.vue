<template>
  <div class="admin-app" :class="{ 'is-sidebar-open': isSidebarOpen }">
    <admin-sidebar :navs="navs" :user="user" />
    <div class="admin-wrapper">
      <admin-navbar @toggle="toggleSidebar(!isSidebarOpen)" />
      <main class="admin-main">
        <div>
          <nuxt />
        </div>
      </main>
    </div>
    <div class="admin-app-shadow" @click="toggleSidebar(false)"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import adminNavs from '@/helpers/admin-navs.js';

export default {
  middleware: 'auth-admin',
  head() {
    return {
      title: 'Halaman Administrator'
    };
  },
  data() {
    return {
      navs: adminNavs,
      isSidebarOpen: true
    };
  },
  computed: {
    ...mapGetters({
      user: 'getUserInfo'
    })
  },
  methods: {
    toggleSidebar(isOpen) {
      this.isSidebarOpen = isOpen;
    }
  }
};
</script>

<style lang="scss">
.admin {
  display: flex;
  &-app {
    color: rgba(12,12,12,1);
    &-shadow {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1033;
      visibility: hidden;
      opacity: 0;
      background-color: rgba(0, 0, 0, 0.5);
      transition: opacity 0.2s ease-out;
    }
    &.is-sidebar-open {
      .admin-sidebar {
        margin-left: 0;
      }
      .admin-navbar,
      .admin-wrapper {
        @media (min-width: map-get($grid-breakpoints, 'lg')) {
          margin-left: $sidebar-width;
        }
      }
      .admin-app-shadow {
        opacity: 1;
        visibility: visible;
        @media (min-width: map-get($grid-breakpoints, 'lg')) {
          opacity: 0;
          visibility: hidden;
        }
      }
    }
    .form-control {
      background-color: #ffffff !important;
    }
    .table,
    .table-hover tbody tr:hover {
      color: rgba(12,12,12,1);
    }
  }
  &-wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    overflow-x: hidden;
    transition: margin-left 0.2s ease-out;
  }
  &-main {
    flex-grow: 1;
    width: 100%;
    padding-top: $navbar-height;
    background-color: #f2f3f4;
  }
}
</style>
