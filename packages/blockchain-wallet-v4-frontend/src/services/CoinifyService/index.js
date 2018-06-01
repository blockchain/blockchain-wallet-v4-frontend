import React from 'react'
import { gt, slice, toUpper, equals, path } from 'ramda'
import { FormattedMessage } from 'react-intl'

export const getLimits = (limits, curr, effectiveBalance) => {
  const getMin = (limits, curr) => Math.min(limits.bank.minimumInAmounts[curr], limits.card.minimumInAmounts[curr])
  const getMax = (limits, curr) => Math.max(limits.bank.inRemaining[curr], limits.card.inRemaining[curr])
  const getSellMin = (limits, curr) => limits.blockchain.minimumInAmounts[curr]
  const getSellMax = (limits, curr) => limits.blockchain.inRemaining[curr]
  return {
    buy: {
      min: getMin(limits, curr),
      max: getMax(limits, curr)
    },
    sell: {
      min: getSellMin(limits, 'BTC'),
      max: getSellMax(limits, 'BTC'),
      effectiveMax: effectiveBalance
    }
  }
}

export const getLimitsError = (amt, userLimits, curr, type) => {
  const limits = getLimits(userLimits, curr)

  if (type === 'buy') {
    if (limits.buy.max < limits.buy.min) return 'max_below_min'
    if (amt > limits.buy.max) return 'over_max'
    if (amt < limits.buy.min) return 'under_min'
  }
  if (type === 'sell') {
    if (limits.sell.max < limits.sell.min) return 'max_below_min'
    if (amt > limits.sell.max) return 'over_max'
    if (amt < limits.sell.min) return 'under_min'
  }

  return false
}

export const isOverEffectiveMax = (amount, effectiveBalance) =>
  gt(amount, effectiveBalance)

export const currencySymbolMap = {
  GBP: '£',
  USD: '$',
  EUR: '€',
  DKK: 'kr. ',
  BTC: 'BTC '
}

export const mockedLimits = {
  bank: {
    inRemaining: { EUR: 0, USD: 0, GBP: 0, DKK: 0 },
    minimumInAmounts: { EUR: 0, USD: 0, GBP: 0, DKK: 0 }
  },
  card: {
    inRemaining: { EUR: 0, USD: 0, GBP: 0, DKK: 0 },
    minimumInAmounts: { EUR: 0, USD: 0, GBP: 0, DKK: 0 }
  },
  blockchain: {
    inRemaining: { BTC: 0 },
    minimumInAmounts: { BTC: 0 }
  }
}

export const reviewOrder = {
  baseBtc: (q) => q.baseCurrency === 'BTC',
  renderFirstRow: (q, medium) => {
    const qAmt = Math.abs(q.quoteAmount)
    const bAmt = Math.abs(q.baseAmount)
    if (reviewOrder.baseBtc(q)) return `${bAmt / 1e8} BTC (${currencySymbolMap[q.quoteCurrency]}${qAmt.toFixed(2)})`
    else return `${qAmt / 1e8} BTC (${currencySymbolMap[q.baseCurrency]}${bAmt.toFixed(2)})`
  },
  renderFeeRow: (q, medium, type) => {
    const med = type === 'sell' ? 'bank' : medium
    const fee = path(['paymentMediums', med], q) && Math.abs(q.paymentMediums[med]['fee'])
    if (!fee) return `~`
    if (reviewOrder.baseBtc(q)) return `${currencySymbolMap[q.quoteCurrency]}${fee.toFixed(2)}`
    else return `${currencySymbolMap[q.baseCurrency]}${fee.toFixed(2)}`
  },
  renderTotalRow: (q, medium, type) => {
    const med = type === 'sell' ? 'bank' : medium
    const qAmt = Math.abs(q.quoteAmount)
    const fee = path(['paymentMediums', med], q) && Math.abs(q.paymentMediums[med]['fee'])
    const totalBase = path(['paymentMediums', med], q) && Math.abs((q.paymentMediums[med]['total']).toFixed(2))
    if (!fee) return `~`
    if (reviewOrder.baseBtc(q)) return `${currencySymbolMap[q.quoteCurrency]}${(qAmt + fee).toFixed(2)}`
    else return `${currencySymbolMap[q.baseCurrency]}${totalBase}`
  }
}

