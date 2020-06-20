const util = require('util')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const Customer = require('./customer')
const Auth = require('../../middleware/auth')

class WX {
  /* WX */
  static async codeToToken(code) {
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
    let user = await Customer.getUserByOpenid(result.data.openid)
    //没有则添加这个用户
    if(!user){
      user = await Customer.registerByOpenid(result.data.openid)
    }
    //生成令牌并返回
    return generateToken(user.id, Auth.USER)
  }
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

module.exports = WX