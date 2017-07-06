import { isNil } from 'ramda'

const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)

const isNumeric = value => (value - 0) === value && ('' + value).trim().length > 0

const isValidEmail = value => emailRegex.test(value)

const passwordStrongness = value => value.length

const required = value => isNil(value) ? undefined : 'Required'

const validPassword = value => passwordStrongness(value) > 5 ? undefined : 'Not strong enough'

const validEmail = value => isValidEmail(value) ? undefined : 'Invalid'

export {
  isNumeric,
  isValidEmail,
  passwordStrongness,
  required,
  validPassword,
  validEmail
}
