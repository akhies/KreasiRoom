export const addErrorLog = async (firestore, { code, message }) => {
  return await firestore.collection(`errors`).add({
    code,
    message
  });
};
