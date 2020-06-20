const Koa = require('koa')
const app = new Koa()
const path = require('path')
const parser = require('koa-bodyparser')
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
const static = require('koa-static')
const InitManager = require('./core/init')
const catchError = require('./middleware/catch-error')

//User.init()
require('./app/model/customer')

//全局异常处理
app.use(catchError)
//处理body传递的请求参数
app.use(parser())
//静态文件显示
app.use(static(path.join(__dirname, './static')))
//配置session
app.keys = ['Molly_#137']
app.use(session({
  //配置 cookie
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  },
  //配置 redis
  store: redisStore({
    all: '127.0.0.1:6379'
  })
}))
//合并加载路由
InitManager.initCore(app)

app.listen(3000)