export const tradeDetails = {
  renderDetails: (trade) => {
    const fiat = trade.inCurrency !== 'BTC' ? trade.inCurrency : trade.outCurrency
    const symbol = currencySymbolMap[fiat]
    if (trade.isBuy) {
      return {
        firstRow: `${trade.receiveAmount} BTC (${symbol}${(trade.inAmount / 100).toFixed(2)})`,
        fee: `${symbol}${((trade.sendAmount / 100) - (trade.inAmount / 100)).toFixed(2)}`,
        total: `${symbol}${(trade.sendAmount / 100).toFixed(2)}`
      }
    } else {
      return {
        firstRow: `${trade.sendAmount / 1e8} BTC (${symbol}${(trade.outAmountExpected / 100).toFixed(2)})`,
        fee: `${symbol}${((trade.outAmountExpected / 100) - trade.receiveAmount).toFixed(2)}`,
        total: `${symbol}${(trade.receiveAmount).toFixed(2)}`
      }
    }
  }
}

export const getCountryCodeFromIban = (iban) => toUpper(slice(0, 2, iban))

export const canCancelTrade = (trade) => {
  const { state } = trade
  if (equals(state, 'awaiting_transfer_in')) return true
  return false
}

export const checkoutButtonLimitsHelper = (quoteR, limits, type) => {
  return quoteR.map(q => {
    if (type === 'sell') {
      if (q.baseCurrency !== 'BTC') return Math.abs(q.quoteAmount / 1e8) > limits.max || Math.abs(q.quoteAmount / 1e8) < limits.min || Math.abs(q.quoteAmount) > limits.effectiveMax
      if (q.baseCurrency !== 'BTC') return Math.abs(q.baseAmount / 1e8) > limits.max || Math.abs(q.baseAmount / 1e8) < limits.min || Math.abs(q.baseAmount) > limits.effectiveMax
    } else {
      if (q.baseCurrency !== 'BTC') return Math.abs(q.baseAmount) > limits.max || Math.abs(q.baseAmount) < limits.min || Math.abs(q.quoteAmount) > limits.effectiveMax
      if (q.baseCurrency === 'BTC') return Math.abs(q.quoteAmount) > limits.max || Math.abs(q.quoteAmount) < limits.min || Math.abs(q.baseAmount) > limits.effectiveMax
    }
  }).data
}

export const statusHelper = status => {
  switch (status) {
    case 'awaiting_transfer_in':
    case 'processing': return { color: 'transferred', text: <FormattedMessage id='scenes.services.coinifyservice.buysellorderhistory.list.orderstatus.processing' defaultMessage='Pending' /> }

    case 'completed': return { color: 'success', text: <FormattedMessage id='scenes.services.coinifyservice.buysellorderhistory.list.orderstatus.completed' defaultMessage='Completed' /> }
    case 'rejected': return { color: 'error', text: <FormattedMessage id='scenes.services.coinifyservice.buysellorderhistory.list.orderstatus.rejected' defaultMessage='Rejected' /> }
    case 'failed': return { color: 'error', text: <FormattedMessage id='scenes.services.coinifyservice.buysellorderhistory.list.orderstatus.failed' defaultMessage='Failed' /> }
    case 'cancelled': return { color: 'error', text: <FormattedMessage id='scenes.services.coinifyservice.buysellorderhistory.list.orderstatus.cancelled' defaultMessage='Cancelled' /> }
    case 'expired': return { color: 'error', text: <FormattedMessage id='scenes.services.coinifyservice.buysellorderhistory.list.orderstatus.expired' defaultMessage='Expired' /> }
    default: return { color: '', text: <FormattedMessage id='scenes.services.coinifyservice.buysellorderhistory.list.orderstatus.unknown' defaultMessage='Unknown' /> }
  }
}

