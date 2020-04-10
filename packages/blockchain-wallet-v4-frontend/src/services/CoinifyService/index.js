import * as Currency from 'blockchain-wallet-v4/src/exchange/currency'
import {
  any,
  equals,
  gt,
  mapObjIndexed,
  path,
  pathOr,
  prop,
  slice,
  toLower,
  toUpper
} from 'ramda'
import { FormattedMessage } from 'react-intl'
import { KYC_STATES } from '../../data/modules/profile/model'
import { Link } from 'blockchain-info-components'
import Currencies from 'blockchain-wallet-v4/src/exchange/currencies'
import React from 'react'
const { NONE, PENDING, UNDER_REVIEW, VERIFIED, REJECTED, EXPIRED } = KYC_STATES

export const getLimits = (profileLimits, curr, effectiveBalance) => {
  const limits = profileLimits || mockedLimits
  const getMin = (limits, curr) =>
    Math.min(
      pathOr(Infinity, ['bank', 'minimumInAmounts', curr], limits),
      pathOr(Infinity, ['card', 'minimumInAmounts', curr], limits)
    )
  const getMax = (limits, curr) =>
    Math.max(
      pathOr(0, ['bank', 'inRemaining', curr], limits),
      pathOr(0, ['card', 'inRemaining', curr], limits)
    )
  const getSellMin = (limits, curr) =>
    pathOr(Infinity, ['blockchain', 'minimumInAmounts', curr], limits)
  const getSellMax = (limits, curr) =>
    pathOr(0, ['blockchain', 'inRemaining', curr], limits)
  return {
    buy: {
      min: getMin(limits, curr),
      max: getMax(limits, curr),
      bankMax: pathOr(0, ['bank', 'inRemaining', curr], limits),
      cardMax: pathOr(0, ['card', 'inRemaining', curr], limits)
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
  const { max, min } = prop(type, limits)
  switch (type) {
    case 'buy':
      if (max < min) return 'max_below_min'
      if (amt > max) return 'over_max'
      if (amt < min) return 'under_min'
      break
    case 'sell':
      if (max < min) return 'max_below_min'
      if (amt > max) return 'over_max'
      if (amt < min) return 'under_min'
      break
    default:
      return false
  }
}

export const isMinOverEffectiveMax = (userLimits, effectiveBalance, curr) => {
  const limits = getLimits(userLimits, curr)
  const { min } = prop('sell', limits)
  const minSatoshis = min * 1e8
  return gt(minSatoshis, effectiveBalance)
}

export const getOverEffectiveMaxError = (
  amount,
  userLimits,
  curr,
  effectiveBalance
) => {
  if (isMinOverEffectiveMax(userLimits, effectiveBalance, curr)) {
    return 'effective_max_under_min'
  }
  if (gt(amount, effectiveBalance)) {
    return 'over_effective_max'
  }
  return false
}

export const currencySymbolMap = mapObjIndexed(
  (value, code) => value.units[code].symbol,
  Currencies
)

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

export const getRateFromQuote = q => {
  const fiat =
    q.baseCurrency !== 'BTC' ? Math.abs(q.quoteAmount) : Math.abs(q.baseAmount)
  const crypto =
    q.baseCurrency !== 'BTC' ? Math.abs(q.baseAmount) : Math.abs(q.quoteAmount)
  const curr = q.baseCurrency !== 'BTC' ? q.baseCurrency : q.quoteCurrency

  const rate = +((1 / (fiat / 1e8)) * crypto)
  const displayRate = Currency.formatFiat(rate)
  return `${currencySymbolMap[curr]}${displayRate}`
}

export const reviewOrder = {
  baseBtc: q => q.baseCurrency === 'BTC',
  getMinerFee: (q, med) =>
    path(['paymentMediums', med, 'outFixedFees', 'BTC'], q),
  renderFirstRow: q =>
    reviewOrder.baseBtc(q)
      ? `${Math.abs(q.baseAmount) / 1e8} BTC`
      : `${Math.abs(q.quoteAmount) / 1e8} BTC`,
  renderMinerFeeRow: (q, medium, type) => {
    const med = type === 'sell' ? 'bank' : medium
    const minerFee = reviewOrder.getMinerFee(q, med)
    if (!minerFee) return `~`
    return minerFee
  },
  renderBtcToBeReceived: (q, medium, type) => {
    const med = type === 'sell' ? 'bank' : medium
    const minerFee = reviewOrder.getMinerFee(q, med)
    const quotedBtcAmount = reviewOrder.baseBtc(q)
      ? Math.abs(q.baseAmount) / 1e8
      : Math.abs(q.quoteAmount) / 1e8
    if (!minerFee || !quotedBtcAmount) return `~`
    const finalAmount = quotedBtcAmount - minerFee
    return finalAmount.toFixed(8)
  },
  renderAmountRow: q =>
    reviewOrder.baseBtc(q)
      ? `${currencySymbolMap[q.quoteCurrency]}${Currency.formatFiat(
          Math.abs(q.quoteAmount)
        )}`
      : `${currencySymbolMap[q.baseCurrency]}${Currency.formatFiat(
          Math.abs(q.baseAmount)
        )}`,
  renderFeeRow: (q, medium, type) => {
    const med = type === 'sell' ? 'bank' : medium
    const fee =
      path(['paymentMediums', med], q) && Math.abs(q.paymentMediums[med]['fee'])
    if (!fee) return `~`
    if (reviewOrder.baseBtc(q)) {
      return `${currencySymbolMap[q.quoteCurrency]}${fee.toFixed(2)}`
    } else return `${currencySymbolMap[q.baseCurrency]}${fee.toFixed(2)}`
  },
  renderTotalRow: (q, medium, type) => {
    const med = type === 'sell' ? 'bank' : medium
    const qAmt = Math.abs(q.quoteAmount)
    const fee =
      path(['paymentMediums', med], q) && Math.abs(q.paymentMediums[med]['fee'])
    const totalBase =
      path(['paymentMediums', med], q) &&
      Math.abs(q.paymentMediums[med]['total'])
    if (!fee) return `~`
    if (reviewOrder.baseBtc(q)) {
      const quoteTotal = type === 'sell' ? qAmt - fee : qAmt + fee
      return `${currencySymbolMap[q.quoteCurrency]}${Currency.formatFiat(
        quoteTotal
      )}`
    } else {
      return `${currencySymbolMap[q.baseCurrency]}${Currency.formatFiat(
        totalBase
      )}`
    }
  }
}

export const tradeDetails = {
  renderDetails: trade => {
    const fiat =
      trade.inCurrency !== 'BTC' ? trade.inCurrency : trade.outCurrency
    const symbol = currencySymbolMap[fiat]
    if (trade.isBuy) {
      return {
        btcAmount: `${trade.receiveAmount} BTC (${symbol}${(
          trade.inAmount / 100
        ).toFixed(2)})`,
        total: `${symbol}${(trade.sendAmount / 100).toFixed(2)}`
      }
    } else {
      return {
        btcAmount: `${trade.sendAmount / 1e8} BTC (${symbol}${(
          trade.outAmountExpected / 100
        ).toFixed(2)})`,
        total: `${symbol}${trade.receiveAmount.toFixed(2)}`
      }
    }
  }
}

export const getCountryCodeFromIban = iban => toUpper(slice(0, 2, iban))

export const canCancelTrade = trade =>
  equals(prop('state', trade), 'awaiting_transfer_in')

export const checkoutButtonLimitsHelper = (quoteR, limits, type) => {
  return quoteR
    .map(q => {
      const isBaseBtc = equals(prop('baseCurrency', q), 'BTC')
      if (type === 'sell') {
        if (isBaseBtc) {
          return (
            Math.abs(q.baseAmount / 1e8) > limits.max ||
            Math.abs(q.baseAmount / 1e8) < limits.min ||
            Math.abs(q.baseAmount) > limits.effectiveMax
          )
        } else {
          return (
            Math.abs(q.quoteAmount / 1e8) > limits.max ||
            Math.abs(q.quoteAmount / 1e8) < limits.min ||
            Math.abs(q.quoteAmount) > limits.effectiveMax
          )
        }
      } else {
        if (isBaseBtc) {
          return (
            Math.abs(q.quoteAmount) > limits.max ||
            Math.abs(q.quoteAmount) < limits.min ||
            Math.abs(q.baseAmount) > limits.effectiveMax
          )
        } else {
          return (
            Math.abs(q.baseAmount) > limits.max ||
            Math.abs(q.baseAmount) < limits.min ||
            Math.abs(q.quoteAmount) > limits.effectiveMax
          )
        }
      }
    })
    .getOrElse(null)
}

export const statusHelper = status => {
  switch (status) {
    case 'reviewing':
    case 'awaiting_transfer_in':
    case 'processing':
      return {
        color: 'btc',
        text: (
          <FormattedMessage
            id='scenes.services.coinifyservice.buysellorderhistory.list.orderstatus.processing'
            defaultMessage='Pending'
          />
        )
      }
    case 'completed':
      return {
        color: 'success',
        text: (
          <FormattedMessage
            id='scenes.services.coinifyservice.buysellorderhistory.list.orderstatus.completed'
            defaultMessage='Completed'
          />
        )
      }
    case 'rejected':
      return {
        color: 'error',
        text: (
          <FormattedMessage
            id='scenes.services.coinifyservice.buysellorderhistory.list.orderstatus.rejected'
            defaultMessage='Rejected'
          />
        )
      }
    case 'failed':
      return {
        color: 'error',
        text: (
          <FormattedMessage
            id='scenes.services.coinifyservice.buysellorderhistory.list.orderstatus.failed'
            defaultMessage='Failed'
          />
        )
      }
    case 'cancelled':
      return {
        color: 'error',
        text: (
          <FormattedMessage
            id='scenes.services.coinifyservice.buysellorderhistory.list.orderstatus.cancelled'
            defaultMessage='Cancelled'
          />
        )
      }
    case 'expired':
      return {
        color: 'error',
        text: (
          <FormattedMessage
            id='scenes.services.coinifyservice.buysellorderhistory.list.orderstatus.expired'
            defaultMessage='Expired'
          />
        )
      }
    default:
      return {
        color: 'grey700',
        text: (
          <FormattedMessage
            id='scenes.services.coinifyservice.buysellorderhistory.list.orderstatus.unknown'
            defaultMessage='Unknown'
          />
        )
      }
  }
}

export const bodyStatusHelper = (status, isBuy) => {
  if (isBuy) {
    switch (status) {
      case 'reviewing':
      case 'awaiting_transfer_in':
      case 'processing':
        return {
          text: (
            <FormattedMessage
              id='scenes.services.coinifyservice.buysellorderhistory.list.orderstatusbody.buy.processing'
              defaultMessage='Your purchase is currently being processed. Our exchange partner will send a status update your way within 1 business day.'
            />
          )
        }
      case 'completed':
        return {
          text: ''
        }
      case 'rejected':
        return {
          text: (
            <FormattedMessage
              id='scenes.services.coinifyservice.buysellorderhistory.list.orderstatusbody.buy.rejected'
              defaultMessage='Your buy trade has been rejected. Please contact support.'
            />
          )
        }
      case 'expired':
      case 'failed':
      case 'cancelled':
        return { text: '' }
      default:
        return {
          text: (
            <FormattedMessage
              id='scenes.services.coinifyservice.busellorderhistory.list.orderstatusbody.buy.unknown'
              defaultMessage='There are issues with this trade, please contact support.'
            />
          )
        }
    }
  } else {
    switch (status) {
      case 'awaiting_transfer_in':
      case 'processing':
        return {
          text: (
            <FormattedMessage
              id='scenes.services.coinifyservice.buysellorderhistory.list.orderstatusbody.sell.coinify.processing'
              defaultMessage='Coinify will issue the owed sale amount directly to your bank account within 2 business days. You will receive an email from Coinify to confirm the transfer, as soon as they issue the funds to your account.'
            />
          )
        }
      case 'completed':
        return {
          text: (
            <FormattedMessage
              id='scenes.services.coinifyservice.buysellorderhistory.list.orderstatusbody.sell.completed'
              defaultMessage='Your sell trade is complete!'
            />
          )
        }
      case 'rejected':
        return {
          text: (
            <FormattedMessage
              id='scenes.services.coinifyservice.buysellorderhistory.list.orderstatusbody.sell.rejected'
              defaultMessage='Your sell trade has been rejected. Please contact support.'
            />
          )
        }
      case 'failed':
      case 'expired':
      case 'cancelled':
        return { text: '' }
      default:
        return {
          text: (
            <FormattedMessage
              id='scenes.services.coinifyservice.busellorderhistory.list.orderstatusbody.sell.unknown'
              defaultMessage='There are issues with this trade, please contact support.'
            />
          )
        }
    }
  }
}

export const kycBodyHelper = status => {
  switch (status) {
    case 'reviewing':
    case 'processing':
      return {
        text: (
          <FormattedMessage
            id='scenes.coinify.details.kyc.reviewing'
            defaultMessage='Your request for authentication has been submitted and will be reviewed shortly. Coinify will email you a status updated within 48 business hours. If you have any questions about the status of your submission, feel free to reach out to Coinify directly at www.coinify.com/support'
          />
        )
      }
    case 'pending':
      return {
        text: (
          <FormattedMessage
            id='scenes.coinify.detailsmodal.kyc.processing'
            defaultMessage='Your identity verification is processing.'
          />
        )
      }
    case 'completed':
      return {
        text: (
          <FormattedMessage
            id='scenes.coinify.detailsmodal.kyc.completed'
            defaultMessage='Your identity verification is complete! Your limits have been raised.'
          />
        )
      }
    case 'rejected':
      return {
        text: (
          <FormattedMessage
            id='scenes.coinify.detailsmodal.kyc.rejected'
            defaultMessage='There was an issue verifying your identity with the documents provided. Please try uploading different identification. Bank transfers are unavailable until we can successfully verify your identity.'
          />
        )
      }
    case 'failed':
      return {
        text: (
          <FormattedMessage
            id='scenes.coinify.detailsmodal.kyc.failed'
            defaultMessage='Your identity verification has failed. Please contact support.'
          />
        )
      }
    case 'cancelled':
      return {
        text: (
          <FormattedMessage
            id='scenes.coinify.detailsmodal.kyc.cancelled'
            defaultMessage='Your identity verification was cancelled. Please try again.'
          />
        )
      }
    default:
      return {
        text: (
          <FormattedMessage
            id='scenes.coinify.detailsmodal.kyc.cancelled.unknown'
            defaultMessage='Your identity verification status could not be determined, please contact support.'
          />
        )
      }
  }
}

export const kycHeaderHelper = status => {
  switch (status) {
    case NONE:
      return {
        color: 'error',
        text: (
          <FormattedMessage
            id='scenes.buy_sell.coinify.kyc.header.incomplete'
            defaultMessage='Incomplete'
          />
        )
      }
    case PENDING:
      return {
        color: 'blue900',
        text: (
          <FormattedMessage
            id='scenes.buy_sell.coinify.kyc.header.pending'
            defaultMessage='Pending'
          />
        )
      }
    case UNDER_REVIEW:
      return {
        color: 'btc',
        text: (
          <FormattedMessage
            id='scenes.buy_sell.coinify.kyc.header.reviewing'
            defaultMessage='In Review'
          />
        )
      }
    case VERIFIED:
      return {
        color: 'success',
        text: (
          <FormattedMessage
            id='scenes.buy_sell.coinify.kyc.header.completed'
            defaultMessage='Completed'
          />
        )
      }
    case REJECTED:
      return {
        color: 'error',
        text: (
          <FormattedMessage
            id='scenes.buy_sell.coinify.kyc.header.failed'
            defaultMessage='Failed'
          />
        )
      }
    case EXPIRED:
      return {
        color: 'error',
        text: (
          <FormattedMessage
            id='scenes.buy_sell.coinify.kyc.header.expired'
            defaultMessage='Expired'
          />
        )
      }
    default:
      return {
        color: '',
        text: ''
      }
  }
}

export const kycNotificationBodyHelper = status => {
  switch (status) {
    case UNDER_REVIEW:
      return {
        text: (
          <FormattedMessage
            id='scenes.buysell.coinify.kyc.underreview'
            defaultMessage='We had some trouble verifying your account with the documents provided. Our Support team will contact you shortly to help you with the verification process.'
          />
        )
      }
    case PENDING:
      return {
        text: (
          <FormattedMessage
            id='scenes.buysell.coinify.kyc.pending'
            defaultMessage={
              'We are currently reviewing your application. Hang tight! In just a few minutes you will be all set to buy & sell cryptocurrency.\n {note} In some cases it can take up to 2 hours to get verified.'
            }
            values={{
              note: (
                <strong>
                  <br />
                  <br />
                  Note:
                </strong>
              )
            }}
          />
        )
      }
    case NONE:
      return {
        text: (
          <FormattedMessage
            id='scenes.buysell.coinify.kyc.none'
            defaultMessage="It looks like you started your identity verification but didn't finish. Complete this process to link your bank account and/or increase your buy & sell limits."
          />
        )
      }
    case VERIFIED:
      return {
        text: (
          <FormattedMessage
            id='scenes.buysell.coinify.kyc.verified'
            defaultMessage='Your identity verification is complete! Your limits have been raised.'
          />
        )
      }
    case REJECTED:
      return {
        text: (
          <FormattedMessage
            id='scenes.buysell.coinify.kyc.rejected_learn_more'
            defaultMessage='Unfortunately we had some trouble with the documents that you’ve supplied and we can’t verifiy your account at this time. {learnMore}'
            values={{
              learnMore: (
                <Link
                  size='13px'
                  weight={400}
                  href='https://support.blockchain.com/hc/en-us/articles/360018080352-Why-has-my-ID-submission-been-rejected-'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <FormattedMessage
                    id='scenes.buysell.coinify.kyc.learn_more'
                    defaultMessage='Learn more.'
                  />
                </Link>
              )
            }}
          />
        )
      }
    case EXPIRED:
      return {
        text: (
          <FormattedMessage
            id='scenes.buysell.coinify.kyc.expired'
            defaultMessage='Your identity verification request has expired.'
          />
        )
      }
    default:
      return {
        color: '',
        text: ''
      }
  }
}

export const showKycStatus = state =>
  any(equals(state), ['pending', 'rejected']) ? state : false

export const getReasonExplanation = (reason, time, verified) => {
  if (!verified)
    return (
      <FormattedMessage
        id='scenes.coinify.cannottradereason.notverified'
        defaultMessage='Trading is disabled because you have not completed identity verification.'
      />
    )

  const ONE_DAY_MS = 86400000
  const canTradeAfter = time
  const days = isNaN(canTradeAfter)
    ? `1 day`
    : `${Math.ceil((canTradeAfter - Date.now()) / ONE_DAY_MS)} days`

  switch (reason) {
    case 'awaiting_first_trade_completion':
      return (
        <FormattedMessage
          id='scenes.coinify.cannottradereason.firsttradecompletion'
          defaultMessage='Trading is disabled because your first trade has not completed yet.'
        />
      )
    case 'after_first_trade':
      return (
        <FormattedMessage
          id='scenes.coinify.cannottradereason.afterfirsttrade'
          defaultMessage='Trading is disabled as our exchange partner verifies your payment info. This will happen only once, and you may resume trading in {days}.'
          values={{ days: days }}
        />
      )
    default:
      return (
        <FormattedMessage
          id='scenes.coinify.cannottradereason.unknown'
          defaultMessage='Trading is disabled.'
        />
      )
  }
}

export const recurringTimeHelper = sub => {
  const human = {
    1: 'st',
    2: 'nd',
    3: 'rd',
    21: 'st',
    22: 'nd',
    23: 'rd',
    31: 'st'
  }
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ]

  const getTimespan = sub => {
    const freq = toLower(prop('frequency', sub))
    const date = new Date()

    switch (freq) {
      case 'hourly':
        return 'hour'
      case 'daily':
        return '24 hours'
      case 'weekly':
        return `${days[date.getDay()]}`
      case 'monthly':
        return `${date.getDate() +
          (human[date.getDate()] || 'th')} of the month`
    }
  }
  return getTimespan(sub)
}

export const recurringFee = trade =>
  `${Currency.formatFiat(trade.sendAmount / 100 - trade.inAmount / 100)} ${prop(
    'inCurrency',
    trade
  )}`
