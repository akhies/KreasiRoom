export const sendEmailVerification = async (user, baseURL) => {
  try {
    await user.sendEmailVerification({
      url: `${baseURL}/?verified=true&email=${decodeURIComponent(user.email)}`
    });
  } catch (error) {
    console.error('send email verification error: ', error);
  }
};
