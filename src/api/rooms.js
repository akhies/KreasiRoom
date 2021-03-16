import formatDate, { dateSecondsToJSDate } from '@/helpers/format-date.js';

const today = new Date();

const generateRooms = docs => {
  let items = [];
  docs.forEach(doc => {
    const data = doc.data();
    items.push({
      id: doc.id,
      ...data,
      checkInDatetime: formatDate(data.checkIn.seconds),
      checkInJSDatetime: dateSecondsToJSDate(data.checkIn.seconds),
      checkOutDatetime: formatDate(data.checkOut.seconds),
      checkOutJSDatetime: dateSecondsToJSDate(data.checkOut.seconds),
      checkInDate: formatDate(data.checkIn.seconds, 'DD'),
      checkInTime: formatDate(data.checkIn.seconds, 'HH:mm ZZZZ'),
      checkOutDate: formatDate(data.checkOut.seconds, 'DD'),
      checkOutTime: formatDate(data.checkOut.seconds, 'HH:mm ZZZZ'),
      isSaving: false,
      isRecentlySaved: false,
      isClosed: dateSecondsToJSDate(data.checkOut.seconds) < today
    });
  });
  return items;
};

export const validateRoom = async (firestore, roomId) => {
  try {
    const doc = await firestore
      .collection('rooms')
      .doc(roomId)
      .get();
    return doc.exists;
  } catch (error) {
    throw error;
  }
};

export const validateActiveRoomCode = async (firestore, roomCode) => {
  try {
    const docs = await firestore
      .collection('rooms')
      .where('code', '==', roomCode)
      .where('checkOut', '>', today)
      .get();
    return !docs.empty;
  } catch (error) {
    throw error;
  }
};

export const addRoom = async (firestore, payload) => {
  try {
    return await firestore.collection('rooms').add(payload);
  } catch (error) {
    throw error;
  }
};

export const editRoom = async (firestore, roomId, payload) => {
  try {
    return await firestore
      .collection('rooms')
      .doc(roomId)
      .set(payload, { merge: true });
  } catch (error) {
    throw error;
  }
};

export const addRoomDetail = async (firestore, roomId, payload) => {
  try {
    return await firestore
      .collection(`rooms/${roomId}/details`)
      .doc('detail')
      .set(payload);
  } catch (error) {
    throw error;
  }
};

export const editRoomDetail = async (firestore, roomId, payload) => {
  try {
    return await firestore
      .collection(`rooms/${roomId}/details`)
      .doc('detail')
      .set(payload, { merge: true });
  } catch (error) {
    throw error;
  }
};

export const addRoomPassword = async (firestore, roomId, payload) => {
  try {
    return await firestore
      .collection(`rooms/${roomId}/password`)
      .doc('password')
      .set(payload);
  } catch (error) {
    throw error;
  }
};

export const editRoomPassword = async (firestore, roomId, payload) => {
  try {
    return await firestore
      .collection(`rooms/${roomId}/password`)
      .doc('password')
      .set(payload, { merge: true });
  } catch (error) {
    throw error;
  }
};

export const fetchRoom = async (firestore, roomId) => {
  try {
    const doc = await firestore
      .collection('rooms')
      .doc(roomId)
      .get();
    if (!doc.exists) throw new Error('No rooms available');
    return doc.data();
  } catch (error) {
    throw error;
  }
};

export const fetchRoomsByCode = async (firestore, roomCode) => {
  try {
    const docs = await firestore
      .collection('rooms')
      .where('code', '>=', roomCode)
      .where('code', '<=', roomCode + '\uf8ff')
      .get();
    if (docs.empty) return [];
    return generateRooms(docs);
  } catch (error) {
    throw error;
  }
};

export const fetchRoomsByName = async (firestore, roomName) => {
  try {
    const docs = await firestore
      .collection('rooms')
      .where('name', '>=', roomName)
      .where('name', '<=', roomName + '\uf8ff')
      .get();
    if (docs.empty) return [];
    return generateRooms(docs);
  } catch (error) {
    throw error;
  }
};