export const bodyStatusHelper = (status, isBuy) => {
  if (isBuy) {
    switch (status) {
      case 'awaiting_transfer_in':
      case 'processing': return { text: <FormattedMessage id='scenes.services.coinifyservice.buysellorderhistory.list.orderstatusbody.buy.processing' defaultMessage='Your purchase is currently being processed. Our exchange partner will send a status update your way within 1 business day.' /> }

      case 'completed': return { text: <FormattedMessage id='scenes.services.coinifyservice.buysellorderhistory.list.orderstatusbody.buy.completed' defaultMessage='Your buy trade is complete!' /> }
      case 'rejected': return { text: <FormattedMessage id='scenes.services.coinifyservice.buysellorderhistory.list.orderstatusbody.buy.rejected' defaultMessage='Your buy trade has been rejected. Please contact support.' /> }
      case 'failed': return { text: <FormattedMessage id='scenes.services.coinifyservice.buysellorderhistory.list.orderstatusbody.buy.failed' defaultMessage='Your buy trade failed. Please contact support.' /> }
      case 'cancelled': return { text: <FormattedMessage id='scenes.services.coinifyservice.buysellorderhistory.list.orderstatusbody.buy.cancelled' defaultMessage='Your buy trade was cancelled.' /> }
      case 'expired': return { text: <FormattedMessage id='scenes.services.coinifyservice.buysellorderhistory.list.orderstatusbody.buy.expired' defaultMessage='Your buy trade has expired.' /> }
    }
  } else {
    switch (status) {
      case 'processing': return { text: <FormattedMessage id='scenes.services.coinifyservice.buysellorderhistory.list.orderstatusbody.sell.processing' defaultMessage='Your sell trade has been initiated. You will receive your funds in 3-5 business days.' /> }
      case 'completed': return { text: <FormattedMessage id='scenes.services.coinifyservice.buysellorderhistory.list.orderstatusbody.sell.completed' defaultMessage='Your sell trade is complete!' /> }
      case 'rejected': return { text: <FormattedMessage id='scenes.services.coinifyservice.buysellorderhistory.list.orderstatusbody.sell.rejected' defaultMessage='Your sell trade has been rejected. Please contact support.' /> }
      case 'failed': return { text: <FormattedMessage id='scenes.services.coinifyservice.buysellorderhistory.list.orderstatusbody.sell.failed' defaultMessage='Your sell trade failed. Please contact support.' /> }
      case 'expired': return { text: <FormattedMessage id='scenes.services.coinifyservice.buysellorderhistory.list.orderstatusbody.sell.expired' defaultMessage='Your sell trade has expired.' /> }
    }
  }
  return { text: <FormattedMessage id='scenes.services.coinifyservice.buysellorderhistory.list.orderstatusbody.unknown' defaultMessage='There are issues with this trade. Please contact support.' /> }
}

export const kycBodyHelper = (status) => {
  switch (status) {
    case 'reviewing':
    case 'processing': return { text: <FormattedMessage id='scenes.coinify.details.kyc.reviewing' defaultMessage='Your request for authentication has been submitted and will be reviewed shortly. Coinify will email you a status updated within 48 business hours. If you have any questions about the status of your submission, feel free to reach out to Coinify directly at www.coinify.com/support' /> }
    case 'pending': return { text: <FormattedMessage id='scenes.coinify.detailsmodal.kyc.processing' defaultMessage='Your identity verification is processing.' /> }
    case 'completed': return { text: <FormattedMessage id='scenes.coinify.detailsmodal.kyc.completed' defaultMessage='Your identity verification is complete! Your limits have been raised.' /> }
    case 'rejected': return { text: <FormattedMessage id='scenes.coinify.detailsmodal.kyc.rejected' defaultMessage='There was an issue verifying your identity with the documents provided. Please try uploading different identification. Bank transfers are unavailable until we can successfully verify your identity.' /> }
    case 'failed': return { text: <FormattedMessage id='scenes.coinify.detailsmodal.kyc.failed' defaultMessage='Your identity verification has failed. Please contact support.' /> }
    case 'cancelled': return { text: <FormattedMessage id='scenes.coinify.detailsmodal.kyc.cancelled' defaultMessage='Your identity verification was cancelled. Please try again.' /> }
    default: return { color: '', text: <FormattedMessage id='scenes.coinify.detailsmodal.kyc.unknown' defaultMessage='Status is unknown' /> }
  }
}

