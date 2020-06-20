//全局异常处理
const { HttpError } = require('../assist/http-error')

const catchError = async (ctx,next)=>{
	try {
		await next()
	}catch (error) {
		//开发时发生错误
		const isDevError = global.config.environment === 'dev'
		const isHttpError = error instanceof HttpError
		if (isDevError && !isHttpError) {
			throw error
		}
		//已知错误
		if (isHttpError) {
			ctx.body = {
				msg: error.msg,
				error_code: error.errorCode
			}
			ctx.status = error.code
		}else {
		//未知错误
			ctx.body = {
        msg: '出错啦！',
        error_code: 999
      }
      ctx.status = 500
		}
	}
}

module.exports = catchError