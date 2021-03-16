<template>
  <aside class="admin-sidebar">
    <div class="admin-sidebar-brand">
      <b-img
        block
        center
        style="max-height: 46px;max-width:100%"
        src="@/assets/images/logo-white.png"
      ></b-img>
      <!-- <div class="h4 mb-0 text-center text-white">KreasiRoom</div> -->
    </div>
    <div class="admin-sidebar-profile" v-if="user">
      <b-media no-body>
        <b-media-aside vertical-align="center">
          <b-img
            width="32"
            height="32"
            alt="placeholder"
            rounded="circle"
            :src="user.picture"
            v-if="user.picture"
          ></b-img>
          <b-img
            width="32"
            height="32"
            alt="placeholder"
            rounded="circle"
            src="@/assets/images/default-user.svg"
            v-else
          ></b-img>
        </b-media-aside>
        <b-media-body class="ml-3">
          <h5 class="h6 mb-1 text-white">{{ user.name }}</h5>
          <div class="text-white" style="line-height: 1.25">
            {{ user.role }}
          </div>
        </b-media-body>
      </b-media>
    </div>
    <ul class="admin-sidebar-nav">
      <template v-if="navs.length">
        <template v-for="(nav, index) in navs">
          <li class="admin-sidebar-nav-title" v-if="nav.title" :key="index">
            {{ nav.title }}
          </li>
          <li class="admin-sidebar-nav-item" v-else :key="index">
            <nuxt-link :to="nav.link" class="admin-sidebar-nav-link">
              <fa-icon :icon="nav.icon" fixed-width class="mr-3"></fa-icon>
              <span>{{ nav.text }}</span>
            </nuxt-link>
          </li>
        </template>
      </template>
    </ul>
  </aside>
</template>

<script>
import { BMedia, BMediaAside, BMediaBody } from 'bootstrap-vue';

export default {
  name: 'AdminSidebar',
  components: {
    BMedia,
    BMediaAside,
    BMediaBody
  },
  props: {
    navs: {
      type: Array,
      default: []
    },
    user: {
      type: Object,
      default: {
        name: '',
        role: '',
        picture: ''
      }
    }
  }
};
</script>

<style lang="scss">
$nav-item-padding: 0.5rem 1rem;

.admin-sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1035;
  width: $sidebar-width;
  overflow-y: auto;
  background-color: #0070e1;
  transition: margin-left 0.2s ease-out;
  margin-left: -1 * $sidebar-width;
  &-brand {
    display: flex;
    justify-content: center;
    align-items: center;
    height: $navbar-height;
    padding: 0.5rem 1rem;
    background-color: rgba(0, 0, 21, 0.2);
  }
  &-profile {
    padding: 0.75rem 1rem;
  }
  &-nav {
    padding-left: 0;
    margin-bottom: 0;
    list-style: none;
    &-title {
      padding: $nav-item-padding;
      margin-top: 1rem;
      font-weight: $headings-font-weight;
      text-transform: uppercase;
      letter-spacing: 0.05rem;
      color: rgba(255, 255, 255, 0.6);
    }
    &-link {
      display: block;
      padding: $nav-item-padding;
      color: white;
      &:hover {
        color: white;
        background-color: rgba(0, 0, 0, 0.12);
        text-decoration: none;
      }
    }
  }
}
</style>
