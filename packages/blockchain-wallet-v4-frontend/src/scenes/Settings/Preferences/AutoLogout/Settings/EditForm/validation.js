import React from 'react'
import { InvalidMessage, MaximumMessage, MinimumMessage } from './validationMessages'

export const isValidAutoLogoutTime = value => {
  if (!Number.isInteger(Number(value))) return <InvalidMessage />
  if (value < 1) return <MinimumMessage />
  if (value > 1440) return <MaximumMessage />
  return undefined
}
