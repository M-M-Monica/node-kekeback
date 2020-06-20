const requireDirectory = require('require-directory')
const Router = require('koa-router')

class InitManage{
	//入口方法
	static initCore(app){
		InitManage.app = app
		InitManage.initLoadRouter()
		InitManage.loadConfig()
		InitManage.loadHttpError()
	}

	static initLoadRouter(){
		//路由绝对地址
		const routerPath = `${process.cwd()}/app/route`
		//找到并查看(路由)模块
		requireDirectory(module, routerPath, {
			visit: loadModule
		})
		function loadModule(obj) {
			if(obj instanceof Router){
				InitManage.app.use(obj.routes())
			}
		}
	}

	static loadConfig() {
    global.config = require('./config')
  }

  static loadHttpError(){
    global.error = require('../assist/http-error')
  }
}

module.exports = InitManage