export default async ctx => {
  try {
    await ctx.store.dispatch('getCurrentUserInfo', ctx);
  } catch (error) {
    console.error(error);
  }
};
