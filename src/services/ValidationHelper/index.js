const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)

const guidRegex = new RegExp(/(^([0-9A-Fa-f]{8}[-][0-9A-Fa-f]{4}[-][0-9A-Fa-f]{4}[-][0-9A-Fa-f]{4}[-][0-9A-Fa-f]{12})$)/)

const isNumeric = value => (value - 0) === value && ('' + value).trim().length > 0

const isEmail = value => emailRegex.test(value)

const isGuid = value => guidRegex.test(value)

const passwordStrongness = value => value.length

export {
  isNumeric,
  isEmail,
  isGuid,
  passwordStrongness
}
