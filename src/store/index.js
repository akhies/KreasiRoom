import { getUserInfo } from '@/api/users';
import { DateTime } from 'luxon';

export const state = () => ({
  currentUser: null,
  fcmToken: null,
  unlockedRooms: []
});

export const getters = {
  isProfileComplete(state) {
    const user = state.currentUser;
    return user.userId && user.phoneNumber;
  },
  isAuthenticated(state) {
    return !!state.currentUser;
  },
  isEmailVerified(state) {
    return state.currentUser ? state.currentUser.isEmailVerified : false;
  },
  isEmailExpired(state) {
    if (!state.currentUser) return true;
    if (state.currentUser.isEmailVerified) return false;
    const today = new Date();
    const expirationEmailLimitInSeconds = 30 * 86400; // 30 days
    const timeDiffBetweenTodayAndLastEmailUpdateInSeconds =
      DateTime.fromJSDate(today).toSeconds() -
      DateTime.fromJSDate(state.currentUser.emailUpdatedAt).toSeconds();
    return (
      timeDiffBetweenTodayAndLastEmailUpdateInSeconds >
      expirationEmailLimitInSeconds
    );
  },
  getUserInfo(state) {
    return state.currentUser;
  },
  savedRooms(state) {
    return state.currentUser ? state.currentUser.savedRooms : [];
  },
  createdRooms(state) {
    return state.currentUser ? state.currentUser.createdRooms : [];
  },
  unlockedRooms(state) {
    return state.unlockedRooms;
  }
};

export const mutations = {
  CLEAR_CURRENT_USER(state) {
    state.currentUser = null;
  },
  SET_CURRENT_USER(state, payload) {
    state.currentUser = payload;
  },
  SET_CURRENT_USER_NAME(state, name) {
    state.currentUser.name = name;
  },
  SET_CURRENT_USER_EMAIL(state, email) {
    state.currentUser.email = email;
  },
  SET_CURRENT_USER_PICTURE(state, pictureUrl) {
    state.currentUser.picture = pictureUrl;
  },
  SET_CURRENT_USER_PROFILE(state, payload) {
    const currentUser = state.currentUser;
    currentUser.userId = payload.userId;
    currentUser.company = payload.company;
    currentUser.job = payload.job;
    currentUser.phoneNumber = payload.phoneNumber;
  },
  SET_FCM_TOKEN(state, token) {
    state.fcmToken = token;
  },
  ADD_CREATED_ROOM(state, roomId) {
    state.currentUser.createdRooms.push(roomId);
  },
  ADD_SAVED_ROOM(state, roomId) {
    state.currentUser.savedRooms.push(roomId);
  },
  REMOVE_SAVED_ROOM(state, roomId) {
    const roomIndex = state.currentUser.savedRooms.indexOf(roomId);
    if (roomIndex > -1) state.currentUser.savedRooms.splice(roomIndex, 1);
  },
  ADD_UNLOCKED_ROOM(state, roomId) {
    state.unlockedRooms.push(roomId);
  },
  CLEAR_UNLOCKED_ROOMS(state) {
    state.unlockedRooms.length = 0;
  }
};

export const actions = {
  async logout({ commit }) {
    await this.$fireAuth.signOut();
    commit('CLEAR_CURRENT_USER');
    commit('CLEAR_UNLOCKED_ROOMS');
  },
  async updateUserInfo({ commit }, { userId, isEmailVerified }) {
    try {
      const userInfo = await getUserInfo(this.$fireStore, userId);
      const today = new Date();
      commit('SET_CURRENT_USER', {
        id: userId,
        name: userInfo.name,
        email: userInfo.email,
        picture: userInfo.picture,
        createdRooms: userInfo.createdRooms,
        savedRooms: userInfo.savedRooms,
        isAdmin: userInfo.isAdmin,
        registeredAt: userInfo.registeredAt
          ? DateTime.fromSeconds(userInfo.registeredAt.seconds).toJSDate()
          : today,
        emailUpdatedAt: userInfo.emailUpdatedAt
          ? DateTime.fromSeconds(userInfo.emailUpdatedAt.seconds).toJSDate()
          : today,
        isEmailVerified,
        loginWith: userInfo.loginWith,
        phoneNumber: userInfo.phoneNumber,
        userId: userInfo.userId,
        company: userInfo.company,
        job: userInfo.job
      });
    } catch (error) {
      console.error('update user info error: ', error);
    }
  },
  async onAuthStateChangedAction({ dispatch }, { authUser }) {
    try {
      if (!authUser) {
        await dispatch('logout');
        return;
      }
      await dispatch('updateUserInfo', {
        userId: authUser.uid,
        isEmailVerified: authUser.emailVerified
      });
    } catch (error) {
      console.error('on auth state changed error: ', error);
    }
  }
};
