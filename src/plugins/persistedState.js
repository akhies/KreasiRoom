import createPersistedState from 'vuex-persistedstate';
import * as Cookies from 'js-cookie';

export default ({ store }) => {
  createPersistedState({
    key: 'kreasiroom',
    storage: {
      getItem: (key) => Cookies.get(key),
      setItem: (key, value) => {
        Cookies.set(key, value, {
          expires: 1,
          secure: false,
          sameSite: 'strict',
        });
      },
      removeItem: (key) => Cookies.remove(key),
    },
    paths: ['fcmToken', 'unlockedRooms'],
  })(store);
};
