const Router = require('koa-router')
const router = new Router()
const WX = require('../../model/wxuser')
const Auth = require('../../../middleware/auth')
const LoginType = require('../../../assist/enum')

//生成token
router.post('/token', async ctx => {
  const body = ctx.request.body
  let token;
  switch (body.type) {
    case LoginType.USER:
      token = await WX.codeToToken(body.account)
      break
    case LoginType.ADMIN:
      break
    default:
      throw new global.error.NotFound()
  }
  ctx.body = token
})

//校验token
router.post('/verify', async (ctx) => {
  const { token } = ctx.request.body
  const isValid = Auth.verifyToken(token)
  ctx.body = isValid
})

module.exports = router