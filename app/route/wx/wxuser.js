const Router = require('koa-router')
const router = new Router()
const util = require('util')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const LoginType = require('../../../assist/enum')
const { Customer } = require('../../model/customer')
const Auth = require('../../../middleware/auth')

//生成token
router.post('/token', async ctx => {
  const body = ctx.request.body
  let token;
  switch (body.type) {
    case LoginType.USER:
      token = await codeToToken(body.account)
      break
    case LoginType.USER_TEL://11-29
      token = await telLogin(body.tel,body.password)
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

async function codeToToken(code) {
  const url = util.format(
    global.config.wx.loginUrl,
    global.config.wx.appId,
    global.config.wx.appSecret,
    code
  )
  //openid获取
  const result = await axios.get(url)
  if (result.status !== 200) {
    throw new global.error.AuthFailed('openid获取失败')
  }
  const errcode = result.data.errcode
  const errmsg = result.data.errmsg
  if (errcode){
    throw new global.error.AuthFailed(errmsg)
  }
  //查找是否有这个用户
  let customer = await Customer.getUserByOpenid(result.data.openid)
  //没有则添加这个用户
  if(!customer){
    customer = await Customer.registerByOpenid(result.data.openid)
  }
  //生成令牌并返回
  return generateToken(customer.id, Auth.USER)
}

async function telLogin(account, secret) {//11-29
  const customer = await Customer.verifyTelPassword(account, secret)
  return token = generateToken(customer.id, Auth.USER)
}

function generateToken(uid, scope) {
  const secretKey = global.config.security.secretKey
  const expiresIn = global.config.security.expiresIn
  const token = jwt.sign({
    uid,
    scope
  },secretKey,{
    expiresIn
  })
  return token
}

module.exports = router