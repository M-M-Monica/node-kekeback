const Router = require('koa-router')
const router = new Router({ prefix: '/user' })
const Customer = require('../../model/customer')
const Auth = require('../../../middleware/auth')

//11-29
router.post('/register', async (ctx) => {
  const v = await new RegisterValidator().validate(ctx)
  // email password
  // token jwt
  // token 无意义的随机字符串
  // 携带数据
  // uid jwt

  // 令牌获取 颁布令牌
  const user = {
      email: v.get('body.email'),
      password: v.get('body.password2'),
      nickname: v.get('body.nickname')
  }

  await User.create(user)
  success()
})

//获取用户信息
router.get('/info', new Auth().m, async ctx => {
  const userInfo = await Customer.getUserInfo(ctx.auth.uid)
  ctx.body = userInfo
})

//修改用户信息
router.post('/update', new Auth().m, async ctx => {
	const { userInfo } = ctx.request.body
  const data = await Customer.updateUserInfo(ctx.auth.uid, userInfo)
  if (data) {
  	throw new global.error.Success('修改成功')
  }
})

module.exports = router