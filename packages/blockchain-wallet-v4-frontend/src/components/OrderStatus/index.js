import React from 'react'
import { FormattedMessage } from 'react-intl'

import { model } from 'data'

const {
  PENDING_EXECUTION,
  FAILED,
  PENDING_DEPOSIT,
  EXPIRED,
  FINISHED_DEPOSIT,
  PENDING_WITHDRAWAL,
  PENDING_REFUND,
  REFUNDED,
  FINISHED
} = model.components.exchangeHistory.STATES

export const selectColor = status => {
  switch (status) {
    case 'complete':
    case FINISHED:
      return 'success'
    case 'no_deposits':
    case 'received':
    case PENDING_DEPOSIT:
    case PENDING_EXECUTION:
    case PENDING_WITHDRAWAL:
    case FINISHED_DEPOSIT:
    case REFUNDED:
    case PENDING_REFUND:
      return 'transferred'
    case 'error':
    case 'failed':
    case 'resolved':
    case FAILED:
    case EXPIRED:
      return 'error'
  }
}

export const OrderStatus = ({ status }) => {
  switch (status) {
    case 'complete':
    case FINISHED:
      return (
        <FormattedMessage
          id='scenes.exchangehistory.list.orderstatus.complete'
          defaultMessage='Complete'
        />
      )
    case 'failed':
    case FAILED:
      return (
        <FormattedMessage
          id='scenes.exchangehistory.list.orderstatus.failed'
          defaultMessage='Failed'
        />
      )
    case 'error':
      return (
        <FormattedMessage
          id='scenes.exchangehistory.list.orderstatus.error'
          defaultMessage='Error'
        />
      )
    case 'no_deposits':
    case 'received':
    case PENDING_WITHDRAWAL:
    case FINISHED_DEPOSIT:
    case PENDING_DEPOSIT:
    case PENDING_EXECUTION:
      return (
        <FormattedMessage
          id='scenes.exchangehistory.list.orderstatus.pending'
          defaultMessage='In Progress'
        />
      )
    case PENDING_REFUND:
      return (
        <FormattedMessage
          id='scenes.exchangehistory.list.orderstatus.refunding'
          defaultMessage='Refund In Progress'
        />
      )
    case 'resolved':
    case REFUNDED:
      return (
        <FormattedMessage
          id='scenes.exchangehistory.list.orderstatus.refunded'
          defaultMessage='Refunded'
        />
      )
    case EXPIRED:
      return (
        <FormattedMessage
          id='scenes.exchangehistory.list.orderstatus.expired'
          defaultMessage='Expired'
        />
      )
    default:
      return (
        <FormattedMessage
          id='scenes.exchangehistory.list.orderstatus.unknown'
          defaultMessage='Unknown'
        />
      )
  }
}

export const OrderNote = ({ status }) => {
  switch (status) {
    case 'complete':
    case FINISHED:
      return ''
    case 'failed':
    case FAILED:
      return (
        <FormattedMessage
          id='components.orderstatus.note.swapfailed'
          defaultMessage='This trade has failed. If any funds have been broadcast from your wallet, they will be returned automatically minus the network fee. Please return to the swap tab to start a new trade.'
        />
      )
    case 'no_deposits':
    case 'received':
    case PENDING_WITHDRAWAL:
    case FINISHED_DEPOSIT:
    case PENDING_DEPOSIT:
    case PENDING_EXECUTION:
      return (
        <FormattedMessage
          id='components.orderstatus.note.swappending'
          defaultMessage='Thanks for placing your trade! Funds will usually reach your wallet within 2 hours and we’ll send you a notification when that happens. Keep track of your trade’s progress in the Order History tab.'
        />
      )
    case PENDING_REFUND:
      return (
        <FormattedMessage
          id='components.orderstatus.note.swaprefunding'
          defaultMessage='We are now processing a refund for any funds broadcast minus the network fee. Please check your Order History to check the refund status.'
        />
      )
    case 'resolved':
    case REFUNDED:
      return (
        <FormattedMessage
          id='components.orderstatus.note.swaprefunded'
          defaultMessage='We have refunded your wallet after the trade failed.  Please return to the swap tab to start a new trade.'
        />
      )
    case EXPIRED:
      return (
        <FormattedMessage
          id='components.orderstatus.note.swapexpired_exchange'
          defaultMessage='This swap has expired as we have still not received your funds. If we receive your funds we will complete your trade. If you require further assistance please contact support.'
        />
      )
    default:
      return ''
  }
}
