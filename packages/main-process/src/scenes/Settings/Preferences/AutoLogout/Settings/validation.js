import React from 'react'
import { FormattedMessage } from 'react-intl'

const InvalidMessage = () => (
  <FormattedMessage
    id='settings.preferences.autologout.settings.invalid'
    defaultMessage='Please set a valid time'
  />
)

const MinimumMessage = () => (
  <FormattedMessage
    id='settings.preferences.autologout.settings.invalid2'
    defaultMessage='Please set a duration greater than 1 minute.'
  />
)

const MaximumMessage = () => (
  <FormattedMessage
    id='settings.preferences.autologout.settings.invalid3'
    defaultMessage='Please set a duration less than 1440 minutes'
  />
)

export const isValidAutoLogoutTime = value => {
  if (!Number.isInteger(Number(value))) return <InvalidMessage />
  if (value < 1) return <MinimumMessage />
  if (value > 1440) return <MaximumMessage />
  return undefined
}
