//输出错误信息的工具
class HttpError extends Error{
	constructor(msg='服务器异常', errorCode=10000, code=400){
		super()
		this.msg = msg
		this.errorCode = errorCode
		this.code = code
	}
}

class Success extends HttpError{
  constructor(msg, errorCode){
    super()
    this.msg = msg || '成功'
    this.errorCode = errorCode || 0
    this.code = 200
  }
}

class AuthFailed  extends HttpError {
  constructor(msg, errorCode) {
    super()
    this.msg = msg || '授权失败'
    this.errorCode = errorCode || 10004
    this.code = 401
  }
}

class Forbidden extends HttpError{
  constructor(msg, errorCode) {
    super()
    this.msg = msg || '禁止访问'
    this.errorCode = errorCode || 10006
    this.code = 403
  }
}

class NotFound extends HttpError{
  constructor(msg, errorCode) {
    super()
    this.msg = msg || '资源未找到'
    this.errorCode = errorCode || 10
    this.code = 404
  }
}

module.exports = {
  HttpError,
  Success,
  AuthFailed,
  Forbidden,
  NotFound
}