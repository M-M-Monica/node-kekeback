const { Sequelize, Model } = require('sequelize')
const { sequelize } = require('../../core/db')

class Statistic extends Model{
  /* CMS */
  static async getAll(){
    return await Statistic.findAll()
  }
}

Statistic.init({
  id: {
    type: Sequelize.INTEGER(1),
    primaryKey: true,
    autoIncrement: true
  },
  customer: {
    type: Sequelize.INTEGER(10)
  },
  product: {
    type: Sequelize.INTEGER(10)
  },
  order: {
    type: Sequelize.INTEGER(10)
  }
}, { sequelize, tableName: 'statistic' })

module.exports = Statistic