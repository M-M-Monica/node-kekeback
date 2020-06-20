const Router = require('koa-router')
const router = new Router()
const Statistic = require('../../model/statistic')
const loginCheck = require('../../../middleware/login-check')

//统计用户/商品/订单数
router.get('/manage/statistic', loginCheck, async ctx => {
	const statistic = await Statistic.getAll()
  ctx.body = statistic
})

module.exports = router