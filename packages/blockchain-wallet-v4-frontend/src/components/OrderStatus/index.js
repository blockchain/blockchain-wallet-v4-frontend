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
      return 'transferred'
    case 'error':
    case 'failed':
    case 'resolved':
    case REFUNDED:
    case PENDING_REFUND:
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
    case PENDING_WITHDRAWAL:
    case FINISHED_DEPOSIT:
    case PENDING_DEPOSIT:
      return (
        <FormattedMessage
          id='scenes.exchangehistory.list.orderstatus.awaitingfunds'
          defaultMessage='Awaiting Funds'
        />
      )
    case 'no_deposits':
    case 'received':
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
