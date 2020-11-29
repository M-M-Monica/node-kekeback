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
    case LoginType.USER_TEL://11-29
      token = await telLogin(v.get('body.account'),v.get('body.secret'))
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

async function telLogin(account, secret) {//11-29
  const user = await User.verifyTelPassword(account, secret)
  return token = generateToken(user.id, Auth.USER)
}

module.exports = router