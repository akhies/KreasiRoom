export const fetchAllAttendants = async (firestore, roomId) => {
  try {
    const docs = await firestore.collection(`rooms/${roomId}/attendants`).get();
    if (docs.empty) return [];
    const items = [];
    docs.forEach(item => {
      items.push(item.data());
    });
    return items;
  } catch (error) {
    throw error;
  }
};

export const fetchAttendants = async (firestore, { roomId, lastAttendant }) => {
  try {
    const query = firestore
      .collection(`rooms/${roomId}/attendants`)
      .orderBy('isOnline', 'desc');
    const queryLastAttendant = lastAttendant
      ? query.startAfter(lastAttendant.isOnline)
      : query;
    return await queryLastAttendant.limit(10).get();
  } catch (error) {
    throw error;
  }
};

export const setOffline = async (firestore, { roomId, userId }) => {
  try {
    await firestore
      .collection(`rooms/${roomId}/attendants`)
      .doc(userId)
      .update({
        isOnline: false
      });
  } catch (error) {
    throw error;
  }
};

export const setUserAttendance = async (
  firestore,
  firestoreObj,
  { roomId, userId, userName, email }
) => {
  try {
    await firestore
      .collection(`rooms/${roomId}/attendants`)
      .doc(userId)
      .set(
        {
          name: userName,
          isOnline: true,
          joinAt: firestoreObj.FieldValue.serverTimestamp(),
          email
        },
        { merge: true }
      );
  } catch (error) {
    throw error;
  }
};

export const deleteUserAttendance = async (firestore, { roomId, userId }) => {
  try {
    await firestore
      .collection(`rooms/${roomId}/attendants`)
      .doc(userId)
      .delete();
  } catch (error) {
    throw error;
  }
};