export const kycHeaderHelper = (status) => {
  switch (status) {
    case 'reviewing':
    case 'pending': return { color: 'transferred', text: <FormattedMessage id='scenes.coinify_details_modal.kyc.header.pending' defaultMessage='Identity Verification In Review' /> }
    case 'completed': return { color: 'success', text: <FormattedMessage id='scenes.coinify_details_modal.kyc.header.completed' defaultMessage='Identity Verification Completed' /> }
    case 'rejected': return { color: 'error', text: <FormattedMessage id='scenes.coinify_details_modal.kyc.header.rejected' defaultMessage='Identity Verification Denied' /> }
    case 'failed': return { color: 'error', text: <FormattedMessage id='scenes.coinify_details_modal.kyc.header.failed' defaultMessage='Identity Verification Failed' /> }
    case 'cancelled': return { color: 'error', text: <FormattedMessage id='scenes.coinify_details_modal.kyc.header.cancelled' defaultMessage='Identity Verification Cancelled' /> }
    case 'expired': return { color: 'error', text: <FormattedMessage id='scenes.coinify_details_modal.kyc.header.expired' defaultMessage='Identity Verification Expired' /> }
    default: return { color: '', text: <FormattedMessage id='scenes.coinify_details_modal.kyc.header.unknown' defaultMessage='Unknown' /> }
  }
}

export const kycNotificationBodyHelper = (status) => {
  switch (status) {
    case 'reviewing':
    case 'processing': return { text: <FormattedMessage id='scenes.coinify_details_modal.kyc.processing' defaultMessage='Your request for authentication has been submitted and will be reviewed shortly. Coinify will email you a status updated within 48 business hours. If you have any questions about the status of your submission, feel free to reach out to Coinify directly at www.coinify.com/support' /> }
    case 'pending': return { text: <FormattedMessage id='scenes.coinify_details_modal.kyc.pending' defaultMessage="It looks like you started your identity verification but didn't finish. Complete this process to link your bank account and/or increase your buy & sell limits." /> }
    case 'completed': return { text: <FormattedMessage id='scenes.coinify_details_modal.kyc.completed' defaultMessage='Your identity verification is complete! Your limits have been raised.' /> }
    case 'rejected': return { text: <FormattedMessage id='scenes.coinify_details_modal.kyc.rejected' defaultMessage='There was an issue verifying your identity with the documents provided. Please try uploading different identification. Bank transfers are unavailable until we can successfully verify your identity.' /> }
    case 'failed': return { text: <FormattedMessage id='scenes.coinify_details_modal.kyc.failed' defaultMessage='Your identity verification has failed. Please contact support.' /> }
    case 'cancelled': return { text: <FormattedMessage id='scenes.coinify_details_modal.kyc.cancelled' defaultMessage='Your identity verification was cancelled. Please try again.' /> }
    case 'expired': return { text: <FormattedMessage id='scenes.coinify_details_modal.kyc.expired' defaultMessage='Your identity verification request has expired. Please try again.' /> }
    default: return { color: '', text: <FormattedMessage id='scenes.coinify_details_modal.kyc.header.unknown' defaultMessage='Unknown' /> }
  }
}

export const kycNotificationButtonHelper = (status) => {
  switch (status) {
    case 'pending': return { color: 'transferred', text: <FormattedMessage id='scenes.buy_sell.kyc_notification.complete' defaultMessage='Complete Verification' /> }
    case 'rejected': return { color: 'error', text: <FormattedMessage id='scenes.buy_sell.kyc_notification.rejected' defaultMessage='Try Again' /> }
    case 'expired': return { color: 'error', text: <FormattedMessage id='scenes.buy_sell.kyc_notification.expired' defaultMessage='Try Again' /> }
    default: return { color: '', text: <FormattedMessage id='scenes.coinify_details_modal.kyc.header.unknown' defaultMessage='' /> }
  }
}

export const showKycStatus = (state) => {
  if (state === 'pending') return state
  if (state === 'rejected') return state
  return false
}

export const getReasonExplanation = (reason, time) => {
  const ONE_DAY_MS = 86400000
  let canTradeAfter = time
  let days = isNaN(canTradeAfter) ? `1 day` : `${Math.ceil((canTradeAfter - Date.now()) / ONE_DAY_MS)} days`

  switch (reason) {
    case 'awaiting_first_trade_completion':
      return <FormattedMessage id='scenes.coinify.cannottradereason.firsttradecompletion' defaultMessage='Trading is disabled because your first trade has not completed yet.' />
    case 'after_first_trade':
      return <FormattedMessage id='scenes.coinify.cannottradereason.afterfirsttrade' defaultMessage='Trading is disabled as our exchange partner verifies your payment info. This will happen only once, and you may resume trading in {days}.' values={{ days: days }} />
    default: return <FormattedMessage id='scenes.coinify.cannottradereason.unknown' defaultMessage='Trading is disabled.' />
  }
}
