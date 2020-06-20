const Router = require('koa-router')
const router = new Router({ prefix: '/cart' })
const { Cart } = require('../../model/cart')
const Auth = require('../../../middleware/auth')

//获取购物车列表
router.get('/list', new Auth().m, async ctx => {
	const cartList = await Cart.getProductList(ctx.auth.uid)
  ctx.body = cartList
})

//添加商品
router.get('/add/:id', new Auth().m, async ctx => {
	const { id } = ctx.params
	const data = await Cart.addToCart(ctx.auth.uid, id)
  if(data){
		throw new global.error.Success('添加成功')
	}
})

//改变商品状态
router.get('/select/:id', new Auth().m, async ctx => {
	const { id } = ctx.params
	const data = await Cart.selectProduct(ctx.auth.uid, id)
  if(data){
		throw new global.error.Success()
	}
})

//增加商品数量
router.get('/increase/:id', new Auth().m, async ctx => {
	const { id } = ctx.params
	const data = await Cart.increaseCount(ctx.auth.uid, id)
  if(data){
		throw new global.error.Success()
	}
})

//减少商品数量
router.get('/decrease/:id', new Auth().m, async ctx => {
	const { id } = ctx.params
	const data = await Cart.decreaseCount(ctx.auth.uid, id)
  if(data){
		throw new global.error.Success()
	}
})

//删除商品
router.get('/delete/:id', new Auth().m, async ctx => {
	const { id } = ctx.params
	const data = await Cart.deleteProduct(ctx.auth.uid, id)
  if(data){
		throw new global.error.Success('删除成功')
	}
})

module.exports = router