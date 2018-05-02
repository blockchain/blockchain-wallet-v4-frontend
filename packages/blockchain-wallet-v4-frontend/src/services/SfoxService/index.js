import React from 'react'
import { FormattedMessage } from 'react-intl'

export const isVerified = (verificationStatus) => {
  const { level } = verificationStatus
  return level === 'verified' || (level === 'pending' && verificationStatus.required_docs.length === 0)
}

const isActiveAccount = (accounts) => {
  return accounts[0] && accounts[0].status === 'active'
}

export const determineStep = (profile, verificationStatus, accounts) => {
  if (!profile) {
    return 'account'
  } else {
    if (verificationStatus.level === 'unverified') return 'verify'
    if (verificationStatus.level === 'needs_documents') return 'upload'
    else if (!accounts.length) return 'funding'
    else return 'verified'
  }
}

export const determineReason = (type, profile, verificationStatus, accounts) => {
  let reason
  if (!profile) reason = 'needs_account'
  else if (verificationStatus.level === 'unverified') reason = 'needs_id'
  else if (!accounts.length) reason = 'needs_bank'
  else if (!isActiveAccount(accounts)) reason = 'needs_bank_active'
  else if (type === 'buy') reason = 'has_remaining_buy_limit'
  else if (type === 'sell') reason = 'has_remaining_sell_limit'
  else reason = 'unknown'

  return reason
}

export const statusHelper = status => {
  switch (status) {
    case 'processing': return { color: 'transferred', text: <FormattedMessage id='scenes.buysellorderhistory.list.orderstatus.processing' defaultMessage='Processing' /> }
    case 'completed': return { color: 'success', text: <FormattedMessage id='scenes.buysellorderhistory.list.orderstatus.completed' defaultMessage='Completed' /> }
    case 'rejected': return { color: 'error', text: <FormattedMessage id='scenes.buysellorderhistory.list.orderstatus.rejected' defaultMessage='Rejected' /> }
    case 'failed': return { color: 'error', text: <FormattedMessage id='scenes.buysellorderhistory.list.orderstatus.failed' defaultMessage='Failed' /> }
    default: return { color: '', text: <FormattedMessage id='scenes.buysellorderhistory.list.orderstatus.unknown' defaultMessage='Unknown' /> }
  }
}

export const bodyStatusHelper = (status, isBuy) => {
  if (isBuy) {
    switch (status) {
      case 'processing': return { text: <FormattedMessage id='scenes.buysellorderhistory.list.orderstatusbody.buy.processing' defaultMessage='Your buy trade has been initiated. You will receive your bitcoin in 3-5 business days.' /> }
      case 'completed': return { text: <FormattedMessage id='scenes.buysellorderhistory.list.orderstatusbody.buy.completed' defaultMessage='Your buy trade is complete!' /> }
      case 'rejected': return { text: <FormattedMessage id='scenes.buysellorderhistory.list.orderstatusbody.buy.rejected' defaultMessage='Your buy trade has been rejected. Please contact support.' /> }
      case 'failed': return { text: <FormattedMessage id='scenes.buysellorderhistory.list.orderstatusbody.buy.failed' defaultMessage='Your buy trade failed. Please contact support.' /> }
    }
  } else {
    switch (status) {
      case 'processing': return { text: <FormattedMessage id='scenes.buysellorderhistory.list.orderstatusbody.sell.processing' defaultMessage='Your sell trade has been initiated. You will receive your funds in 3-5 business days.' /> }
      case 'completed': return { text: <FormattedMessage id='scenes.buysellorderhistory.list.orderstatusbody.sell.completed' defaultMessage='Your sell trade is complete!' /> }
      case 'rejected': return { text: <FormattedMessage id='scenes.buysellorderhistory.list.orderstatusbody.sell.rejected' defaultMessage='Your sell trade has been rejected. Please contact support.' /> }
      case 'failed': return { text: <FormattedMessage id='scenes.buysellorderhistory.list.orderstatusbody.sell.failed' defaultMessage='Your sell trade failed. Please contact support.' /> }
    }
  }
  return { text: <FormattedMessage id='scenes.buysellorderhistory.list.orderstatusbody.unknown' defaultMessage='There are issues with this trade. Please contact support.' /> }
}

export const reviewOrder = {
  baseBtc: (q) => q.baseCurrency === 'BTC',
  renderFirstRow (q, type) {
    if (type === 'buy') {
      if (this.baseBtc(q)) return `${q.baseAmount / 1e8} BTC ($${(+q.quoteAmount - +q.feeAmount).toFixed(2)})`
      else return `${q.quoteAmount / 1e8} BTC ($${(+q.baseAmount - +q.feeAmount).toFixed(2)})`
    } else {
      if (this.baseBtc(q)) return `${q.baseAmount / 1e8} BTC ($${(+q.quoteAmount).toFixed(2)})`
      else return `${q.quoteAmount / 1e8} BTC ($${(+q.baseAmount).toFixed(2)})`
    }
  },
  renderTotal (q, type) {
    if (type === 'buy') {
      if (this.baseBtc(q)) return `$${q.quoteAmount}`
      else return `$${q.baseAmount}`
    } else {
      if (this.baseBtc(q)) return `$${(+q.quoteAmount - +q.feeAmount).toFixed(2)}`
      else return `$${(+q.baseAmount - +q.feeAmount).toFixed(2)}`
    }
  }
}
