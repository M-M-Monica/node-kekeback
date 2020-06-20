const { Sequelize, Model } = require('sequelize')
const { sequelize } = require('../../core/db')
const Product = require('./product')
const { Cart } = require('./cart')

class Order extends Model{
  /* WX */
  //获取订单列表
  static async getOrderList(uid){
    return await Order.findAll({
      include: [
        { model: Product }
      ],
      where: {
        customer_id: uid
      },
      order:[
        ["id", "DESC"]
      ]
    })
  }
  //创建订单cartlist
  static async createOrder(uid, goodsArr, total){
    const Customer = require('./customer')
    const customer = await Customer.findOne({
      attributes: {
        exclude: ['openid']
      },
      where: {
        id: uid
      }
    })
    const cart = await Cart.findOne({
      where: {
        customer_id: uid
      }
    })
    const o = await customer.createOrder({
      status: 1,
      total
    })
    const order = await Order.findOne({
      where: {
        id: o.id
      }
    })
    await test()
    async function test(){
      for(let item of goodsArr){
        const good = await Product.findAll({
          where: {
            id: item.id
          }
        })
        await order.addProduct(good, {
          through: { count: item.count }
        })
        await cart.removeProduct(good, {
          force: true
        })
      }
    }
    return {
      customer,
      order
    }
  }
  //取消订单
  static async cancelOrder(oid){
    const order = await Order.findOne({
      where: {
        id: oid
      }
    })
    await order.setProducts([], {force: true})
    return await order.destroy({force: true})
  }
  //确认支付
  static async updateOrder(oid){
    return await Order.update({
      status: 2
    }, {
      where: {
        id: oid
      }
    })
  }
  /* CMS */
  //获取订单列表
  static async getAll(pageNum){
    return await Order.findAndCountAll({
      offset: (pageNum-1)*10,
      limit: 10
    })
  }
  //获取订单详情
  static async getDetail(id){
    const Customer = require('./customer')
    const orderDetail = await Order.findOne({
      include: [
        {
          model: Product,
          through: {
            attributes: ['count']
          }
        },
        {
          model: Customer,
          attributes: {
            exclude: ['openid']
          }
        }
      ],
      where: {
        id
      }
    })
    return orderDetail
  }
  //搜索订单
  static async searchOrder(id){
    return await Order.findAndCountAll({
      where: {
        id
      }
    })
  }
  //订单状态改变
  static async sendGood(id){
    await Order.update({
      status: 3
    }, {
      where: {
        id
      }
    })
    return true
  }  
}

class OrderList extends Model{
}

Order.init({
  id: {
    type: Sequelize.INTEGER(10),
    primaryKey: true,
    autoIncrement: true
  },
  status: {
    type: Sequelize.INTEGER(1)
  },
  total: {
    type: Sequelize.INTEGER(5)
  }
}, { sequelize, tableName: 'order' })

OrderList.init({
  count: {
    type: Sequelize.INTEGER(5)
  }
}, { sequelize, tableName: 'order_list' })

// Order.belongsTo(Customer)
// OrderList.belongsTo(Product)

module.exports = {
  Order,
  OrderList
}