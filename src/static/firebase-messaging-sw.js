
// Only works on Firebase hosting!
importScripts('/__/firebase/7.14.1/firebase-app.js')
importScripts('/__/firebase/7.14.1/firebase-messaging.js')
importScripts('/__/firebase/init.js')

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging()
