const { Sequelize, Model } = require('sequelize')
const { sequelize } = require('../../core/db')

class Product extends Model{
  /* WX */
  //获取商品列表
  static async getProduct(category, pageNum){
    return await Product.findAndCountAll({
      where: {
        category
      },
      offset: (pageNum-1)*8,
      limit: 8
    })
  }
  /* CMS */
  //获取所有商品
  static async getAll(pageNum){
    return await Product.findAndCountAll({
      offset: (pageNum-1)*8,
      limit: 8
    })
  }
  //获取商品详情
  static async getDetail(id){
    return await Product.findOne({
      where: {
        id
      }
    })
  }
  //更新商品
  static async editGood(body){
    await Product.update({
      name: body.name,
      category: body.category,
      price: body.price,
      description: body.description,
      img: body.img
    }, { 
      where: {
        id: body.id
      }
    })
    return true
  }
  //删除商品
  static async delGood(id){
    await Product.destroy({
      where: {
        id
      }
    })
    return true
  }
  //新增商品
  static async addGood(body){
    await Product.create({
      name: body.name,
      category: body.category,
      price: body.price,
      description: body.description,
      img: body.img
    })
    return true
  }
  //搜索商品
  static async searchGood(name){
    return await Product.findAndCountAll({
      where: {
        name
      }
    })
  }
}

Product.init({
  id: {
    type: Sequelize.INTEGER(10),
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING(7)
  },
  category: {
    type: Sequelize.STRING(7)
  },
  price: {
    type: Sequelize.INTEGER(5)
  },
  description: {
    type: Sequelize.STRING(200)
  },
  img: {
    type: Sequelize.STRING(100)
  }
}, { sequelize, tableName: 'product' })

module.exports = Product