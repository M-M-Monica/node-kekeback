const { Sequelize, Model } = require('sequelize')
const { sequelize } = require('../../core/db')
const { Customer } = require('./customer')
const Product = require('./product')

class Cart extends Model{
  /* WX */
  //获取购物车列表
  static async getProductList(uid){
    const cart = await Cart.findOne({
      where: {
        customer_id: uid
      }
    })
    return await cart.getProducts()
  }
  //添加商品
  static async addToCart(uid, pid){
    //找到用户对应的购物车
    const cart = await Cart.findOne({
      where: {
        customer_id: uid
      }
    })
    //购物车里有没有该商品
    const good = await cart.getProducts({
      where: {
        id: pid
      }
    })
    const product = await Product.findOne({
      where: {
        id: pid
      }
    })
    if (good.length === 0) {
      return await cart.addProduct(
        product,
        {
          through: {
            status: 1,
            count: 1
          }
        }
      )
    }else {
      return await CartList.update({
        count: sequelize.literal('count+1')
      }, {
        where: {
          cart_id: cart.id,
          product_id: pid
        }
      })       
    }
  }
  //改变商品选择状态
  static async selectProduct(uid, pid){
    //找到用户对应的购物车
    const cart = await Cart.findOne({
      where: {
        customer_id: uid
      }
    })
    return await CartList.update({
      status: sequelize.literal('!status')
    }, {
      where: {
        cart_id: cart.id,
        product_id: pid
      }
    })
  }
  //增加商品数量
  static async increaseCount(uid, pid){
    const cart = await Cart.findOne({
      where: {
        customer_id: uid
      }
    })
    return await CartList.update({
      count: sequelize.literal('count+1')
    }, {
      where: {
        cart_id: cart.id,
        product_id: pid
      }
    })
  }
  //减少商品数量
  static async decreaseCount(uid, pid){
    const cart = await Cart.findOne({
      where: {
        customer_id: uid
      }
    })
    return await CartList.update({
      count: sequelize.literal('count-1')
    }, {
      where: {
        cart_id: cart.id,
        product_id: pid
      }
    })
  }
  //删除商品
  static async deleteProduct(uid, pid){
    //找到用户对应的购物车
    const cart = await Cart.findOne({
      where: {
        customer_id: uid
      }
    })
    //找到购物车里要删除的商品
    const good = await cart.getProducts({
      where: {
        id: pid
      }
    })
    await cart.removeProduct(good, {force: true})
    return true
  }
}

class CartList extends Model{
}

Cart.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }
}, { sequelize, tableName: 'cart' })

CartList.init({
  count: {
    type: Sequelize.INTEGER
  },
  status: {
    type: Sequelize.INTEGER
  }
}, { sequelize, tableName: 'cart_list' })

module.exports = {
  Cart,
  CartList
}