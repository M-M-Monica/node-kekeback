//配置环境
module.exports = {
	//prod生产环境
	//dev开发环境
	environment: 'dev',
	database: {
		dbName: 'kekeback',
		host: 'localhost',
		port: 3306,
		user: 'root',
		password: ''
	},
  security: {
    secretKey: "Molly_#137",
    expiresIn: 60*60*2
  },
  wx: {
    appId: '',
    appSecret: '',
    loginUrl: 'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code'
  },
  host: 'http://localhost:3000/'
}