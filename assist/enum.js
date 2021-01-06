function isThisType(val){
  for(let key in this){
    if(this[key] === val){
      return true
    }
  }
  return false
}

const LoginType = {
  USER: 100,
  USER_TEL: 150,
  ADMIN: 200,
  isThisType
}

module.exports = LoginType