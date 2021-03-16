const generateQuestions = (docs, userId) => {
  const items = [];
  docs.forEach(doc => {
    const data = doc.data();
    items.push({
      id: doc.id,
      ...data,
      isLikingQuestion: false,
      isDeletingQuestion: false,
      hasLiked: userId ? data.likedBy.includes(userId) : false
    });
  });
  return items;
};

export const fetchAllQuestions = async (firestore, { roomId, userId }) => {
  try {
    const docs = await firestore
      .collection(`rooms/${roomId}/questions`)
      .orderBy('likesCounter', 'desc')
      .get();
    if (docs.empty) return [];
    return generateQuestions(docs, userId);
  } catch (error) {
    throw error;
  }
};

export const fetchQuestions = async (
  firestore,
  { roomId, questions, limit = 10, userId }
) => {
  try {
    const query = firestore
      .collection(`rooms/${roomId}/questions`)
      .orderBy('likesCounter', 'desc');
    const queryLastQuestion = questions.length
      ? query.startAfter(questions[questions.length - 1].likesCounter)
      : query;
    const docs = await queryLastQuestion.limit(limit).get();
    if (docs.empty) return [];
    return generateQuestions(docs, userId);
  } catch (error) {
    throw error;
  }
};

export const addQuestion = async (
  firestore,
  firestoreObj,
  { roomId, message, senderId, senderName }
) => {
  try {
    await firestore.collection(`rooms/${roomId}/questions`).add({
      senderId,
      senderName,
      message,
      hasRead: false,
      likedBy: [],
      likesCounter: 0,
      createdAt: firestoreObj.FieldValue.serverTimestamp()
    });
  } catch (error) {
    throw error;
  }
};

export const deleteQuestion = async (firestore, { roomId, questionId }) => {
  try {
    await firestore
      .collection(`rooms/${roomId}/questions`)
      .doc(questionId)
      .delete();
  } catch (error) {
    throw error;
  }
};

export const likeQuestion = async (
  firestore,
  firestoreObj,
  { roomId, userId, isLike, questionId }
) => {
  try {
    const fieldValue = firestoreObj.FieldValue;
    let updateLikedBy = fieldValue.arrayRemove(userId);
    let updateLikesCounter = -1;
    if (isLike) {
      updateLikedBy = fieldValue.arrayUnion(userId);
      updateLikesCounter = 1;
    }
    await firestore
      .collection(`rooms/${roomId}/questions`)
      .doc(questionId)
      .update({
        likedBy: updateLikedBy,
        likesCounter: fieldValue.increment(updateLikesCounter)
      });
  } catch (error) {
    throw error;
  }
};
