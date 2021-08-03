import React, { Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import { prop } from 'ramda'

import { Link, Text } from 'blockchain-info-components'
import * as C from 'services/alerts'

export const selectTitle = title => {
  switch (title) {
    case C.BITPAY_CONFIRM_TITLE:
      return (
        <FormattedMessage
          id='modals.confirm.title/bitpay'
          defaultMessage="You've Entered a BitPay URL"
        />
      )
    case C.VERIFY_IDENTITY_TITLE:
      return (
        <FormattedMessage
          id='modals.confirm.title.verify_identity'
          defaultMessage='Verify Your Identity'
        />
      )
    case C.PHONE_CALL_TITLE:
      return (
        <FormattedMessage
          id='modals.confirm.title.phone_call'
          defaultMessage='Trade In Progress'
        />
      )
    case C.ARCHIVE_VULNERABLE_ADDRESS_TITLE:
      return (
        <FormattedMessage
          id='modals.confirm.title.archive_address'
          defaultMessage='Archive Vulnerable Address'
        />
      )
    default:
      return (
        <FormattedMessage id='modals.confirm.title' defaultMessage='Confirm' />
      )
  }
}

export const selectMessage = (message, values) => {
  switch (message) {
    case C.BITPAY_CONFIRM_MSG:
      return (
        <FormattedMessage
          id='modals.confirm.message.bitpay'
          defaultMessage='Click OK to autopopulate your BitPay invoice payment information.'
        />
      )
    case C.VERIFY_IDENTITY_MSG:
      return (
        <FormattedMessage
          id='modals.confirm.message.verify_identity'
          defaultMessage='Verifying your identity will raise your buy and sell limits, allowing you to trade higher amounts. It will also speed up waiting times for trades. It only takes a few minutes to go through the process.'
        />
      )
    case C.PHONE_CALL_MSG:
      return (
        <Fragment>
          <Text size='18px'>
            <FormattedMessage
              id='modals.confirm.message.phone_call'
              defaultMessage='Would you like to speed up the process?'
            />
          </Text>
          <Text size='14px' weight={400}>
            <br />
            <FormattedMessage
              id='modals.confirm.message.phone_call_1'
              defaultMessage='You can receive your funds in only 3 business days by a quick and painless phone call to verify your identity.'
            />
            <br />
            <br />
            <FormattedMessage
              id='modals.confirm.message.phone_call_2'
              defaultMessage='If this sounds good to you, you will receive a call within the next 24 hours to <b>{smsNumber}</b>.'
              values={values}
            />
          </Text>
        </Fragment>
      )
    case C.ARCHIVE_VULNERABLE_ADDRESS_MSG:
      return (
        <FormattedMessage
          id='modals.confirm.title.archive_address_msg'
          defaultMessage='A security issue effects address {addr}. Please Archive it, and if you continue to have issues contact {support}.'
          values={{
            addr: prop('vulnerableAddress', values),
            support: (
              <Link
                size='16px'
                weight={500}
                target='_blank'
                href='https://support.blockchain.com'
              >
                support
              </Link>
            )
          }}
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
    case C.CANCEL_PHONE_CALL:
      return (
        <FormattedMessage
          id='modals.confirm.cancel.phone_call'
          defaultMessage='No, Thanks'
        />
      )
    default:
      return <FormattedMessage id='buttons.cancel' defaultMessage='Cancel' />
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
    case C.ARCHIVE_VULNERABLE_ADDRESS_CONFIRM:
      return (
        <FormattedMessage
          id='modals.confirm.title.archive_address_confirm'
          defaultMessage='Archive Address'
        />
      )
    case C.CONFIRM_PHONE_CALL:
      return (
        <FormattedMessage
          id='modals.confirm.confirm.phone_call'
          defaultMessage='Give Me A Call'
        />
      )
    default:
      return <FormattedMessage id='modals.confirm.button' defaultMessage='OK' />
  }
}
