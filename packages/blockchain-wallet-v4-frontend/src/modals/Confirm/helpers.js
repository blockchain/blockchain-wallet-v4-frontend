import React from 'react'
import { FormattedMessage } from 'react-intl'
import * as C from 'services/ConfirmService'

export const selectTitle = title => {
  switch (title) {
    case C.VERIFY_IDENTITY_TITLE:
      return (
        <FormattedMessage
          id='modals.confirm.title.verify_identity'
          defaultMessage='Verify Your Identity'
        />
      )
    default:
      return (
        <FormattedMessage id='modals.confirm.title' defaultMessage='Confirm' />
      )
  }
}

export const selectMessage = message => {
  switch (message) {
    case C.VERIFY_IDENTITY_MSG:
      return (
        <FormattedMessage
          id='modals.confirm.message.verify_identity'
          defaultMessage='Verifying your identity will raise your buy and sell limits, allowing you to trade higher amounts. It will also speed up waiting times for trades. It only takes a few minutes to go through the process.'
        />
      )
    default:
      return (
        <FormattedMessage
          id='modals.confirm.message'
          defaultMessage='Please confirm.'
        />
      )
  }
}

export const selectCancel = message => {
  switch (message) {
    case C.CANCEL_VERIFY_IDENTITY:
      return (
        <FormattedMessage
          id='modals.confirm.cancel.verify_identity'
          defaultMessage="I'll Do This Later"
        />
      )
    default:
      return (
        <FormattedMessage
          id='modals.confirm.button.cancel'
          defaultMessage='Cancel'
        />
      )
  }
}

export const selectConfirm = message => {
  switch (message) {
    case C.CONFIRM_VERIFY_IDENTITY:
      return (
        <FormattedMessage
          id='modals.confirm.confirm.verify_identity'
          defaultMessage='Verify My Identity'
        />
      )
    default:
      return <FormattedMessage id='modals.confirm.button' defaultMessage='OK' />
  }
}
