import { view, is, pipe } from 'ramda'
import Type from './Type'

export class Options extends Type {}

export const isOptions = is(Options)

export const pbkdf2Iterations = Options.define('pbkdf2_iterations')
export const feePerKb = Options.define('fee_per_kb')
export const html5Notifications = Options.define('html5_notifications')
export const logoutTime = Options.define('logout_time')

export const selectPbkdf2Iterations = view(pbkdf2Iterations)
export const selectFeePerKb = view(feePerKb)
export const selectHtml5Notifications = view(html5Notifications)
export const selectLogoutTime = view(logoutTime)

export const toJS = pipe(Options.guard, (txnotes) => {
  return txnotes.toObject()
})

export const fromJS = (object) => {
  if (isOptions(object)) {
    return object
  } else {
    return new Options(object)
  }
}

export const reviver = (object) => {
  return new Options(object)
}
