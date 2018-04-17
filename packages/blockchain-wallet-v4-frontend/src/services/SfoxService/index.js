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
    // if (!isVerified(verificationStatus)) {
    //   return 'verify'
    // } else if (!accounts.length || !isActiveAccount(accounts)) {
    //   return 'funding'
    // } else {
    //   return 'verified'
    // }
  }
}

export const determineReason = (type, profile, verificationStatus, accounts) => {
  let reason
  if (!profile) reason = 'needs_account'
  // else if (!isVerified(verificationStatus)) reason = 'needs_id'
  else if (verificationStatus.level === 'unverified') reason = 'needs_id'
  else if (!accounts.length) reason = 'needs_bank'
  else if (!isActiveAccount(accounts)) reason = 'needs_bank_active'
  else if (type === 'buy') reason = 'has_remaining_buy_limit'
  else if (type === 'sell') reason = 'has_remaining_sell_limit'
  else reason = 'unknown'

  return reason
}

export const statusHelper = status => {
  console.log('status helper', status)
  switch (status) {
    case 'processing': return { color: 'marketing-secondary', text: <FormattedMessage id='scenes.buysellorderhistory.list.orderstatus.processing' defaultMessage='Processing' /> }
    case 'completed': return { color: 'success', text: <FormattedMessage id='scenes.buysellorderhistory.list.orderstatus.completed' defaultMessage='Completed' /> }
    case 'rejected': return { color: 'error', text: <FormattedMessage id='scenes.buysellorderhistory.list.orderstatus.rejected' defaultMessage='Rejected' /> }
    case 'failed': return { color: 'error', text: <FormattedMessage id='scenes.buysellorderhistory.list.orderstatus.failed' defaultMessage='Failed' /> }
    default: return <FormattedMessage id='scenes.buysellorderhistory.list.orderstatus.unknown' defaultMessage='Unknown' />
  }
}
