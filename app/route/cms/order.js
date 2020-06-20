const Router = require('koa-router')
const router = new Router({ prefix: '/manage/order' })
const { Order } = require('../../model/order')
const loginCheck = require('../../../middleware/login-check')

//获取订单列表
router.post('/list', loginCheck, async ctx => {
	const { pageNum } = ctx.request.body
	const order = await Order.getAll(pageNum)
  ctx.body = order
})

//获取订单详情
router.post('/detail', loginCheck, async ctx => {
	const { id } = ctx.request.body
	const orderDetail = await Order.getDetail(id)
  ctx.body = orderDetail
})

//按订单号查询
router.post('/search', loginCheck, async ctx => {
	const { id } = ctx.request.body
	const order = await Order.searchOrder(id)
  ctx.body = order
})

//订单状态改变
router.post('/send', loginCheck, async ctx => {
	const { id } = ctx.request.body
	const data = await Order.sendGood(id)
	if(data){
		throw new global.error.Success('订单状态修改成功')
	}
})

module.exports = router