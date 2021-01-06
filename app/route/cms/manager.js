const Router = require('koa-router')
const router = new Router({ prefix: '/manage/user' })
const { Customer } = require('../../model/customer')
const { User, RegisterValidator } = require('../../model/manager')
const loginCheck = require('../../../middleware/login-check')

//管理员注册
router.post('/register', async ctx => {
  const { tel, password } = ctx.request.body
  //校验看看有没有不符合要求的输入
  const user = await new RegisterValidator(tel, password).validateTelPassword()
	//没问题则拿到输入
  if (user) {
    //把数据加到数据库
    await User.create({
      tel,
      password
    })
    throw new global.error.Success('注册成功')
  }
})

//管理员登录
router.post('/login', async ctx => {
  const { tel, password } = ctx.request.body
  const user = await User.verifyTelPassword(tel, password)
  if (user) {
    ctx.session.user = user
    throw new global.error.Success('登录成功')
    return
  }
  throw new global.error.NotFound('登录失败')
})

//退出登录
router.get('/logout', ctx => {
  ctx.session.user = null
  throw new global.error.Success('已退出登录') 
})

//获取用户列表
router.post('/list', loginCheck, async ctx => {
  const { pageNum } = ctx.request.body
  const userList = await Customer.getAll(pageNum)
  ctx.body = userList
})

module.exports = router