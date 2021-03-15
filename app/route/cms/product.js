const Router = require('koa-router')
const router = new Router({ prefix: '/manage/product' })
const multer = require('@koa/multer')
const path = require('path')
const Product = require('../../model/product')
const loginCheck = require('../../../middleware/login-check')

// 配置上传的文件目录及文件名
const storage = multer.diskStorage({
  destination: (req, file, cb)=>{
    cb(null, path.join(__dirname, '../../../static/image'))
  },
  filename: (req, file, cb)=>{
    cb(null, file.originalname)
  }
})
const upload = multer({ storage })
//图片上传
router.post('/upload', loginCheck, upload.single('avatar'), async ctx => {
  const imgUrl = '/image/'+ctx.file.originalname
  ctx.body = { imgUrl }
})

//获取商品列表
router.post('/list', loginCheck, async ctx => {
	const { pageNum } = ctx.request.body
	const product = await Product.getAll(pageNum)
  ctx.body = product
})

//获取商品详情
router.post('/detail', loginCheck, async ctx => {
	const { id } = ctx.request.body
	const productDetail = await Product.getDetail(id)
  ctx.body = productDetail
})

//更新商品
router.post('/edit', loginCheck, async ctx => {
	const body = ctx.request.body
	const data = await Product.editGood(body)
	if(data){
		throw new global.error.Success('修改成功')
	}
})

//删除商品
router.post('/delete', loginCheck, async ctx => {
	const { id } = ctx.request.body
	const data = await Product.delGood(id)
	if(data){
		throw new global.error.Success('删除成功')
	}
})

//新增商品
router.post('/add', loginCheck, async ctx => {
	const body = ctx.request.body
  const data = await Product.addGood(body)
  if(data){
  	throw new global.error.Success('添加成功')
  }
})

//商品搜索
router.post('/search', loginCheck, async ctx => {
	const { name } = ctx.request.body
	const product = await Product.searchGood(name)
  ctx.body = product
})

module.exports = router