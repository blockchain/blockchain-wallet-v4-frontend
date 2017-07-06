
const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)

const isNumeric = (value) => (value - 0) === value && ('' + value).trim().length > 0

const isEmail = (value) => emailRegex.exec(value)

const passwordStrongness = (value) => value.length

export {
  isNumeric,
  isEmail,
  passwordStrongness
}
