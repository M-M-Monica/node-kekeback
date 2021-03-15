const Router = require('koa-router')
const router = new Router({ prefix: '/product' })
const Product = require('../../model/product')
const Auth = require('../../../middleware/auth')

//获取商品列表
router.get('/list/:category/:page', async ctx => {
	const { category, page } = ctx.params
	let num = JSON.parse(page.split('&')[0].split('=')[1])
	let size = JSON.parse(page.split('&')[1].split('=')[1])
	const product = await Product.getProduct(category, num, size)
  ctx.body = product
})

module.exports = router