export const fetchRoomsByHostName = async (firestore, hostName) => {
  try {
    const docs = await firestore
      .collection('rooms')
      .where('hostName', '>=', hostName)
      .where('hostName', '<=', hostName + '\uf8ff')
      .get();
    if (docs.empty) return [];
    return generateRooms(docs);
  } catch (error) {
    throw error;
  }
};

export const fetchRoomsByIds = async (firestore, firestoreObj, ids) => {
  try {
    if (!ids.length) return [];
    const docs = await firestore
      .collection('rooms')
      .where(firestoreObj.FieldPath.documentId(), 'in', ids)
      .get();
    if (docs.empty) return [];
    return generateRooms(docs);
  } catch (error) {
    console.log('failed to fetch rooms by ids: ', error);
    throw error;
  }
};

export const fetchRooms = async (
  firestore,
  {
    limit = 10,
    action = 'refresh',
    filterRoomName = '',
    firstRoomName = '',
    lastRoomName = '',
    isActive = false,
    firstPrevRoomName = ''
  }
) => {
  try {
    const query = firestore
      .collection('rooms')
      .where('isActive', '==', isActive)
      .orderBy('name');

    let queryLimit = null;
    switch (action) {
      case 'next':
        queryLimit = query.startAfter(lastRoomName).limit(limit);
        break;
      case 'prev':
        queryLimit = query
          .startAt(firstPrevRoomName)
          .endBefore(firstRoomName)
          .limitToLast(limit);
        break;
      default:
        queryLimit = query
          .startAt(filterRoomName)
          .endAt(filterRoomName + '\uf8ff')
          .limit(limit);
        break;
    }

    const docs = await queryLimit.get();
    if (docs.empty) throw new Error('All rooms are already loaded.');
    return generateRooms(docs);
  } catch (error) {
    throw error;
  }
};

export const fetchRoomInfoByCode = async (firestore, roomCode) => {
  try {
    const docs = await firestore
      .collection('rooms')
      .where('code', '==', roomCode)
      .where('checkOut', '>', today)
      .get();
    if (docs.empty) throw new Error('Room tidak ditemukan.');
    const rooms = generateRooms(docs);
    return rooms[0];
  } catch (error) {
    throw error;
  }
};

export const fetchRoomDetail = async (firestore, roomId) => {
  try {
    const doc = await firestore
      .collection(`rooms/${roomId}/details`)
      .doc('detail')
      .get();
    if (!doc.exists) throw new Error('Detail room tidak ditemukan.');
    const roomDetail = doc.data();
    return roomDetail;
  } catch (error) {
    throw error;
  }
};

export const fetchRoomPassword = async (firestore, roomId) => {
  try {
    const doc = await firestore
      .collection(`rooms/${roomId}/password`)
      .doc('password')
      .get();
    if (!doc.exists) throw new Error('Kata sandi tidak ditemukan.');
    return doc.data();
  } catch (error) {
    throw error;
  }
};

export const setUserSavedRoom = async (
  firestore,
  firestoreObj,
  { isSaving = true, roomId, userId }
) => {
  try {
    await firestore
      .collection('users')
      .doc(userId)
      .update({
        savedRooms: isSaving
          ? firestoreObj.FieldValue.arrayUnion(roomId)
          : firestoreObj.FieldValue.arrayRemove(roomId)
      });
  } catch (error) {
    throw error;
  }
};

export const removeUserSavedRoom = async (
  firestore,
  firestoreObj,
  { roomId, userId }
) => {
  try {
    await firestore
      .collection('users')
      .doc(userId)
      .update({ savedRooms: firestoreObj.FieldValue.arrayRemove(roomId) });
  } catch (error) {
    throw error;
  }
};

export const clearUserCurrentRoom = async (firestore, userId) => {
  try {
    await firestore
      .collection('users')
      .doc(userId)
      .update({
        currentRoom: null
      });
  } catch (error) {
    throw error;
  }
};

export const setInactiveRoom = async (firestore, roomId) => {
  try {
    await firestore
      .collection('rooms')
      .doc(roomId)
      .update({
        isActive: false
      });
  } catch (error) {
    throw error;
  }
};
