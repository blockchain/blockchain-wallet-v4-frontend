import React from 'react'
import { FormattedMessage } from 'react-intl'

export const InvalidMessage = () => <FormattedMessage id='settings.preferences.autologout.settings.invalid' defaultMessage='Please set a valid time' />

export const MinimumMessage = () => <FormattedMessage id='settings.preferences.autologout.settings.invalid2' defaultMessage='Please set a duration greater than 1 minute.' />

export const MaximumMessage = () => <FormattedMessage id='settings.preferences.autologout.settings.invalid3' defaultMessage='Please set a duration less than 1440 minutes' />
