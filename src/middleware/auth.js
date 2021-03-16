export default ({ redirect, $fireAuth }) => {
  if (!$fireAuth.currentUser) {
    return redirect('/login');
  }
};
