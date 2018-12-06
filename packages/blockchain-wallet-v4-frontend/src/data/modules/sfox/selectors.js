import { path, compose, prop } from 'ramda'

export const getSfoxData = path(['sfoxSignup'])
export const getSfoxBusy = compose(
  prop('sfoxBusy'),
  getSfoxData
)
