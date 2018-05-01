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

export const bodyStatusHelper = status => {
  switch (status) {
    case 'processing': return { text: <FormattedMessage id='scenes.buysellorderhistory.list.orderstatusbody.processing' defaultMessage='Your buy trade has been initiated. You will receive your bitcoin in 3-5 business days.' /> }
    case 'completed': return { text: <FormattedMessage id='scenes.buysellorderhistory.list.orderstatusbody.completed' defaultMessage='Your buy trade is complete!' /> }
    case 'rejected': return { text: <FormattedMessage id='scenes.buysellorderhistory.list.orderstatusbody.rejected' defaultMessage='Your buy trade has been rejected. Please contact support.' /> }
    case 'failed': return { text: <FormattedMessage id='scenes.buysellorderhistory.list.orderstatusbody.failed' defaultMessage='Your buy trade failed. Please contact support.' /> }
    default: return { text: <FormattedMessage id='scenes.buysellorderhistory.list.orderstatusbody.unknown' defaultMessage='There are issues with this trade. Please contact support.' /> }
  }
}
