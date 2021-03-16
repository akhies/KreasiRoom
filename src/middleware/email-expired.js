export default async ({ store, redirect }) => {
  if (store.getters.isEmailExpired) {
    redirect('/rooms');
  }
};
