const Sequelize = require('sequelize')
const { dbName, host, port, user, password } = require('./config').database
const sequelize = new Sequelize(dbName, user, password, {
	//数据库类型
	dialect: 'mysql',
	host,
	port,
	timezone: '+08:00',
	define:{
		//create_time update_time
		timestamps: true,
		//软删除时间戳 delete_time
		paranoid: true,
		//不使用驼峰命名,或者createAt: 'create_at'
		underscored: true
	},
	dialectOptions: {
    dateStrings: true,
    typeCast: true
  }
})

//自动创建到数据库中去
sequelize.sync()

module.exports = {
	sequelize
}