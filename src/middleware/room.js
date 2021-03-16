export default ({ app, redirect, $fireAuth, store }) => {
  if (!$fireAuth.currentUser) {
    return redirect('/login');
  }
  if (!store.getters.isProfileComplete) {
    return redirect('/rooms?incomplete=true');
  }
};
