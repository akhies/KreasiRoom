export const addNewUser = async (firestore, { userId, userInfo }) => {
  try {
    await firestore
      .collection('users')
      .doc(userId)
      .set({
        ...userInfo,
        isAdmin: false,
        createdRooms: [],
        savedRooms: []
      });
  } catch (error) {
    throw error;
  }
};

export const getUserInfo = async (firestore, userId) => {
  try {
    const doc = await firestore
      .collection('users')
      .doc(userId)
      .get();
    if (!doc.exists) throw new Error('User is not exist.');
    return doc.data();
  } catch (error) {
    throw error;
  }
};

export const updateUserInfo = async (firestore, userId, payload) => {
  try {
    await firestore
      .collection('users')
      .doc(userId)
      .set(payload, { merge: true });
  } catch (error) {
    throw error;
  }
};

export const updateUserAuthProfile = async (fireAuth, { name, picture }) => {
  try {
    const user = fireAuth.currentUser;
    await user.updateProfile({
      displayName: name || user.displayName,
      photoURL: picture || user.photoURL
    });
  } catch (error) {
    throw error;
  }
};

export const updateAuthEmail = async (fireAuth, email) => {
  try {
    const user = fireAuth.currentUser;
    await user.updateEmail(email);
  } catch (error) {
    throw error;
  }
};

export const updateAuthPassword = async (fireAuth, password) => {
  try {
    const user = fireAuth.currentUser;
    await user.updatePassword(password);
  } catch (error) {
    throw error;
  }
};

export const checkId = async (firestore, userId, id) => {
  try {
    const snaps = await firestore
      .collection('users')
      .where('userId', '==', userId)
      .get();
    if (snaps.empty) return false;
    let isIdExists = false;
    snaps.forEach(doc => {
      if (doc.id === id) return;
      isIdExists = true;
    });
    return isIdExists;
  } catch (error) {}
};
