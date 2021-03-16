const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { DateTime } = require('luxon');
const express = require('express');
const cors = require('cors');
// const slugify = require('./utils/slugify');

const app = express();
app.use(cors({ origin: true }));

admin.initializeApp();
const firestore = admin.firestore();

const REGION = 'asia-east2';

exports.roomCreated = functions
  .region(REGION)
  .firestore.document('rooms/{roomId}')
  .onCreate(async (snap, context) => {
    try {
      // increment number of rooms created on admin dashboard
      await firestore
        .collection('metadata')
        .doc('dashboard')
        .set(
          {
            activeRoomsCounter: admin.firestore.FieldValue.increment(1)
          },
          { merge: true }
        );

      // add created room to user createdRooms
      const roomId = context.params.roomId;
      const newValue = snap.data();
      await firestore
        .collection('users')
        .doc(newValue.hostId)
        .set(
          {
            createdRooms: admin.firestore.FieldValue.arrayUnion(roomId)
          },
          { merge: true }
        );
      return;
    } catch (error) {
      console.error(error);
    }
  });

exports.userUpdated = functions
  .region(REGION)
  .firestore.document('users/{userId}')
  .onUpdate(async (change, context) => {
    try {
      const userId = context.params.userId;
      const newValue = change.after.data();
      const oldValue = change.before.data();
      const newRooms = newValue.savedRooms;
      const oldRooms = oldValue.savedRooms;

      // add attendance
      if (newRooms.length > oldRooms.length) {
        const newSavedRoom = newRooms.filter(room => !oldRooms.includes(room));
        await firestore
          .collection(`rooms/${newSavedRoom[0]}/attendants`)
          .doc(userId)
          .set({
            name: newValue.name,
            isOnline: true,
            joinAt: admin.firestore.FieldValue.serverTimestamp(),
            email: newValue.email
          });
      }

      // remove attendance
      if (newRooms.length < oldRooms.length) {
        const deletedSavedRoom = oldRooms.filter(
          room => !newRooms.includes(room)
        );
        await firestore
          .collection(`rooms/${deletedSavedRoom[0]}/attendants`)
          .doc(userId)
          .delete();
      }
      return;
    } catch (error) {
      console.error(error);
    }
  });

exports.roomLeft = functions
  .region(REGION)
  .firestore.document('rooms/{roomId}/attendants/{userId}')
  .onDelete(async (snap, context) => {
    try {
      const roomId = context.params.roomId;

      // decrease number of attendants on room document
      const setAttendantsCounter = firestore
        .collection('rooms')
        .doc(roomId)
        .set(
          {
            attendantsCounter: admin.firestore.FieldValue.increment(-1)
          },
          { merge: true }
        );

      // decrease number of bookings on admin dashboard
      const setBookingsCounter = firestore
        .collection('metadata')
        .doc('dashboard')
        .set(
          {
            bookingsCounter: admin.firestore.FieldValue.increment(-1)
          },
          { merge: true }
        );

      Promise.all([setAttendantsCounter, setBookingsCounter])
        .then(values => {
          return;
        })
        .catch(err => console.error(err));
    } catch (error) {
      console.error(error);
    }
  });

exports.roomJoined = functions
  .region(REGION)
  .firestore.document('rooms/{roomId}/attendants/{userId}')
  .onCreate((snap, context) => {
    try {
      const roomId = context.params.roomId;

      // increment number of attendants on room document
      const setAttendantsCounter = firestore
        .collection('rooms')
        .doc(roomId)
        .set(
          {
            attendantsCounter: admin.firestore.FieldValue.increment(1)
          },
          { merge: true }
        );

      // increment number of bookings on admin dashboard
      const setBookingsCounter = firestore
        .collection('metadata')
        .doc('dashboard')
        .set(
          {
            bookingsCounter: admin.firestore.FieldValue.increment(1)
          },
          { merge: true }
        );

      Promise.all([setAttendantsCounter, setBookingsCounter])
        .then(values => {
          return;
        })
        .catch(err => console.error(err));
    } catch (error) {
      console.error(error);
    }
  });

exports.questionSent = functions
  .region(REGION)
  .firestore.document('rooms/{roomId}/questions/{questionId}')
  .onCreate(async (snap, context) => {
    try {
      const roomId = context.params.roomId;
      await firestore
        .collection('rooms')
        .doc(roomId)
        .set(
          {
            questionsCounter: admin.firestore.FieldValue.increment(1)
          },
          {
            merge: true
          }
        );
    } catch (error) {
      console.error(error);
    }
  });

exports.questionDeleted = functions
  .region(REGION)
  .firestore.document('rooms/{roomId}/questions/{questionId}')
  .onDelete(async (snap, context) => {
    try {
      const roomId = context.params.roomId;
      await firestore
        .collection('rooms')
        .doc(roomId)
        .set(
          {
            questionsCounter: admin.firestore.FieldValue.increment(-1)
          },
          { merge: true }
        );
    } catch (error) {
      console.error(error);
    }
  });

