const bcrypt = require('bcryptjs')
const validator = require('validator')
const { Sequelize, Model } = require('sequelize')
const { sequelize } = require('../../core/db')
const { Order, OrderList } = require('./order')
const { Cart, CartList } = require('./cart')
const Product = require('./product')

class Customer extends Model{
  /* WX & WEB */
  //登录校验
  static async verifyTelPassword(tel, password) {
    const customer = await Customer.findOne({
      where: {
        tel
      }
    })
    if (!customer) {
      throw new global.error.Forbidden('号码不存在')
    }
    const correct = bcrypt.compareSync(password, customer.password)
    if(!correct){
      throw new global.error.Forbidden('密码不正确')
    }
    return customer
  }
  static async getUserByOpenid(openid){
    return await Customer.findOne({
      where:{
        openid
      }
    })
  }
  //通过openid注册
  static async registerByOpenid(openid) {
    const customer = await Customer.create({
      openid
    })
    return customer.createCart()
  }
  static async getUserInfo(uid){
    return await Customer.findOne({
      attributes: {
        exclude: ['openid']
      },
      where:{
        id: uid
      }
    })
  }
  static async updateUserInfo(uid, userInfo){
    return await Customer.update({
      name: userInfo.name,
      tel: userInfo.tel,
      address: userInfo.address
    }, {
      where: {
        id: uid
      }
    })  
  }
  /* CMS */
  static async getAll(pageNum){
    return await Customer.findAndCountAll({
      attributes: {
        exclude: ['openid']
      },
      offset: (pageNum-1)*10,
      limit: 10
    })
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
    let customer = await Customer.findOne({
      where: {
        tel: this.tel
      }
    })
    if (customer) {
      throw new global.error.Forbidden('该手机号已注册')
    }else{
        customer = await Customer.create({
          tel: this.tel,
          password: this.password
        })
        customer.createCart()
    }
    return true
  }
}

Customer.init({
  id: {
    type: Sequelize.INTEGER(10),
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING(25)
  },
  address: {
    type: Sequelize.STRING(50)
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
  },
  openid: {
    type: Sequelize.STRING(64),
    unique: true
  }
}, { sequelize, tableName: 'customer' })

Customer.hasMany(Order)
Order.belongsTo(Customer)

Customer.hasOne(Cart)

Order.belongsToMany(Product, { through: 'OrderList' })
Product.belongsToMany(Order, { through: 'OrderList' })

Cart.belongsToMany(Product, { through: 'CartList' })
Product.belongsToMany(Cart, { through: 'CartList' })

module.exports = {
  Customer,
  RegisterValidator
}