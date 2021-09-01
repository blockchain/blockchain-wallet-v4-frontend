import { SendFormType } from '../types'

export const INVALID_ADDR = 'INVALID_ADDR'

export const isValidAddress = (value?: string) => {
  if (!value) return { to: true }

  return !value.match(/[a-zA-Z0-9]{15,}/) ? { to: INVALID_ADDR } : { to: true }
}

export const validate = (formValues: SendFormType) => {
  return isValidAddress(formValues.to)
}
