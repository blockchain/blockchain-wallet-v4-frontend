import React from 'react'
import { FormattedMessage } from 'react-intl'
import { add, format } from 'date-fns'

import { DepositTerms, DisplayMode } from 'data/types'

const Switcher = (
  type: 'Trade' | 'Withdraw',
  displayMode: DisplayMode,
  depositTerms: DepositTerms
) => {
  let title
  let value
  const minutesMax = depositTerms[`availableTo${type}MinutesMax`]
  const minutesMin = depositTerms[`availableTo${type}MinutesMin`]

  if (type === 'Trade') {
    title = <FormattedMessage id='copy.available_to_trade' defaultMessage='Available to trade' />
  } else {
    title = (
      <FormattedMessage id='copy.available_to_withdraw' defaultMessage='Available to withdraw' />
    )
  }

  switch (displayMode) {
    case DisplayMode.IMMEDIATELY:
      value = <FormattedMessage id='copy.immediately' defaultMessage='Immediately' />
      break
    case DisplayMode.MAX_DAY: // 18th of October
      value = format(add(new Date(), { minutes: minutesMax }), "do 'of' MMMM")
      break
    case DisplayMode.MAX_MINUTE: // in 2 minutes
      value = (
        <FormattedMessage
          id='copy.in_minutes'
          defaultMessage='in {minutesMax} minutes'
          values={{ minutesMax }}
        />
      )
      break
    case DisplayMode.MINUTE_RANGE: // between 1 and 2 minutes || in 1 minute(s)
      value =
        minutesMin === minutesMax ? (
          <FormattedMessage
            id='copy.in_minutes'
            defaultMessage='in {minutesMax} minute(s)'
            values={{ minutesMax }}
          />
        ) : (
          <FormattedMessage
            id='copy.between_minutes'
            defaultMessage='between {minutesMin} and {minutesMax} minutes'
            values={{ minutesMax, minutesMin }}
          />
        )
      break
    case DisplayMode.DAY_RANGE: // Between 16th and the 18th || on the 18th
      const dayMin = format(add(new Date(), { minutes: minutesMax }), 'do')
      const dayMax = format(add(new Date(), { minutes: minutesMax }), 'do')
      value =
        dayMin === dayMax ? (
          <FormattedMessage
            id='copy.on_the_day'
            defaultMessage='on the {dayMax}'
            values={{ dayMax }}
          />
        ) : (
          <FormattedMessage
            id='copy.between_and_the'
            defaultMessage='between {dayMin} and the {dayMax}'
            values={{ dayMax, dayMin }}
          />
        )
      break
    case DisplayMode.NONE:
    default:
      return undefined
  }

  return { title, value }
}

type ParseDepositTermsReturnType = {
  trade?: {
    title: string | React.ReactNode
    value: string | React.ReactNode
  }
  withdraw?: {
    title: string | React.ReactNode
    value: string | React.ReactNode
  }
}
export const ParseDepositTerms = (depositTerms: DepositTerms): ParseDepositTermsReturnType => {
  const ParsedTerms: ParseDepositTermsReturnType = {}

  ParsedTerms.trade = Switcher('Trade', depositTerms.availableToTradeDisplayMode, depositTerms)
  ParsedTerms.withdraw = Switcher(
    'Withdraw',
    depositTerms.availableToWithdrawDisplayMode,
    depositTerms
  )

  return ParsedTerms
}
