module.exports = async (ctx, next) => {
  if (ctx.session.user) {
    await next()
    return
  }
  throw new global.error.NotFound('未登录')
}