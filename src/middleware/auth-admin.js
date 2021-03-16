export default ({ store, redirect }) => {
  if (!store.state.currentUser.isAdmin) {
    return redirect('/rooms');
  }
};
