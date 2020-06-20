const Router = require('koa-router')
const router = new Router({ prefix: '/product' })
const Product = require('../../model/product')
const Auth = require('../../../middleware/auth')

//获取商品列表
router.get('/list/:category/:pageNum', async ctx => {
	const { category, pageNum } = ctx.params
	const product = await Product.getProduct(category, pageNum)
  ctx.body = product
})

module.exports = router