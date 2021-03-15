const Router = require('koa-router')
const router = new Router({ prefix: '/order' })
const { Order } = require('../../model/order')
const Auth = require('../../../middleware/auth')

//获取订单列表
router.get('/list', new Auth().m, async ctx => {
	const orderList = await Order.getOrderList(ctx.auth.uid)
  ctx.body = orderList
})

//创建订单
router.post('/create', new Auth().m, async ctx => {
	const { goodsArr, total } = ctx.request.body
	const order = await Order.createOrder(ctx.auth.uid, goodsArr, total)
  ctx.body = order
})

//取消订单
router.get('/cancel/:id', new Auth().m, async ctx => {
	const { id } = ctx.params
	const data = await Order.cancelOrder(id)
	if (data) {
		throw new global.error.Success('删除成功')
	}
})

//确认支付
router.get('/pay/:id', new Auth().m, async ctx => {
	const { id } = ctx.params
	const data = await Order.updateOrder(id)
	if (data) {
		throw new global.error.Success('支付成功')
	}
})

module.exports = router