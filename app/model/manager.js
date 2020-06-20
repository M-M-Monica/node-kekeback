const bcrypt = require('bcryptjs')
const { sequelize } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')
const validator = require('validator')

class User extends Model {
  /* CMS */
  //登录校验
  static async verifyTelPassword(tel, password) {
    const user = await User.findOne({
      where: {
        tel
      }
    })
    if (!user) {
      throw new global.error.Forbidden('号码不存在')
    }
    const correct = bcrypt.compareSync(password, user.password)
    if(!correct){
      throw new global.error.Forbidden('密码不正确')
    }
    return user
  }
}

//关于注册的校验
class RegisterValidator {
  constructor(tel, password) {
    this.tel = tel
    this.password = password
  }
  //注册校验
  async validateTelPassword() {
    if (!validator.isMobilePhone(this.tel, ['zh-CN'])) {
      throw new global.error.Forbidden('手机号不符合规范')
    }
    if (!validator.isLength(this.password, { min: 6, max: 15 })) {
      throw new global.error.Forbidden('密码至少6个字符，最多15个字符')
    }
    if (!validator.matches(this.password, '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]')) {
      throw new global.error.Forbidden('密码需包括数字和字母')
    }
    const user = await User.findOne({
      where: {
        tel: this.tel
      }
    })
    if (user) {
      throw new global.error.Forbidden('该手机号已注册')
    }
    return true
  }
}

User.init({
  id: {
    type: Sequelize.INTEGER(10),
    primaryKey: true,
    autoIncrement: true
  },
  tel: {
    type: Sequelize.BIGINT(11)
  },
  password: { 
    type: Sequelize.STRING,
    set(val) {
      const salt = bcrypt.genSaltSync(5)
      const psw = bcrypt.hashSync(val, salt)
      this.setDataValue('password', psw)
    }
  }
}, { sequelize, tableName: 'user' })

module.exports = {
  User,
  RegisterValidator
}