exports.sendQuestionNotification = functions
  .region(REGION)
  .firestore.document('rooms/{roomId}/questions/{questionId}')
  .onCreate(async (snap, context) => {
    try {
      const roomId = context.params.roomId;
      const newValue = snap.data();

      const payload = {
        notification: {
          title: 'New question added.',
          body: newValue.text || newValue.message
        }
      };

      const response = await admin
        .messaging()
        .sendToTopic(`questions_${roomId}`, payload);
      console.log('question notification response', response);

      return;
    } catch (error) {
      console.error(error);
    }
  });

exports.hostLeave = functions
  .region(REGION)
  .firestore.document('rooms/{roomId}')
  .onUpdate(async (change, context) => {
    try {
      const roomId = context.params.roomId;
      const newValue = change.after.data();

      if (!newValue.isActive) {
        // clear all attendants saved room
        const query = firestore
          .collection('users')
          .where('savedRooms', 'array-contains', roomId);
        const docs = await firestore.runTransaction(t => {
          return t.get(query);
        });

        if (docs.exists) {
          await docs.ref.update({
            savedRooms: admin.firestore.FieldValue.arrayRemove(roomId)
          });
        }
        return;
      }
    } catch (error) {
      console.error(error);
    }
  });

// app.get('/updateAttendantsEmail', async (req, res) => {
//   try {
//     const roomId = req.query.roomId;
//     const batch = firestore.batch();

//     const attendantSnaps = await firestore
//       .collection(`rooms/${roomId}/attendants`)
//       .get();
//     let attendantIds = [];
//     attendantSnaps.forEach(snap => {
//       attendantIds.push(snap.id);
//     });

//     const userSnaps = await firestore.collection('users').get();
//     userSnaps.forEach(doc => {
//       const id = doc.id;
//       if (attendantIds.includes(id)) {
//         const data = doc.data();
//         const ref = firestore
//           .collection(`rooms/${roomId}/attendants`)
//           .doc(doc.id);
//         batch.update(ref, {
//           email: data.email
//         });
//       }
//     });

//     await batch.commit();
//     res.send('Finished');
//   } catch (error) {
//     console.error(error);
//     res.send();
//   }
// });

// app.get('/updateUserInfo', async (req, res) => {
//   try {
//     const snaps = await firestore.collection('users').get();
//     const batch = firestore.batch();
//     const today = new Date();
//     snaps.forEach(doc => {
//       const ref = firestore.collection('users').doc(doc.id);
//       batch.update(ref, {
//         currentRooms: admin.firestore.FieldValue.delete(),
//         savedRooms: [],
//         createdRooms: [],
//         loginWith: 'google.com',
//         emailUpdatedAt: today,
//         registeredAt: today
//       });
//     });
//     await batch.commit();

//     res.send('Finished');
//   } catch (error) {
//     console.error(error);
//     res.end();
//   }
// });

// app.get('/updateRoomInfo', async (req, res) => {
//   try {
//     const snaps = await firestore.collection('rooms').get();
//     const batch = firestore.batch();
//     snaps.forEach(async doc => {
//       const roomRef = firestore.collection('rooms').doc(doc.id);
//       const data = doc.data();
//       batch.update(roomRef, {
//         code: slugify(data.name),
//         isPublic: true,
//         locationName: ''
//       });

//       const userRef = firestore.collection('users').doc(data.hostId);
//       batch.update(userRef, {
//         createdRooms: admin.firestore.FieldValue.arrayUnion(doc.id)
//       });

//       const subCollectionRef = roomRef.collection('details').doc('detail');
//       batch.set(subCollectionRef, {
//         coverImageUrl: '',
//         description: '',
//         facebookLiveUrl: '',
//         videoCallUrl: '',
//         youtubeLiveUrl: ''
//       });
//     });

//     await batch.commit();
//     res.send('Finished');
//   } catch (error) {
//     console.error(error);
//     res.end();
//   }
// });

// exports.updateDatabase = functions
//   .runWith({
//     timeoutSeconds: 60,
//     memory: '2GB'
//   })
//   .region(REGION)
//   .https.onRequest(app);

// exports.roomDeleted = functions.pubsub
//   .schedule('0 0 * * *')
//   .onRun(async context => {
//     try {
//       const daysLater = DateTime.local()
//         .minus({ days: 1 })
//         .toString();
//       const docs = await firestore
//         .collection('rooms')
//         .where('createdAt', '>=', daysLater)
//         .get();
//       if (docs.empty) {
//         return;
//       }
//       docs.forEach(async doc => {
//         const attendantDocs = await firestore
//           .collection(`rooms/${doc.id}/attendants`)
//           .get();
//         if (!attendantDocs.empty) {
//           attendantDocs.forEach(async attendant => {
//             await firestore
//               .collection(`rooms/${docs.id}/attendants`)
//               .doc(attendant.id)
//               .delete();
//           });
//         }
//         const questionDocs = await firestore
//           .collection(`rooms/${doc.id}/questions`)
//           .get();
//         if (!questionDocs.empty) {
//           questionDocs.forEach(async question => {
//             await firestore
//               .collection(`rooms/${docs.id}/question`)
//               .doc(question.id)
//               .delete();
//           });
//         }
//         await firestore
//           .collection('rooms')
//           .doc(doc.id)
//           .delete();
//       });
//     } catch (error) {
//       console.error(error);
//     }
//   });
