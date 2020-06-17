// require('dotenv').config()
const crypto = require('crypto')

const key = process.env.SECRET
const algo = process.env.ALGO
const IV_LENGTH = 16

exports.encrypt = str => {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(algo, Buffer.from(key), iv)
  let encrypted = cipher.update(str)

  encrypted = Buffer.concat([encrypted, cipher.final()])

  return iv.toString('hex') + ':' + encrypted.toString('hex')
  // const input = str.toString()
  // const cipher = crypto.createCipher(algo, key)
  // let crypted = cipher.update(input, 'utf8', 'hex')
  // crypted += cipher.final('hex')
  // return crypted
}

exports.decrypt = text => {
  try {
    const textParts = text.split(':')
    const iv = Buffer.from(textParts.shift(), 'hex')
    const encryptedText = Buffer.from(textParts.join(':'), 'hex')
    const decipher = crypto.createDecipheriv(algo, Buffer.from(key), iv)
    let decrypted = decipher.update(encryptedText)

    decrypted = Buffer.concat([decrypted, decipher.final()])

    return decrypted.toString()
  } catch (e) {
    console.error(e)
    return false
  }
  // const input = str.toString()
  // const decipher = crypto.createDecipher(algo, key)
  // try {
  //   let decrypted = decipher.update(input, 'hex', 'utf8')
  //   decrypted += decipher.final('utf8')
  //   return decrypted
  // } catch {
  //   return false
  // }
}
