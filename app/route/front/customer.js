const Router = require('koa-router')
const router = new Router({ prefix: '/user' })
const { Customer, RegisterValidator } = require('../../model/customer')
const Auth = require('../../../middleware/auth')

//用户注册
router.post('/register', async ctx => {
  const { tel, password } = ctx.request.body
  //校验看看有没有不符合要求的输入
  const customer = await new RegisterValidator(tel, password).validateTelPassword()
  //没问题则拿到输入
  if (customer) {
    throw new global.error.Success('注册成功')
  }
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